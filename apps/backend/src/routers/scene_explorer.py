from __future__ import annotations

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.scene_explorer import SceneExplorerRepository

router = APIRouter(prefix="/scenes", tags=["scenes"])


@router.get("")
async def list_scenes(
    movieId: Optional[str] = Query(None),
    genre: Optional[List[str]] = Query(None),
    sceneType: Optional[str] = Query(None),
    page: int | None = Query(None, ge=1),
    pageSize: int | None = Query(None, ge=1, le=200),
    sort: str | None = Query("popular"),
    session: AsyncSession = Depends(get_session),
) -> Any:
    repo = SceneExplorerRepository(session)
    return await repo.list_scenes(
        movie_external_id=movieId,
        genres=genre,
        scene_type=sceneType,
        page=page,
        page_size=pageSize,
        sort=sort,
    )


@router.get("/by-movie/{movie_id}")
async def list_scenes_by_movie(
    movie_id: str,
    page: int | None = Query(None, ge=1),
    pageSize: int | None = Query(None, ge=1, le=200),
    sort: str | None = Query("popular"),
    session: AsyncSession = Depends(get_session),
) -> Any:
    repo = SceneExplorerRepository(session)
    return await repo.list_by_movie(
        movie_external_id=movie_id,
        page=page,
        page_size=pageSize,
        sort=sort,
    )

