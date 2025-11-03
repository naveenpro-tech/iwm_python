"""Feature Flags API Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional

from ..db import get_session
from ..models import FeatureFlag, User
from ..schemas.feature_flag import (
    FeatureFlagsResponse,
    FeatureFlagsAdminResponse,
    FeatureFlagAdmin,
    FeatureFlagUpdate,
    FeatureFlagBulkUpdate,
)
from ..dependencies.auth import get_current_user
from ..dependencies.admin import require_admin

router = APIRouter(tags=["feature-flags"])


@router.get("/feature-flags", response_model=FeatureFlagsResponse)
async def get_feature_flags(
    db: AsyncSession = Depends(get_session)
):
    """
    Get all feature flags (public endpoint).
    Returns a simple map of feature_key to is_enabled.
    """
    result = await db.execute(
        select(FeatureFlag.feature_key, FeatureFlag.is_enabled)
        .order_by(FeatureFlag.display_order)
    )
    flags_list = result.all()
    
    # Convert to dictionary
    flags_dict = {flag.feature_key: flag.is_enabled for flag in flags_list}
    
    return FeatureFlagsResponse(flags=flags_dict)


@router.get("/admin/feature-flags", response_model=FeatureFlagsAdminResponse)
async def get_admin_feature_flags(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin)
):
    """
    Get all feature flags with full details (admin only).
    Optionally filter by category.
    """
    query = select(FeatureFlag).order_by(FeatureFlag.category, FeatureFlag.display_order)
    
    if category:
        query = query.where(FeatureFlag.category == category)
    
    result = await db.execute(query)
    flags = result.scalars().all()
    
    return FeatureFlagsAdminResponse(
        total=len(flags),
        flags=[FeatureFlagAdmin.model_validate(flag) for flag in flags]
    )


@router.put("/admin/feature-flags/bulk", response_model=dict)
async def bulk_update_feature_flags(
    bulk_update: FeatureFlagBulkUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin)
):
    """
    Bulk update multiple feature flags (admin only).
    Accepts a map of feature_key to is_enabled.

    IMPORTANT: This endpoint MUST be defined BEFORE the /{feature_key} endpoint
    to prevent FastAPI from matching 'bulk' as a feature_key path parameter.
    """
    updated_count = 0
    errors = []

    for feature_key, is_enabled in bulk_update.updates.items():
        try:
            result = await db.execute(
                update(FeatureFlag)
                .where(FeatureFlag.feature_key == feature_key)
                .values(is_enabled=is_enabled, updated_by=current_user.id)
            )

            if result.rowcount > 0:
                updated_count += 1
            else:
                errors.append(f"Feature '{feature_key}' not found")
        except Exception as e:
            errors.append(f"Error updating '{feature_key}': {str(e)}")

    await db.commit()

    return {
        "success": True,
        "updated_count": updated_count,
        "total_requested": len(bulk_update.updates),
        "errors": errors if errors else None
    }


@router.put("/admin/feature-flags/{feature_key}", response_model=FeatureFlagAdmin)
async def update_feature_flag(
    feature_key: str,
    flag_update: FeatureFlagUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin)
):
    """
    Update a single feature flag (admin only).

    IMPORTANT: This endpoint MUST be defined AFTER the /bulk endpoint
    to prevent the path parameter from matching 'bulk' as a feature_key.
    """
    # Get the feature flag
    result = await db.execute(
        select(FeatureFlag).where(FeatureFlag.feature_key == feature_key)
    )
    flag = result.scalar_one_or_none()

    if not flag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature flag '{feature_key}' not found"
        )

    # Update fields
    update_data = flag_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(flag, field, value)

    flag.updated_by = current_user.id

    await db.commit()
    await db.refresh(flag)

    return FeatureFlagAdmin.model_validate(flag)


@router.get("/admin/feature-flags/categories", response_model=list[str])
async def get_feature_categories(
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin)
):
    """
    Get all unique feature categories (admin only).
    """
    result = await db.execute(
        select(FeatureFlag.category).distinct().order_by(FeatureFlag.category)
    )
    categories = [row[0] for row in result.all()]
    
    return categories

