"""Repository for critic affiliate link operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from datetime import datetime
import uuid

from ..models import CriticAffiliateLink, CriticProfile
from ..schemas.critic_affiliate import CriticAffiliateLinkCreate, CriticAffiliateLinkUpdate


class CriticAffiliateLinkRepository:
    """Repository for managing critic affiliate links"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_affiliate_link(
        self,
        critic_id: int,
        link_data: CriticAffiliateLinkCreate
    ) -> CriticAffiliateLink:
        """Create a new affiliate link"""
        external_id = f"aff_{uuid.uuid4().hex[:12]}"

        affiliate_link = CriticAffiliateLink(
            external_id=external_id,
            critic_id=critic_id,
            label=link_data.label,
            platform=link_data.platform,
            url=link_data.url,
            utm_source=link_data.utm_source,
            utm_medium=link_data.utm_medium,
            utm_campaign=link_data.utm_campaign,
            is_active=link_data.is_active
        )

        self.db.add(affiliate_link)
        await self.db.commit()
        await self.db.refresh(affiliate_link)
        return affiliate_link

    async def get_affiliate_link_by_id(self, link_id: int) -> Optional[CriticAffiliateLink]:
        """Get affiliate link by ID"""
        query = (
            select(CriticAffiliateLink)
            .options(selectinload(CriticAffiliateLink.critic).selectinload(CriticProfile.user))
            .where(CriticAffiliateLink.id == link_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_affiliate_link_by_external_id(self, external_id: str) -> Optional[CriticAffiliateLink]:
        """Get affiliate link by external ID"""
        query = (
            select(CriticAffiliateLink)
            .options(selectinload(CriticAffiliateLink.critic).selectinload(CriticProfile.user))
            .where(CriticAffiliateLink.external_id == external_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_affiliate_links_by_critic(
        self,
        critic_id: int,
        is_active: Optional[bool] = None,
        platform: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[CriticAffiliateLink]:
        """List affiliate links by critic with optional filters"""
        query = (
            select(CriticAffiliateLink)
            .options(selectinload(CriticAffiliateLink.critic).selectinload(CriticProfile.user))
            .where(CriticAffiliateLink.critic_id == critic_id)
        )

        if is_active is not None:
            query = query.where(CriticAffiliateLink.is_active == is_active)

        if platform:
            query = query.where(CriticAffiliateLink.platform == platform)

        query = (
            query
            .order_by(CriticAffiliateLink.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_affiliate_links_by_username(
        self,
        username: str,
        is_active: Optional[bool] = None,
        platform: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[CriticAffiliateLink]:
        """List affiliate links by critic username"""
        query = (
            select(CriticAffiliateLink)
            .join(CriticProfile)
            .options(selectinload(CriticAffiliateLink.critic).selectinload(CriticProfile.user))
            .where(CriticProfile.username == username)
        )

        if is_active is not None:
            query = query.where(CriticAffiliateLink.is_active == is_active)

        if platform:
            query = query.where(CriticAffiliateLink.platform == platform)

        query = (
            query
            .order_by(CriticAffiliateLink.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update_affiliate_link(
        self,
        link_id: int,
        link_data: CriticAffiliateLinkUpdate
    ) -> Optional[CriticAffiliateLink]:
        """Update affiliate link"""
        affiliate_link = await self.get_affiliate_link_by_id(link_id)
        if not affiliate_link:
            return None

        update_data = link_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(affiliate_link, key, value)

        affiliate_link.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(affiliate_link)
        return affiliate_link

    async def delete_affiliate_link(self, link_id: int) -> bool:
        """Delete affiliate link"""
        affiliate_link = await self.get_affiliate_link_by_id(link_id)
        if not affiliate_link:
            return False

        await self.db.delete(affiliate_link)
        await self.db.commit()
        return True

    async def track_click(self, link_id: int) -> bool:
        """Increment click count for an affiliate link"""
        affiliate_link = await self.get_affiliate_link_by_id(link_id)
        if not affiliate_link:
            return False

        affiliate_link.click_count += 1
        affiliate_link.last_clicked_at = datetime.utcnow()
        await self.db.commit()
        return True

    async def track_conversion(self, link_id: int) -> bool:
        """Increment conversion count for an affiliate link"""
        affiliate_link = await self.get_affiliate_link_by_id(link_id)
        if not affiliate_link:
            return False

        affiliate_link.conversion_count += 1
        await self.db.commit()
        return True

    async def get_total_clicks_by_critic(self, critic_id: int) -> int:
        """Get total clicks across all affiliate links for a critic"""
        query = select(func.sum(CriticAffiliateLink.click_count)).where(
            CriticAffiliateLink.critic_id == critic_id
        )
        result = await self.db.execute(query)
        total = result.scalar_one_or_none()
        return total if total is not None else 0

    async def get_total_conversions_by_critic(self, critic_id: int) -> int:
        """Get total conversions across all affiliate links for a critic"""
        query = select(func.sum(CriticAffiliateLink.conversion_count)).where(
            CriticAffiliateLink.critic_id == critic_id
        )
        result = await self.db.execute(query)
        total = result.scalar_one_or_none()
        return total if total is not None else 0

    async def get_top_performing_links(
        self,
        critic_id: int,
        limit: int = 10
    ) -> List[CriticAffiliateLink]:
        """Get top performing affiliate links by click count"""
        query = (
            select(CriticAffiliateLink)
            .options(selectinload(CriticAffiliateLink.critic).selectinload(CriticProfile.user))
            .where(CriticAffiliateLink.critic_id == critic_id)
            .order_by(CriticAffiliateLink.click_count.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_total_count_by_critic(
        self,
        critic_id: int,
        is_active: Optional[bool] = None
    ) -> int:
        """Get total count of affiliate links by critic"""
        query = select(func.count(CriticAffiliateLink.id)).where(
            CriticAffiliateLink.critic_id == critic_id
        )

        if is_active is not None:
            query = query.where(CriticAffiliateLink.is_active == is_active)

        result = await self.db.execute(query)
        return result.scalar_one()

