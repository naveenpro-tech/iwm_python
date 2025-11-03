"""Feature Flag Schemas"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FeatureFlagBase(BaseModel):
    """Base feature flag schema"""
    feature_key: str = Field(..., min_length=1, max_length=100)
    feature_name: str = Field(..., min_length=1, max_length=200)
    is_enabled: bool = False
    category: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    display_order: int = 0


class FeatureFlagCreate(FeatureFlagBase):
    """Schema for creating a feature flag"""
    pass


class FeatureFlagUpdate(BaseModel):
    """Schema for updating a feature flag"""
    is_enabled: Optional[bool] = None
    feature_name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    display_order: Optional[int] = None


class FeatureFlagBulkUpdate(BaseModel):
    """Schema for bulk updating feature flags"""
    updates: dict[str, bool] = Field(..., description="Map of feature_key to is_enabled")


class FeatureFlagPublic(BaseModel):
    """Public feature flag schema (minimal info)"""
    feature_key: str
    is_enabled: bool

    class Config:
        from_attributes = True


class FeatureFlagAdmin(BaseModel):
    """Admin feature flag schema (full info)"""
    id: int
    feature_key: str
    feature_name: str
    is_enabled: bool
    category: str
    description: Optional[str] = None
    display_order: int
    created_at: datetime
    updated_at: datetime
    updated_by: Optional[int] = None

    class Config:
        from_attributes = True


class FeatureFlagsResponse(BaseModel):
    """Response schema for feature flags list"""
    flags: dict[str, bool] = Field(..., description="Map of feature_key to is_enabled")


class FeatureFlagsAdminResponse(BaseModel):
    """Admin response schema for feature flags list"""
    total: int
    flags: list[FeatureFlagAdmin]

