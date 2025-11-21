from __future__ import annotations

from typing import Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Genre, Movie


class GenreRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def get_details(self, genre_slug: str) -> dict[str, Any] | None:
        # Minimal placeholder; expand with real aggregates later
        if not self.session:
            # Return stub to enable vertical slice
            return {
                "id": genre_slug,
                "name": genre_slug.title(),
                "description": "",
                "backgroundImage": "",
                "subgenres": [],
                "statistics": {
                    "totalMovies": 0,
                    "averageRating": 0,
                    "topDirectors": [],
                    "peakDecade": "",
                    "top3MoviesBySidduScoreInGenre": [],
                    "availableCountries": [],
                    "availableLanguages": [],
                    "popularityTrend": [],
                    "ratingDistribution": [],
                    "subgenreBreakdown": [],
                    "topActorsInGenre": [],
                    "releaseFrequencyByYear": [],
                },
                "relatedGenres": [],
                "curatedCollections": [],
                "notableFigures": [],
                "evolutionTimeline": [],
            }
        # DB-backed (simplified)
        q = select(Genre).where(Genre.slug == genre_slug)
        res = await self.session.execute(q)
        g = res.scalar_one_or_none()
        if not g:
            return None
        return {
            "id": g.slug,
            "name": g.name,
            "description": "",
            "backgroundImage": "",
            "subgenres": [],
            "statistics": {
                "totalMovies": len(g.movies),
                "averageRating": 0,
                "topDirectors": [],
                "peakDecade": "",
                "top3MoviesBySidduScoreInGenre": [],
                "availableCountries": [],
                "availableLanguages": [],
                "popularityTrend": [],
                "ratingDistribution": [],
                "subgenreBreakdown": [],
                "topActorsInGenre": [],
                "releaseFrequencyByYear": [],
            },
            "relatedGenres": [],
            "curatedCollections": [],
            "notableFigures": [],
            "evolutionTimeline": [],
        }

    async def get_movies(self, genre_slug: str, limit: int = 20, offset: int = 0) -> List[dict[str, Any]]:
        if not self.session:
            return []
        q = (
            select(Movie)
            .join(Movie.genres)
            .where(Genre.slug == genre_slug)
            .limit(limit)
            .offset(offset)
        )
        res = await self.session.execute(q)
        movies = res.scalars().all()
        return [{"id": m.external_id, "title": m.title} for m in movies]

