from __future__ import annotations

from typing import Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Person, Movie, movie_people


class PeopleRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list(self, *, page: int = 1, limit: int = 20) -> List[dict[str, Any]]:
        if not self.session:
            return []
        q = select(Person).limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        people = res.scalars().all()
        return [
            {
                "id": p.external_id,
                "name": p.name,
                "imageUrl": p.image_url,
            }
            for p in people
        ]

    async def get(self, external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        q = select(Person).where(Person.external_id == external_id)
        res = await self.session.execute(q)
        p = res.scalar_one_or_none()
        if not p:
            return None
        # naive filmography (roles omitted for now)
        filmography = [
            {
                "id": m.external_id,
                "title": m.title,
                "year": m.year,
                "posterUrl": m.poster_url,
            }
            for m in p.movies
        ]
        return {
            "id": p.external_id,
            "name": p.name,
            "bio": p.bio,
            "imageUrl": p.image_url,
            "filmography": filmography,
        }

