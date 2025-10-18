from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.reviews import ReviewRepository

router = APIRouter(prefix="/reviews", tags=["reviews"])


class ReviewIn(BaseModel):
    movieId: str
    userId: str
    rating: float  # 0-10
    title: Optional[str] = None
    content: str
    spoilers: bool = False


@router.get("")
async def list_reviews(
    page: int = 1,
    limit: int = 20,
    movieId: str | None = None,
    userId: str | None = None,
    sortBy: str = "date_desc",
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List reviews with optional filters.

    - page: page number (1-based)
    - limit: results per page
    - movieId: filter by movie external_id
    - userId: filter by user external_id
    - sortBy: date_desc, date_asc, rating_desc, rating_asc, helpful_desc
    """
    repo = ReviewRepository(session)
    return await repo.list(
        page=page, limit=limit, movie_id=movieId, user_id=userId, sort_by=sortBy
    )


@router.get("/{review_id}")
async def get_review(review_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = ReviewRepository(session)
    data = await repo.get(review_id)
    if not data:
        raise HTTPException(status_code=404, detail="Review not found")
    return data


@router.post("")
async def create_review(body: ReviewIn, session: AsyncSession = Depends(get_session)) -> Any:
    """Create a new review for a movie"""
    repo = ReviewRepository(session)
    try:
        result = await repo.create(
            movie_id=body.movieId,
            user_id=body.userId,
            rating=body.rating,
            title=body.title,
            content=body.content,
            spoilers=body.spoilers,
        )
        await session.commit()
        return result
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to create review")

