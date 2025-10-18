from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, Query

from ..db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.pulse import PulseRepository

router = APIRouter(prefix="/pulse", tags=["pulse"])


@router.get("/")
@router.get("/feed")
async def get_feed(
    filter: str = Query("latest", pattern="^(latest|popular|following|trending)$"),
    window: str = Query("7d", pattern="^(24h|7d|30d)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    viewerId: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session),
):
    repo = PulseRepository(session)
    return await repo.list_feed(filter_type=filter, window=window, page=page, limit=limit, viewer_external_id=viewerId)


@router.get("/trending-topics")
async def get_trending_topics(
    window: str = Query("7d", pattern="^(24h|7d|30d)$"),
    limit: int = Query(10, ge=1, le=50),
    session: AsyncSession = Depends(get_session),
):
    repo = PulseRepository(session)
    return await repo.trending_topics(window=window, limit=limit)

