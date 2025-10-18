from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.movies import MovieRepository

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("")
async def list_movies(
    page: int = 1,
    limit: int = 20,
    genre: str | None = None,
    yearMin: int | None = None,
    yearMax: int | None = None,
    countries: str | None = None,
    languages: str | None = None,
    ratingMin: float | None = None,
    ratingMax: float | None = None,
    status: str | None = None,  # accepted but not used currently
    sortBy: str | None = None,
    session: AsyncSession = Depends(get_session),
) -> Any:
    repo = MovieRepository(session)
    country_list = [c.strip() for c in countries.split(",")] if countries else None
    language_list = [l.strip() for l in languages.split(",")] if languages else None
    return await repo.list(
        page=page,
        limit=limit,
        genre_slug=genre,
        year_min=yearMin,
        year_max=yearMax,
        countries=country_list,
        languages=language_list,
        rating_min=ratingMin,
        rating_max=ratingMax,
        sort_by=sortBy,
    )


@router.get("/{movie_id}")
async def get_movie(movie_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = MovieRepository(session)
    data = await repo.get(movie_id)
    if not data:
        raise HTTPException(status_code=404, detail="Movie not found")
    return data

