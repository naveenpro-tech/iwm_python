from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.talent_hub import TalentHubRepository

router = APIRouter(prefix="/talent-hub", tags=["talent-hub"])


@router.get("/calls")
async def list_casting_calls(
    search: Optional[str] = Query(None),
    projectType: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    visibility: Optional[str] = Query(None),
    budgetRange: Optional[str] = Query(None),
    roleType: Optional[str] = Query(None),
    compensation: Optional[str] = Query(None),
    experienceLevel: Optional[str] = Query(None),
    sortBy: str = Query("newest", pattern="^(newest|deadline|alphabetical)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = TalentHubRepository(session)
    return await repo.list_casting_calls(
        search=search,
        project_type=projectType,
        location=location,
        status=status,
        visibility=visibility,
        budget_range=budgetRange,
        role_type=roleType,
        compensation=compensation,
        experience_level=experienceLevel,
        sort_by=sortBy,
        page=page,
        limit=limit,
    )


@router.get("/calls/{callId}")
async def get_casting_call_detail(
    callId: str,
    session: AsyncSession = Depends(get_session),
):
    repo = TalentHubRepository(session)
    c = await repo.get_casting_call_detail(call_external_id=callId)
    if not c:
        raise HTTPException(status_code=404, detail="casting_call_not_found")
    return c

