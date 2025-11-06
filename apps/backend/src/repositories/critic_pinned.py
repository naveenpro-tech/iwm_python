"""Repository for critic pinned content operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from datetime import datetime
import uuid

from ..models import CriticPinnedContent, CriticProfile
from ..schemas.critic_pinned import CriticPinnedContentCreate, CriticPinnedContentUpdate


class CriticPinnedContentRepository:
    """Repository for managing critic pinned content"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_pinned_content(
        self,
        critic_id: int,
        pinned_data: CriticPinnedContentCreate
    ) -> CriticPinnedContent:
        """Create a new pinned content entry"""
        external_id = f"pin_{uuid.uuid4().hex[:12]}"

        # Get current max display order
        max_order = await self._get_max_display_order(critic_id)
        display_order = max_order + 1 if max_order is not None else 0

        pinned_content = CriticPinnedContent(
            external_id=external_id,
            critic_id=critic_id,
            content_type=pinned_data.content_type,
            content_id=pinned_data.content_id,
            display_order=display_order
        )

        self.db.add(pinned_content)
        await self.db.commit()
        await self.db.refresh(pinned_content)
        return pinned_content

    async def get_pinned_content_by_id(self, pin_id: int) -> Optional[CriticPinnedContent]:
        """Get pinned content by ID"""
        query = (
            select(CriticPinnedContent)
            .options(selectinload(CriticPinnedContent.critic).selectinload(CriticProfile.user))
            .where(CriticPinnedContent.id == pin_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_pinned_content_by_external_id(self, external_id: str) -> Optional[CriticPinnedContent]:
        """Get pinned content by external ID"""
        query = (
            select(CriticPinnedContent)
            .options(selectinload(CriticPinnedContent.critic).selectinload(CriticProfile.user))
            .where(CriticPinnedContent.external_id == external_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_pinned_content_by_critic(
        self,
        critic_id: int
    ) -> List[CriticPinnedContent]:
        """Get all pinned content for a critic, ordered by display_order"""
        query = (
            select(CriticPinnedContent)
            .options(selectinload(CriticPinnedContent.critic).selectinload(CriticProfile.user))
            .where(CriticPinnedContent.critic_id == critic_id)
            .order_by(CriticPinnedContent.display_order.asc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_pinned_content_by_username(
        self,
        username: str
    ) -> List[CriticPinnedContent]:
        """Get all pinned content for a critic by username"""
        query = (
            select(CriticPinnedContent)
            .join(CriticProfile)
            .options(selectinload(CriticPinnedContent.critic).selectinload(CriticProfile.user))
            .where(CriticProfile.username == username)
            .order_by(CriticPinnedContent.display_order.asc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update_pinned_content(
        self,
        pin_id: int,
        pinned_data: CriticPinnedContentUpdate
    ) -> Optional[CriticPinnedContent]:
        """Update pinned content"""
        pinned_content = await self.get_pinned_content_by_id(pin_id)
        if not pinned_content:
            return None

        update_data = pinned_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(pinned_content, key, value)

        pinned_content.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(pinned_content)
        return pinned_content

    async def delete_pinned_content(self, pin_id: int) -> bool:
        """Delete pinned content"""
        pinned_content = await self.get_pinned_content_by_id(pin_id)
        if not pinned_content:
            return False

        critic_id = pinned_content.critic_id
        await self.db.delete(pinned_content)
        await self.db.commit()

        # Reorder remaining items
        await self._reorder_after_delete(critic_id)
        return True

    async def reorder_pinned_content(
        self,
        critic_id: int,
        pin_orders: List[dict]  # [{"pin_id": 1, "display_order": 0}, ...]
    ) -> bool:
        """Reorder pinned content for a critic"""
        for item in pin_orders:
            pin_id = item.get("pin_id")
            display_order = item.get("display_order")

            if pin_id is None or display_order is None:
                continue

            pinned_content = await self.get_pinned_content_by_id(pin_id)
            if pinned_content and pinned_content.critic_id == critic_id:
                pinned_content.display_order = display_order
                pinned_content.updated_at = datetime.utcnow()

        await self.db.commit()
        return True

    async def get_pinned_count(self, critic_id: int) -> int:
        """Get count of pinned content for a critic"""
        query = select(func.count(CriticPinnedContent.id)).where(
            CriticPinnedContent.critic_id == critic_id
        )
        result = await self.db.execute(query)
        return result.scalar_one()

    async def check_duplicate_pin(
        self,
        critic_id: int,
        content_type: str,
        content_id: int
    ) -> Optional[CriticPinnedContent]:
        """Check if content is already pinned"""
        query = (
            select(CriticPinnedContent)
            .where(
                and_(
                    CriticPinnedContent.critic_id == critic_id,
                    CriticPinnedContent.content_type == content_type,
                    CriticPinnedContent.content_id == content_id
                )
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _get_max_display_order(self, critic_id: int) -> Optional[int]:
        """Get maximum display order for a critic"""
        query = select(func.max(CriticPinnedContent.display_order)).where(
            CriticPinnedContent.critic_id == critic_id
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def _reorder_after_delete(self, critic_id: int) -> None:
        """Reorder pinned content after deletion to fill gaps"""
        pinned_items = await self.get_pinned_content_by_critic(critic_id)
        for index, item in enumerate(pinned_items):
            item.display_order = index
            item.updated_at = datetime.utcnow()
        await self.db.commit()

