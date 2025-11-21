from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.quiz import QuizRepository

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


# --------------------------- Schemas ---------------------------
class StartAttemptBody(BaseModel):
    userId: str


class SubmitAnswer(BaseModel):
    questionId: str
    selectedOptionIds: List[str]
    timeSpent: Optional[int] = None


class SubmitAttemptBody(BaseModel):
    userId: str
    attemptId: str
    answers: List[SubmitAnswer]
    startedAt: Optional[str] = None


# --------------------------- Endpoints ---------------------------
@router.get("")
async def list_quizzes(
    search: Optional[str] = Query(None, description="Search by quiz title"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = QuizRepository(session)
    return await repo.list_quizzes(search=search, page=page, limit=limit)


@router.get("/attempts")
async def user_attempt_history(
    userId: str = Query(...),
    quizId: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = QuizRepository(session)
    return await repo.user_attempt_history(user_external_id=userId, quiz_external_id=quizId, page=page, limit=limit)


@router.get("/{quizId}")
async def get_quiz_detail(
    quizId: str,
    session: AsyncSession = Depends(get_session),
):
    repo = QuizRepository(session)
    quiz = await repo.get_quiz_detail(quiz_external_id=quizId)
    if not quiz:
        raise HTTPException(status_code=404, detail="quiz_not_found")
    return quiz


@router.post("/{quizId}/start")
async def start_attempt(
    quizId: str,
    body: StartAttemptBody,
    session: AsyncSession = Depends(get_session),
):
    repo = QuizRepository(session)
    try:
        return await repo.start_attempt(user_external_id=body.userId, quiz_external_id=quizId)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{quizId}/submit")
async def submit_answers(
    quizId: str,
    body: SubmitAttemptBody,
    session: AsyncSession = Depends(get_session),
):
    repo = QuizRepository(session)
    try:
        return await repo.submit_answers(
            user_external_id=body.userId,
            quiz_external_id=quizId,
            attempt_external_id=body.attemptId,
            answers=[a.model_dump() for a in body.answers],
            started_at=body.startedAt,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{quizId}/leaderboard")
async def quiz_leaderboard(
    quizId: str,
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = QuizRepository(session)
    return await repo.leaderboard(quiz_external_id=quizId, limit=limit)


