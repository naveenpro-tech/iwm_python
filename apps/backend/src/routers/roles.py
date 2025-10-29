"""Role Management API Router

Handles multi-role profile management for users.
Endpoints for creating, updating, activating, and deactivating user roles.
"""
from __future__ import annotations

from typing import Any, Optional, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..models import User
from ..dependencies.auth import get_current_user
from ..repositories.role_management import RoleManagementRepository

router = APIRouter(prefix="/roles", tags=["roles"])


def repo_dep(session: AsyncSession = Depends(get_session)) -> RoleManagementRepository:
    """Dependency to inject RoleManagementRepository into endpoints."""
    return RoleManagementRepository(session)


# ============================================================================
# Pydantic Models
# ============================================================================

class RoleProfileResponse(BaseModel):
    """Response model for a user role profile"""
    id: int
    user_id: int
    role_type: str
    enabled: bool
    visibility: str
    is_default: bool
    handle: Optional[str] = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class RoleProfileListResponse(BaseModel):
    """Response model for list of role profiles"""
    roles: List[RoleProfileResponse]
    total: int


class UpdateRoleProfileRequest(BaseModel):
    """Request model for updating a role profile"""
    enabled: Optional[bool] = None
    visibility: Optional[str] = Field(None, pattern="^(public|private|followers_only)$")
    is_default: Optional[bool] = None
    handle: Optional[str] = Field(None, max_length=100)


class ActivateRoleRequest(BaseModel):
    """Request model for activating a role"""
    handle: Optional[str] = Field(None, max_length=100)


class OnboardingWizardResponse(BaseModel):
    """Response model for onboarding wizard data"""
    role_profile_id: int
    role_type: str
    profile_created: bool
    profile_type: Optional[str] = None
    next_step: str


class TalentProfileUpdateRequest(BaseModel):
    """Request model for updating talent profile"""
    stage_name: Optional[str] = Field(None, max_length=200)
    bio: Optional[str] = None
    headshot_url: Optional[str] = Field(None, max_length=500)
    demo_reel_url: Optional[str] = Field(None, max_length=500)
    imdb_url: Optional[str] = Field(None, max_length=500)
    agent_name: Optional[str] = Field(None, max_length=200)
    agent_contact: Optional[str] = Field(None, max_length=200)
    skills: Optional[dict] = None
    experience_years: Optional[int] = None
    availability_status: Optional[str] = Field(None, pattern="^(available|busy|not_available)$")


class IndustryProfileUpdateRequest(BaseModel):
    """Request model for updating industry profile"""
    company_name: Optional[str] = Field(None, max_length=200)
    job_title: Optional[str] = Field(None, max_length=200)
    bio: Optional[str] = None
    profile_image_url: Optional[str] = Field(None, max_length=500)
    website_url: Optional[str] = Field(None, max_length=500)
    imdb_url: Optional[str] = Field(None, max_length=500)
    linkedin_url: Optional[str] = Field(None, max_length=500)
    notable_works: Optional[dict] = None
    specializations: Optional[dict] = None
    experience_years: Optional[int] = None
    accepting_projects: Optional[bool] = None


class TalentProfileResponse(BaseModel):
    """Response model for talent profile"""
    id: int
    user_id: int
    role_profile_id: Optional[int]
    stage_name: Optional[str]
    bio: Optional[str]
    headshot_url: Optional[str]
    demo_reel_url: Optional[str]
    imdb_url: Optional[str]
    agent_name: Optional[str]
    agent_contact: Optional[str]
    skills: Optional[dict]
    experience_years: Optional[int]
    availability_status: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class IndustryProfileResponse(BaseModel):
    """Response model for industry profile"""
    id: int
    user_id: int
    role_profile_id: Optional[int]
    company_name: Optional[str]
    job_title: Optional[str]
    bio: Optional[str]
    profile_image_url: Optional[str]
    website_url: Optional[str]
    imdb_url: Optional[str]
    linkedin_url: Optional[str]
    notable_works: Optional[dict]
    specializations: Optional[dict]
    experience_years: Optional[int]
    accepting_projects: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# ============================================================================
# E-1.5.1: GET /api/v1/roles - List all user roles
# ============================================================================

@router.get("", response_model=RoleProfileListResponse)
async def get_user_roles(
    current_user: User = Depends(get_current_user),
    repo: RoleManagementRepository = Depends(repo_dep),
) -> Any:
    """
    Get all role profiles for the current user.

    Returns all user_role_profiles with their enabled, visibility, is_default, and role_type.

    Args:
        current_user: The authenticated user (injected by dependency)
        repo: The role management repository (injected by dependency)

    Returns:
        RoleProfileListResponse: List of role profiles and total count

    Raises:
        HTTPException 401: If user is not authenticated
    """
    try:
        roles = await repo.get_user_roles(current_user.id)

        return RoleProfileListResponse(
            roles=[RoleProfileResponse.from_orm(role) for role in roles],
            total=len(roles)
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch roles")


# ============================================================================
# E-1.5.2: PUT /api/v1/roles/{role_type} - Update role profile
# ============================================================================

@router.put("/{role_type}", response_model=RoleProfileResponse)
async def update_role_profile(
    role_type: str,
    request: UpdateRoleProfileRequest,
    current_user: User = Depends(get_current_user),
    repo: RoleManagementRepository = Depends(repo_dep),
) -> Any:
    """
    Update a role profile for the current user.

    Updates enabled, visibility, is_default, and handle fields.
    Validates that only one role is marked as default per user.

    Args:
        role_type: The role type to update (e.g., 'lover', 'critic', 'talent', 'industry')
        request: The update request data
        current_user: The authenticated user (injected by dependency)
        repo: The role management repository (injected by dependency)

    Returns:
        RoleProfileResponse: The updated role profile

    Raises:
        HTTPException 400: If validation fails or role profile doesn't exist
        HTTPException 401: If user is not authenticated
        HTTPException 500: If database operation fails
    """
    try:
        # Find the role profile
        role_profile = await repo.get_role_profile(current_user.id, role_type)

        if not role_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role profile '{role_type}' not found for user"
            )

        # Update the role profile
        updates = request.dict(exclude_unset=True)
        role_profile = await repo.update_role_profile(role_profile, updates)

        return RoleProfileResponse.from_orm(role_profile)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update role profile")


# ============================================================================
# E-1.5.3: POST /api/v1/roles/{role_type}/activate - Activate a role
# ============================================================================

@router.post("/{role_type}/activate", response_model=OnboardingWizardResponse)
async def activate_role(
    role_type: str,
    request: ActivateRoleRequest,
    current_user: User = Depends(get_current_user),
    repo: RoleManagementRepository = Depends(repo_dep),
) -> Any:
    """
    Activate a role for the current user.

    Activates a role (enabled=true) and creates role-specific profile if needed.
    Returns onboarding wizard data for the frontend.

    Args:
        role_type: The role type to activate (e.g., 'talent', 'industry')
        request: The activation request data
        current_user: The authenticated user (injected by dependency)
        repo: The role management repository (injected by dependency)

    Returns:
        OnboardingWizardResponse: Onboarding wizard data

    Raises:
        HTTPException 400: If role profile doesn't exist or invalid role type
        HTTPException 401: If user is not authenticated
        HTTPException 500: If database operation fails
    """
    try:
        # Activate the role
        role_profile, profile_created, profile_type = await repo.activate_role(
            current_user.id, role_type, request.handle
        )

        return OnboardingWizardResponse(
            role_profile_id=role_profile.id,
            role_type=role_type,
            profile_created=profile_created,
            profile_type=profile_type,
            next_step="complete_profile" if profile_created else "done"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to activate role")


# ============================================================================
# E-1.5.4: POST /api/v1/roles/{role_type}/deactivate - Deactivate a role
# ============================================================================

@router.post("/{role_type}/deactivate", response_model=RoleProfileResponse)
async def deactivate_role(
    role_type: str,
    current_user: User = Depends(get_current_user),
    repo: RoleManagementRepository = Depends(repo_dep),
) -> Any:
    """
    Deactivate a role for the current user.

    Deactivates a role (enabled=false, visibility=private).
    Preserves all data (no deletion).
    Prevents deactivating the last enabled role.

    Args:
        role_type: The role type to deactivate
        current_user: The authenticated user (injected by dependency)
        repo: The role management repository (injected by dependency)

    Returns:
        RoleProfileResponse: The deactivated role profile

    Raises:
        HTTPException 400: If role profile doesn't exist or is the last enabled role
        HTTPException 401: If user is not authenticated
        HTTPException 500: If database operation fails
    """
    try:
        # Deactivate the role
        role_profile = await repo.deactivate_role(current_user.id, role_type)

        return RoleProfileResponse.from_orm(role_profile)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to deactivate role")


# ============================================================================
# E-1.5.5: GET /api/v1/roles/{role_type} - Get role profile details
# ============================================================================

@router.get("/{role_type}", response_model=Any)
async def get_role_profile(
    role_type: str,
    current_user: User = Depends(get_current_user),
    repo: RoleManagementRepository = Depends(repo_dep),
) -> Any:
    """
    Get role profile details for a specific role type.

    Returns role profile details including role-specific fields.
    For 'talent' role, returns TalentProfile data.
    For 'industry' role, returns IndustryProfile data.
    For 'critic' role, returns CriticProfile data.

    Args:
        role_type: The role type to fetch (e.g., 'lover', 'critic', 'talent', 'industry')
        current_user: The authenticated user (injected by dependency)
        repo: The role management repository (injected by dependency)

    Returns:
        Role-specific profile response

    Raises:
        HTTPException 404: If role profile doesn't exist
        HTTPException 401: If user is not authenticated
        HTTPException 500: If database operation fails
    """
    try:
        # Get the role profile
        role_profile = await repo.get_role_profile(current_user.id, role_type)

        if not role_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Role profile '{role_type}' not found"
            )

        # Get role-specific profile
        if role_type == "talent":
            talent_profile = await repo.get_talent_profile(current_user.id)
            return TalentProfileResponse.from_orm(talent_profile) if talent_profile else None

        elif role_type == "industry":
            industry_profile = await repo.get_industry_profile(current_user.id)
            return IndustryProfileResponse.from_orm(industry_profile) if industry_profile else None

        elif role_type == "critic":
            critic_profile = await repo.get_critic_profile(current_user.id)
            return critic_profile

        else:
            return RoleProfileResponse.from_orm(role_profile)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch role profile")


# ============================================================================
# E-1.5.6: PUT /api/v1/roles/{role_type} profile update - Update role-specific profile
# ============================================================================

@router.put("/{role_type}/profile", response_model=Any)
async def update_role_specific_profile(
    role_type: str,
    request: Any,
    current_user: User = Depends(get_current_user),
    repo: RoleManagementRepository = Depends(repo_dep),
) -> Any:
    """
    Update role-specific profile fields.

    Updates role-specific profile data (e.g., TalentProfile.headshot_url).
    Validates role-specific constraints.

    Args:
        role_type: The role type to update
        request: The update request data (TalentProfileUpdateRequest or IndustryProfileUpdateRequest)
        current_user: The authenticated user (injected by dependency)
        repo: The role management repository (injected by dependency)

    Returns:
        Updated role-specific profile response

    Raises:
        HTTPException 400: If validation fails or profile doesn't exist
        HTTPException 401: If user is not authenticated
        HTTPException 500: If database operation fails
    """
    try:
        if role_type == "talent":
            talent_profile = await repo.get_talent_profile(current_user.id)

            if not talent_profile:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Talent profile not found"
                )

            # Update fields
            updates = request.dict(exclude_unset=True)
            talent_profile = await repo.update_talent_profile(talent_profile, updates)
            return TalentProfileResponse.from_orm(talent_profile)

        elif role_type == "industry":
            industry_profile = await repo.get_industry_profile(current_user.id)

            if not industry_profile:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Industry profile not found"
                )

            # Update fields
            updates = request.dict(exclude_unset=True)
            industry_profile = await repo.update_industry_profile(industry_profile, updates)
            return IndustryProfileResponse.from_orm(industry_profile)

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported role type: {role_type}"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update role profile")

