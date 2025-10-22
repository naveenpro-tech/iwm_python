"""Critic Hub - Critics API Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from typing import List, Optional

from ..db import get_session
from ..repositories.critics import CriticRepository
from ..dependencies.auth import get_current_user
from ..models import User


router = APIRouter(prefix="/critics", tags=["critics"])


# --- Pydantic Models ---
class SocialLinkCreate(BaseModel):
    platform: str = Field(..., max_length=50)
    url: str = Field(..., max_length=500)
    display_order: int = Field(default=0)
    is_primary: bool = Field(default=False)


class SocialLinkResponse(BaseModel):
    id: int
    platform: str
    url: str
    display_order: int
    is_primary: bool

    class Config:
        from_attributes = True


class CriticProfileResponse(BaseModel):
    id: int
    external_id: str
    username: str
    display_name: str
    bio: Optional[str]
    logo_url: Optional[str]
    banner_url: Optional[str]
    banner_video_url: Optional[str]
    is_verified: bool
    verification_level: Optional[str]
    follower_count: int
    total_reviews: int
    avg_engagement: float
    total_views: int
    review_philosophy: Optional[str]
    equipment_info: Optional[str]
    background_info: Optional[str]
    created_at: str
    social_links: List[SocialLinkResponse] = []

    class Config:
        from_attributes = True


class CriticProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, max_length=200)
    bio: Optional[str] = None
    logo_url: Optional[str] = Field(None, max_length=255)
    banner_url: Optional[str] = Field(None, max_length=255)
    banner_video_url: Optional[str] = Field(None, max_length=255)
    review_philosophy: Optional[str] = None
    equipment_info: Optional[str] = None
    background_info: Optional[str] = None


class FollowerResponse(BaseModel):
    id: int
    external_id: str
    name: str
    email: str
    avatar_url: Optional[str]

    class Config:
        from_attributes = True


# --- Endpoints ---
@router.get("", response_model=List[CriticProfileResponse])
async def list_critics(
    is_verified: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0,
    sort_by: str = "follower_count",
    db: AsyncSession = Depends(get_session)
):
    """List all critics with optional filters"""
    repo = CriticRepository(db)
    critics = await repo.list_critics(
        is_verified=is_verified,
        limit=limit,
        offset=offset,
        sort_by=sort_by
    )
    
    return [
        CriticProfileResponse(
            **{
                **critic.__dict__,
                "created_at": critic.created_at.isoformat(),
                "social_links": [SocialLinkResponse.from_orm(link) for link in critic.social_links]
            }
        )
        for critic in critics
    ]


@router.get("/search", response_model=List[CriticProfileResponse])
async def search_critics(
    q: str,
    limit: int = 20,
    db: AsyncSession = Depends(get_session)
):
    """Search critics by username or display name"""
    repo = CriticRepository(db)
    critics = await repo.search_critics(q, limit=limit)

    return [
        CriticProfileResponse(
            **{
                **critic.__dict__,
                "created_at": critic.created_at.isoformat(),
                "social_links": [SocialLinkResponse.from_orm(link) for link in critic.social_links]
            }
        )
        for critic in critics
    ]


@router.get("/{username}", response_model=CriticProfileResponse)
async def get_critic_by_username(
    username: str,
    db: AsyncSession = Depends(get_session)
):
    """Get critic profile by username"""
    repo = CriticRepository(db)
    critic = await repo.get_critic_by_username(username)
    
    if not critic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    return CriticProfileResponse(
        **{
            **critic.__dict__,
            "created_at": critic.created_at.isoformat(),
            "social_links": [SocialLinkResponse.from_orm(link) for link in critic.social_links]
        }
    )


@router.put("/{username}", response_model=CriticProfileResponse)
async def update_critic_profile(
    username: str,
    update_data: CriticProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """Update critic profile (only by the critic themselves)"""
    repo = CriticRepository(db)
    critic = await repo.get_critic_by_username(username)
    
    if not critic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    # Check if current user owns this critic profile
    if critic.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this profile"
        )
    
    # Update profile
    update_dict = update_data.dict(exclude_unset=True)
    updated_critic = await repo.update_critic_profile(critic.id, **update_dict)
    
    return CriticProfileResponse(
        **{
            **updated_critic.__dict__,
            "created_at": updated_critic.created_at.isoformat(),
            "social_links": [SocialLinkResponse.from_orm(link) for link in updated_critic.social_links]
        }
    )


@router.post("/{username}/follow")
async def follow_critic(
    username: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """Follow a critic"""
    repo = CriticRepository(db)
    critic = await repo.get_critic_by_username(username)

    if not critic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )

    # Check if already following
    is_following = await repo.is_following(critic.id, current_user.id)
    if is_following:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this critic"
        )

    await repo.follow_critic(critic.id, current_user.id)

    return {"message": "Successfully followed critic", "username": username}


@router.delete("/{username}/follow")
async def unfollow_critic(
    username: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """Unfollow a critic"""
    repo = CriticRepository(db)
    critic = await repo.get_critic_by_username(username)
    
    if not critic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    success = await repo.unfollow_critic(critic.id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not following this critic"
        )
    
    return {"message": "Successfully unfollowed critic", "username": username}


@router.get("/{username}/followers", response_model=List[FollowerResponse])
async def get_critic_followers(
    username: str,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_session)
):
    """Get followers of a critic"""
    repo = CriticRepository(db)
    critic = await repo.get_critic_by_username(username)
    
    if not critic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    followers = await repo.get_followers(critic.id, limit=limit, offset=offset)
    
    return [FollowerResponse.from_orm(follower) for follower in followers]

