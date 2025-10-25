from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, Field

from ..db import get_session
from ..repositories.playlists import PlaylistRepository
from ..dependencies.auth import get_current_user
from ..models import User, Playlist

router = APIRouter(prefix="/playlists", tags=["playlists"])


class PlaylistCreateBody(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(default="", max_length=500)
    isPublic: bool = True


class PlaylistUpdateBody(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    isPublic: bool | None = None


class AddMovieBody(BaseModel):
    movieId: str


@router.get("")
async def list_playlists(
    page: int = 1,
    limit: int = 20,
    userId: str | None = None,
    isPublic: bool | None = None,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List playlists with optional filters.
    - page: page number (1-based)
    - limit: results per page
    - userId: filter by user external_id
    - isPublic: filter by public/private status
    """
    repo = PlaylistRepository(session)
    return await repo.list(page=page, limit=limit, user_id=userId, is_public=isPublic)


@router.get("/{playlist_id}")
async def get_playlist(playlist_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = PlaylistRepository(session)
    data = await repo.get(playlist_id)
    if not data:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return data


@router.post("")
async def create_playlist(
    body: PlaylistCreateBody,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    repo = PlaylistRepository(session)
    try:
        result = await repo.create(
            user_id=current_user.id,
            title=body.title,
            description=body.description,
            is_public=body.isPublic,
        )
        await session.commit()
        return result
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to create playlist")


@router.patch("/{playlist_id}")
async def update_playlist(
    playlist_id: str,
    body: PlaylistUpdateBody,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    try:
        res = await session.execute(select(Playlist).where(Playlist.external_id == playlist_id))
        playlist = res.scalar_one_or_none()
        if not playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")
        if playlist.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="User does not own this playlist")
        if body.title is not None:
            playlist.title = body.title
        if body.description is not None:
            playlist.description = body.description
        if body.isPublic is not None:
            playlist.is_public = body.isPublic
        await session.flush()
        await session.commit()
        return {"updated": True}
    except HTTPException:
        raise
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to update playlist")


@router.post("/{playlist_id}/movies")
async def add_movie_to_playlist(
    playlist_id: str,
    body: AddMovieBody,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    repo = PlaylistRepository(session)
    try:
        result = await repo.add_movie(
            playlist_id=playlist_id,
            movie_id=body.movieId,
            user_id=current_user.id,
        )
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playlist not found")
        await session.commit()
        return {"added": True}
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to add movie to playlist")


@router.delete("/{playlist_id}/movies/{movie_id}")
async def remove_movie_from_playlist(
    playlist_id: str,
    movie_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    repo = PlaylistRepository(session)
    try:
        result = await repo.remove_movie(
            playlist_id=playlist_id,
            movie_id=movie_id,
            user_id=current_user.id,
        )
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playlist or movie not found")
        await session.commit()
        return {"removed": True}
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to remove movie from playlist")


@router.delete("/{playlist_id}")
async def delete_playlist(
    playlist_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    repo = PlaylistRepository(session)
    try:
        result = await repo.delete_playlist(
            playlist_id=playlist_id,
            user_id=current_user.id,
        )
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playlist not found")
        await session.commit()
        return {"deleted": True}
    except ValueError as e:
        await session.rollback()
        if "does not own" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        await session.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete playlist")

