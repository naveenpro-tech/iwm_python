"""
Admin RBAC Dependency Module

This module provides the `require_admin` dependency that enforces Role-Based Access Control (RBAC)
for admin endpoints. It checks if the current user has the ADMIN role and raises a 403 Forbidden
error if they don't.

Usage:
    @router.get("/admin/users")
    async def list_users(current_user: User = Depends(require_admin)):
        # Only admin users can access this endpoint
        ...

Author: IWM Development Team
Date: 2025-01-30
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..models import User, RoleType, UserRoleProfile
from .auth import get_current_user


async def require_admin(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> User:
    """
    Dependency that enforces admin role requirement.
    
    This dependency:
    1. Gets the current authenticated user via get_current_user
    2. Checks if the user has an ADMIN role profile that is enabled
    3. Raises 403 Forbidden if the user is not an admin
    
    Args:
        current_user: The authenticated user (from get_current_user dependency)
        session: Database session for querying role profiles
        
    Returns:
        User: The authenticated user if they have admin role
        
    Raises:
        HTTPException: 403 Forbidden if user doesn't have admin role
        
    Example:
        @router.get("/admin/users")
        async def list_users(admin_user: User = Depends(require_admin)):
            # admin_user is guaranteed to have ADMIN role
            return await get_all_users()
    """
    
    # Check if user has an enabled ADMIN role profile
    has_admin_role = any(
        role_profile.role_type == RoleType.ADMIN and role_profile.enabled
        for role_profile in current_user.role_profiles
    )
    
    if not has_admin_role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required. User does not have admin role.",
        )
    
    return current_user

