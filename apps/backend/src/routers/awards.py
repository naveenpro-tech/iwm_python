from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.awards import AwardsRepository

router = APIRouter(prefix="/awards", tags=["awards"])


@router.get("/ceremonies")
async def list_ceremonies(session: AsyncSession = Depends(get_session)) -> Any:
    repo = AwardsRepository(session)
    return await repo.list_ceremonies()


@router.get("/details/{ceremony_year_id}")
async def get_award_details(ceremony_year_id: str, session: AsyncSession = Depends(get_session)) -> Any:
    repo = AwardsRepository(session)
    data = await repo.get_award_details(ceremony_year_id)
    if not data:
        raise HTTPException(status_code=404, detail="Award details not found")
    return data

