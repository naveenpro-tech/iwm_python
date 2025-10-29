"""
User Roles Router
Handles role management for multi-role users:
- GET /api/v1/users/me/roles - Get all available roles for current user
- GET /api/v1/users/me/active-role - Get current active role
- POST /api/v1/users/me/active-role - Set active role
"""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..models import User, AdminUserMeta
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


# ============================================================================
# Pydantic Models
# ============================================================================

class RoleMetadata(BaseModel):
    """Metadata for a user role"""
    id: str
    name: str
    description: str
    icon: str | None = None


class RoleInfo(BaseModel):
    """Role information with metadata"""
    role: str
    name: str
    description: str
    icon: str | None = None
    is_active: bool = False


class RolesListResponse(BaseModel):
    """Response for listing user roles"""
    roles: list[RoleInfo]
    active_role: str | None = None


class SetActiveRoleRequest(BaseModel):
    """Request to set active role"""
    role: str


class ActiveRoleResponse(BaseModel):
    """Response for active role endpoint"""
    active_role: str
    role_name: str
    role_description: str
    role_icon: str | None = None


# ============================================================================
# Role Metadata
# ============================================================================

ROLE_METADATA = {
    "lover": {
        "name": "Movie Lover",
        "description": "Discover, rate, and review movies",
        "icon": "heart",
    },
    "critic": {
        "name": "Critic",
        "description": "Write professional reviews and analysis",
        "icon": "star",
    },
    "talent": {
        "name": "Talent",
        "description": "Showcase your portfolio and find opportunities",
        "icon": "user",
    },
    "industry": {
        "name": "Industry Pro",
        "description": "Connect with industry professionals",
        "icon": "briefcase",
    },
}


# ============================================================================
# Endpoints
# ============================================================================

@router.get("/me/roles", response_model=RolesListResponse)
async def get_user_roles(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    Get all available roles for the current user.

    Returns:
    - List of roles from AdminUserMeta.roles
    - Current active role
    - Role metadata (name, description, icon)

    Requires: Valid JWT access token
    Returns: 401 Unauthorized if token is invalid or missing
    """
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"Getting roles for user {current_user.id}")

    # Fetch AdminUserMeta to get roles
    admin_meta_query = select(AdminUserMeta).where(AdminUserMeta.user_id == current_user.id)
    admin_meta_result = await session.execute(admin_meta_query)
    admin_meta = admin_meta_result.scalar_one_or_none()

    logger.info(f"AdminUserMeta found: {admin_meta is not None}")
    if admin_meta:
        logger.info(f"AdminUserMeta roles: {admin_meta.roles}")

    roles_list = admin_meta.roles if admin_meta else ["lover"]  # Default to lover role
    
    # Build role info list
    role_infos = []
    for role in roles_list:
        metadata = ROLE_METADATA.get(role, {})
        role_infos.append(
            RoleInfo(
                role=role,
                name=metadata.get("name", role.capitalize()),
                description=metadata.get("description", ""),
                icon=metadata.get("icon"),
                is_active=(role == current_user.active_role),
            )
        )
    
    return RolesListResponse(
        roles=role_infos,
        active_role=current_user.active_role or "lover",
    )


@router.get("/me/active-role", response_model=ActiveRoleResponse)
async def get_active_role(
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current active role for the user.
    
    Returns:
    - Current active role
    - Role metadata (name, description, icon)
    
    Requires: Valid JWT access token
    Returns: 401 Unauthorized if token is invalid or missing
    """
    active_role = current_user.active_role or "lover"
    metadata = ROLE_METADATA.get(active_role, {})
    
    return ActiveRoleResponse(
        active_role=active_role,
        role_name=metadata.get("name", active_role.capitalize()),
        role_description=metadata.get("description", ""),
        role_icon=metadata.get("icon"),
    )


@router.post("/me/active-role", response_model=ActiveRoleResponse)
async def set_active_role(
    body: SetActiveRoleRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    Set the active role for the current user.
    
    Request body:
    - role: The role to set as active (must be in user's available roles)
    
    Returns:
    - Updated active role
    - Role metadata (name, description, icon)
    
    Requires: Valid JWT access token
    Returns: 
    - 401 Unauthorized if token is invalid or missing
    - 400 Bad Request if role is not in user's available roles
    """
    # Fetch AdminUserMeta to validate role
    admin_meta_query = select(AdminUserMeta).where(AdminUserMeta.user_id == current_user.id)
    admin_meta_result = await session.execute(admin_meta_query)
    admin_meta = admin_meta_result.scalar_one_or_none()
    
    available_roles = admin_meta.roles if admin_meta else ["lover"]
    
    # Validate role exists in user's available roles
    if body.role not in available_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role '{body.role}' is not available for this user",
        )
    
    # Update active role
    current_user.active_role = body.role
    session.add(current_user)
    await session.commit()
    
    metadata = ROLE_METADATA.get(body.role, {})
    
    return ActiveRoleResponse(
        active_role=body.role,
        role_name=metadata.get("name", body.role.capitalize()),
        role_description=metadata.get("description", ""),
        role_icon=metadata.get("icon"),
    )

