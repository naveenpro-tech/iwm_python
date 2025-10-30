"""
Pydantic schemas for movie curation

This module defines request/response schemas for movie curation operations.
Used for validation and serialization of curation data.

Author: IWM Development Team
Date: 2025-01-30
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class CurationStatusEnum(str):
    """Enum for curation status values"""
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class CurationBase(BaseModel):
    """Base schema for curation data"""
    
    curation_status: Optional[str] = Field(
        default="draft",
        description="Status of movie curation: draft, pending_review, approved, rejected"
    )
    quality_score: Optional[int] = Field(
        default=None,
        ge=0,
        le=100,
        description="Quality score for the movie (0-100)"
    )
    curator_notes: Optional[str] = Field(
        default=None,
        description="Notes from the curator about the movie"
    )

    @field_validator("curation_status")
    @classmethod
    def validate_curation_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate curation status is one of the allowed values"""
        if v is None:
            return v
        
        allowed_statuses = ["draft", "pending_review", "approved", "rejected"]
        if v not in allowed_statuses:
            raise ValueError(f"curation_status must be one of {allowed_statuses}")
        
        return v


class CurationCreate(CurationBase):
    """Schema for creating/updating curation data"""
    pass


class CurationUpdate(BaseModel):
    """Schema for updating curation data (all fields optional)"""
    
    curation_status: Optional[str] = Field(
        default=None,
        description="Status of movie curation"
    )
    quality_score: Optional[int] = Field(
        default=None,
        ge=0,
        le=100,
        description="Quality score for the movie (0-100)"
    )
    curator_notes: Optional[str] = Field(
        default=None,
        description="Notes from the curator about the movie"
    )

    @field_validator("curation_status")
    @classmethod
    def validate_curation_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate curation status is one of the allowed values"""
        if v is None:
            return v
        
        allowed_statuses = ["draft", "pending_review", "approved", "rejected"]
        if v not in allowed_statuses:
            raise ValueError(f"curation_status must be one of {allowed_statuses}")
        
        return v


class CuratorInfo(BaseModel):
    """Schema for curator information"""
    
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class CurationResponse(CurationBase):
    """Schema for curation response data"""
    
    curated_by_id: Optional[int] = Field(
        default=None,
        description="ID of the user who curated this movie"
    )
    curated_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp when the movie was curated"
    )
    last_reviewed_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp of the last review"
    )
    curated_by: Optional[CuratorInfo] = Field(
        default=None,
        description="Information about the curator"
    )

    class Config:
        from_attributes = True


class MovieCurationResponse(BaseModel):
    """Schema for movie with curation data"""
    
    id: int
    external_id: str
    title: str
    year: Optional[str] = None
    curation: CurationResponse = Field(
        description="Curation information for the movie"
    )

    class Config:
        from_attributes = True


class CurationBulkUpdate(BaseModel):
    """Schema for bulk curation updates"""

    movie_ids: list[int] = Field(
        description="List of movie IDs to update"
    )
    curation_status: Optional[str] = Field(
        default=None,
        description="Status to apply to all movies"
    )
    quality_score: Optional[int] = Field(
        default=None,
        ge=0,
        le=100,
        description="Quality score to apply to all movies"
    )

    @field_validator("curation_status")
    @classmethod
    def validate_curation_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate curation status is one of the allowed values"""
        if v is None:
            return v

        allowed_statuses = ["draft", "pending_review", "approved", "rejected"]
        if v not in allowed_statuses:
            raise ValueError(f"curation_status must be one of {allowed_statuses}")

        return v


class BulkUpdateRequest(BaseModel):
    """Schema for bulk update request"""

    movie_ids: list[int] = Field(
        description="List of movie IDs to update",
        min_length=1
    )
    curation_data: CurationUpdate = Field(
        description="Curation data to apply to all movies"
    )


class BulkUpdateResponse(BaseModel):
    """Schema for bulk update response"""

    success_count: int = Field(
        description="Number of movies successfully updated"
    )
    failure_count: int = Field(
        description="Number of movies that failed to update"
    )
    failed_ids: list[int] = Field(
        default_factory=list,
        description="List of movie IDs that failed to update"
    )
    message: str = Field(
        description="Summary message of the bulk operation"
    )


class BulkPublishRequest(BaseModel):
    """Schema for bulk publish/unpublish request"""

    movie_ids: list[int] = Field(
        description="List of movie IDs to publish/unpublish",
        min_length=1
    )
    publish: bool = Field(
        description="True to publish (set status to approved), False to unpublish (set to draft)"
    )


class BulkFeatureRequest(BaseModel):
    """Schema for bulk feature/unfeature request"""

    movie_ids: list[int] = Field(
        description="List of movie IDs to feature/unfeature",
        min_length=1
    )
    featured: bool = Field(
        description="True to feature movies, False to unfeature"
    )

