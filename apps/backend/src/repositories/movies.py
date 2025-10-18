from __future__ import annotations

from typing import Any, List, Optional
from sqlalchemy import select, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Movie, Genre


class MovieRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list(
        self,
        *,
        page: int = 1,
        limit: int = 20,
        genre_slug: Optional[str] = None,
        year_min: Optional[int] = None,
        year_max: Optional[int] = None,
        countries: Optional[list[str]] = None,
        languages: Optional[list[str]] = None,
        rating_min: Optional[float] = None,
        rating_max: Optional[float] = None,
        sort_by: Optional[str] = None,
    ) -> List[dict[str, Any]]:
        if not self.session:
            return []
        q = select(Movie)
        if genre_slug:
            q = q.join(Movie.genres).where(Genre.slug == genre_slug)
        if year_min is not None:
            q = q.where(Movie.year >= str(year_min))
        if year_max is not None:
            q = q.where(Movie.year <= str(year_max))
        if countries:
            q = q.where(Movie.country.in_(countries))
        if languages:
            q = q.where(Movie.language.in_(languages))
        if rating_min is not None:
            q = q.where(Movie.siddu_score >= rating_min)
        if rating_max is not None:
            q = q.where(Movie.siddu_score <= rating_max)
        # sorting
        if sort_by == "latest":
            q = q.order_by(desc(Movie.year))
        elif sort_by in ("score", "rating"):
            q = q.order_by(desc(Movie.siddu_score))
        elif sort_by == "popular":
            q = q.order_by(desc(Movie.siddu_score))
        elif sort_by == "alphabetical":
            q = q.order_by(asc(Movie.title))
        elif sort_by == "alphabetical-desc":
            q = q.order_by(desc(Movie.title))
        q = q.limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        movies = res.scalars().all()
        return [
            {
                "id": m.external_id,
                "title": m.title,
                "year": m.year,
                "posterUrl": m.poster_url,
                "genres": [g.name for g in m.genres],
                "sidduScore": m.siddu_score,
                "language": m.language,
                "country": m.country,
                "runtime": m.runtime,
            }
            for m in movies
        ]

    async def get(self, external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        q = select(Movie).where(Movie.external_id == external_id)
        res = await self.session.execute(q)
        m = res.scalar_one_or_none()
        if not m:
            return None
        return {
            "id": m.external_id,
            "title": m.title,
            "year": m.year,
            "posterUrl": m.poster_url,
            "genres": [g.name for g in m.genres],
            "sidduScore": m.siddu_score,
            "language": m.language,
            "country": m.country,
            "runtime": m.runtime,
            "synopsis": m.overview,
        }

