"""Critic Hub - Verification API Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from typing import List, Optional

from ..db import get_session
from ..repositories.critic_verification import CriticVerificationRepository
from ..repositories.critics import CriticRepository
from ..dependencies.auth import get_current_user
from ..models import User


router = APIRouter(prefix="/critic-verification", tags=["critic-verification"])


# --- Pydantic Models ---
class PlatformLink(BaseModel):
    platform: str = Field(..., max_length=50)
    url: str = Field(..., max_length=500)


class ApplicationCreate(BaseModel):
    requested_username: str = Field(..., min_length=3, max_length=100)
    requested_display_name: str = Field(..., min_length=2, max_length=200)
    bio: str = Field(..., min_length=100, max_length=1000)
    platform_links: List[PlatformLink] = Field(..., min_items=1)
    sample_review_urls: List[str] = Field(..., min_items=2, max_items=5)
    metrics: Optional[dict] = None
    other_platforms: Optional[dict] = None


class ApplicationResponse(BaseModel):
    id: int
    external_id: str
    user_id: int
    requested_username: str
    requested_display_name: str
    bio: str
    platform_links: List[dict]
    sample_review_urls: List[str]
    metrics: Optional[dict]
    other_platforms: Optional[dict]
    status: str
    admin_notes: Optional[str]
    rejection_reason: Optional[str]
    reviewed_by: Optional[int]
    reviewed_at: Optional[str]
    submitted_at: str

    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected)$")
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


# --- Endpoints ---
@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def submit_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """Submit a critic verification application"""
    # Check if user already has a critic profile
    critic_repo = CriticRepository(db)
    existing_critic = await critic_repo.get_critic_by_user_id(current_user.id)
    
    if existing_critic:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a critic profile"
        )
    
    # Check if user already has a pending application
    verification_repo = CriticVerificationRepository(db)
    existing_application = await verification_repo.get_application_by_user_id(current_user.id)
    
    if existing_application and existing_application.status == "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a pending application"
        )
    
    # Check if username is already taken
    existing_username = await critic_repo.get_critic_by_username(application_data.requested_username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create application
    application = await verification_repo.create_application(
        user_id=current_user.id,
        requested_username=application_data.requested_username,
        requested_display_name=application_data.requested_display_name,
        bio=application_data.bio,
        platform_links=[link.dict() for link in application_data.platform_links],
        sample_review_urls=application_data.sample_review_urls,
        metrics=application_data.metrics,
        other_platforms=application_data.other_platforms
    )
    
    return ApplicationResponse(
        **{
            **application.__dict__,
            "submitted_at": application.submitted_at.isoformat(),
            "reviewed_at": application.reviewed_at.isoformat() if application.reviewed_at else None
        }
    )


@router.get("/my-application", response_model=ApplicationResponse)
async def get_my_application(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """Get current user's most recent application"""
    verification_repo = CriticVerificationRepository(db)
    application = await verification_repo.get_application_by_user_id(current_user.id)
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No application found"
        )
    
    return ApplicationResponse(
        **{
            **application.__dict__,
            "submitted_at": application.submitted_at.isoformat(),
            "reviewed_at": application.reviewed_at.isoformat() if application.reviewed_at else None
        }
    )


@router.get("/admin/applications", response_model=List[ApplicationResponse])
async def list_applications(
    status_filter: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """List all verification applications (admin only)"""
    # TODO: Add admin role check
    # For now, any authenticated user can access this
    
    verification_repo = CriticVerificationRepository(db)
    applications = await verification_repo.list_applications(
        status=status_filter,
        limit=limit,
        offset=offset
    )
    
    return [
        ApplicationResponse(
            **{
                **app.__dict__,
                "submitted_at": app.submitted_at.isoformat(),
                "reviewed_at": app.reviewed_at.isoformat() if app.reviewed_at else None
            }
        )
        for app in applications
    ]


@router.put("/admin/applications/{application_id}", response_model=ApplicationResponse)
async def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """Update application status (admin only)"""
    # TODO: Add admin role check
    
    verification_repo = CriticVerificationRepository(db)
    application = await verification_repo.get_application_by_id(application_id)
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # If approving, create critic profile
    if status_update.status == "approved":
        critic_repo = CriticRepository(db)
        
        # Check if username is still available
        existing_username = await critic_repo.get_critic_by_username(application.requested_username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username no longer available"
            )
        
        # Create critic profile
        await critic_repo.create_critic_profile(
            user_id=application.user_id,
            username=application.requested_username,
            display_name=application.requested_display_name,
            bio=application.bio,
            is_verified=True,
            verification_level="verified"
        )
        
        # Add social links
        for link in application.platform_links:
            await critic_repo.add_social_link(
                critic_id=(await critic_repo.get_critic_by_username(application.requested_username)).id,
                platform=link.get('platform'),
                url=link.get('url')
            )
    
    # Update application status
    updated_application = await verification_repo.update_application_status(
        application_id=application_id,
        status=status_update.status,
        reviewed_by=current_user.id,
        admin_notes=status_update.admin_notes,
        rejection_reason=status_update.rejection_reason
    )
    
    return ApplicationResponse(
        **{
            **updated_application.__dict__,
            "submitted_at": updated_application.submitted_at.isoformat(),
            "reviewed_at": updated_application.reviewed_at.isoformat() if updated_application.reviewed_at else None
        }
    )

