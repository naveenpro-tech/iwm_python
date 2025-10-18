from __future__ import annotations
from typing import Any, Dict, List, Optional
from sqlalchemy import select, or_, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import (
    User,
    AdminUserMeta,
    ModerationItem,
    ModerationAction,
    SystemSettings,
    AdminMetricSnapshot,
)


class AdminRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_users(
        self,
        *,
        search: Optional[str] = None,
        role: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        q = (
            select(User, AdminUserMeta)
            .outerjoin(AdminUserMeta, AdminUserMeta.user_id == User.id)
        )
        if search:
            s = f"%{search.lower()}%"
            q = q.where(or_(func.lower(User.name).like(s), func.lower(AdminUserMeta.email).like(s)))
        if role:
            # roles is JSONB array
            q = q.where(func.jsonb_contains(AdminUserMeta.roles, func.to_jsonb([role])))  # type: ignore
        if status:
            q = q.where(AdminUserMeta.status == status)
        q = q.offset((page - 1) * limit).limit(limit)
        res = await self.session.execute(q)
        rows = res.all()
        items: List[Dict[str, Any]] = []
        for u, meta in rows:
            items.append(
                {
                    "id": u.external_id,
                    "name": u.name,
                    "email": (meta.email if meta else None) or f"{u.external_id}@example.com",
                    "roles": (meta.roles if meta else ["User"]),
                    "status": (meta.status if meta else "Active"),
                    "joinedDate": (meta.joined_date.isoformat()[:10] if (meta and meta.joined_date) else None) or "2024-01-01",
                    "lastLogin": (meta.last_login.isoformat() if (meta and meta.last_login) else None),
                    "profileType": (meta.profile_type if meta else None),
                    "verificationStatus": (meta.verification_status if meta else None),
                    "accountType": (meta.account_type if meta else None),
                    "phoneNumber": (meta.phone_number if meta else None),
                    "location": (meta.location if meta else None),
                }
            )
        return items

    async def list_moderation_items(
        self,
        *,
        status: Optional[str] = None,
        content_type: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        q = select(ModerationItem).options(selectinload(ModerationItem.actions))
        if status:
            q = q.where(ModerationItem.status == status)
        if content_type:
            q = q.where(ModerationItem.content_type == content_type)
        if search:
            s = f"%{search.lower()}%"
            q = q.where(or_(func.lower(ModerationItem.content_title).like(s), func.lower(ModerationItem.report_reason).like(s)))
        q = q.order_by(ModerationItem.created_at.desc()).offset((page - 1) * limit).limit(limit)
        rows = (await self.session.execute(q)).scalars().all()
        out: List[Dict[str, Any]] = []
        for m in rows:
            out.append(
                {
                    "id": m.external_id,
                    "type": m.content_type,
                    "contentTitle": m.content_title,
                    "reportReason": m.report_reason,
                    "status": m.status,
                    "user": None,
                    "timestamp": m.created_at.isoformat(timespec="seconds"),
                    "reports": m.reporter_count,
                }
            )
        return out

    async def set_moderation_action(self, *, item_external_id: str, action: str, reason: Optional[str] = None) -> Dict[str, Any]:
        item = (
            await self.session.execute(select(ModerationItem).where(ModerationItem.external_id == item_external_id))
        ).scalar_one_or_none()
        if not item:
            return {}
        item.status = "resolved" if action == "approve" else "flagged"
        act = ModerationAction(item_id=item.id, moderator_user_id=None, action=action, reason=reason)
        self.session.add(act)
        await self.session.flush()
        await self.session.commit()
        return {"ok": True}

    async def get_settings(self) -> Dict[str, Any]:
        s = (
            await self.session.execute(select(SystemSettings).where(SystemSettings.external_id == "default"))
        ).scalar_one_or_none()
        if not s:
            s = SystemSettings(external_id="default", data={})
            self.session.add(s)
            await self.session.flush()
            await self.session.commit()
        return s.data

    async def update_settings(self, *, data: Dict[str, Any]) -> Dict[str, Any]:
        s = (
            await self.session.execute(select(SystemSettings).where(SystemSettings.external_id == "default"))
        ).scalar_one_or_none()
        if not s:
            s = SystemSettings(external_id="default", data=data)
            self.session.add(s)
        else:
            s.data = data
        await self.session.flush()
        await self.session.commit()
        return s.data

    async def get_analytics_overview(self) -> Dict[str, Any]:
        # Prefer latest snapshot, fallback to quick computed values
        snap = (
            await self.session.execute(
                select(AdminMetricSnapshot).order_by(AdminMetricSnapshot.snapshot_time.desc()).limit(1)
            )
        ).scalar_one_or_none()
        if snap and snap.metrics:
            return snap.metrics
        # Fallback compute
        users_count = (await self.session.execute(select(func.count(User.id)))).scalar_one() or 0
        reviews_count = (await self.session.execute(select(func.count().select_from(select(1).select_from(User)))))  # dummy
        return {
            "totalUsers": users_count,
            "contentViews": 0,
            "avgRating": 0,
            "systemHealth": 100.0,
            "changes": {"totalUsers": 0.0, "contentViews": 0.0, "avgRating": 0.0, "systemHealth": 0.0},
        }

