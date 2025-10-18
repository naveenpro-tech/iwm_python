from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.box_office import BoxOfficeRepository

router = APIRouter(prefix="/boxoffice", tags=["boxoffice"])


@router.get("/weekend")
async def get_weekend(region: str = "global", limit: int = 10, session: AsyncSession = Depends(get_session)) -> Any:
    repo = BoxOfficeRepository(session)
    return await repo.weekend(region=region, limit=limit)


@router.get("/trends")
async def get_trends(region: str = "global", session: AsyncSession = Depends(get_session)) -> Any:
    repo = BoxOfficeRepository(session)
    return await repo.trends(region=region)


@router.get("/ytd")
async def get_ytd(region: str = "global", year: int | None = None, session: AsyncSession = Depends(get_session)) -> Any:
    repo = BoxOfficeRepository(session)
    return await repo.ytd(region=region, year=year)


@router.get("/performance")
async def get_performance(region: str = "global", session: AsyncSession = Depends(get_session)) -> Any:
    repo = BoxOfficeRepository(session)
    return await repo.performance(region=region)


@router.get("/records")
async def get_records(region: str = "global", session: AsyncSession = Depends(get_session)) -> Any:
    repo = BoxOfficeRepository(session)
    return await repo.records(region=region)


@router.get("/top-films")
async def get_top_films(region: str = "global", limit: int = 10, session: AsyncSession = Depends(get_session)) -> Any:
    # Alias to weekend for now
    repo = BoxOfficeRepository(session)
    return await repo.weekend(region=region, limit=limit)

