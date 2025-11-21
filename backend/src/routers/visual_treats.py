from __future__ import annotations

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.visual_treats import VisualTreatsRepository

router = APIRouter(prefix="/visual-treats", tags=["visual-treats"])


@router.get("")
async def list_visual_treats(
    categories: Optional[List[str]] = Query(None),
    tags: Optional[List[str]] = Query(None),
    directors: Optional[List[str]] = Query(None),
    cinematographers: Optional[List[str]] = Query(None),
    decades: Optional[List[str]] = Query(None),
    search: Optional[str] = Query(None),
    movieId: Optional[str] = Query(None),
    sceneId: Optional[str] = Query(None),
    sortBy: Optional[str] = Query("popular"),
    page: Optional[int] = Query(None, ge=1),
    pageSize: Optional[int] = Query(None, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
) -> Any:
    repo = VisualTreatsRepository(session)
    return await repo.list_treats(
        categories=categories,
        tags=tags,
        directors=directors,
        cinematographers=cinematographers,
        decades=decades,
        search=search,
        movie_external_id=movieId,
        scene_external_id=sceneId,
        sort_by=sortBy,
        page=page,
        page_size=pageSize,
    )


@router.get("/by-movie/{movie_id}")
async def list_visual_treats_by_movie(
    movie_id: str,
    sortBy: Optional[str] = Query("popular"),
    page: Optional[int] = Query(None, ge=1),
    pageSize: Optional[int] = Query(None, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
) -> Any:
    repo = VisualTreatsRepository(session)
    return await repo.list_by_movie(movie_external_id=movie_id, sort_by=sortBy, page=page, page_size=pageSize)


@router.get("/by-scene/{scene_id}")
async def list_visual_treats_by_scene(
    scene_id: str,
    sortBy: Optional[str] = Query("popular"),
    page: Optional[int] = Query(None, ge=1),
    pageSize: Optional[int] = Query(None, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
) -> Any:
    repo = VisualTreatsRepository(session)
    return await repo.list_by_scene(scene_external_id=scene_id, sort_by=sortBy, page=page, page_size=pageSize)

