"""Critic Hub - Critics Repository"""
from typing import List, Optional
from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

from ..models import CriticProfile, CriticSocialLink, CriticFollower, User


class CriticRepository:
    """Repository for critic profile operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_critic_profile(
        self,
        user_id: int,
        username: str,
        display_name: str,
        bio: str | None = None,
        logo_url: str | None = None,
        banner_url: str | None = None,
        banner_video_url: str | None = None,
        review_philosophy: str | None = None,
        equipment_info: str | None = None,
        background_info: str | None = None,
    ) -> CriticProfile:
        """Create a new critic profile"""
        critic = CriticProfile(
            external_id=str(uuid.uuid4()),
            user_id=user_id,
            username=username,
            display_name=display_name,
            bio=bio,
            logo_url=logo_url,
            banner_url=banner_url,
            banner_video_url=banner_video_url,
            review_philosophy=review_philosophy,
            equipment_info=equipment_info,
            background_info=background_info,
        )
        self.db.add(critic)
        await self.db.commit()
        await self.db.refresh(critic)
        return critic

    async def get_critic_by_id(self, critic_id: int) -> Optional[CriticProfile]:
        """Get critic profile by ID"""
        result = await self.db.execute(
            select(CriticProfile).where(CriticProfile.id == critic_id)
        )
        return result.scalar_one_or_none()

    async def get_critic_by_external_id(self, external_id: str) -> Optional[CriticProfile]:
        """Get critic profile by external ID"""
        result = await self.db.execute(
            select(CriticProfile).where(CriticProfile.external_id == external_id)
        )
        return result.scalar_one_or_none()

    async def get_critic_by_username(self, username: str) -> Optional[CriticProfile]:
        """Get critic profile by username"""
        result = await self.db.execute(
            select(CriticProfile).where(CriticProfile.username == username)
        )
        return result.scalar_one_or_none()

    async def get_critic_by_user_id(self, user_id: int) -> Optional[CriticProfile]:
        """Get critic profile by user ID"""
        result = await self.db.execute(
            select(CriticProfile).where(CriticProfile.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def update_critic_profile(
        self,
        critic_id: int,
        **kwargs
    ) -> Optional[CriticProfile]:
        """Update critic profile"""
        kwargs['updated_at'] = datetime.utcnow()
        await self.db.execute(
            update(CriticProfile)
            .where(CriticProfile.id == critic_id)
            .values(**kwargs)
        )
        await self.db.commit()
        return await self.get_critic_by_id(critic_id)

    async def list_critics(
        self,
        is_verified: bool | None = None,
        limit: int = 20,
        offset: int = 0,
        sort_by: str = "follower_count"
    ) -> List[CriticProfile]:
        """List critics with filters"""
        query = select(CriticProfile)
        
        if is_verified is not None:
            query = query.where(CriticProfile.is_verified == is_verified)
        
        # Sort
        if sort_by == "follower_count":
            query = query.order_by(CriticProfile.follower_count.desc())
        elif sort_by == "total_reviews":
            query = query.order_by(CriticProfile.total_reviews.desc())
        elif sort_by == "avg_engagement":
            query = query.order_by(CriticProfile.avg_engagement.desc())
        elif sort_by == "created_at":
            query = query.order_by(CriticProfile.created_at.desc())
        
        query = query.limit(limit).offset(offset)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def search_critics(self, search_term: str, limit: int = 20) -> List[CriticProfile]:
        """Search critics by username or display name"""
        query = select(CriticProfile).where(
            (CriticProfile.username.ilike(f"%{search_term}%")) |
            (CriticProfile.display_name.ilike(f"%{search_term}%"))
        ).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def add_social_link(
        self,
        critic_id: int,
        platform: str,
        url: str,
        display_order: int = 0,
        is_primary: bool = False
    ) -> CriticSocialLink:
        """Add social link to critic profile"""
        link = CriticSocialLink(
            critic_id=critic_id,
            platform=platform,
            url=url,
            display_order=display_order,
            is_primary=is_primary
        )
        self.db.add(link)
        await self.db.commit()
        await self.db.refresh(link)
        return link

    async def get_social_links(self, critic_id: int) -> List[CriticSocialLink]:
        """Get all social links for a critic"""
        result = await self.db.execute(
            select(CriticSocialLink)
            .where(CriticSocialLink.critic_id == critic_id)
            .order_by(CriticSocialLink.display_order)
        )
        return list(result.scalars().all())

    async def delete_social_link(self, link_id: int) -> bool:
        """Delete a social link"""
        result = await self.db.execute(
            delete(CriticSocialLink).where(CriticSocialLink.id == link_id)
        )
        await self.db.commit()
        return result.rowcount > 0

    async def follow_critic(self, critic_id: int, user_id: int) -> CriticFollower:
        """Follow a critic"""
        follower = CriticFollower(
            critic_id=critic_id,
            user_id=user_id
        )
        self.db.add(follower)
        
        # Increment follower count
        await self.db.execute(
            update(CriticProfile)
            .where(CriticProfile.id == critic_id)
            .values(follower_count=CriticProfile.follower_count + 1)
        )
        
        await self.db.commit()
        await self.db.refresh(follower)
        return follower

    async def unfollow_critic(self, critic_id: int, user_id: int) -> bool:
        """Unfollow a critic"""
        result = await self.db.execute(
            delete(CriticFollower).where(
                (CriticFollower.critic_id == critic_id) &
                (CriticFollower.user_id == user_id)
            )
        )
        
        if result.rowcount > 0:
            # Decrement follower count
            await self.db.execute(
                update(CriticProfile)
                .where(CriticProfile.id == critic_id)
                .values(follower_count=CriticProfile.follower_count - 1)
            )
            await self.db.commit()
            return True
        
        return False

    async def is_following(self, critic_id: int, user_id: int) -> bool:
        """Check if user is following critic"""
        result = await self.db.execute(
            select(CriticFollower).where(
                (CriticFollower.critic_id == critic_id) &
                (CriticFollower.user_id == user_id)
            )
        )
        return result.scalar_one_or_none() is not None

    async def get_followers(self, critic_id: int, limit: int = 50, offset: int = 0) -> List[User]:
        """Get followers of a critic"""
        result = await self.db.execute(
            select(User)
            .join(CriticFollower, CriticFollower.user_id == User.id)
            .where(CriticFollower.critic_id == critic_id)
            .order_by(CriticFollower.followed_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def get_follower_count(self, critic_id: int) -> int:
        """Get follower count for a critic"""
        result = await self.db.execute(
            select(func.count(CriticFollower.id)).where(CriticFollower.critic_id == critic_id)
        )
        return result.scalar() or 0

    async def suspend_critic(self, critic_id: int, reason: str | None = None) -> Optional[CriticProfile]:
        """Suspend a critic (admin only)"""
        await self.db.execute(
            update(CriticProfile)
            .where(CriticProfile.id == critic_id)
            .values(
                is_active=False,
                suspended_at=datetime.utcnow(),
                suspension_reason=reason,
                updated_at=datetime.utcnow()
            )
        )
        await self.db.commit()
        return await self.get_critic_by_id(critic_id)

    async def activate_critic(self, critic_id: int) -> Optional[CriticProfile]:
        """Activate a suspended critic (admin only)"""
        await self.db.execute(
            update(CriticProfile)
            .where(CriticProfile.id == critic_id)
            .values(
                is_active=True,
                suspended_at=None,
                suspension_reason=None,
                updated_at=datetime.utcnow()
            )
        )
        await self.db.commit()
        return await self.get_critic_by_id(critic_id)

