from __future__ import annotations

from typing import Any, List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

from ..models import Favorite, User, Movie, Person


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

    async def create(
        self,
        user_id: int,
        fav_type: str,
        movie_id: Optional[str] = None,
        person_id: Optional[str] = None,
    ) -> dict[str, Any]:
        """Create a new favorite"""
        if not self.session:
            return {}

        # Validate type and get entity
        movie_id_db = None
        person_id_db = None

        if fav_type == "movie":
            if not movie_id:
                raise ValueError("movie_id required for movie favorites")
            movie_res = await self.session.execute(
                select(Movie).where(Movie.external_id == movie_id)
            )
            movie = movie_res.scalar_one_or_none()
            if not movie:
                raise ValueError(f"Movie {movie_id} not found")
            movie_id_db = movie.id

        elif fav_type == "person":
            if not person_id:
                raise ValueError("person_id required for person favorites")
            person_res = await self.session.execute(
                select(Person).where(Person.external_id == person_id)
            )
            person = person_res.scalar_one_or_none()
            if not person:
                raise ValueError(f"Person {person_id} not found")
            person_id_db = person.id

        else:
            raise ValueError(f"Invalid favorite type: {fav_type}")

        # Check if already exists
        existing_q = select(Favorite).where(Favorite.user_id == user_id)
        if movie_id_db:
            existing_q = existing_q.where(Favorite.movie_id == movie_id_db)
        if person_id_db:
            existing_q = existing_q.where(Favorite.person_id == person_id_db)

        existing = await self.session.execute(existing_q)
        if existing.scalar_one_or_none():
            raise ValueError("Already in favorites")

        # Create favorite
        favorite = Favorite(
            external_id=str(uuid.uuid4()),
            user_id=user_id,
            type=fav_type,
            movie_id=movie_id_db,
            person_id=person_id_db,
            added_date=datetime.utcnow(),
        )
        self.session.add(favorite)
        await self.session.flush()

        return {
            "id": favorite.external_id,
            "type": favorite.type,
            "addedDate": favorite.added_date.isoformat(),
        }

    async def delete(self, favorite_id: str, user_id: int) -> bool:
        """Delete a favorite"""
        if not self.session:
            return False

        # Get favorite
        q = select(Favorite).where(Favorite.external_id == favorite_id)
        res = await self.session.execute(q)
        favorite = res.scalar_one_or_none()
        if not favorite:
            return False

        # Verify ownership
        if favorite.user_id != user_id:
            raise ValueError("User does not own this favorite")

        await self.session.delete(favorite)
        await self.session.flush()
        return True

