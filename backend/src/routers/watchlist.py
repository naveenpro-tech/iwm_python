from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from ..db import get_session
from ..dependencies.auth import get_current_user
from ..models import User, Watchlist, Movie
from ..repositories.watchlist import WatchlistRepository

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


class WatchlistItemIn(BaseModel):
    movieId: str
    userId: str
    status: str = "want-to-watch"  # want-to-watch, watching, watched
    progress: Optional[int] = None  # 0-100 for watching status
    rating: Optional[int] = None  # User rating 1-5
    priority: Optional[str] = None  # high, medium, low


class WatchlistItemUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
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
async def add_to_watchlist(
    body: WatchlistItemIn,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Add a movie to user's watchlist (idempotent). Body.userId is ignored; we use the authenticated user."""
    repo = WatchlistRepository(session)
    try:
        result = await repo.create(
            movie_id=body.movieId,
            user_id=current_user.external_id,  # enforce authenticated user
            status=body.status,
            progress=body.progress,
            rating=body.rating if body.rating is not None else None,
            priority=body.priority if body.priority is not None else "medium",
        )
        await session.commit()
        return result
    except IntegrityError:
        # Unique constraint violation -> fetch existing and return it
        await session.rollback()
        res = await session.execute(
            select(Watchlist)
            .join(Watchlist.user)
            .join(Watchlist.movie)
            .where(User.id == current_user.id, Movie.external_id == body.movieId)
            .limit(1)
        )
        w = res.scalar_one_or_none()
        if not w:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already in watchlist")
        return {
            "id": w.external_id,
            "movieId": w.movie.external_id,
            "userId": current_user.external_id,
            "status": w.status,
            "progress": w.progress,
            "dateAdded": w.date_added.isoformat(),
        }
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log unexpected error
        try:
            import traceback
            print("[watchlist.add] unexpected error:", repr(e), flush=True)
            traceback.print_exc()
        except Exception:
            pass
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to add to watchlist")


@router.patch("/{watchlist_id}")
async def update_watchlist_item(
    watchlist_id: str, body: WatchlistItemUpdate, session: AsyncSession = Depends(get_session)
) -> Any:
    """Update watchlist item status, progress, or priority"""
    repo = WatchlistRepository(session)
    result = await repo.update(
        watchlist_id=watchlist_id,
        status=body.status,
        progress=body.progress,
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

