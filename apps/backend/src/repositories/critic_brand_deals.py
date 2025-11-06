"""Repository for critic brand deal and sponsor disclosure operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from datetime import datetime
import uuid

from ..models import CriticBrandDeal, CriticSponsorDisclosure, CriticProfile
from ..schemas.critic_brand_deals import (
    CriticBrandDealCreate,
    CriticBrandDealUpdate,
    CriticSponsorDisclosureCreate
)


class CriticBrandDealRepository:
    """Repository for managing critic brand deals and sponsor disclosures"""

    def __init__(self, db: AsyncSession):
        self.db = db

    # ==================== Brand Deal Operations ====================

    async def create_brand_deal(
        self,
        critic_id: int,
        deal_data: CriticBrandDealCreate
    ) -> CriticBrandDeal:
        """Create a new brand deal"""
        external_id = f"deal_{uuid.uuid4().hex[:12]}"

        brand_deal = CriticBrandDeal(
            external_id=external_id,
            critic_id=critic_id,
            brand_name=deal_data.brand_name,
            campaign_title=deal_data.campaign_title,
            brief=deal_data.brief,
            rate_card=deal_data.rate_card,
            status=deal_data.status,
            deliverables=deal_data.deliverables,
            requires_disclosure=deal_data.requires_disclosure,
            start_date=deal_data.start_date,
            end_date=deal_data.end_date
        )

        self.db.add(brand_deal)
        await self.db.commit()
        await self.db.refresh(brand_deal)
        return brand_deal

    async def get_brand_deal_by_id(self, deal_id: int) -> Optional[CriticBrandDeal]:
        """Get brand deal by ID"""
        query = (
            select(CriticBrandDeal)
            .options(selectinload(CriticBrandDeal.critic).selectinload(CriticProfile.user))
            .where(CriticBrandDeal.id == deal_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_brand_deal_by_external_id(self, external_id: str) -> Optional[CriticBrandDeal]:
        """Get brand deal by external ID"""
        query = (
            select(CriticBrandDeal)
            .options(selectinload(CriticBrandDeal.critic).selectinload(CriticProfile.user))
            .where(CriticBrandDeal.external_id == external_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_brand_deals_by_critic(
        self,
        critic_id: int,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[CriticBrandDeal]:
        """List brand deals by critic with optional status filter"""
        query = (
            select(CriticBrandDeal)
            .options(selectinload(CriticBrandDeal.critic).selectinload(CriticProfile.user))
            .where(CriticBrandDeal.critic_id == critic_id)
        )

        if status:
            query = query.where(CriticBrandDeal.status == status)

        query = (
            query
            .order_by(CriticBrandDeal.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_brand_deals_by_username(
        self,
        username: str,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[CriticBrandDeal]:
        """List brand deals by critic username"""
        query = (
            select(CriticBrandDeal)
            .join(CriticProfile)
            .options(selectinload(CriticBrandDeal.critic).selectinload(CriticProfile.user))
            .where(CriticProfile.username == username)
        )

        if status:
            query = query.where(CriticBrandDeal.status == status)

        query = (
            query
            .order_by(CriticBrandDeal.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update_brand_deal(
        self,
        deal_id: int,
        deal_data: CriticBrandDealUpdate
    ) -> Optional[CriticBrandDeal]:
        """Update brand deal"""
        brand_deal = await self.get_brand_deal_by_id(deal_id)
        if not brand_deal:
            return None

        update_data = deal_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(brand_deal, key, value)

        brand_deal.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(brand_deal)
        return brand_deal

    async def update_brand_deal_status(
        self,
        deal_id: int,
        status: str
    ) -> Optional[CriticBrandDeal]:
        """Update brand deal status"""
        brand_deal = await self.get_brand_deal_by_id(deal_id)
        if not brand_deal:
            return None

        brand_deal.status = status
        brand_deal.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(brand_deal)
        return brand_deal

    async def get_active_brand_deals(
        self,
        critic_id: int
    ) -> List[CriticBrandDeal]:
        """Get active brand deals for a critic"""
        query = (
            select(CriticBrandDeal)
            .options(selectinload(CriticBrandDeal.critic).selectinload(CriticProfile.user))
            .where(
                and_(
                    CriticBrandDeal.critic_id == critic_id,
                    CriticBrandDeal.status == "accepted"
                )
            )
            .order_by(CriticBrandDeal.start_date.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_total_count_by_critic(
        self,
        critic_id: int,
        status: Optional[str] = None
    ) -> int:
        """Get total count of brand deals by critic"""
        query = select(func.count(CriticBrandDeal.id)).where(
            CriticBrandDeal.critic_id == critic_id
        )

        if status:
            query = query.where(CriticBrandDeal.status == status)

        result = await self.db.execute(query)
        return result.scalar_one()

    # ==================== Sponsor Disclosure Operations ====================

    async def create_sponsor_disclosure(
        self,
        disclosure_data: CriticSponsorDisclosureCreate
    ) -> CriticSponsorDisclosure:
        """Create a new sponsor disclosure"""
        external_id = f"disc_{uuid.uuid4().hex[:12]}"

        disclosure = CriticSponsorDisclosure(
            external_id=external_id,
            review_id=disclosure_data.review_id,
            blog_post_id=disclosure_data.blog_post_id,
            brand_deal_id=disclosure_data.brand_deal_id,
            disclosure_text=disclosure_data.disclosure_text,
            disclosure_type=disclosure_data.disclosure_type
        )

        self.db.add(disclosure)
        await self.db.commit()
        await self.db.refresh(disclosure)
        return disclosure

    async def get_disclosure_by_id(self, disclosure_id: int) -> Optional[CriticSponsorDisclosure]:
        """Get sponsor disclosure by ID"""
        query = (
            select(CriticSponsorDisclosure)
            .options(selectinload(CriticSponsorDisclosure.brand_deal))
            .where(CriticSponsorDisclosure.id == disclosure_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_disclosure_by_external_id(self, external_id: str) -> Optional[CriticSponsorDisclosure]:
        """Get sponsor disclosure by external ID"""
        query = (
            select(CriticSponsorDisclosure)
            .options(selectinload(CriticSponsorDisclosure.brand_deal))
            .where(CriticSponsorDisclosure.external_id == external_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_disclosure_by_review(self, review_id: int) -> Optional[CriticSponsorDisclosure]:
        """Get sponsor disclosure for a review"""
        query = (
            select(CriticSponsorDisclosure)
            .options(selectinload(CriticSponsorDisclosure.brand_deal))
            .where(CriticSponsorDisclosure.review_id == review_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_disclosure_by_blog_post(self, blog_post_id: int) -> Optional[CriticSponsorDisclosure]:
        """Get sponsor disclosure for a blog post"""
        query = (
            select(CriticSponsorDisclosure)
            .options(selectinload(CriticSponsorDisclosure.brand_deal))
            .where(CriticSponsorDisclosure.blog_post_id == blog_post_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def delete_disclosure(self, disclosure_id: int) -> bool:
        """Delete sponsor disclosure"""
        disclosure = await self.get_disclosure_by_id(disclosure_id)
        if not disclosure:
            return False

        await self.db.delete(disclosure)
        await self.db.commit()
        return True

