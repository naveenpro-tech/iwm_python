from __future__ import annotations

from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from ..db import get_session
from ..repositories.favorites import FavoriteRepository
from ..dependencies.auth import get_current_user
from ..models import User

router = APIRouter(prefix="/favorites", tags=["favorites"])


class FavoriteCreateBody(BaseModel):
    type: str  # movie, person, scene
    movieId: Optional[str] = None
    personId: Optional[str] = None


@router.get("")
async def list_favorites(
    page: int = 1,
    limit: int = 20,
    type: str | None = None,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    List favorite items for the current user with optional filters.

    - page: page number (1-based)
    - limit: results per page
    - type: filter by type (movie, person, scene, article, all)

    Note: Always filters by current user for security
    """
    repo = FavoriteRepository(session)
    return await repo.list(page=page, limit=limit, user_id=current_user.external_id, type_filter=type)


@router.get("/{favorite_id}")
async def get_favorite_item(favorite_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = FavoriteRepository(session)
    data = await repo.get(favorite_id)
    if not data:
        raise HTTPException(status_code=404, detail="Favorite item not found")
    return data


@router.post("")
async def add_to_favorites(
    body: FavoriteCreateBody,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Add an item to favorites"""
    repo = FavoriteRepository(session)
    try:
        result = await repo.create(
            user_id=current_user.id,
            fav_type=body.type,
            movie_id=body.movieId,
            person_id=body.personId,
        )
        await session.commit()
        return result
    except ValueError as e:
        await session.rollback()
        if "Already in favorites" in str(e):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to add to favorites")


@router.delete("/{favorite_id}")
async def remove_from_favorites(
    favorite_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Remove an item from favorites. User must own the favorite."""
    repo = FavoriteRepository(session)
    try:
        result = await repo.delete(favorite_id=favorite_id, user_id=current_user.id)
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")
        await session.commit()
        return {"deleted": True}
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to remove from favorites")

