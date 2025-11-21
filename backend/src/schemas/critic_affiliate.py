"""Pydantic schemas for critic affiliate links"""
from pydantic import BaseModel, Field, HttpUrl, field_validator
from datetime import datetime
from typing import Optional


class CriticAffiliateLinkCreate(BaseModel):
    """Schema for creating an affiliate link"""
    label: str = Field(..., min_length=3, max_length=100, description="Display label for the link")
    platform: str = Field(..., description="Platform name (e.g., netflix, amazon, apple_tv)")
    url: str = Field(..., max_length=500, description="Affiliate URL")
    utm_source: Optional[str] = Field(None, max_length=100, description="UTM source parameter")
    utm_medium: Optional[str] = Field(None, max_length=100, description="UTM medium parameter")
    utm_campaign: Optional[str] = Field(None, max_length=100, description="UTM campaign parameter")

    @field_validator("platform")
    @classmethod
    def validate_platform(cls, v: str) -> str:
        allowed_platforms = [
            "netflix",
            "amazon",
            "apple_tv",
            "disney_plus",
            "hbo_max",
            "hulu",
            "paramount_plus",
            "peacock",
            "youtube",
            "vudu",
            "google_play",
            "microsoft",
            "other"
        ]
        v_lower = v.lower().replace(" ", "_")
        if v_lower not in allowed_platforms:
            # Allow custom platforms but normalize
            return v_lower
        return v_lower


class CriticAffiliateLinkUpdate(BaseModel):
    """Schema for updating an affiliate link"""
    label: Optional[str] = Field(None, min_length=3, max_length=100)
    platform: Optional[str] = None
    url: Optional[str] = Field(None, max_length=500)
    utm_source: Optional[str] = Field(None, max_length=100)
    utm_medium: Optional[str] = Field(None, max_length=100)
    utm_campaign: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None


class CriticAffiliateLinkResponse(BaseModel):
    """Schema for affiliate link response"""
    id: int
    external_id: str
    critic_username: str
    label: str
    platform: str
    url: str
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    click_count: int
    conversion_count: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AffiliateLinkClickRequest(BaseModel):
    """Schema for tracking affiliate link clicks"""
    referrer: Optional[str] = Field(None, max_length=500, description="Referrer URL")
    user_agent: Optional[str] = Field(None, max_length=500, description="User agent string")


class AffiliateLinkClickResponse(BaseModel):
    """Schema for affiliate link click response"""
    redirect_url: str
    click_tracked: bool = True

