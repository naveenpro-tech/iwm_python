"""API routes for critic brand deals and sponsor disclosures"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from ..db import get_session
from ..dependencies.auth import get_current_user
from ..models import User, CriticProfile
from ..repositories.critic_brand_deals import CriticBrandDealRepository
from ..repositories.critics import CriticRepository
from ..schemas.critic_brand_deals import (
    CriticBrandDealCreate,
    CriticBrandDealUpdate,
    CriticBrandDealResponse,
    UpdateBrandDealStatusRequest,
    CriticSponsorDisclosureCreate,
    CriticSponsorDisclosureResponse
)

router = APIRouter(prefix="/api/v1/critic-brand-deals", tags=["Critic Brand Deals"])


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


# ==================== Brand Deal Endpoints ====================

@router.post("", response_model=CriticBrandDealResponse, status_code=status.HTTP_201_CREATED)
async def create_brand_deal(
    deal_data: CriticBrandDealCreate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Create a new brand deal (critics only)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    # Create deal
    brand_deal = await brand_deal_repo.create_brand_deal(
        critic_id=critic_profile.id,
        deal_data=deal_data
    )
    
    return CriticBrandDealResponse.model_validate(brand_deal)


@router.get("/critic/{username}", response_model=List[CriticBrandDealResponse])
async def list_brand_deals_by_critic(
    username: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """List brand deals by critic username (owner only for privacy)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    critic_repo = CriticRepository(db)
    
    # Verify critic exists
    critic_profile = await critic_repo.get_critic_by_username(username)
    if not critic_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    # Check if current user is the owner (brand deals are private)
    is_owner = current_user and critic_profile.user_id == current_user.id
    
    if not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brand deals are private and can only be viewed by the owner"
        )
    
    # Get deals
    deals = await brand_deal_repo.list_brand_deals_by_username(
        username=username,
        status=status_filter,
        limit=limit,
        offset=offset
    )
    
    return [CriticBrandDealResponse.model_validate(deal) for deal in deals]


@router.put("/{deal_id}/status", response_model=CriticBrandDealResponse)
async def update_brand_deal_status(
    deal_id: int,
    status_data: UpdateBrandDealStatusRequest,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Update brand deal status (owner only)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    # Get existing deal
    existing = await brand_deal_repo.get_brand_deal_by_id(deal_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand deal not found"
        )
    
    # Check ownership
    if existing.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own brand deals"
        )
    
    # Update status
    updated_deal = await brand_deal_repo.update_brand_deal_status(
        deal_id=deal_id,
        status=status_data.status
    )
    
    return CriticBrandDealResponse.model_validate(updated_deal)


@router.put("/{deal_id}", response_model=CriticBrandDealResponse)
async def update_brand_deal(
    deal_id: int,
    deal_data: CriticBrandDealUpdate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Update brand deal (owner only)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    # Get existing deal
    existing = await brand_deal_repo.get_brand_deal_by_id(deal_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand deal not found"
        )
    
    # Check ownership
    if existing.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own brand deals"
        )
    
    # Update deal
    updated_deal = await brand_deal_repo.update_brand_deal(deal_id, deal_data)
    
    return CriticBrandDealResponse.model_validate(updated_deal)


@router.get("/{deal_id}", response_model=CriticBrandDealResponse)
async def get_brand_deal(
    deal_id: int,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Get brand deal by ID (owner only)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    deal = await brand_deal_repo.get_brand_deal_by_id(deal_id)
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand deal not found"
        )
    
    # Check ownership
    if deal.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own brand deals"
        )
    
    return CriticBrandDealResponse.model_validate(deal)


# ==================== Sponsor Disclosure Endpoints ====================

@router.post("/disclosures", response_model=CriticSponsorDisclosureResponse, status_code=status.HTTP_201_CREATED)
async def create_sponsor_disclosure(
    disclosure_data: CriticSponsorDisclosureCreate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_session)
):
    """Create a sponsor disclosure for review or blog post (critics only)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    # Verify brand deal exists and belongs to critic
    if disclosure_data.brand_deal_id:
        brand_deal = await brand_deal_repo.get_brand_deal_by_id(disclosure_data.brand_deal_id)
        if not brand_deal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brand deal not found"
            )
        
        if brand_deal.critic_id != critic_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Brand deal does not belong to you"
            )
    
    # Create disclosure
    disclosure = await brand_deal_repo.create_sponsor_disclosure(disclosure_data)
    
    return CriticSponsorDisclosureResponse.model_validate(disclosure)


@router.get("/disclosures/review/{review_id}", response_model=CriticSponsorDisclosureResponse)
async def get_disclosure_by_review(
    review_id: int,
    db: AsyncSession = Depends(get_session)
):
    """Get sponsor disclosure for a review (public)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    disclosure = await brand_deal_repo.get_disclosure_by_review(review_id)
    if not disclosure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No disclosure found for this review"
        )
    
    return CriticSponsorDisclosureResponse.model_validate(disclosure)


@router.get("/disclosures/blog-post/{blog_post_id}", response_model=CriticSponsorDisclosureResponse)
async def get_disclosure_by_blog_post(
    blog_post_id: int,
    db: AsyncSession = Depends(get_session)
):
    """Get sponsor disclosure for a blog post (public)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    disclosure = await brand_deal_repo.get_disclosure_by_blog_post(blog_post_id)
    if not disclosure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No disclosure found for this blog post"
        )
    
    return CriticSponsorDisclosureResponse.model_validate(disclosure)


@router.get("/disclosures/{disclosure_id}", response_model=CriticSponsorDisclosureResponse)
async def get_disclosure(
    disclosure_id: int,
    db: AsyncSession = Depends(get_session)
):
    """Get sponsor disclosure by ID (public)"""
    brand_deal_repo = CriticBrandDealRepository(db)
    
    disclosure = await brand_deal_repo.get_disclosure_by_id(disclosure_id)
    if not disclosure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Disclosure not found"
        )
    
    return CriticSponsorDisclosureResponse.model_validate(disclosure)

