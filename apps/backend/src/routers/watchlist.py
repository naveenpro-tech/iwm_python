from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.watchlist import WatchlistRepository

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


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

