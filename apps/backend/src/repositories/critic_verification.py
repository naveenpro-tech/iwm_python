"""Critic Hub - Verification Repository"""
from typing import List, Optional
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

from ..models import CriticVerificationApplication, User


class CriticVerificationRepository:
    """Repository for critic verification operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_application(
        self,
        user_id: int,
        requested_username: str,
        requested_display_name: str,
        bio: str,
        platform_links: list,
        sample_review_urls: list,
        metrics: dict | None = None,
        other_platforms: dict | None = None,
    ) -> CriticVerificationApplication:
        """Create a new verification application"""
        application = CriticVerificationApplication(
            external_id=str(uuid.uuid4()),
            user_id=user_id,
            requested_username=requested_username,
            requested_display_name=requested_display_name,
            bio=bio,
            platform_links=platform_links,
            sample_review_urls=sample_review_urls,
            metrics=metrics,
            other_platforms=other_platforms,
            status="pending"
        )
        self.db.add(application)
        await self.db.commit()
        await self.db.refresh(application)
        return application

    async def get_application_by_id(self, application_id: int) -> Optional[CriticVerificationApplication]:
        """Get application by ID"""
        result = await self.db.execute(
            select(CriticVerificationApplication).where(
                CriticVerificationApplication.id == application_id
            )
        )
        return result.scalar_one_or_none()

    async def get_application_by_external_id(self, external_id: str) -> Optional[CriticVerificationApplication]:
        """Get application by external ID"""
        result = await self.db.execute(
            select(CriticVerificationApplication).where(
                CriticVerificationApplication.external_id == external_id
            )
        )
        return result.scalar_one_or_none()

    async def get_application_by_user_id(self, user_id: int) -> Optional[CriticVerificationApplication]:
        """Get most recent application by user ID"""
        result = await self.db.execute(
            select(CriticVerificationApplication)
            .where(CriticVerificationApplication.user_id == user_id)
            .order_by(CriticVerificationApplication.submitted_at.desc())
        )
        return result.scalar_one_or_none()

    async def list_applications(
        self,
        status: str | None = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[CriticVerificationApplication]:
        """List verification applications with filters"""
        query = select(CriticVerificationApplication)
        
        if status:
            query = query.where(CriticVerificationApplication.status == status)
        
        query = query.order_by(CriticVerificationApplication.submitted_at.desc()).limit(limit).offset(offset)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update_application_status(
        self,
        application_id: int,
        status: str,
        reviewed_by: int,
        admin_notes: str | None = None,
        rejection_reason: str | None = None
    ) -> Optional[CriticVerificationApplication]:
        """Update application status"""
        await self.db.execute(
            update(CriticVerificationApplication)
            .where(CriticVerificationApplication.id == application_id)
            .values(
                status=status,
                reviewed_by=reviewed_by,
                reviewed_at=datetime.utcnow(),
                admin_notes=admin_notes,
                rejection_reason=rejection_reason
            )
        )
        await self.db.commit()
        return await self.get_application_by_id(application_id)

    async def delete_application(self, application_id: int) -> bool:
        """Delete an application"""
        result = await self.db.execute(
            delete(CriticVerificationApplication).where(
                CriticVerificationApplication.id == application_id
            )
        )
        await self.db.commit()
        return result.rowcount > 0

