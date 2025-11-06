"""API routes for critic pinned content"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..database import get_db
from ..dependencies import get_current_user
from ..models import User, CriticProfile
from ..repositories.critic_pinned import CriticPinnedContentRepository
from ..repositories.critics import CriticRepository
from ..schemas.critic_pinned import (
    CriticPinnedContentCreate,
    CriticPinnedContentResponse,
    ReorderPinnedContentRequest
)

router = APIRouter(prefix="/api/v1/critic-pinned", tags=["Critic Pinned Content"])


async def get_critic_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> CriticProfile:
    """Dependency to get current user's critic profile"""
    critic_repo = CriticRepository(db)
    critic_profile = await critic_repo.get_critic_by_user_id(current_user.id)
    
    if not critic_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only critics can access this endpoint"
        )
    
    return critic_profile


@router.post("", response_model=CriticPinnedContentResponse, status_code=status.HTTP_201_CREATED)
async def pin_content(
    pinned_data: CriticPinnedContentCreate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Pin content to critic profile (critics only)"""
    pinned_repo = CriticPinnedContentRepository(db)
    
    # Check if already pinned
    existing = await pinned_repo.check_duplicate_pin(
        critic_id=critic_profile.id,
        content_type=pinned_data.content_type,
        content_id=pinned_data.content_id
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This content is already pinned"
        )
    
    # Check pinned count limit
    # Free tier: 3, Pro tier: 5 (will be enhanced with tier check)
    current_count = await pinned_repo.get_pinned_count(critic_profile.id)
    max_pins = 5  # Default to Pro tier limit for now
    
    if current_count >= max_pins:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum pinned content limit reached ({max_pins})"
        )
    
    # Create pinned content
    pinned_content = await pinned_repo.create_pinned_content(
        critic_id=critic_profile.id,
        pinned_data=pinned_data
    )
    
    return CriticPinnedContentResponse.model_validate(pinned_content)


@router.get("/critic/{username}", response_model=List[CriticPinnedContentResponse])
async def get_pinned_content_by_critic(
    username: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all pinned content for a critic (public)"""
    pinned_repo = CriticPinnedContentRepository(db)
    critic_repo = CriticRepository(db)
    
    # Verify critic exists
    critic_profile = await critic_repo.get_critic_by_username(username)
    if not critic_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    # Get pinned content
    pinned_items = await pinned_repo.get_pinned_content_by_username(username)
    
    return [CriticPinnedContentResponse.model_validate(item) for item in pinned_items]


@router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_pinned_content(
    reorder_data: ReorderPinnedContentRequest,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Reorder pinned content (owner only)"""
    pinned_repo = CriticPinnedContentRepository(db)
    
    # Verify all pins belong to the critic
    for item in reorder_data.pin_orders:
        pin_id = item.get("pin_id")
        if pin_id:
            existing = await pinned_repo.get_pinned_content_by_id(pin_id)
            if not existing or existing.critic_id != critic_profile.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Pin {pin_id} not found or does not belong to you"
                )
    
    # Reorder
    await pinned_repo.reorder_pinned_content(
        critic_id=critic_profile.id,
        pin_orders=reorder_data.pin_orders
    )
    
    return None


@router.delete("/{pin_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unpin_content(
    pin_id: int,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Unpin content (owner only)"""
    pinned_repo = CriticPinnedContentRepository(db)
    
    # Get existing pin
    existing = await pinned_repo.get_pinned_content_by_id(pin_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pinned content not found"
        )
    
    # Check ownership
    if existing.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only unpin your own content"
        )
    
    # Delete pin
    await pinned_repo.delete_pinned_content(pin_id)
    
    return None


@router.get("/{pin_id}", response_model=CriticPinnedContentResponse)
async def get_pinned_content(
    pin_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get pinned content by ID (public)"""
    pinned_repo = CriticPinnedContentRepository(db)
    
    pinned_content = await pinned_repo.get_pinned_content_by_id(pin_id)
    if not pinned_content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pinned content not found"
        )
    
    return CriticPinnedContentResponse.model_validate(pinned_content)

