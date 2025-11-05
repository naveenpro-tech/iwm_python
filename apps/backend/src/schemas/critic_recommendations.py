"""Pydantic schemas for critic recommendations"""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class CriticRecommendationCreate(BaseModel):
    """Schema for creating a recommendation"""
    movie_id: int = Field(..., gt=0, description="ID of the movie being recommended")
    recommendation_type: str = Field(..., description="Type of recommendation")
    reason: str = Field(..., min_length=10, max_length=1000, description="Reason for recommendation")

    @field_validator("recommendation_type")
    @classmethod
    def validate_recommendation_type(cls, v: str) -> str:
        allowed_types = [
            "must_watch",
            "hidden_gem",
            "guilty_pleasure",
            "underrated",
            "cult_classic",
            "comfort_watch",
            "masterpiece",
            "controversial"
        ]
        if v not in allowed_types:
            raise ValueError(f"Recommendation type must be one of: {', '.join(allowed_types)}")
        return v


class MovieInfoResponse(BaseModel):
    """Minimal movie info for recommendation responses"""
    id: int
    title: str
    release_year: Optional[int] = None
    poster_url: Optional[str] = None
    genres: list = []

    class Config:
        from_attributes = True


class CriticRecommendationResponse(BaseModel):
    """Schema for recommendation response"""
    id: int
    external_id: str
    critic_username: str
    movie: MovieInfoResponse
    recommendation_type: str
    reason: str
    created_at: datetime

    class Config:
        from_attributes = True

