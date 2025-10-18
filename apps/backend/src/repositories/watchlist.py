from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Watchlist, User, Movie


class WatchlistRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list(
        self,
        *,
        page: int = 1,
        limit: int = 20,
        user_id: str | None = None,
        status: str | None = None,
    ) -> List[dict[str, Any]]:
        if not self.session:
            return []
        q = select(Watchlist)
        if user_id:
            q = q.join(Watchlist.user).where(User.external_id == user_id)
        if status:
            q = q.where(Watchlist.status == status)
        q = q.order_by(desc(Watchlist.date_added)).limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        items = res.scalars().all()
        return [
            {
                "id": w.external_id,
                "title": w.movie.title,
                "posterUrl": w.movie.poster_url,
                "dateAdded": w.date_added.isoformat(),
                "releaseDate": w.movie.year,
                "status": w.status,
                "priority": w.priority,
                "progress": w.progress,
                "rating": w.movie.siddu_score,
                "genres": [g.name for g in w.movie.genres],
                "runtime": w.movie.runtime,
            }
            for w in items
        ]

    async def get(self, external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        q = select(Watchlist).where(Watchlist.external_id == external_id)
        res = await self.session.execute(q)
        w = res.scalar_one_or_none()
        if not w:
            return None
        return {
            "id": w.external_id,
            "title": w.movie.title,
            "posterUrl": w.movie.poster_url,
            "dateAdded": w.date_added.isoformat(),
            "releaseDate": w.movie.year,
            "status": w.status,
            "priority": w.priority,
            "progress": w.progress,
            "rating": w.movie.siddu_score,
            "genres": [g.name for g in w.movie.genres],
            "runtime": w.movie.runtime,
        }

