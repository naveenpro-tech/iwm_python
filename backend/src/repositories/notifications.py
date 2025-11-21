from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, delete, select, update, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Notification, NotificationPreference, User


DEFAULT_CHANNELS = {
    "social": {"inApp": True, "email": True, "push": True},
    "releases": {"inApp": True, "email": True, "push": True},
    "system": {"inApp": True, "email": False, "push": False},
    "clubs": {"inApp": True, "email": True, "push": False},
    "quizzes": {"inApp": True, "email": False, "push": False},
    "messages": {"inApp": True, "email": True, "push": True},
    "events": {"inApp": True, "email": True, "push": True},
}
DEFAULT_GLOBAL = {
    "emailFrequency": "daily",
    "pushEnabled": True,
    "emailEnabled": True,
    "inAppEnabled": True,
    "dndEnabled": False,
    "dndStartTime": "22:00",
    "dndEndTime": "08:00",
    "notificationVolume": 70,
}


class NotificationsRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # ---------------------- helpers ----------------------
    def _to_dto(self, n: Notification) -> Dict[str, Any]:
        return {
            "id": n.external_id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "timestamp": (n.created_at.isoformat() + "Z"),
            "isRead": bool(n.is_read),
            **({"actionUrl": n.action_url} if n.action_url else {}),
            **({"metadata": n.meta} if n.meta is not None else {}),
        }

    async def _user_id_from_ext(self, user_external_id: str) -> Optional[int]:
        q = select(User.id).where(User.external_id == user_external_id)
        return (await self.session.execute(q)).scalar_one_or_none()

    # ---------------------- queries ----------------------
    async def list_notifications(
        self,
        user_external_id: str,
        unread: Optional[bool] = None,
        ntype: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        page: int = 1,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            return []
        conds = [Notification.user_id == user_id]
        if unread is True:
            conds.append(Notification.is_read.is_(False))
        elif unread is False:
            conds.append(Notification.is_read.is_(True))
        if ntype and ntype != "all":
            conds.append(Notification.type == ntype)
        if date_from:
            conds.append(Notification.created_at >= date_from)
        if date_to:
            conds.append(Notification.created_at <= date_to)
        q = (
            select(Notification)
            .where(and_(*conds))
            .order_by(desc(Notification.created_at))
            .limit(limit)
            .offset((page - 1) * limit)
        )
        rows = (await self.session.execute(q)).scalars().all()
        return [self._to_dto(n) for n in rows]

    async def get_detail(self, user_external_id: str, notification_external_id: str) -> Optional[Dict[str, Any]]:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            return None
        q = select(Notification).where(
            (Notification.external_id == notification_external_id) & (Notification.user_id == user_id)
        )
        n = (await self.session.execute(q)).scalars().first()
        return self._to_dto(n) if n else None

    async def mark_as_read(self, user_external_id: str, notification_external_id: str) -> bool:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            return False
        q = (
            update(Notification)
            .where((Notification.external_id == notification_external_id) & (Notification.user_id == user_id))
            .values(is_read=True)
        )
        await self.session.execute(q)
        await self.session.commit()
        return True

    async def mark_as_unread(self, user_external_id: str, notification_external_id: str) -> bool:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            return False
        q = (
            update(Notification)
            .where((Notification.external_id == notification_external_id) & (Notification.user_id == user_id))
            .values(is_read=False)
        )
        await self.session.execute(q)
        await self.session.commit()
        return True

    async def mark_all_read(self, user_external_id: str, only_unread: bool = True) -> int:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            return 0
        conds = [Notification.user_id == user_id]
        if only_unread:
            conds.append(Notification.is_read.is_(False))
        q = update(Notification).where(and_(*conds)).values(is_read=True)
        res = await self.session.execute(q)
        await self.session.commit()
        # rowcount may be None in some dialects; use 0 fallback
        return res.rowcount or 0

    async def delete_notification(self, user_external_id: str, notification_external_id: str) -> bool:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            return False
        q = delete(Notification).where(
            (Notification.external_id == notification_external_id) & (Notification.user_id == user_id)
        )
        await self.session.execute(q)
        await self.session.commit()
        return True

    # ---------------------- preferences ----------------------
    async def get_user_preferences(self, user_external_id: str) -> Dict[str, Any]:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            # default when user does not exist
            return {"channels": DEFAULT_CHANNELS, "global": DEFAULT_GLOBAL}
        q = select(NotificationPreference).where(NotificationPreference.user_id == user_id)
        pref = (await self.session.execute(q)).scalars().first()
        if not pref:
            return {"channels": DEFAULT_CHANNELS, "global": DEFAULT_GLOBAL}
        return {
            "channels": pref.channels or DEFAULT_CHANNELS,
            "global": pref.global_settings or DEFAULT_GLOBAL,
        }

    async def update_user_preferences(self, user_external_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        user_id = await self._user_id_from_ext(user_external_id)
        if not user_id:
            raise ValueError("user_not_found")
        q = select(NotificationPreference).where(NotificationPreference.user_id == user_id)
        pref = (await self.session.execute(q)).scalars().first()
        channels = data.get("channels") or DEFAULT_CHANNELS
        global_settings = data.get("global") or DEFAULT_GLOBAL
        if not pref:
            pref = NotificationPreference(user_id=user_id, channels=channels, global_settings=global_settings)
            self.session.add(pref)
        else:
            pref.channels = channels
            pref.global_settings = global_settings
        await self.session.flush()
        await self.session.commit()
        return {"channels": channels, "global": global_settings}

