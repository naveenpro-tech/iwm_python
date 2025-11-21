from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Movie, Person, Genre


class SearchRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def search(
        self,
        *,
        query: str,
        types: List[str] | None = None,
        limit_per_type: int = 10,
    ) -> dict[str, Any]:
        if not self.session:
            return {"movies": [], "people": [], "genres": []}

        types = types or ["movies", "people", "genres"]
        result: dict[str, Any] = {"movies": [], "people": [], "genres": []}

        if "movies" in types:
            q = select(Movie).where(Movie.title.ilike(f"%{query}%")).limit(limit_per_type)
            res = await self.session.execute(q)
            movies = res.scalars().all()
            result["movies"] = [
                {
                    "id": m.external_id,
                    "title": m.title,
                    "year": m.year,
                    "posterUrl": m.poster_url,
                    "genres": [g.name for g in m.genres],
                }
                for m in movies
            ]

        if "people" in types:
            q = select(Person).where(Person.name.ilike(f"%{query}%")).limit(limit_per_type)
            res = await self.session.execute(q)
            people = res.scalars().all()
            result["people"] = [
                {
                    "id": p.external_id,
                    "name": p.name,
                    "imageUrl": p.image_url,
                }
                for p in people
            ]

        if "genres" in types:
            q = select(Genre).where(
                or_(Genre.name.ilike(f"%{query}%"), Genre.slug.ilike(f"%{query}%"))
            ).limit(limit_per_type)
            res = await self.session.execute(q)
            genres = res.scalars().all()
            result["genres"] = [
                {
                    "id": g.slug,
                    "name": g.name,
                }
                for g in genres
            ]

        return result

