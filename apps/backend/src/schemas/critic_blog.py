"""Pydantic schemas for critic blog posts"""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List


class CriticBlogPostCreate(BaseModel):
    """Schema for creating a blog post"""
    title: str = Field(..., min_length=3, max_length=200, description="Blog post title")
    content: str = Field(..., min_length=10, description="Blog post content (Markdown)")
    excerpt: Optional[str] = Field(None, max_length=500, description="Short excerpt/summary")
    cover_image_url: Optional[str] = Field(None, max_length=255, description="Cover image URL")
    tags: List[str] = Field(default_factory=list, description="Tags for categorization")
    status: str = Field(default="draft", description="Post status: draft, published, archived")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed_statuses = ["draft", "published", "archived"]
        if v not in allowed_statuses:
            raise ValueError(f"Status must be one of: {', '.join(allowed_statuses)}")
        return v

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, v: List[str]) -> List[str]:
        if len(v) > 10:
            raise ValueError("Maximum 10 tags allowed")
        return [tag.strip().lower() for tag in v if tag.strip()]


class CriticBlogPostUpdate(BaseModel):
    """Schema for updating a blog post"""
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    content: Optional[str] = Field(None, min_length=10)
    excerpt: Optional[str] = Field(None, max_length=500)
    cover_image_url: Optional[str] = Field(None, max_length=255)
    tags: Optional[List[str]] = None
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            allowed_statuses = ["draft", "published", "archived"]
            if v not in allowed_statuses:
                raise ValueError(f"Status must be one of: {', '.join(allowed_statuses)}")
        return v

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if v is not None:
            if len(v) > 10:
                raise ValueError("Maximum 10 tags allowed")
            return [tag.strip().lower() for tag in v if tag.strip()]
        return v


class CriticInfoResponse(BaseModel):
    """Minimal critic info for blog post responses"""
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    is_verified: bool

    class Config:
        from_attributes = True


class CriticBlogPostResponse(BaseModel):
    """Schema for blog post response"""
    id: int
    external_id: str
    critic: CriticInfoResponse
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    tags: List[str]
    status: str
    published_at: Optional[datetime] = None
    view_count: int
    like_count: int
    comment_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CriticBlogPostListResponse(BaseModel):
    """Schema for blog post list item (lighter than full response)"""
    id: int
    external_id: str
    critic_username: str
    critic_display_name: str
    title: str
    slug: str
    excerpt: Optional[str] = None
    cover_image_url: Optional[str] = None
    tags: List[str]
    status: str
    published_at: Optional[datetime] = None
    view_count: int
    like_count: int
    comment_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class PublishBlogPostRequest(BaseModel):
    """Schema for publishing a draft blog post"""
    publish: bool = Field(default=True, description="Set to true to publish")

