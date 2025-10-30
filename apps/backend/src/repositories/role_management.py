"""Role Management Repository

Handles all database operations for role management.
Provides methods for managing user roles, role profiles, and role-specific profiles.
"""
from __future__ import annotations

from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import UserRoleProfile, TalentProfile, IndustryProfile, CriticProfile, AdminUserMeta


class RoleManagementRepository:
    """Repository for role management database operations."""

    def __init__(self, session: AsyncSession):
        """
        Initialize repository with database session.

        Args:
            session: SQLAlchemy async session for database operations
        """
        self.session = session

    # ========================================================================
    # UserRoleProfile Methods
    # ========================================================================

    async def get_user_roles(self, user_id: int) -> List[UserRoleProfile]:
        """
        Fetch all role profiles for a user.

        Args:
            user_id: The user's ID

        Returns:
            List of UserRoleProfile objects, empty list if none found
        """
        try:
            query = select(UserRoleProfile).where(UserRoleProfile.user_id == user_id)
            result = await self.session.execute(query)
            return result.scalars().all()
        except Exception:
            return []

    async def get_role_profile(self, user_id: int, role_type: str) -> UserRoleProfile | None:
        """
        Fetch a specific role profile by user_id and role_type.

        Args:
            user_id: The user's ID
            role_type: The role type (e.g., 'lover', 'critic', 'talent', 'industry')

        Returns:
            UserRoleProfile object if found, None otherwise
        """
        query = select(UserRoleProfile).where(
            and_(
                UserRoleProfile.user_id == user_id,
                UserRoleProfile.role_type == role_type
            )
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def update_role_profile(
        self, role_profile: UserRoleProfile, updates: Dict[str, Any]
    ) -> UserRoleProfile:
        """
        Update role profile fields.

        If setting is_default=True, automatically unsets all other defaults for this user.

        Args:
            role_profile: The UserRoleProfile object to update
            updates: Dictionary of fields to update (enabled, visibility, is_default, handle)

        Returns:
            Updated UserRoleProfile object
        """
        try:
            # If setting as default, unset other defaults
            if updates.get("is_default"):
                other_defaults = select(UserRoleProfile).where(
                    and_(
                        UserRoleProfile.user_id == role_profile.user_id,
                        UserRoleProfile.is_default == True,
                        UserRoleProfile.id != role_profile.id
                    )
                )
                result = await self.session.execute(other_defaults)
                for other in result.scalars().all():
                    other.is_default = False

            # Update fields
            for key, value in updates.items():
                if value is not None and hasattr(role_profile, key):
                    setattr(role_profile, key, value)

            await self.session.commit()
            await self.session.refresh(role_profile)
            return role_profile
        except Exception:
            await self.session.rollback()
            raise

    async def activate_role(
        self, user_id: int, role_type: str, handle: str | None = None
    ) -> Tuple[UserRoleProfile, bool, str | None]:
        """
        Activate a role and create role-specific profile if needed.

        Args:
            user_id: The user's ID
            role_type: The role type to activate
            handle: Optional custom handle for the role

        Returns:
            Tuple of (role_profile, profile_created: bool, profile_type: str | None)
        """
        try:
            # Get the role profile
            role_profile = await self.get_role_profile(user_id, role_type)
            if not role_profile:
                raise ValueError(f"Role profile '{role_type}' not found")

            # Activate the role
            role_profile.enabled = True
            if handle:
                role_profile.handle = handle

            # Update AdminUserMeta.roles to include this role
            admin_meta_query = select(AdminUserMeta).where(AdminUserMeta.user_id == user_id)
            admin_meta_result = await self.session.execute(admin_meta_query)
            admin_meta = admin_meta_result.scalar_one_or_none()

            if admin_meta and role_type not in admin_meta.roles:
                admin_meta.roles = list(set(admin_meta.roles + [role_type]))

            # Create role-specific profile if needed
            profile_created = False
            profile_type = None

            if role_type == "talent":
                talent_query = select(TalentProfile).where(TalentProfile.user_id == user_id)
                talent_result = await self.session.execute(talent_query)
                talent_profile = talent_result.scalar_one_or_none()

                if not talent_profile:
                    talent_profile = TalentProfile(
                        user_id=user_id,
                        role_profile_id=role_profile.id
                    )
                    self.session.add(talent_profile)
                    profile_created = True
                    profile_type = "talent"

            elif role_type == "industry":
                industry_query = select(IndustryProfile).where(IndustryProfile.user_id == user_id)
                industry_result = await self.session.execute(industry_query)
                industry_profile = industry_result.scalar_one_or_none()

                if not industry_profile:
                    industry_profile = IndustryProfile(
                        user_id=user_id,
                        role_profile_id=role_profile.id
                    )
                    self.session.add(industry_profile)
                    profile_created = True
                    profile_type = "industry"

            await self.session.commit()
            await self.session.refresh(role_profile)
            return role_profile, profile_created, profile_type
        except Exception:
            await self.session.rollback()
            raise

    async def deactivate_role(self, user_id: int, role_type: str) -> UserRoleProfile:
        """
        Deactivate a role.

        Prevents deactivating the last enabled role.
        If deactivating the default role, sets another enabled role as default.

        Args:
            user_id: The user's ID
            role_type: The role type to deactivate

        Returns:
            Updated UserRoleProfile object

        Raises:
            ValueError: If attempting to deactivate the last enabled role
        """
        try:
            # Get the role profile
            role_profile = await self.get_role_profile(user_id, role_type)
            if not role_profile:
                raise ValueError(f"Role profile '{role_type}' not found")

            # Check if this is the last enabled role
            enabled_query = select(UserRoleProfile).where(
                and_(
                    UserRoleProfile.user_id == user_id,
                    UserRoleProfile.enabled == True
                )
            )
            result = await self.session.execute(enabled_query)
            enabled_roles = result.scalars().all()

            if len(enabled_roles) == 1 and enabled_roles[0].id == role_profile.id:
                raise ValueError("Cannot deactivate the last enabled role")

            # Deactivate the role
            role_profile.enabled = False
            role_profile.visibility = "private"

            # Update AdminUserMeta.roles to remove this role
            admin_meta_query = select(AdminUserMeta).where(AdminUserMeta.user_id == user_id)
            admin_meta_result = await self.session.execute(admin_meta_query)
            admin_meta = admin_meta_result.scalar_one_or_none()

            if admin_meta and role_type in admin_meta.roles:
                admin_meta.roles = [r for r in admin_meta.roles if r != role_type]

            # If this was the default role, set another as default
            if role_profile.is_default:
                role_profile.is_default = False
                for other_role in enabled_roles:
                    if other_role.id != role_profile.id:
                        other_role.is_default = True
                        break

            await self.session.commit()
            await self.session.refresh(role_profile)
            return role_profile
        except Exception:
            await self.session.rollback()
            raise

    # ========================================================================
    # Role-Specific Profile Methods
    # ========================================================================

    async def get_talent_profile(self, user_id: int) -> TalentProfile | None:
        """
        Fetch talent profile for a user.

        Args:
            user_id: The user's ID

        Returns:
            TalentProfile object if found, None otherwise
        """
        query = select(TalentProfile).where(TalentProfile.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_industry_profile(self, user_id: int) -> IndustryProfile | None:
        """
        Fetch industry profile for a user.

        Args:
            user_id: The user's ID

        Returns:
            IndustryProfile object if found, None otherwise
        """
        query = select(IndustryProfile).where(IndustryProfile.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_critic_profile(self, user_id: int) -> CriticProfile | None:
        """
        Fetch critic profile for a user.

        Args:
            user_id: The user's ID

        Returns:
            CriticProfile object if found, None otherwise
        """
        query = select(CriticProfile).where(CriticProfile.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def update_talent_profile(
        self, talent_profile: TalentProfile, updates: Dict[str, Any]
    ) -> TalentProfile:
        """
        Update talent profile fields.

        Args:
            talent_profile: The TalentProfile object to update
            updates: Dictionary of fields to update

        Returns:
            Updated TalentProfile object
        """
        try:
            for key, value in updates.items():
                if value is not None and hasattr(talent_profile, key):
                    setattr(talent_profile, key, value)

            await self.session.commit()
            await self.session.refresh(talent_profile)
            return talent_profile
        except Exception:
            await self.session.rollback()
            raise

    async def update_industry_profile(
        self, industry_profile: IndustryProfile, updates: Dict[str, Any]
    ) -> IndustryProfile:
        """
        Update industry profile fields.

        Args:
            industry_profile: The IndustryProfile object to update
            updates: Dictionary of fields to update

        Returns:
            Updated IndustryProfile object
        """
        try:
            for key, value in updates.items():
                if value is not None and hasattr(industry_profile, key):
                    setattr(industry_profile, key, value)

            await self.session.commit()
            await self.session.refresh(industry_profile)
            return industry_profile
        except Exception:
            await self.session.rollback()
            raise

