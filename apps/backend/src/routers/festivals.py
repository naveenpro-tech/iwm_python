from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.festivals import FestivalsRepository

router = APIRouter(prefix="/festivals", tags=["festivals"])


@router.get("")
async def list_festivals(session: AsyncSession = Depends(get_session)) -> Any:
    repo = FestivalsRepository(session)
    return await repo.list_festivals()


@router.get("/{festival_id}")
async def get_festival_header(festival_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = FestivalsRepository(session)
    data = await repo.get_festival_header(festival_id)
    if not data:
        raise HTTPException(status_code=404, detail="Festival not found")
    return data


@router.get("/{festival_id}/{year}/program")
async def get_program(festival_id: str, year: int, session: AsyncSession = Depends(get_session)) -> Any:
    repo = FestivalsRepository(session)
    data = await repo.get_program(festival_id, year)
    if data is None:
        raise HTTPException(status_code=404, detail="Program not found")
    return data


@router.get("/{festival_id}/{year}/winners")
async def get_winners(festival_id: str, year: int, session: AsyncSession = Depends(get_session)) -> Any:
    repo = FestivalsRepository(session)
    data = await repo.get_winners(festival_id, year)
    if data is None:
        raise HTTPException(status_code=404, detail="Winners not found")
    return data

