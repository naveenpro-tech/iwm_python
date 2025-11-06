"""API routes for critic recommendations"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from ..database import get_db
from ..dependencies import get_current_user
from ..models import User, CriticProfile
from ..repositories.critic_recommendations import CriticRecommendationRepository
from ..repositories.critics import CriticRepository
from ..repositories.movies import MovieRepository
from ..schemas.critic_recommendations import (
    CriticRecommendationCreate,
    CriticRecommendationResponse
)

router = APIRouter(prefix="/api/v1/critic-recommendations", tags=["Critic Recommendations"])


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


@router.post("", response_model=CriticRecommendationResponse, status_code=status.HTTP_201_CREATED)
async def create_recommendation(
    recommendation_data: CriticRecommendationCreate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Create a new movie recommendation (critics only)"""
    recommendation_repo = CriticRecommendationRepository(db)
    movie_repo = MovieRepository(db)
    
    # Verify movie exists
    movie = await movie_repo.get_movie_by_id(recommendation_data.movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    
    # Check for duplicate recommendation
    existing = await recommendation_repo.check_duplicate_recommendation(
        critic_id=critic_profile.id,
        movie_id=recommendation_data.movie_id
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already recommended this movie"
        )
    
    # Create recommendation
    recommendation = await recommendation_repo.create_recommendation(
        critic_id=critic_profile.id,
        recommendation_data=recommendation_data
    )
    
    return CriticRecommendationResponse.model_validate(recommendation)


@router.get("/critic/{username}", response_model=List[CriticRecommendationResponse])
async def list_recommendations_by_critic(
    username: str,
    recommendation_type: Optional[str] = Query(None, alias="type"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """List recommendations by critic username (public)"""
    recommendation_repo = CriticRecommendationRepository(db)
    critic_repo = CriticRepository(db)
    
    # Verify critic exists
    critic_profile = await critic_repo.get_critic_by_username(username)
    if not critic_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    # Get recommendations
    recommendations = await recommendation_repo.list_recommendations_by_username(
        username=username,
        recommendation_type=recommendation_type,
        limit=limit,
        offset=offset
    )
    
    return [CriticRecommendationResponse.model_validate(rec) for rec in recommendations]


@router.get("/type/{recommendation_type}", response_model=List[CriticRecommendationResponse])
async def list_recommendations_by_type(
    recommendation_type: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """List all recommendations by type across all critics (public)"""
    recommendation_repo = CriticRecommendationRepository(db)
    
    # Validate recommendation type
    valid_types = [
        "must_watch", "hidden_gem", "guilty_pleasure", "underrated",
        "cult_classic", "comfort_watch", "masterpiece", "controversial"
    ]
    
    if recommendation_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid recommendation type. Must be one of: {', '.join(valid_types)}"
        )
    
    # Get recommendations
    recommendations = await recommendation_repo.list_recommendations_by_type(
        recommendation_type=recommendation_type,
        limit=limit,
        offset=offset
    )
    
    return [CriticRecommendationResponse.model_validate(rec) for rec in recommendations]


@router.delete("/{recommendation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recommendation(
    recommendation_id: int,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Delete recommendation (owner only)"""
    recommendation_repo = CriticRecommendationRepository(db)
    
    # Get existing recommendation
    existing = await recommendation_repo.get_recommendation_by_id(recommendation_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
    
    # Check ownership
    if existing.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own recommendations"
        )
    
    # Delete recommendation
    await recommendation_repo.delete_recommendation(recommendation_id)
    
    return None


@router.get("/{recommendation_id}", response_model=CriticRecommendationResponse)
async def get_recommendation(
    recommendation_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get recommendation by ID (public)"""
    recommendation_repo = CriticRecommendationRepository(db)
    
    recommendation = await recommendation_repo.get_recommendation_by_id(recommendation_id)
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
    
    return CriticRecommendationResponse.model_validate(recommendation)

