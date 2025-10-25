from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.watchlist import WatchlistRepository

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


class WatchlistItemIn(BaseModel):
    movieId: str
    userId: str
    status: str = "want-to-watch"  # want-to-watch, watching, watched
    progress: Optional[int] = None  # 0-100 for watching status
    rating: Optional[float] = None  # 0-10


class WatchlistItemUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    rating: Optional[float] = None
    priority: Optional[str] = None


@router.get("")
async def list_watchlist(
    page: int = 1,
    limit: int = 20,
    userId: str | None = None,
    status: str | None = None,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List watchlist items with optional filters.

    - page: page number (1-based)
    - limit: results per page
    - userId: filter by user external_id
    - status: filter by status (want-to-watch, watching, watched)
    """
    repo = WatchlistRepository(session)
    return await repo.list(page=page, limit=limit, user_id=userId, status=status)


@router.get("/{watchlist_id}")
async def get_watchlist_item(watchlist_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = WatchlistRepository(session)
    data = await repo.get(watchlist_id)
    if not data:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    return data


@router.post("")
async def add_to_watchlist(body: WatchlistItemIn, session: AsyncSession = Depends(get_session)) -> Any:
    """Add a movie to user's watchlist"""
    repo = WatchlistRepository(session)
    result = await repo.create(
        movie_id=body.movieId,
        user_id=body.userId,
        status=body.status,
        progress=body.progress,
        rating=body.rating,
    )
    await session.commit()
    return result


@router.patch("/{watchlist_id}")
async def update_watchlist_item(
    watchlist_id: str, body: WatchlistItemUpdate, session: AsyncSession = Depends(get_session)
) -> Any:
    """Update watchlist item status, progress, rating, or priority"""
    repo = WatchlistRepository(session)
    result = await repo.update(
        watchlist_id=watchlist_id,
        status=body.status,
        progress=body.progress,
        rating=body.rating,
        priority=body.priority,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    await session.commit()
    return result


@router.delete("/{watchlist_id}")
async def remove_from_watchlist(watchlist_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    """Remove a movie from user's watchlist"""
    repo = WatchlistRepository(session)
    result = await repo.delete(watchlist_id)
    if not result:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    await session.commit()
    return {"deleted": True}

