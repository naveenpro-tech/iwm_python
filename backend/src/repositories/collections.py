from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, desc, delete, insert, and_
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

from ..models import Collection, User, Movie, collection_movies, collection_likes


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

    async def create(
        self,
        user_id: int,
        title: str,
        description: str = "",
        is_public: bool = True,
    ) -> dict[str, Any]:
        """Create a new collection"""
        if not self.session:
            return {}

        collection = Collection(
            external_id=str(uuid.uuid4()),
            user_id=user_id,
            title=title,
            description=description,
            is_public=is_public,
            followers=0,
            created_at=datetime.utcnow(),
        )
        self.session.add(collection)
        await self.session.flush()
        await self.session.refresh(collection, ["creator"])

        return {
            "id": collection.external_id,
            "title": collection.title,
            "description": collection.description,
            "creator": collection.creator.name,
            "movieCount": 0,
            "followers": 0,
            "posterImages": [],
            "isPublic": collection.is_public,
            "createdAt": collection.created_at.isoformat(),
        }

    async def update(
        self,
        collection_id: str,
        user_id: int,
        title: str | None = None,
        description: str | None = None,
        is_public: bool | None = None,
    ) -> dict[str, Any] | None:
        """Update a collection's metadata"""
        if not self.session:
            return None

        # Get collection
        coll_res = await self.session.execute(
            select(Collection).where(Collection.external_id == collection_id)
        )
        collection = coll_res.scalar_one_or_none()
        if not collection:
            return None

        # Verify ownership
        if collection.user_id != user_id:
            raise ValueError("User does not own this collection")

        # Update fields if provided
        if title is not None:
            collection.title = title
        if description is not None:
            collection.description = description
        if is_public is not None:
            collection.is_public = is_public

        collection.updated_at = datetime.utcnow()
        await self.session.flush()
        await self.session.refresh(collection, ["creator", "movies"])

        return {
            "id": collection.external_id,
            "title": collection.title,
            "description": collection.description,
            "creator": collection.creator.name,
            "movieCount": len(collection.movies),
            "followers": collection.followers,
            "posterImages": [m.poster_url for m in collection.movies[:4] if m.poster_url],
            "isPublic": collection.is_public,
            "createdAt": collection.created_at.isoformat(),
            "updatedAt": collection.updated_at.isoformat() if collection.updated_at else None,
        }

    async def add_movie(
        self, collection_id: str, movie_id: str, user_id: int
    ) -> bool:
        """Add a movie to a collection"""
        if not self.session:
            return False

        # Get collection
        coll_res = await self.session.execute(
            select(Collection).where(Collection.external_id == collection_id)
        )
        collection = coll_res.scalar_one_or_none()
        if not collection:
            return False

        # Verify ownership
        if collection.user_id != user_id:
            raise ValueError("User does not own this collection")

        # Get movie
        movie_res = await self.session.execute(
            select(Movie).where(Movie.external_id == movie_id)
        )
        movie = movie_res.scalar_one_or_none()
        if not movie:
            raise ValueError(f"Movie {movie_id} not found")

        # Check if already exists
        existing = await self.session.execute(
            select(collection_movies).where(
                collection_movies.c.collection_id == collection.id,
                collection_movies.c.movie_id == movie.id,
            )
        )
        if existing.first():
            return True  # Already exists, return success

        # Add to collection
        await self.session.execute(
            insert(collection_movies).values(
                collection_id=collection.id,
                movie_id=movie.id,
            )
        )
        collection.updated_at = datetime.utcnow()
        await self.session.flush()
        return True

    async def remove_movie(
        self, collection_id: str, movie_id: str, user_id: int
    ) -> bool:
        """Remove a movie from a collection"""
        if not self.session:
            return False

        # Get collection
        coll_res = await self.session.execute(
            select(Collection).where(Collection.external_id == collection_id)
        )
        collection = coll_res.scalar_one_or_none()
        if not collection:
            return False

        # Verify ownership
        if collection.user_id != user_id:
            raise ValueError("User does not own this collection")

        # Get movie
        movie_res = await self.session.execute(
            select(Movie).where(Movie.external_id == movie_id)
        )
        movie = movie_res.scalar_one_or_none()
        if not movie:
            return False

        # Delete from collection
        await self.session.execute(
            delete(collection_movies).where(
                collection_movies.c.collection_id == collection.id,
                collection_movies.c.movie_id == movie.id,
            )
        )
        collection.updated_at = datetime.utcnow()
        await self.session.flush()
        return True

    async def delete_collection(self, collection_id: str, user_id: int) -> bool:
        """Delete a collection"""
        if not self.session:
            return False

        # Get collection
        coll_res = await self.session.execute(
            select(Collection).where(Collection.external_id == collection_id)
        )
        collection = coll_res.scalar_one_or_none()
        if not collection:
            return False

        # Verify ownership
        if collection.user_id != user_id:
            raise ValueError("User does not own this collection")

        # Delete all collection movies first
        await self.session.execute(
            delete(collection_movies).where(
                collection_movies.c.collection_id == collection.id
            )
        )

        # Delete collection
        await self.session.delete(collection)
        await self.session.flush()
        return True

    async def toggle_like(self, collection_id: str, user_id: int) -> bool | None:
        """Toggle like status for a collection. Returns True if liked, False if unliked, None if collection not found."""
        if not self.session:
            return None

        # Get collection
        coll_res = await self.session.execute(
            select(Collection).where(Collection.external_id == collection_id)
        )
        collection = coll_res.scalar_one_or_none()
        if not collection:
            return None

        # Check if already liked
        existing = await self.session.execute(
            select(collection_likes).where(
                and_(
                    collection_likes.c.collection_id == collection.id,
                    collection_likes.c.user_id == user_id,
                )
            )
        )
        like_exists = existing.first()

        if like_exists:
            # Unlike - remove the like
            await self.session.execute(
                delete(collection_likes).where(
                    and_(
                        collection_likes.c.collection_id == collection.id,
                        collection_likes.c.user_id == user_id,
                    )
                )
            )
            # Decrement followers count
            if collection.followers > 0:
                collection.followers -= 1
            await self.session.flush()
            return False
        else:
            # Like - add the like
            await self.session.execute(
                insert(collection_likes).values(
                    collection_id=collection.id,
                    user_id=user_id,
                )
            )
            # Increment followers count
            collection.followers += 1
            await self.session.flush()
            return True

    async def import_collection(self, collection_id: str, user_id: int) -> dict[str, Any] | None:
        """Import (copy) a collection for the current user."""
        if not self.session:
            return None

        # Get the source collection
        coll_res = await self.session.execute(
            select(Collection).where(Collection.external_id == collection_id)
        )
        source_collection = coll_res.scalar_one_or_none()
        if not source_collection:
            return None

        # Check if the user already owns this collection
        if source_collection.user_id == user_id:
            raise ValueError("You already own this collection")

        # Create a new collection (copy) for the current user
        new_collection = Collection(
            external_id=str(uuid.uuid4()),
            user_id=user_id,
            title=f"{source_collection.title} (Imported)",
            description=source_collection.description,
            is_public=False,  # Imported collections are private by default
            followers=0,
            tags=source_collection.tags,
            created_at=datetime.utcnow(),
        )
        self.session.add(new_collection)
        await self.session.flush()

        # Copy all movies from the source collection
        for movie in source_collection.movies:
            await self.session.execute(
                insert(collection_movies).values(
                    collection_id=new_collection.id,
                    movie_id=movie.id,
                )
            )
        await self.session.flush()
        await self.session.refresh(new_collection, ["creator", "movies"])

        return {
            "id": new_collection.external_id,
            "title": new_collection.title,
            "description": new_collection.description,
            "creator": new_collection.creator.name,
            "movieCount": len(new_collection.movies),
            "followers": new_collection.followers,
            "posterImages": [m.poster_url for m in new_collection.movies[:4] if m.poster_url],
            "isPublic": new_collection.is_public,
            "createdAt": new_collection.created_at.isoformat(),
        }
