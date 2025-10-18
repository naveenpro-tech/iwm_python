from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Collection, User


class CollectionRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list(
        self,
        *,
        page: int = 1,
        limit: int = 20,
        user_id: str | None = None,
        is_public: bool | None = None,
    ) -> List[dict[str, Any]]:
        if not self.session:
            return []
        q = select(Collection)
        if user_id:
            q = q.join(Collection.creator).where(User.external_id == user_id)
        if is_public is not None:
            q = q.where(Collection.is_public == is_public)
        q = q.order_by(desc(Collection.created_at)).limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        collections = res.scalars().all()
        return [
            {
                "id": c.external_id,
                "title": c.title,
                "description": c.description,
                "creator": c.creator.name,
                "movieCount": len(c.movies),
                "followers": c.followers,
                "posterImages": [m.poster_url for m in c.movies[:4] if m.poster_url],
                "isPublic": c.is_public,
                "createdAt": c.created_at.isoformat(),
                "updatedAt": c.updated_at.isoformat() if c.updated_at else None,
                "tags": c.tags.split(",") if c.tags else [],
            }
            for c in collections
        ]

    async def get(self, external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        q = select(Collection).where(Collection.external_id == external_id)
        res = await self.session.execute(q)
        c = res.scalar_one_or_none()
        if not c:
            return None
        return {
            "id": c.external_id,
            "title": c.title,
            "description": c.description,
            "creator": c.creator.name,
            "movieCount": len(c.movies),
            "followers": c.followers,
            "posterImages": [m.poster_url for m in c.movies[:4] if m.poster_url],
            "isPublic": c.is_public,
            "createdAt": c.created_at.isoformat(),
            "updatedAt": c.updated_at.isoformat() if c.updated_at else None,
            "tags": c.tags.split(",") if c.tags else [],
            "movies": [
                {
                    "id": m.external_id,
                    "title": m.title,
                    "year": int(m.year) if m.year else None,
                    "poster": m.poster_url,
                    "rating": m.siddu_score,
                    "genres": [g.name for g in m.genres],
                }
                for m in c.movies
            ],
        }

