"""Pydantic schemas for critic brand deals and sponsor disclosures"""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
import json


class CriticBrandDealCreate(BaseModel):
    """Schema for creating a brand deal"""
    brand_name: str = Field(..., min_length=2, max_length=200, description="Brand/company name")
    campaign_title: str = Field(..., min_length=3, max_length=200, description="Campaign title")
    brief: str = Field(..., min_length=10, description="Campaign brief/description")
    rate_card: Optional[float] = Field(None, gt=0, description="Proposed rate/budget")
    disclosure_required: bool = Field(default=True, description="Whether FTC disclosure is required")
    deliverables: Optional[List[str]] = Field(default=None, description="List of deliverables")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class CriticBrandDealUpdate(BaseModel):
    """Schema for updating a brand deal"""
    brand_name: Optional[str] = Field(None, min_length=2, max_length=200)
    campaign_title: Optional[str] = Field(None, min_length=3, max_length=200)
    brief: Optional[str] = Field(None, min_length=10)
    rate_card: Optional[float] = Field(None, gt=0)
    status: Optional[str] = None
    deliverables: Optional[List[str]] = None
    disclosure_required: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            allowed_statuses = ["pending", "accepted", "completed", "cancelled"]
            if v not in allowed_statuses:
                raise ValueError(f"Status must be one of: {', '.join(allowed_statuses)}")
        return v


class CriticBrandDealResponse(BaseModel):
    """Schema for brand deal response"""
    id: int
    external_id: str
    critic_username: str
    brand_name: str
    campaign_title: str
    brief: str
    rate_card: Optional[float] = None
    status: str
    deliverables: Optional[List[str]] = None
    disclosure_required: bool
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UpdateBrandDealStatusRequest(BaseModel):
    """Schema for updating brand deal status"""
    status: str = Field(..., description="New status: pending, accepted, completed, cancelled")
    deliverables: Optional[List[str]] = Field(None, description="Updated deliverables list")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed_statuses = ["pending", "accepted", "completed", "cancelled"]
        if v not in allowed_statuses:
            raise ValueError(f"Status must be one of: {', '.join(allowed_statuses)}")
        return v


class CriticSponsorDisclosureCreate(BaseModel):
    """Schema for creating a sponsor disclosure"""
    review_id: Optional[int] = Field(None, description="Review ID if disclosure is for a review")
    blog_post_id: Optional[int] = Field(None, description="Blog post ID if disclosure is for a blog post")
    brand_deal_id: Optional[int] = Field(None, description="Associated brand deal ID")
    disclosure_text: str = Field(..., min_length=10, max_length=500, description="FTC-compliant disclosure text")
    disclosure_type: str = Field(..., description="Type: sponsored, affiliate, gifted, partnership")

    @field_validator("disclosure_type")
    @classmethod
    def validate_disclosure_type(cls, v: str) -> str:
        allowed_types = ["sponsored", "affiliate", "gifted", "partnership"]
        if v not in allowed_types:
            raise ValueError(f"Disclosure type must be one of: {', '.join(allowed_types)}")
        return v

    def model_post_init(self, __context) -> None:
        """Validate that at least one content ID is provided"""
        if not self.review_id and not self.blog_post_id:
            raise ValueError("Either review_id or blog_post_id must be provided")


class CriticSponsorDisclosureResponse(BaseModel):
    """Schema for sponsor disclosure response"""
    id: int
    external_id: str
    review_id: Optional[int] = None
    blog_post_id: Optional[int] = None
    brand_deal_id: Optional[int] = None
    disclosure_text: str
    disclosure_type: str
    created_at: datetime

    class Config:
        from_attributes = True

