from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.search import SearchRepository

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
async def search(
    q: str,
    types: str | None = None,
    limit: int = 10,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    Search across movies, people, and genres.
    
    - q: search query string
    - types: comma-separated list of types to search (movies,people,genres). Default: all
    - limit: max results per type
    """
    type_list = types.split(",") if types else ["movies", "people", "genres"]
    repo = SearchRepository(session)
    return await repo.search(query=q, types=type_list, limit_per_type=limit)

