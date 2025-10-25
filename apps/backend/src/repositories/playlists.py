from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, desc, delete, insert
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

from ..models import Playlist, User, Movie, playlist_movies


class PlaylistRepository:
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
        q = select(Playlist)
        if user_id:
            q = q.join(Playlist.creator).where(User.external_id == user_id)
        if is_public is not None:
            q = q.where(Playlist.is_public == is_public)
        q = q.order_by(desc(Playlist.created_at)).limit(limit).offset((page - 1) * limit)
        res = await self.session.execute(q)
        items = res.scalars().all()
        return [
            {
                "id": p.external_id,
                "title": p.title,
                "description": p.description,
                "creator": p.creator.name,
                "movieCount": len(p.movies),
                "followers": p.followers,
                "posterImages": [m.poster_url for m in p.movies[:4] if m.poster_url],
                "isPublic": p.is_public,
                "createdAt": p.created_at.isoformat(),
                "updatedAt": p.updated_at.isoformat() if p.updated_at else None,
                "tags": p.tags.split(",") if p.tags else [],
            }
            for p in items
        ]

    async def get(self, external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        q = select(Playlist).where(Playlist.external_id == external_id)
        res = await self.session.execute(q)
        p = res.scalar_one_or_none()
        if not p:
            return None
        return {
            "id": p.external_id,
            "title": p.title,
            "description": p.description,
            "creator": p.creator.name,
            "movieCount": len(p.movies),
            "followers": p.followers,
            "posterImages": [m.poster_url for m in p.movies[:4] if m.poster_url],
            "isPublic": p.is_public,
            "createdAt": p.created_at.isoformat(),
            "updatedAt": p.updated_at.isoformat() if p.updated_at else None,
            "tags": p.tags.split(",") if p.tags else [],
            "movies": [
                {
                    "id": m.external_id,
                    "title": m.title,
                    "year": int(m.year) if m.year else None,
                    "poster": m.poster_url,
                    "rating": m.siddu_score,
                    "genres": [g.name for g in m.genres],
                }
                for m in p.movies
            ],
        }

    async def create(
        self,
        user_id: int,
        title: str,
        description: str = "",
        is_public: bool = True,
    ) -> dict[str, Any]:
        if not self.session:
            return {}

        playlist = Playlist(
            external_id=str(uuid.uuid4()),
            user_id=user_id,
            title=title,
            description=description,
            is_public=is_public,
            followers=0,
            created_at=datetime.utcnow(),
        )
        self.session.add(playlist)
        await self.session.flush()
        await self.session.refresh(playlist, ["creator"])

        return {
            "id": playlist.external_id,
            "title": playlist.title,
            "description": playlist.description,
            "creator": playlist.creator.name,
            "movieCount": 0,
            "followers": 0,
            "posterImages": [],
            "isPublic": playlist.is_public,
            "createdAt": playlist.created_at.isoformat(),
        }

    async def add_movie(self, playlist_id: str, movie_id: str, user_id: int) -> bool:
        if not self.session:
            return False

        res_pl = await self.session.execute(
            select(Playlist).where(Playlist.external_id == playlist_id)
        )
        playlist = res_pl.scalar_one_or_none()
        if not playlist:
            return False
        if playlist.user_id != user_id:
            raise ValueError("User does not own this playlist")

        res_mv = await self.session.execute(select(Movie).where(Movie.external_id == movie_id))
        movie = res_mv.scalar_one_or_none()
        if not movie:
            raise ValueError(f"Movie {movie_id} not found")

        existing = await self.session.execute(
            select(playlist_movies).where(
                playlist_movies.c.playlist_id == playlist.id,
                playlist_movies.c.movie_id == movie.id,
            )
        )
        if existing.first():
            return True

        await self.session.execute(
            insert(playlist_movies).values(
                playlist_id=playlist.id,
                movie_id=movie.id,
            )
        )
        playlist.updated_at = datetime.utcnow()
        await self.session.flush()
        return True

    async def remove_movie(self, playlist_id: str, movie_id: str, user_id: int) -> bool:
        if not self.session:
            return False

        res_pl = await self.session.execute(
            select(Playlist).where(Playlist.external_id == playlist_id)
        )
        playlist = res_pl.scalar_one_or_none()
        if not playlist:
            return False
        if playlist.user_id != user_id:
            raise ValueError("User does not own this playlist")

        res_mv = await self.session.execute(select(Movie).where(Movie.external_id == movie_id))
        movie = res_mv.scalar_one_or_none()
        if not movie:
            return False

        await self.session.execute(
            delete(playlist_movies).where(
                playlist_movies.c.playlist_id == playlist.id,
                playlist_movies.c.movie_id == movie.id,
            )
        )
        playlist.updated_at = datetime.utcnow()
        await self.session.flush()
        return True

    async def delete_playlist(self, playlist_id: str, user_id: int) -> bool:
        if not self.session:
            return False

        res_pl = await self.session.execute(
            select(Playlist).where(Playlist.external_id == playlist_id)
        )
        playlist = res_pl.scalar_one_or_none()
        if not playlist:
            return False
        if playlist.user_id != user_id:
            raise ValueError("User does not own this playlist")

        await self.session.execute(
            delete(playlist_movies).where(
                playlist_movies.c.playlist_id == playlist.id
            )
        )
        await self.session.delete(playlist)
        await self.session.flush()
        return True

