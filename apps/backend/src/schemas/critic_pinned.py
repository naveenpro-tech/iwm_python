"""Pydantic schemas for critic pinned content"""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class CriticPinnedContentCreate(BaseModel):
    """Schema for pinning content"""
    content_type: str = Field(..., description="Type of content: review, blog_post, recommendation")
    content_id: int = Field(..., gt=0, description="ID of the content item")
    display_order: int = Field(default=0, ge=0, description="Display order (0 = first)")

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, v: str) -> str:
        allowed_types = ["review", "blog_post", "recommendation"]
        if v not in allowed_types:
            raise ValueError(f"Content type must be one of: {', '.join(allowed_types)}")
        return v


class CriticPinnedContentUpdate(BaseModel):
    """Schema for updating pinned content"""
    display_order: int = Field(..., ge=0, description="New display order")


class CriticPinnedContentResponse(BaseModel):
    """Schema for pinned content response"""
    id: int
    external_id: str
    critic_username: str
    content_type: str
    content_id: int
    display_order: int
    pinned_at: datetime

    class Config:
        from_attributes = True


class ReorderPinnedContentRequest(BaseModel):
    """Schema for reordering multiple pinned items"""
    pin_id: int
    new_order: int = Field(..., ge=0)

