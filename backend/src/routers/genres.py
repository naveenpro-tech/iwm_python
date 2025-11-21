from __future__ import annotations

from typing import Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.genres import GenreRepository

router = APIRouter(prefix="/genres", tags=["genres"])


class GenreDetailsDTO(BaseModel):
    id: str
    name: str
    description: str = ""
    backgroundImage: str = ""
    subgenres: list[dict[str, str]] = []
    statistics: dict[str, Any] = {}
    relatedGenres: list[str] = []
    curatedCollections: list[dict[str, Any]] = []
    notableFigures: list[dict[str, Any]] = []
    evolutionTimeline: list[dict[str, Any]] = []


@router.get("/{genre_id}", response_model=GenreDetailsDTO)
async def get_genre_details(genre_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = GenreRepository(session)
    data = await repo.get_details(genre_id)
    if not data:
        raise HTTPException(status_code=404, detail="Genre not found")
    return data


@router.get("/{genre_id}/movies")
async def get_movies_by_genre(genre_id: str, page: int = 1, limit: int = 20, session: AsyncSession = Depends(get_session)) -> Any:
    repo = GenreRepository(session)
    offset = (page - 1) * limit
    return await repo.get_movies(genre_id, limit=limit, offset=offset)

