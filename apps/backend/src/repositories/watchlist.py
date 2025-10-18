from __future__ import annotations

from typing import Any, List, Optional
from sqlalchemy import select, desc, delete
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

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

    async def create(
        self,
        movie_id: str,
        user_id: str,
        status: str = "want-to-watch",
        progress: Optional[int] = None,
        rating: Optional[float] = None,
    ) -> dict[str, Any]:
        """Create a new watchlist item"""
        if not self.session:
            return {}

        # Get user and movie
        user_res = await self.session.execute(select(User).where(User.external_id == user_id))
        user = user_res.scalar_one_or_none()
        if not user:
            raise ValueError(f"User {user_id} not found")

        movie_res = await self.session.execute(select(Movie).where(Movie.external_id == movie_id))
        movie = movie_res.scalar_one_or_none()
        if not movie:
            raise ValueError(f"Movie {movie_id} not found")

        # Create watchlist item
        watchlist_item = Watchlist(
            external_id=str(uuid.uuid4()),
            user_id=user.id,
            movie_id=movie.id,
            status=status,
            progress=progress,
            rating=rating,
            date_added=datetime.utcnow(),
        )
        self.session.add(watchlist_item)
        await self.session.flush()

        return {
            "id": watchlist_item.external_id,
            "movieId": movie.external_id,
            "userId": user.external_id,
            "status": watchlist_item.status,
            "progress": watchlist_item.progress,
            "rating": watchlist_item.rating,
            "dateAdded": watchlist_item.date_added.isoformat(),
        }

    async def update(
        self,
        watchlist_id: str,
        status: Optional[str] = None,
        progress: Optional[int] = None,
        rating: Optional[float] = None,
    ) -> dict[str, Any] | None:
        """Update a watchlist item"""
        if not self.session:
            return None

        q = select(Watchlist).where(Watchlist.external_id == watchlist_id)
        res = await self.session.execute(q)
        w = res.scalar_one_or_none()
        if not w:
            return None

        if status is not None:
            w.status = status
        if progress is not None:
            w.progress = progress
        if rating is not None:
            w.rating = rating

        await self.session.flush()

        return {
            "id": w.external_id,
            "status": w.status,
            "progress": w.progress,
            "rating": w.rating,
        }

    async def delete(self, watchlist_id: str) -> bool:
        """Delete a watchlist item"""
        if not self.session:
            return False

        q = select(Watchlist).where(Watchlist.external_id == watchlist_id)
        res = await self.session.execute(q)
        w = res.scalar_one_or_none()
        if not w:
            return False

        await self.session.delete(w)
        await self.session.flush()
        return True

