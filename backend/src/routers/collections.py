from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field

from ..db import get_session
from ..repositories.collections import CollectionRepository
from ..dependencies.auth import get_current_user
from ..models import User

router = APIRouter(prefix="/collections", tags=["collections"])


class CollectionCreateBody(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(default="", max_length=500)
    isPublic: bool = True


class CollectionUpdateBody(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=100)
    description: str | None = Field(None, max_length=500)
    isPublic: bool | None = None


class AddMovieBody(BaseModel):
    movieId: str


@router.get("")
async def list_collections(
    page: int = 1,
    limit: int = 20,
    userId: str | None = None,
    isPublic: bool | None = None,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List collections with optional filters.
    
    - page: page number (1-based)
    - limit: results per page
    - userId: filter by user external_id
    - isPublic: filter by public/private status
    """
    repo = CollectionRepository(session)
    return await repo.list(page=page, limit=limit, user_id=userId, is_public=isPublic)


@router.get("/{collection_id}")
async def get_collection(collection_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = CollectionRepository(session)
    data = await repo.get(collection_id)
    if not data:
        raise HTTPException(status_code=404, detail="Collection not found")
    return data


@router.post("")
async def create_collection(
    body: CollectionCreateBody,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create a new collection"""
    repo = CollectionRepository(session)
    try:
        result = await repo.create(
            user_id=current_user.id,
            title=body.title,
            description=body.description,
            is_public=body.isPublic,
        )
        await session.commit()
        return result
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to create collection")


@router.put("/{collection_id}")
async def update_collection(
    collection_id: str,
    body: CollectionUpdateBody,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update a collection. User must own the collection."""
    repo = CollectionRepository(session)
    try:
        result = await repo.update(
            collection_id=collection_id,
            user_id=current_user.id,
            title=body.title,
            description=body.description,
            is_public=body.isPublic,
        )
        if result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
        await session.commit()
        return result
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to update collection")


@router.post("/{collection_id}/movies")
async def add_movie_to_collection(
    collection_id: str,
    body: AddMovieBody,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Add a movie to a collection. User must own the collection."""
    repo = CollectionRepository(session)
    try:
        result = await repo.add_movie(
            collection_id=collection_id,
            movie_id=body.movieId,
            user_id=current_user.id,
        )
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
        await session.commit()
        return {"added": True}
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to add movie to collection")


@router.delete("/{collection_id}/movies/{movie_id}")
async def remove_movie_from_collection(
    collection_id: str,
    movie_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Remove a movie from a collection. User must own the collection."""
    repo = CollectionRepository(session)
    try:
        result = await repo.remove_movie(
            collection_id=collection_id,
            movie_id=movie_id,
            user_id=current_user.id,
        )
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection or movie not found")
        await session.commit()
        return {"removed": True}
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to remove movie from collection")


@router.delete("/{collection_id}")
async def delete_collection(
    collection_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Delete a collection. User must own the collection."""
    repo = CollectionRepository(session)
    try:
        result = await repo.delete_collection(
            collection_id=collection_id,
            user_id=current_user.id,
        )
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
        await session.commit()
        return {"deleted": True}
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete collection")


@router.post("/{collection_id}/like")
async def like_collection(
    collection_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Like or unlike a collection. Toggles the like status."""
    repo = CollectionRepository(session)
    try:
        result = await repo.toggle_like(
            collection_id=collection_id,
            user_id=current_user.id,
        )
        if result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
        await session.commit()
        return {"liked": result, "message": "Collection liked" if result else "Collection unliked"}
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to like collection")


@router.post("/{collection_id}/import")
async def import_collection_route(
    collection_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Import (copy) a collection to the current user's account."""
    repo = CollectionRepository(session)
    try:
        result = await repo.import_collection(
            collection_id=collection_id,
            user_id=current_user.id,
        )
        if result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
        await session.commit()
        return result
    except ValueError as e:
        await session.rollback()
        if "already own" in str(e):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to import collection")
