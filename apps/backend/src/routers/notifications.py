from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.notifications import NotificationsRepository

router = APIRouter(prefix="/notifications", tags=["notifications"])


class NotificationOut(BaseModel):
    id: str
    type: str
    title: str
    message: str
    timestamp: str
    isRead: bool
    actionUrl: Optional[str] = None
    metadata: Optional[dict] = None




@router.get("")
async def list_notifications(
    page: int = 1,
    limit: int = 20,
    userId: str | None = Query(None, description="User external id"),
    unread: bool | None = Query(None),
    type: str | None = Query(None, description="social|release|system|club|quiz|all"),
    dateFrom: str | None = Query(None),
    dateTo: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> list[NotificationOut]:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    df = datetime.fromisoformat(dateFrom.replace("Z", "+00:00")) if dateFrom else None
    dt = datetime.fromisoformat(dateTo.replace("Z", "+00:00")) if dateTo else None
    items = await repo.list_notifications(
        user_external_id=user_external_id,
        unread=unread,
        ntype=type,
        date_from=df,
        date_to=dt,
        page=page,
        limit=limit,
    )
    return [NotificationOut.model_validate(i) for i in items]


# Preferences and bulk actions BEFORE dynamic id routes to avoid conflicts
class MarkAllRequest(BaseModel):
    onlyUnread: bool = True


@router.get("/preferences")
async def get_preferences(
    userId: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> dict:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    data = await repo.get_user_preferences(user_external_id)
    return data


@router.put("/preferences")
async def update_preferences(
    payload: dict,
    userId: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> dict:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    out = await repo.update_user_preferences(user_external_id, payload)
    return out


@router.post("/mark-all-read")
async def mark_all_read(
    payload: MarkAllRequest,
    userId: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> dict[str, Any]:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    count = await repo.mark_all_read(user_external_id, only_unread=payload.onlyUnread)
    return {"updated": count}


# Dynamic id routes AFTER the above
@router.get("/{notificationId}")
async def get_notification(
    notificationId: str,
    userId: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> NotificationOut:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    data = await repo.get_detail(user_external_id, notificationId)
    if not data:
        raise HTTPException(status_code=404, detail="Notification not found")
    return NotificationOut.model_validate(data)


@router.post("/{notificationId}/read")
async def mark_read(
    notificationId: str,
    userId: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> dict[str, Any]:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    ok = await repo.mark_as_read(user_external_id, notificationId)
    if not ok:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "ok"}


@router.post("/{notificationId}/unread")
async def mark_unread(
    notificationId: str,
    userId: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> dict[str, Any]:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    ok = await repo.mark_as_unread(user_external_id, notificationId)
    if not ok:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "ok"}


@router.delete("/{notificationId}")
async def delete_notification(
    notificationId: str,
    userId: str | None = Query(None),
    session: AsyncSession = Depends(get_session),
) -> dict[str, Any]:
    repo = NotificationsRepository(session)
    user_external_id = userId or "user-1"
    ok = await repo.delete_notification(user_external_id, notificationId)
    if not ok:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "deleted"}

