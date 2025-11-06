"""API routes for critic affiliate links"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from ..db import get_session
from ..dependencies.auth import get_current_user
from ..models import User, CriticProfile
from ..repositories.critic_affiliate import CriticAffiliateLinkRepository
from ..repositories.critics import CriticRepository
from ..schemas.critic_affiliate import (
    CriticAffiliateLinkCreate,
    CriticAffiliateLinkUpdate,
    CriticAffiliateLinkResponse,
    AffiliateLinkClickRequest,
    AffiliateLinkClickResponse
)

router = APIRouter(prefix="/api/v1/critic-affiliate", tags=["Critic Affiliate Links"])


async def get_critic_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
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


@router.post("", response_model=CriticAffiliateLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_affiliate_link(
    link_data: CriticAffiliateLinkCreate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Create a new affiliate link (critics only)"""
    affiliate_repo = CriticAffiliateLinkRepository(db)
    
    # Create link
    affiliate_link = await affiliate_repo.create_affiliate_link(
        critic_id=critic_profile.id,
        link_data=link_data
    )
    
    return CriticAffiliateLinkResponse.model_validate(affiliate_link)


@router.get("/critic/{username}", response_model=List[CriticAffiliateLinkResponse])
async def list_affiliate_links_by_critic(
    username: str,
    is_active: Optional[bool] = Query(None),
    platform: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """List affiliate links by critic username (public for active, owner for all)"""
    affiliate_repo = CriticAffiliateLinkRepository(db)
    critic_repo = CriticRepository(db)
    
    # Verify critic exists
    critic_profile = await critic_repo.get_critic_by_username(username)
    if not critic_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    # Check if current user is the owner
    is_owner = current_user and critic_profile.user_id == current_user.id
    
    # If not owner, only show active links
    if not is_owner:
        is_active = True
    
    # Get links
    links = await affiliate_repo.list_affiliate_links_by_username(
        username=username,
        is_active=is_active,
        platform=platform,
        limit=limit,
        offset=offset
    )
    
    return [CriticAffiliateLinkResponse.model_validate(link) for link in links]


@router.post("/{link_id}/click", response_model=AffiliateLinkClickResponse)
async def track_affiliate_click(
    link_id: int,
    click_data: AffiliateLinkClickRequest,
    db: AsyncSession = Depends(get_session)
):
    """Track affiliate link click (public, rate-limited)"""
    affiliate_repo = CriticAffiliateLinkRepository(db)
    
    # Get link
    link = await affiliate_repo.get_affiliate_link_by_id(link_id)
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate link not found"
        )
    
    # Check if link is active
    if not link.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This affiliate link is not active"
        )
    
    # Track click
    await affiliate_repo.track_click(link_id)
    
    # Return redirect URL
    return AffiliateLinkClickResponse(
        redirect_url=link.url,
        message="Click tracked successfully"
    )


@router.put("/{link_id}", response_model=CriticAffiliateLinkResponse)
async def update_affiliate_link(
    link_id: int,
    link_data: CriticAffiliateLinkUpdate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Update affiliate link (owner only)"""
    affiliate_repo = CriticAffiliateLinkRepository(db)
    
    # Get existing link
    existing = await affiliate_repo.get_affiliate_link_by_id(link_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate link not found"
        )
    
    # Check ownership
    if existing.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own affiliate links"
        )
    
    # Update link
    updated_link = await affiliate_repo.update_affiliate_link(link_id, link_data)
    
    return CriticAffiliateLinkResponse.model_validate(updated_link)


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_affiliate_link(
    link_id: int,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Delete affiliate link (owner only)"""
    affiliate_repo = CriticAffiliateLinkRepository(db)
    
    # Get existing link
    existing = await affiliate_repo.get_affiliate_link_by_id(link_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate link not found"
        )
    
    # Check ownership
    if existing.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own affiliate links"
        )
    
    # Delete link
    await affiliate_repo.delete_affiliate_link(link_id)
    
    return None


@router.get("/{link_id}", response_model=CriticAffiliateLinkResponse)
async def get_affiliate_link(
    link_id: int,
    db: AsyncSession = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get affiliate link by ID (public for active, owner for all)"""
    affiliate_repo = CriticAffiliateLinkRepository(db)
    
    link = await affiliate_repo.get_affiliate_link_by_id(link_id)
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate link not found"
        )
    
    # Check if current user is the owner
    is_owner = current_user and link.critic.user_id == current_user.id
    
    # If not owner and link is inactive, deny access
    if not is_owner and not link.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate link not found"
        )
    
    return CriticAffiliateLinkResponse.model_validate(link)


@router.post("/{link_id}/conversion", status_code=status.HTTP_204_NO_CONTENT)
async def track_affiliate_conversion(
    link_id: int,
    db: AsyncSession = Depends(get_session)
):
    """Track affiliate link conversion (webhook/callback endpoint)"""
    affiliate_repo = CriticAffiliateLinkRepository(db)
    
    # Get link
    link = await affiliate_repo.get_affiliate_link_by_id(link_id)
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate link not found"
        )
    
    # Track conversion
    await affiliate_repo.track_conversion(link_id)
    
    return None

