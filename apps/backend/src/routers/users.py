from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..db import get_session
from ..models import User, Review, Watchlist, Favorite, Collection

router = APIRouter(prefix="/users", tags=["users"])


class UserStatsResponse(BaseModel):
    reviews: int
    watchlist: int
    favorites: int
    collections: int
    following: int
    followers: int


class UserProfileResponse(BaseModel):
    id: str
    username: str
    name: str
    email: str
    bio: str | None
    avatarUrl: str | None
    bannerUrl: str | None
    joinedDate: str
    location: str | None
    website: str | None
    stats: UserStatsResponse
    isVerified: bool

    class Config:
        from_attributes = True


@router.get("/{username}", response_model=UserProfileResponse)
async def get_user_by_username(
    username: str,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    Get user profile by username.
    Try multiple strategies:
    1. Exact email match
    2. Email prefix match (username@)
    3. External_id match
    """
    user = None

    # Try exact email match first
    query = select(User).where(User.email == username)
    result = await session.execute(query)
    user = result.scalar_one_or_none()

    # If not found, try email prefix (limit to 1 to avoid MultipleResultsFound error)
    if not user:
        query = select(User).where(User.email.like(f"{username}@%")).limit(1)
        result = await session.execute(query)
        user = result.scalar_one_or_none()

    # If still not found, try external_id
    if not user:
        query = select(User).where(User.external_id == username)
        result = await session.execute(query)
        user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Get user stats
    stats = await get_user_stats_internal(user.id, session)

    # Extract username from email
    email_username = user.email.split('@')[0] if '@' in user.email else user.email

    return UserProfileResponse(
        id=user.external_id,
        username=email_username,
        name=user.name,
        email=user.email,
        bio=None,  # TODO: Add bio field to User model
        avatarUrl=user.avatar_url,
        bannerUrl=None,  # TODO: Add banner_url field to User model
        joinedDate=user.created_at.strftime("%B %Y"),
        location=None,  # TODO: Add location field to User model
        website=None,  # TODO: Add website field to User model
        stats=stats,
        isVerified=False,  # TODO: Add is_verified field to User model
    )


@router.get("/{username}/stats", response_model=UserStatsResponse)
async def get_user_stats(
    username: str,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """Get user statistics (counts for reviews, watchlist, favorites, collections)"""
    # Find user by username
    query = select(User).where(User.email.like(f"{username}%"))
    result = await session.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return await get_user_stats_internal(user.id, session)


async def get_user_stats_internal(user_id: int, session: AsyncSession) -> UserStatsResponse:
    """Internal function to get user stats by user ID"""
    # Count reviews
    reviews_query = select(func.count(Review.id)).where(Review.user_id == user_id)
    reviews_result = await session.execute(reviews_query)
    reviews_count = reviews_result.scalar() or 0
    
    # Count watchlist items
    watchlist_query = select(func.count(Watchlist.id)).where(Watchlist.user_id == user_id)
    watchlist_result = await session.execute(watchlist_query)
    watchlist_count = watchlist_result.scalar() or 0
    
    # Count favorites
    favorites_query = select(func.count(Favorite.id)).where(
        Favorite.user_id == user_id,
        Favorite.type == "movie"
    )
    favorites_result = await session.execute(favorites_query)
    favorites_count = favorites_result.scalar() or 0
    
    # Count collections
    collections_query = select(func.count(Collection.id)).where(Collection.user_id == user_id)
    collections_result = await session.execute(collections_query)
    collections_count = collections_result.scalar() or 0
    
    return UserStatsResponse(
        reviews=reviews_count,
        watchlist=watchlist_count,
        favorites=favorites_count,
        collections=collections_count,
        following=0,  # TODO: Implement following/followers
        followers=0,
    )

