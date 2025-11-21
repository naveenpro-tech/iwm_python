"""
Award Ceremonies Router

This router provides endpoints for managing award ceremonies (e.g., Oscars, Filmfare, National Film Awards).
Supports listing, filtering, creating, updating, and deleting award ceremonies with Indian and international awards.

Public Endpoints:
- GET /api/v1/award-ceremonies - List all award ceremonies with filtering
- GET /api/v1/award-ceremonies/{external_id} - Get single award ceremony
- GET /api/v1/award-ceremonies/stats - Get statistics

Admin Endpoints (require admin role):
- POST /api/v1/admin/award-ceremonies - Create new award ceremony
- PUT /api/v1/admin/award-ceremonies/{external_id} - Update award ceremony
- DELETE /api/v1/admin/award-ceremonies/{external_id} - Delete award ceremony

Author: IWM Development Team
Date: 2025-11-03
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..repositories.award_ceremonies import AwardCeremoniesRepository
from ..dependencies.admin import require_admin
from ..models import User


# Pydantic Models for Request/Response

class AwardCeremonyBase(BaseModel):
    """Base model for award ceremony data."""
    external_id: str = Field(..., description="Unique identifier (e.g., 'filmfare-awards-hindi')")
    name: str = Field(..., description="Full name of the award")
    short_name: Optional[str] = Field(None, description="Short name or abbreviation")
    description: Optional[str] = Field(None, description="Description of the award")
    logo_url: Optional[str] = Field(None, description="URL to the award logo")
    background_image_url: Optional[str] = Field(None, description="URL to background image")
    current_year: Optional[int] = Field(None, description="Current year of the award")
    next_ceremony_date: Optional[datetime] = Field(None, description="Date of next ceremony")
    country: Optional[str] = Field(None, description="Country (e.g., 'India', 'USA', 'International')")
    language: Optional[str] = Field(None, description="Language (e.g., 'Hindi', 'Tamil', 'English')")
    category_type: Optional[str] = Field(None, description="Category type (e.g., 'Film', 'Television', 'Music', 'OTT')")
    prestige_level: Optional[str] = Field(None, description="Prestige level (e.g., 'national', 'state', 'industry', 'international')")
    established_year: Optional[int] = Field(None, description="Year the award was established")
    is_active: Optional[bool] = Field(True, description="Whether the award is currently active")
    display_order: Optional[int] = Field(None, description="Display order for sorting")


class AwardCeremonyCreate(AwardCeremonyBase):
    """Model for creating a new award ceremony."""
    pass


class AwardCeremonyUpdate(BaseModel):
    """Model for updating an award ceremony (all fields optional)."""
    name: Optional[str] = None
    short_name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    background_image_url: Optional[str] = None
    current_year: Optional[int] = None
    next_ceremony_date: Optional[datetime] = None
    country: Optional[str] = None
    language: Optional[str] = None
    category_type: Optional[str] = None
    prestige_level: Optional[str] = None
    established_year: Optional[int] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class AwardCeremonyResponse(BaseModel):
    """Model for award ceremony response."""
    id: int
    external_id: str
    name: str
    short_name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    background_image_url: Optional[str] = None
    current_year: Optional[int] = None
    next_ceremony_date: Optional[str] = None
    country: Optional[str] = None
    language: Optional[str] = None
    category_type: Optional[str] = None
    prestige_level: Optional[str] = None
    established_year: Optional[int] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

    class Config:
        from_attributes = True


class AwardCeremoniesListResponse(BaseModel):
    """Model for paginated list of award ceremonies."""
    ceremonies: List[AwardCeremonyResponse]
    total: int
    limit: int
    offset: int


class AwardCeremoniesStatsResponse(BaseModel):
    """Model for award ceremonies statistics."""
    total_ceremonies: int
    by_country: Dict[str, int]
    by_language: Dict[str, int]
    by_category_type: Dict[str, int]
    by_prestige_level: Dict[str, int]


class SuccessResponse(BaseModel):
    """Generic success response."""
    success: bool
    message: str


# Router

router = APIRouter(prefix="/award-ceremonies", tags=["award-ceremonies"])


# Public Endpoints

@router.get("", response_model=AwardCeremoniesListResponse)
async def list_award_ceremonies(
    country: Optional[str] = Query(None, description="Filter by country (e.g., 'India', 'USA')"),
    language: Optional[str] = Query(None, description="Filter by language (e.g., 'Hindi', 'Tamil')"),
    category_type: Optional[str] = Query(None, description="Filter by category type (e.g., 'Film', 'Television')"),
    prestige_level: Optional[str] = Query(None, description="Filter by prestige level (e.g., 'national', 'industry')"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of results"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List all award ceremonies with optional filtering.
    
    Supports filtering by:
    - Country (India, USA, UK, International)
    - Language (Hindi, Tamil, Telugu, Malayalam, English, etc.)
    - Category Type (Film, Television, Music, OTT)
    - Prestige Level (national, state, industry, international)
    - Active Status (true/false)
    
    Results are paginated using limit and offset parameters.
    """
    repo = AwardCeremoniesRepository(session)
    
    ceremonies = await repo.list(
        country=country,
        language=language,
        category_type=category_type,
        prestige_level=prestige_level,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )
    
    total = await repo.count(
        country=country,
        language=language,
        category_type=category_type,
        prestige_level=prestige_level,
        is_active=is_active,
    )
    
    return {
        "ceremonies": ceremonies,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/stats", response_model=AwardCeremoniesStatsResponse)
async def get_award_ceremonies_stats(
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    Get statistics about award ceremonies.
    
    Returns counts grouped by:
    - Country
    - Language
    - Category Type
    - Prestige Level
    """
    repo = AwardCeremoniesRepository(session)
    stats = await repo.get_statistics()
    return stats


@router.get("/{external_id}", response_model=AwardCeremonyResponse)
async def get_award_ceremony(
    external_id: str,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    Get a single award ceremony by its external_id.
    
    Args:
        external_id: Unique identifier (e.g., 'filmfare-awards-hindi', 'national-film-awards')
    
    Returns:
        Award ceremony details
    
    Raises:
        404: Award ceremony not found
    """
    repo = AwardCeremoniesRepository(session)
    ceremony = await repo.get_by_external_id(external_id)
    
    if not ceremony:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Award ceremony with external_id '{external_id}' not found"
        )
    
    return ceremony


# Admin Endpoints (require admin role)
# Note: These are registered under the main router, so they become /api/v1/award-ceremonies/admin/*

admin_router = APIRouter(prefix="/admin", tags=["award-ceremonies-admin"])


@admin_router.post("", response_model=AwardCeremonyResponse, status_code=status.HTTP_201_CREATED)
async def create_award_ceremony(
    ceremony_data: AwardCeremonyCreate,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> Any:
    """
    Create a new award ceremony.
    
    **Requires admin role.**
    
    Args:
        ceremony_data: Award ceremony data
    
    Returns:
        Created award ceremony
    
    Raises:
        403: User is not an admin
        400: Invalid data or external_id already exists
    """
    repo = AwardCeremoniesRepository(session)
    
    # Check if external_id already exists
    existing = await repo.get_by_external_id(ceremony_data.external_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Award ceremony with external_id '{ceremony_data.external_id}' already exists"
        )
    
    try:
        ceremony = await repo.create(ceremony_data.model_dump())
        return ceremony
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create award ceremony: {str(e)}"
        )


@admin_router.put("/{external_id}", response_model=AwardCeremonyResponse)
async def update_award_ceremony(
    external_id: str,
    ceremony_data: AwardCeremonyUpdate,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> Any:
    """
    Update an existing award ceremony.
    
    **Requires admin role.**
    
    Args:
        external_id: Unique identifier of the ceremony to update
        ceremony_data: Updated ceremony data (only provided fields will be updated)
    
    Returns:
        Updated award ceremony
    
    Raises:
        403: User is not an admin
        404: Award ceremony not found
        400: Invalid data
    """
    repo = AwardCeremoniesRepository(session)
    
    # Only include fields that were actually provided
    update_data = ceremony_data.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update"
        )
    
    try:
        ceremony = await repo.update(external_id, update_data)
        
        if not ceremony:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Award ceremony with external_id '{external_id}' not found"
            )
        
        return ceremony
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update award ceremony: {str(e)}"
        )


@admin_router.delete("/{external_id}", response_model=SuccessResponse)
async def delete_award_ceremony(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> Any:
    """
    Delete an award ceremony.
    
    **Requires admin role.**
    
    Args:
        external_id: Unique identifier of the ceremony to delete
    
    Returns:
        Success message
    
    Raises:
        403: User is not an admin
        404: Award ceremony not found
    """
    repo = AwardCeremoniesRepository(session)
    
    deleted = await repo.delete(external_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Award ceremony with external_id '{external_id}' not found"
        )
    
    return {
        "success": True,
        "message": f"Award ceremony '{external_id}' deleted successfully"
    }


# Include admin router
router.include_router(admin_router)

