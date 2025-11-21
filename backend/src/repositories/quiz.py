from __future__ import annotations

import json
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import func, select, asc, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models import (
    Movie,
    Quiz,
    QuizAnswer,
    QuizAttempt,
    QuizLeaderboardEntry,
    QuizQuestion,
    QuizQuestionOption,
    User,
)


class QuizRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --------------------------- DTO helpers ---------------------------
    def _movie_fields(self, quiz: Quiz) -> Dict[str, Any]:
        mv: Optional[Movie] = quiz.movie
        movie_id = mv.external_id if mv else ""
        movie_title = mv.title if mv else ""
        poster = mv.poster_url if mv else None
        # Best-effort release date from year if available
        release_date = f"{mv.year}-01-01" if mv and mv.year else ""
        return {
            "movieId": movie_id,
            "movieTitle": movie_title,
            "movieReleaseDate": release_date,
            "moviePosterUrl": poster,
        }

    def _question_to_dto(self, q: QuizQuestion, include_correct: bool = False) -> Dict[str, Any]:
        # Map type to frontend values
        q_type = q.type
        if q_type not in {"multiple-choice", "multiple-select", "true-false"}:
            # fallback mapping
            q_type = {
                "multiple": "multiple-select",
                "single": "multiple-choice",
                "true_false": "true-false",
            }.get(q.type, "multiple-choice")

        opts = []
        for opt in sorted(q.options, key=lambda o: o.order_index):
            item = {
                "id": opt.external_id,
                "questionId": q.external_id,
                "text": opt.text,
                "order": opt.order_index,
            }
            if include_correct:
                item["isCorrect"] = bool(opt.is_correct)
            opts.append(item)

        dto = {
            "id": q.external_id,
            "quizId": q.quiz.external_id,
            "text": q.text,
            "mediaUrl": q.media_url,
            "mediaType": q.media_type,
            "options": opts,
            "explanation": q.explanation,
            "points": q.points,
            "order": q.order_index,
            "type": q_type,
        }
        # Some components also look for `hint` / `imageUrl`
        if q.hint:
            dto["hint"] = q.hint
        if q.media_url and q.media_type == "image":
            dto["imageUrl"] = q.media_url
        return dto

    def _quiz_to_dto(self, quiz: Quiz, include_questions: bool = False, include_correct: bool = False) -> Dict[str, Any]:
        dto = {
            "id": quiz.external_id,
            "title": quiz.title,
            "description": quiz.description,
            **self._movie_fields(quiz),
            "numberOfQuestions": quiz.number_of_questions,
            "timeLimit": quiz.time_limit_seconds,
            "passScore": quiz.pass_score,
            "isVerificationRequired": quiz.is_verification_required,
            "createdAt": quiz.created_at.isoformat() + "Z",
            "updatedAt": (quiz.updated_at.isoformat() + "Z") if quiz.updated_at else quiz.created_at.isoformat() + "Z",
        }
        if include_questions:
            qs = sorted(quiz.questions, key=lambda x: x.order_index)
            dto["questions"] = [self._question_to_dto(q, include_correct=include_correct) for q in qs]
        else:
            dto["questions"] = []
        return dto

    # --------------------------- Queries ---------------------------
    def _base_quiz_query(self):
        return select(Quiz).options(
            selectinload(Quiz.movie),
            selectinload(Quiz.questions).selectinload(QuizQuestion.options),
        )

    async def list_quizzes(
        self,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        q = self._base_quiz_query().order_by(asc(Quiz.title))
        if search:
            like = f"%{search.lower()}%"
            q = q.where(func.lower(Quiz.title).like(like))
        q = q.limit(limit).offset((page - 1) * limit)
        rows = (await self.session.execute(q)).scalars().all()
        return [self._quiz_to_dto(quiz, include_questions=False) for quiz in rows]

    async def get_quiz_detail(self, quiz_external_id: str) -> Optional[Dict[str, Any]]:
        q = self._base_quiz_query().where(Quiz.external_id == quiz_external_id)
        quiz = (await self.session.execute(q)).scalars().first()
        if not quiz:
            return None
        return self._quiz_to_dto(quiz, include_questions=True, include_correct=False)

    # --------------------------- Attempts ---------------------------
    async def _get_user_and_quiz_ids(self, user_external_id: str, quiz_external_id: str) -> Tuple[int, int]:
        user_q = select(User).where(User.external_id == user_external_id)
        user = (await self.session.execute(user_q)).scalars().first()
        if not user:
            raise ValueError("user_not_found")
        quiz_q = select(Quiz).where(Quiz.external_id == quiz_external_id)
        quiz = (await self.session.execute(quiz_q)).scalars().first()
        if not quiz:
            raise ValueError("quiz_not_found")
        return user.id, quiz.id

    async def start_attempt(self, user_external_id: str, quiz_external_id: str) -> Dict[str, Any]:
        user_id, quiz_id = await self._get_user_and_quiz_ids(user_external_id, quiz_external_id)

        count_q = select(func.count()).select_from(QuizAttempt).where(
            (QuizAttempt.user_id == user_id) & (QuizAttempt.quiz_id == quiz_id)
        )
        attempt_number = (await self.session.execute(count_q)).scalar_one() + 1

        external_id = f"attempt-{int(datetime.utcnow().timestamp()*1000)}"
        attempt = QuizAttempt(
            external_id=external_id,
            user_id=user_id,
            quiz_id=quiz_id,
            attempt_number=attempt_number,
            started_at=datetime.utcnow(),
        )
        self.session.add(attempt)
        await self.session.flush()
        await self.session.commit()

        # fetch quiz for time limit
        quiz = (await self.session.execute(select(Quiz).where(Quiz.id == quiz_id))).scalars().first()
        return {
            "attemptId": external_id,
            "attemptNumber": attempt_number,
            "startedAt": attempt.started_at.isoformat() + "Z",
            "timeLimit": quiz.time_limit_seconds if quiz else None,
        }

    async def submit_answers(
        self,
        user_external_id: str,
        quiz_external_id: str,
        attempt_external_id: str,
        answers: List[Dict[str, Any]],
        started_at: Optional[str] = None,
    ) -> Dict[str, Any]:
        # Load quiz with questions and options
        quiz_q = self._base_quiz_query().where(Quiz.external_id == quiz_external_id)
        quiz = (await self.session.execute(quiz_q)).scalars().first()
        if not quiz:
            raise ValueError("quiz_not_found")

        # Attempt
        att_q = select(QuizAttempt).where(QuizAttempt.external_id == attempt_external_id)
        attempt = (await self.session.execute(att_q)).scalars().first()
        if not attempt:
            raise ValueError("attempt_not_found")

        # Build correct answers map
        correct_by_q: Dict[str, List[str]] = {}
        q_by_ext: Dict[str, QuizQuestion] = {q.external_id: q for q in quiz.questions}
        for q in quiz.questions:
            correct_by_q[q.external_id] = [o.external_id for o in q.options if o.is_correct]

        # Grade
        total = min(len(quiz.questions), quiz.number_of_questions or len(quiz.questions)) or 1
        correct_count = 0
        answer_rows: List[QuizAnswer] = []
        answer_dtos: List[Dict[str, Any]] = []
        for ans in answers:
            qid = ans.get("questionId")
            selected: List[str] = ans.get("selectedOptionIds") or []
            time_spent = ans.get("timeSpent")
            correct_ids = set(correct_by_q.get(qid, []))
            is_correct = set(selected) == correct_ids
            if is_correct:
                correct_count += 1

            q_model = q_by_ext.get(qid)
            if q_model:
                row = QuizAnswer(
                    attempt_id=attempt.id,
                    question_id=q_model.id,
                    selected_option_ids=json.dumps(selected),
                    is_correct=is_correct,
                    time_spent_seconds=time_spent,
                )
                answer_rows.append(row)

            answer_dtos.append(
                {
                    "questionId": qid,
                    "selectedOptionIds": selected,
                    "isCorrect": is_correct,
                    **({"timeSpent": time_spent} if time_spent is not None else {}),
                }
            )

        # Persist answers
        for r in answer_rows:
            self.session.add(r)

        # Finalize attempt
        attempt.completed_at = datetime.utcnow()
        attempt.time_spent_seconds = (
            int((attempt.completed_at - attempt.started_at).total_seconds()) if attempt.started_at else None
        )
        score = int(round((correct_count / total) * 100))
        attempt.score_percent = score
        attempt.passed = score >= (quiz.pass_score or 70)
        await self.session.flush()

        # Leaderboard entry
        lb = QuizLeaderboardEntry(
            quiz_id=quiz.id,
            user_id=attempt.user_id,
            score_percent=score,
            completion_time_seconds=attempt.time_spent_seconds,
        )
        self.session.add(lb)
        await self.session.flush()
        await self.session.commit()

        # Response
        attempt_dto = {
            "id": attempt.external_id,
            "quizId": quiz.external_id,
            "userId": user_external_id,
            "attemptNumber": attempt.attempt_number,
            "startedAt": attempt.started_at.isoformat() + "Z",
            "completedAt": attempt.completed_at.isoformat() + "Z" if attempt.completed_at else None,
            "score": score,
            "passed": attempt.passed,
            "answers": answer_dtos,
        }

        return {
            "attempt": attempt_dto,
            "correctOptionIdsByQuestion": correct_by_q,
        }

    # --------------------------- Leaderboard & history ---------------------------
    async def leaderboard(self, quiz_external_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        quiz_id = (
            await self.session.execute(select(Quiz.id).where(Quiz.external_id == quiz_external_id))
        ).scalar_one_or_none()
        if not quiz_id:
            return []

        q = (
            select(QuizLeaderboardEntry, User)
            .join(User, User.id == QuizLeaderboardEntry.user_id)
            .where(QuizLeaderboardEntry.quiz_id == quiz_id)
            .order_by(desc(QuizLeaderboardEntry.score_percent), asc(QuizLeaderboardEntry.completion_time_seconds))
            .limit(limit)
        )
        rows = (await self.session.execute(q)).all()
        out = []
        rank = 1
        for lb, user in rows:
            out.append(
                {
                    "rank": rank,
                    "userId": user.external_id,
                    "username": user.name,
                    "score": lb.score_percent,
                    "completionTime": lb.completion_time_seconds,
                }
            )
            rank += 1
        return out

    async def user_attempt_history(
        self, user_external_id: str, quiz_external_id: Optional[str] = None, page: int = 1, limit: int = 20
    ) -> List[Dict[str, Any]]:
        user_id = (
            await self.session.execute(select(User.id).where(User.external_id == user_external_id))
        ).scalar_one_or_none()
        if not user_id:
            return []
        q = select(QuizAttempt, Quiz).join(Quiz, Quiz.id == QuizAttempt.quiz_id).where(QuizAttempt.user_id == user_id)
        if quiz_external_id:
            q = q.where(Quiz.external_id == quiz_external_id)
        q = q.order_by(desc(QuizAttempt.started_at)).limit(limit).offset((page - 1) * limit)
        rows = (await self.session.execute(q)).all()
        out: List[Dict[str, Any]] = []
        for att, quiz in rows:
            out.append(
                {
                    "id": att.external_id,
                    "quizId": quiz.external_id,
                    "userId": user_external_id,
                    "attemptNumber": att.attempt_number,
                    "startedAt": att.started_at.isoformat() + "Z",
                    "completedAt": att.completed_at.isoformat() + "Z" if att.completed_at else None,
                    "score": att.score_percent,
                    "passed": att.passed,
                    "answers": [],  # not loading per-history row for brevity
                }
            )
        return out

