"""
Tests for Role Management System
Tests role activation, deactivation, and enabled status in role listing
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.models import User, AdminUserMeta, UserRoleProfile
from src.auth import hash_password, create_access_token


@pytest.fixture
async def test_user_with_lover_only(session: AsyncSession):
    """Create a test user with only lover role (new signup behavior)"""
    user = User(
        external_id="rolemanagement@example.com",
        email="rolemanagement@example.com",
        name="Role Management Test User",
        hashed_password=hash_password("testpassword123"),
        active_role="lover",
    )
    session.add(user)
    await session.flush()
    
    # Create AdminUserMeta with only lover role (new default)
    admin_meta = AdminUserMeta(
        user_id=user.id,
        email=user.email,
        roles=["lover"],
        status="Active",
    )
    session.add(admin_meta)
    
    # Create UserRoleProfile for lover role
    lover_profile = UserRoleProfile(
        user_id=user.id,
        role_type="lover",
        enabled=True,
        visibility="public",
        is_default=True,
    )
    session.add(lover_profile)
    
    await session.commit()
    await session.refresh(user)
    
    return user


@pytest.mark.asyncio
async def test_get_roles_includes_enabled_status(
    client: AsyncClient,
    test_user_with_lover_only: User,
):
    """Test that GET /api/v1/users/me/roles includes enabled status"""
    token = create_access_token(str(test_user_with_lover_only.id))
    
    response = await client.get(
        "/api/v1/users/me/roles",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "roles" in data
    assert len(data["roles"]) == 1
    
    lover_role = data["roles"][0]
    assert lover_role["role"] == "lover"
    assert "enabled" in lover_role
    assert lover_role["enabled"] is True


@pytest.mark.asyncio
async def test_activate_critic_role(
    client: AsyncClient,
    test_user_with_lover_only: User,
    session: AsyncSession,
):
    """Test activating critic role"""
    token = create_access_token(str(test_user_with_lover_only.id))
    
    # First, add critic to AdminUserMeta.roles
    admin_meta_query = select(AdminUserMeta).where(AdminUserMeta.user_id == test_user_with_lover_only.id)
    admin_meta_result = await session.execute(admin_meta_query)
    admin_meta = admin_meta_result.scalar_one()
    admin_meta.roles = ["lover", "critic"]
    await session.commit()
    
    # Activate critic role
    response = await client.post(
        "/api/v1/roles/critic/activate",
        headers={"Authorization": f"Bearer {token}"},
        json={"handle": None},
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["role_type"] == "critic"
    assert data["profile_created"] is True
    
    # Verify role is now enabled in GET /api/v1/users/me/roles
    roles_response = await client.get(
        "/api/v1/users/me/roles",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert roles_response.status_code == 200
    roles_data = roles_response.json()
    
    critic_role = next((r for r in roles_data["roles"] if r["role"] == "critic"), None)
    assert critic_role is not None
    assert critic_role["enabled"] is True


@pytest.mark.asyncio
async def test_deactivate_role(
    client: AsyncClient,
    test_user_with_lover_only: User,
    session: AsyncSession,
):
    """Test deactivating a role"""
    token = create_access_token(str(test_user_with_lover_only.id))
    
    # First, add and activate critic role
    admin_meta_query = select(AdminUserMeta).where(AdminUserMeta.user_id == test_user_with_lover_only.id)
    admin_meta_result = await session.execute(admin_meta_query)
    admin_meta = admin_meta_result.scalar_one()
    admin_meta.roles = ["lover", "critic"]
    await session.commit()
    
    await client.post(
        "/api/v1/roles/critic/activate",
        headers={"Authorization": f"Bearer {token}"},
        json={"handle": None},
    )
    
    # Now deactivate critic role
    response = await client.post(
        "/api/v1/roles/critic/deactivate",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["role_type"] == "critic"
    assert data["enabled"] is False
    assert data["visibility"] == "private"
    
    # Verify role is now disabled in GET /api/v1/users/me/roles
    roles_response = await client.get(
        "/api/v1/users/me/roles",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert roles_response.status_code == 200
    roles_data = roles_response.json()
    
    critic_role = next((r for r in roles_data["roles"] if r["role"] == "critic"), None)
    assert critic_role is not None
    assert critic_role["enabled"] is False


@pytest.mark.asyncio
async def test_cannot_deactivate_last_enabled_role(
    client: AsyncClient,
    test_user_with_lover_only: User,
):
    """Test that deactivating the last enabled role fails"""
    token = create_access_token(str(test_user_with_lover_only.id))
    
    # Try to deactivate lover role (the only enabled role)
    response = await client.post(
        "/api/v1/roles/lover/deactivate",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert response.status_code == 400
    data = response.json()
    assert "last enabled role" in data["detail"].lower()


@pytest.mark.asyncio
async def test_new_signup_gets_only_lover_role(
    client: AsyncClient,
    session: AsyncSession,
):
    """Test that new signups get only lover role by default"""
    # Signup new user
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "newsignup@example.com",
            "password": "testpassword123",
            "name": "New Signup User",
        },
    )
    
    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]
    
    # Get roles for new user
    roles_response = await client.get(
        "/api/v1/users/me/roles",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert roles_response.status_code == 200
    roles_data = roles_response.json()
    
    # Should only have lover role
    assert len(roles_data["roles"]) == 1
    assert roles_data["roles"][0]["role"] == "lover"
    assert roles_data["roles"][0]["enabled"] is True


@pytest.mark.asyncio
async def test_role_data_preserved_after_deactivation(
    client: AsyncClient,
    test_user_with_lover_only: User,
    session: AsyncSession,
):
    """Test that role data is preserved when role is deactivated"""
    token = create_access_token(str(test_user_with_lover_only.id))
    
    # Add and activate critic role
    admin_meta_query = select(AdminUserMeta).where(AdminUserMeta.user_id == test_user_with_lover_only.id)
    admin_meta_result = await session.execute(admin_meta_query)
    admin_meta = admin_meta_result.scalar_one()
    admin_meta.roles = ["lover", "critic"]
    await session.commit()
    
    await client.post(
        "/api/v1/roles/critic/activate",
        headers={"Authorization": f"Bearer {token}"},
        json={"handle": "test_critic"},
    )
    
    # Update critic profile with some data
    await client.put(
        "/api/v1/roles/critic/profile",
        headers={"Authorization": f"Bearer {token}"},
        json={"bio": "Test critic bio"},
    )
    
    # Deactivate critic role
    await client.post(
        "/api/v1/roles/critic/deactivate",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    # Re-activate critic role
    await client.post(
        "/api/v1/roles/critic/activate",
        headers={"Authorization": f"Bearer {token}"},
        json={"handle": None},
    )
    
    # Verify data is still there
    profile_response = await client.get(
        "/api/v1/roles/critic",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert profile_response.status_code == 200
    profile_data = profile_response.json()
    
    assert profile_data["critic_profile"]["bio"] == "Test critic bio"

