from __future__ import annotations
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession
from ..db import get_session
from ..repositories.admin import AdminRepository

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminUserOut(BaseModel):
    id: str
    name: str
    email: str
    roles: List[str]
    status: str
    joinedDate: str
    lastLogin: Optional[str] = None
    profileType: Optional[str] = None
    verificationStatus: Optional[str] = None
    accountType: Optional[str] = None
    phoneNumber: Optional[str] = None
    location: Optional[str] = None


class ModerationItemOut(BaseModel):
    id: str
    type: str
    contentTitle: str
    reportReason: Optional[str] = None
    status: str
    user: Optional[str] = None
    timestamp: str
    reports: int


class SettingsUpdateIn(BaseModel):
    data: Dict[str, Any]


class AnalyticsOverviewOut(BaseModel):
    totalUsers: int
    contentViews: int
    avgRating: float
    systemHealth: float
    changes: Dict[str, float]


@router.get("/users", response_model=List[AdminUserOut])
async def list_users(
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = AdminRepository(session)
    return await repo.list_users(search=search, role=role, status=status, page=page, limit=limit)


@router.get("/moderation/items", response_model=List[ModerationItemOut])
async def list_moderation_items(
    status: Optional[str] = Query(None),
    contentType: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = AdminRepository(session)
    return await repo.list_moderation_items(status=status, content_type=contentType, search=search, page=page, limit=limit)


class ModerationActionIn(BaseModel):
    reason: Optional[str] = None


@router.post("/moderation/items/{itemId}/approve")
async def approve_item(itemId: str, body: ModerationActionIn, session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    result = await repo.set_moderation_action(item_external_id=itemId, action="approve", reason=body.reason)
    if not result:
        raise HTTPException(status_code=404, detail="moderation_item_not_found")
    return result


@router.post("/moderation/items/{itemId}/reject")
async def reject_item(itemId: str, body: ModerationActionIn, session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    result = await repo.set_moderation_action(item_external_id=itemId, action="reject", reason=body.reason)
    if not result:
        raise HTTPException(status_code=404, detail="moderation_item_not_found")
    return result


@router.get("/system/settings")
async def get_settings(session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    return await repo.get_settings()


@router.put("/system/settings")
async def update_settings(body: SettingsUpdateIn, session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    return await repo.update_settings(data=body.data)


@router.get("/analytics/overview", response_model=AnalyticsOverviewOut)
async def analytics_overview(session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    return await repo.get_analytics_overview()

