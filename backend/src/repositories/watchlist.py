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
        # Prefer DISTINCT ON (movie_id) to avoid duplicates per movie for a user (PostgreSQL)
        q = select(Watchlist)
        if user_id:
            q = q.join(Watchlist.user).where(User.external_id == user_id)
        if status:
            q = q.where(Watchlist.status == status)
        # DISTINCT ON must come before ORDER BY in SQL; SQLAlchemy models it via distinct(col)
        q = q.order_by(Watchlist.movie_id, desc(Watchlist.date_added)).distinct(Watchlist.movie_id)
        # Apply pagination after dedupe (approximate)
        q = q.limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        items = res.scalars().all()
        # Deduplicate by movie external_id to avoid duplicates for same user/movie
        result: list[dict[str, Any]] = []
        seen_movies: set[str] = set()
        for w in items:
            movie_ext_id = w.movie.external_id
            if movie_ext_id in seen_movies:
                continue
            seen_movies.add(movie_ext_id)
            result.append(
                {
                    "id": w.external_id,
                    "movieId": movie_ext_id,
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
            )
        return result

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
            "movieId": w.movie.external_id,
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
        rating: Optional[float] = None,  # Kept for API compatibility but not used
        priority: Optional[str] = None,  # Kept for API compatibility but not used
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

        # DEBUG: log lookup ids
        try:
            print(f"[watchlist.create] lookup user.id={user.id} movie.id={movie.id}")
        except Exception:
            pass

        # Check for existing entry to make operation idempotent (join to ensure relationship loaded)
        existing_res = await self.session.execute(
            select(Watchlist)
            .join(Watchlist.user)
            .join(Watchlist.movie)
            .where(User.external_id == user_id, Movie.external_id == movie_id)
            .limit(1)
        )
        existing = existing_res.scalar_one_or_none()
        if existing:
            try:
                print(f"[watchlist.create] existing found ext_id={existing.external_id}")
            except Exception:
                pass
            return {
                "id": existing.external_id,
                "movieId": movie.external_id,
                "userId": user.external_id,
                "status": existing.status,
                "progress": existing.progress,
                "dateAdded": existing.date_added.isoformat(),
            }

        # Create watchlist item
        watchlist_item = Watchlist(
            external_id=str(uuid.uuid4()),
            user_id=user.id,
            movie_id=movie.id,
            status=status,
            priority=priority or "medium",
            progress=progress,
            date_added=datetime.utcnow(),
        )
        self.session.add(watchlist_item)
        try:
            await self.session.flush()
        except Exception as e:
            # Handle unique constraint violation gracefully (idempotent create)
            try:
                from sqlalchemy.exc import IntegrityError
                if isinstance(e, IntegrityError):
                    await self.session.rollback()
                    existing_res2 = await self.session.execute(
                        select(Watchlist)
                        .join(Watchlist.user)
                        .join(Watchlist.movie)
                        .where(User.external_id == user_id, Movie.external_id == movie_id)
                        .limit(1)
                    )
                    existing2 = existing_res2.scalar_one_or_none()
                    if existing2:
                        return {
                            "id": existing2.external_id,
                            "movieId": movie.external_id,
                            "userId": user.external_id,
                            "status": existing2.status,
                            "progress": existing2.progress,
                            "dateAdded": existing2.date_added.isoformat(),
                        }
            except Exception:
                pass
            raise

        return {
            "id": watchlist_item.external_id,
            "movieId": movie.external_id,
            "userId": user.external_id,
            "status": watchlist_item.status,
            "progress": watchlist_item.progress,
            "dateAdded": watchlist_item.date_added.isoformat(),
        }

    async def update(
        self,
        watchlist_id: str,
        status: Optional[str] = None,
        progress: Optional[int] = None,
        priority: Optional[str] = None,
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
        if priority is not None:
            w.priority = priority

        await self.session.flush()

        return {
            "id": w.external_id,
            "status": w.status,
            "progress": w.progress,
            "priority": w.priority,
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

