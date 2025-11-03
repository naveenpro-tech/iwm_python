"""
Award Ceremonies Repository

This repository handles CRUD operations for award ceremonies (e.g., Oscars, Filmfare, National Film Awards).
Supports filtering by country, language, category type, and prestige level for Indian and international awards.

Author: IWM Development Team
Date: 2025-11-03
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import AwardCeremony


class AwardCeremoniesRepository:
    """Repository for managing award ceremonies with support for Indian and international awards."""
    
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list(
        self,
        *,
        country: Optional[str] = None,
        language: Optional[str] = None,
        category_type: Optional[str] = None,
        prestige_level: Optional[str] = None,
        is_active: Optional[bool] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """
        List award ceremonies with optional filtering.
        
        Args:
            country: Filter by country (e.g., "India", "USA", "International")
            language: Filter by language (e.g., "Hindi", "Tamil", "English")
            category_type: Filter by category type (e.g., "Film", "Television", "Music", "OTT")
            prestige_level: Filter by prestige level (e.g., "national", "state", "industry", "international")
            is_active: Filter by active status
            limit: Maximum number of results to return
            offset: Number of results to skip (for pagination)
            
        Returns:
            List of award ceremony dictionaries
        """
        if not self.session:
            return []

        # Build query with filters
        query = select(AwardCeremony)
        
        if country:
            query = query.where(AwardCeremony.country == country)
        if language:
            query = query.where(AwardCeremony.language == language)
        if category_type:
            query = query.where(AwardCeremony.category_type == category_type)
        if prestige_level:
            query = query.where(AwardCeremony.prestige_level == prestige_level)
        if is_active is not None:
            query = query.where(AwardCeremony.is_active == is_active)
        
        # Order by display_order, then by name
        query = query.order_by(AwardCeremony.display_order, AwardCeremony.name)
        
        # Apply pagination
        query = query.limit(limit).offset(offset)
        
        result = await self.session.execute(query)
        ceremonies = result.scalars().all()
        
        return [
            {
                "id": c.id,
                "external_id": c.external_id,
                "name": c.name,
                "short_name": c.short_name,
                "description": c.description,
                "logo_url": c.logo_url,
                "background_image_url": c.background_image_url,
                "current_year": c.current_year,
                "next_ceremony_date": c.next_ceremony_date.isoformat() if c.next_ceremony_date else None,
                "country": c.country,
                "language": c.language,
                "category_type": c.category_type,
                "prestige_level": c.prestige_level,
                "established_year": c.established_year,
                "is_active": c.is_active,
                "display_order": c.display_order,
            }
            for c in ceremonies
        ]

    async def count(
        self,
        *,
        country: Optional[str] = None,
        language: Optional[str] = None,
        category_type: Optional[str] = None,
        prestige_level: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> int:
        """
        Count award ceremonies matching the given filters.
        
        Args:
            Same as list() method
            
        Returns:
            Total count of matching ceremonies
        """
        if not self.session:
            return 0

        query = select(func.count(AwardCeremony.id))
        
        if country:
            query = query.where(AwardCeremony.country == country)
        if language:
            query = query.where(AwardCeremony.language == language)
        if category_type:
            query = query.where(AwardCeremony.category_type == category_type)
        if prestige_level:
            query = query.where(AwardCeremony.prestige_level == prestige_level)
        if is_active is not None:
            query = query.where(AwardCeremony.is_active == is_active)
        
        result = await self.session.execute(query)
        return result.scalar_one()

    async def get_by_external_id(self, external_id: str) -> Dict[str, Any] | None:
        """
        Get a single award ceremony by its external_id.
        
        Args:
            external_id: The unique external identifier (e.g., "filmfare-awards-hindi")
            
        Returns:
            Award ceremony dictionary or None if not found
        """
        if not self.session:
            return None

        query = select(AwardCeremony).where(AwardCeremony.external_id == external_id)
        result = await self.session.execute(query)
        ceremony = result.scalar_one_or_none()
        
        if not ceremony:
            return None
        
        return {
            "id": ceremony.id,
            "external_id": ceremony.external_id,
            "name": ceremony.name,
            "short_name": ceremony.short_name,
            "description": ceremony.description,
            "logo_url": ceremony.logo_url,
            "background_image_url": ceremony.background_image_url,
            "current_year": ceremony.current_year,
            "next_ceremony_date": ceremony.next_ceremony_date.isoformat() if ceremony.next_ceremony_date else None,
            "country": ceremony.country,
            "language": ceremony.language,
            "category_type": ceremony.category_type,
            "prestige_level": ceremony.prestige_level,
            "established_year": ceremony.established_year,
            "is_active": ceremony.is_active,
            "display_order": ceremony.display_order,
        }

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new award ceremony.
        
        Args:
            data: Dictionary containing ceremony data
            
        Returns:
            Created ceremony dictionary
        """
        if not self.session:
            raise ValueError("Database session is required")

        ceremony = AwardCeremony(**data)
        self.session.add(ceremony)
        await self.session.commit()
        await self.session.refresh(ceremony)
        
        return {
            "id": ceremony.id,
            "external_id": ceremony.external_id,
            "name": ceremony.name,
            "short_name": ceremony.short_name,
            "description": ceremony.description,
            "logo_url": ceremony.logo_url,
            "background_image_url": ceremony.background_image_url,
            "current_year": ceremony.current_year,
            "next_ceremony_date": ceremony.next_ceremony_date.isoformat() if ceremony.next_ceremony_date else None,
            "country": ceremony.country,
            "language": ceremony.language,
            "category_type": ceremony.category_type,
            "prestige_level": ceremony.prestige_level,
            "established_year": ceremony.established_year,
            "is_active": ceremony.is_active,
            "display_order": ceremony.display_order,
        }

    async def update(self, external_id: str, data: Dict[str, Any]) -> Dict[str, Any] | None:
        """
        Update an existing award ceremony.
        
        Args:
            external_id: The unique external identifier
            data: Dictionary containing updated ceremony data
            
        Returns:
            Updated ceremony dictionary or None if not found
        """
        if not self.session:
            return None

        query = select(AwardCeremony).where(AwardCeremony.external_id == external_id)
        result = await self.session.execute(query)
        ceremony = result.scalar_one_or_none()
        
        if not ceremony:
            return None
        
        # Update fields
        for key, value in data.items():
            if hasattr(ceremony, key):
                setattr(ceremony, key, value)
        
        await self.session.commit()
        await self.session.refresh(ceremony)
        
        return {
            "id": ceremony.id,
            "external_id": ceremony.external_id,
            "name": ceremony.name,
            "short_name": ceremony.short_name,
            "description": ceremony.description,
            "logo_url": ceremony.logo_url,
            "background_image_url": ceremony.background_image_url,
            "current_year": ceremony.current_year,
            "next_ceremony_date": ceremony.next_ceremony_date.isoformat() if ceremony.next_ceremony_date else None,
            "country": ceremony.country,
            "language": ceremony.language,
            "category_type": ceremony.category_type,
            "prestige_level": ceremony.prestige_level,
            "established_year": ceremony.established_year,
            "is_active": ceremony.is_active,
            "display_order": ceremony.display_order,
        }

    async def delete(self, external_id: str) -> bool:
        """
        Delete an award ceremony.
        
        Args:
            external_id: The unique external identifier
            
        Returns:
            True if deleted, False if not found
        """
        if not self.session:
            return False

        query = select(AwardCeremony).where(AwardCeremony.external_id == external_id)
        result = await self.session.execute(query)
        ceremony = result.scalar_one_or_none()
        
        if not ceremony:
            return False
        
        await self.session.delete(ceremony)
        await self.session.commit()
        
        return True

    async def get_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about award ceremonies.
        
        Returns:
            Dictionary containing statistics grouped by country, language, category_type, and prestige_level
        """
        if not self.session:
            return {
                "total_ceremonies": 0,
                "by_country": {},
                "by_language": {},
                "by_category_type": {},
                "by_prestige_level": {},
            }

        # Total count
        total_query = select(func.count(AwardCeremony.id))
        total_result = await self.session.execute(total_query)
        total = total_result.scalar_one()

        # Group by country
        country_query = select(
            AwardCeremony.country,
            func.count(AwardCeremony.id)
        ).group_by(AwardCeremony.country)
        country_result = await self.session.execute(country_query)
        by_country = {row[0] or "Unknown": row[1] for row in country_result.all()}

        # Group by language
        language_query = select(
            AwardCeremony.language,
            func.count(AwardCeremony.id)
        ).group_by(AwardCeremony.language)
        language_result = await self.session.execute(language_query)
        by_language = {row[0] or "Unknown": row[1] for row in language_result.all()}

        # Group by category_type
        category_query = select(
            AwardCeremony.category_type,
            func.count(AwardCeremony.id)
        ).group_by(AwardCeremony.category_type)
        category_result = await self.session.execute(category_query)
        by_category_type = {row[0] or "Unknown": row[1] for row in category_result.all()}

        # Group by prestige_level
        prestige_query = select(
            AwardCeremony.prestige_level,
            func.count(AwardCeremony.id)
        ).group_by(AwardCeremony.prestige_level)
        prestige_result = await self.session.execute(prestige_query)
        by_prestige_level = {row[0] or "Unknown": row[1] for row in prestige_result.all()}

        return {
            "total_ceremonies": total,
            "by_country": by_country,
            "by_language": by_language,
            "by_category_type": by_category_type,
            "by_prestige_level": by_prestige_level,
        }

