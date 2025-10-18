from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Favorite, User


class FavoriteRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list(
        self,
        *,
        page: int = 1,
        limit: int = 20,
        user_id: str | None = None,
        type_filter: str | None = None,
    ) -> List[dict[str, Any]]:
        if not self.session:
            return []
        q = select(Favorite)
        if user_id:
            q = q.join(Favorite.user).where(User.external_id == user_id)
        if type_filter and type_filter != "all":
            q = q.where(Favorite.type == type_filter)
        q = q.order_by(desc(Favorite.added_date)).limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        items = res.scalars().all()
        result = []
        for f in items:
            item: dict[str, Any] = {
                "id": f.external_id,
                "type": f.type,
                "addedDate": f.added_date.isoformat(),
            }
            if f.type == "movie" and f.movie:
                item["title"] = f.movie.title
                item["imageUrl"] = f.movie.poster_url
                item["releaseYear"] = int(f.movie.year) if f.movie.year else None
                item["userRating"] = f.movie.siddu_score
                item["genres"] = [g.name for g in f.movie.genres]
            elif f.type == "person" and f.person:
                item["title"] = f.person.name
                item["imageUrl"] = f.person.image_url
            result.append(item)
        return result

    async def get(self, external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        q = select(Favorite).where(Favorite.external_id == external_id)
        res = await self.session.execute(q)
        f = res.scalar_one_or_none()
        if not f:
            return None
        item: dict[str, Any] = {
            "id": f.external_id,
            "type": f.type,
            "addedDate": f.added_date.isoformat(),
        }
        if f.type == "movie" and f.movie:
            item["title"] = f.movie.title
            item["imageUrl"] = f.movie.poster_url
            item["releaseYear"] = int(f.movie.year) if f.movie.year else None
            item["userRating"] = f.movie.siddu_score
            item["genres"] = [g.name for g in f.movie.genres]
        elif f.type == "person" and f.person:
            item["title"] = f.person.name
            item["imageUrl"] = f.person.image_url
        return item

