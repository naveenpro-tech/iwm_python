"""Repository for critic recommendation operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from datetime import datetime
import uuid

from ..models import CriticRecommendation, CriticProfile, Movie
from ..schemas.critic_recommendations import CriticRecommendationCreate


class CriticRecommendationRepository:
    """Repository for managing critic recommendations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_recommendation(
        self,
        critic_id: int,
        recommendation_data: CriticRecommendationCreate
    ) -> CriticRecommendation:
        """Create a new recommendation"""
        external_id = f"rec_{uuid.uuid4().hex[:12]}"

        recommendation = CriticRecommendation(
            external_id=external_id,
            critic_id=critic_id,
            movie_id=recommendation_data.movie_id,
            recommendation_type=recommendation_data.recommendation_type,
            reason=recommendation_data.reason
        )

        self.db.add(recommendation)
        await self.db.commit()
        await self.db.refresh(recommendation)
        return recommendation

    async def get_recommendation_by_id(self, recommendation_id: int) -> Optional[CriticRecommendation]:
        """Get recommendation by ID"""
        query = (
            select(CriticRecommendation)
            .options(
                selectinload(CriticRecommendation.critic).selectinload(CriticProfile.user),
                selectinload(CriticRecommendation.movie)
            )
            .where(CriticRecommendation.id == recommendation_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_recommendation_by_external_id(self, external_id: str) -> Optional[CriticRecommendation]:
        """Get recommendation by external ID"""
        query = (
            select(CriticRecommendation)
            .options(
                selectinload(CriticRecommendation.critic).selectinload(CriticProfile.user),
                selectinload(CriticRecommendation.movie)
            )
            .where(CriticRecommendation.external_id == external_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list_recommendations_by_critic(
        self,
        critic_id: int,
        recommendation_type: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[CriticRecommendation]:
        """List recommendations by critic with optional type filter"""
        query = (
            select(CriticRecommendation)
            .options(
                selectinload(CriticRecommendation.critic).selectinload(CriticProfile.user),
                selectinload(CriticRecommendation.movie)
            )
            .where(CriticRecommendation.critic_id == critic_id)
        )

        if recommendation_type:
            query = query.where(CriticRecommendation.recommendation_type == recommendation_type)

        query = (
            query
            .order_by(CriticRecommendation.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_recommendations_by_username(
        self,
        username: str,
        recommendation_type: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[CriticRecommendation]:
        """List recommendations by critic username"""
        query = (
            select(CriticRecommendation)
            .join(CriticProfile)
            .options(
                selectinload(CriticRecommendation.critic).selectinload(CriticProfile.user),
                selectinload(CriticRecommendation.movie)
            )
            .where(CriticProfile.username == username)
        )

        if recommendation_type:
            query = query.where(CriticRecommendation.recommendation_type == recommendation_type)

        query = (
            query
            .order_by(CriticRecommendation.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_recommendations_by_type(
        self,
        recommendation_type: str,
        limit: int = 20,
        offset: int = 0
    ) -> List[CriticRecommendation]:
        """List all recommendations by type across all critics"""
        query = (
            select(CriticRecommendation)
            .options(
                selectinload(CriticRecommendation.critic).selectinload(CriticProfile.user),
                selectinload(CriticRecommendation.movie)
            )
            .where(CriticRecommendation.recommendation_type == recommendation_type)
            .order_by(CriticRecommendation.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def delete_recommendation(self, recommendation_id: int) -> bool:
        """Delete recommendation"""
        recommendation = await self.get_recommendation_by_id(recommendation_id)
        if not recommendation:
            return False

        await self.db.delete(recommendation)
        await self.db.commit()
        return True

    async def check_duplicate_recommendation(
        self,
        critic_id: int,
        movie_id: int
    ) -> Optional[CriticRecommendation]:
        """Check if critic already recommended this movie"""
        query = (
            select(CriticRecommendation)
            .where(
                and_(
                    CriticRecommendation.critic_id == critic_id,
                    CriticRecommendation.movie_id == movie_id
                )
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_total_count_by_critic(
        self,
        critic_id: int,
        recommendation_type: Optional[str] = None
    ) -> int:
        """Get total count of recommendations by critic"""
        query = select(func.count(CriticRecommendation.id)).where(
            CriticRecommendation.critic_id == critic_id
        )

        if recommendation_type:
            query = query.where(CriticRecommendation.recommendation_type == recommendation_type)

        result = await self.db.execute(query)
        return result.scalar_one()

