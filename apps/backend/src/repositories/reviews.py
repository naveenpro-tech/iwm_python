from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Review, User, Movie


class ReviewRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list(
        self,
        *,
        page: int = 1,
        limit: int = 20,
        movie_id: str | None = None,
        user_id: str | None = None,
        sort_by: str = "date_desc",
    ) -> List[dict[str, Any]]:
        if not self.session:
            return []
        q = select(Review)
        if movie_id:
            q = q.join(Review.movie).where(Movie.external_id == movie_id)
        if user_id:
            q = q.join(Review.author).where(User.external_id == user_id)
        
        if sort_by == "date_desc":
            q = q.order_by(desc(Review.date))
        elif sort_by == "date_asc":
            q = q.order_by(Review.date)
        elif sort_by == "rating_desc":
            q = q.order_by(desc(Review.rating))
        elif sort_by == "rating_asc":
            q = q.order_by(Review.rating)
        elif sort_by == "helpful_desc":
            q = q.order_by(desc(Review.helpful_votes))

        q = q.limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        reviews = res.scalars().all()
        return [
            {
                "id": r.external_id,
                "title": r.title,
                "content": r.content,
                "rating": r.rating,
                "date": r.date.isoformat(),
                "hasSpoilers": r.has_spoilers,
                "isVerified": r.is_verified,
                "helpfulVotes": r.helpful_votes,
                "unhelpfulVotes": r.unhelpful_votes,
                "commentCount": r.comment_count,
                "engagementScore": r.engagement_score,
                "mediaUrls": r.media_urls.split(",") if r.media_urls else [],
                "author": {
                    "id": r.author.external_id,
                    "name": r.author.name,
                    "avatarUrl": r.author.avatar_url,
                },
                "movie": {
                    "id": r.movie.external_id,
                    "title": r.movie.title,
                    "posterUrl": r.movie.poster_url,
                    "year": int(r.movie.year) if r.movie.year else None,
                    "genres": [g.name for g in r.movie.genres],
                    "country": r.movie.country,
                    "language": r.movie.language,
                },
            }
            for r in reviews
        ]

    async def get(self, external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        q = select(Review).where(Review.external_id == external_id)
        res = await self.session.execute(q)
        r = res.scalar_one_or_none()
        if not r:
            return None
        return {
            "id": r.external_id,
            "title": r.title,
            "content": r.content,
            "rating": r.rating,
            "date": r.date.isoformat(),
            "hasSpoilers": r.has_spoilers,
            "isVerified": r.is_verified,
            "helpfulVotes": r.helpful_votes,
            "unhelpfulVotes": r.unhelpful_votes,
            "commentCount": r.comment_count,
            "engagementScore": r.engagement_score,
            "mediaUrls": r.media_urls.split(",") if r.media_urls else [],
            "author": {
                "id": r.author.external_id,
                "name": r.author.name,
                "avatarUrl": r.author.avatar_url,
            },
            "movie": {
                "id": r.movie.external_id,
                "title": r.movie.title,
                "posterUrl": r.movie.poster_url,
                "year": int(r.movie.year) if r.movie.year else None,
                "genres": [g.name for g in r.movie.genres],
                "country": r.movie.country,
                "language": r.movie.language,
            },
        }

