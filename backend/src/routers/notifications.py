from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..models import User
from ..dependencies.auth import get_current_user
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
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """
    Get notification preferences for the current user.

    Returns all notification channel settings and global notification settings.

    Args:
        current_user: The authenticated user (injected by dependency)
        session: The database session (injected by dependency)

    Returns:
        dict: Notification preferences with 'channels' and 'global' keys

    Raises:
        HTTPException 401: If user is not authenticated
        HTTPException 500: If database operation fails
    """
    try:
        repo = NotificationsRepository(session)
        data = await repo.get_user_preferences(current_user.external_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch notification preferences")


@router.put("/preferences")
async def update_preferences(
    payload: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """
    Update notification preferences for the current user.

    Updates notification channel settings and/or global notification settings.
    Validates channel and global settings before persisting.

    Args:
        payload: dict with optional 'channels' and 'global' keys
        current_user: The authenticated user (injected by dependency)
        session: The database session (injected by dependency)

    Returns:
        dict: Updated notification preferences with 'channels' and 'global' keys

    Raises:
        HTTPException 400: If validation fails
        HTTPException 401: If user is not authenticated
        HTTPException 500: If database operation fails
    """
    try:
        if not isinstance(payload, dict):
            raise HTTPException(status_code=400, detail="Request body must be a JSON object")

        repo = NotificationsRepository(session)
        out = await repo.update_user_preferences(current_user.external_id, payload)
        return out
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update notification preferences")


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

