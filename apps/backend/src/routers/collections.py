from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.collections import CollectionRepository

router = APIRouter(prefix="/collections", tags=["collections"])


@router.get("")
async def list_collections(
    page: int = 1,
    limit: int = 20,
    userId: str | None = None,
    isPublic: bool | None = None,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List collections with optional filters.
    
    - page: page number (1-based)
    - limit: results per page
    - userId: filter by user external_id
    - isPublic: filter by public/private status
    """
    repo = CollectionRepository(session)
    return await repo.list(page=page, limit=limit, user_id=userId, is_public=isPublic)


@router.get("/{collection_id}")
async def get_collection(collection_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = CollectionRepository(session)
    data = await repo.get(collection_id)
    if not data:
        raise HTTPException(status_code=404, detail="Collection not found")
    return data

