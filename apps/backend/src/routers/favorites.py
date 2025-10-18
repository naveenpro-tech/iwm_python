from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.favorites import FavoriteRepository

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("")
async def list_favorites(
    page: int = 1,
    limit: int = 20,
    userId: str | None = None,
    type: str | None = None,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List favorite items with optional filters.
    
    - page: page number (1-based)
    - limit: results per page
    - userId: filter by user external_id
    - type: filter by type (movie, person, scene, article, all)
    """
    repo = FavoriteRepository(session)
    return await repo.list(page=page, limit=limit, user_id=userId, type_filter=type)


@router.get("/{favorite_id}")
async def get_favorite_item(favorite_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = FavoriteRepository(session)
    data = await repo.get(favorite_id)
    if not data:
        raise HTTPException(status_code=404, detail="Favorite item not found")
    return data

