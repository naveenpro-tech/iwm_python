"""
Tests for user roles API endpoints
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from ..src.main import app
from ..src.models import User, AdminUserMeta
from ..src.security.jwt_utils import create_access_token
from ..src.db import get_session


@pytest.fixture
async def test_user(session: AsyncSession):
    """Create a test user with roles"""
    user = User(
        external_id="roletest@example.com",
        email="roletest@example.com",
        name="Role Test User",
        hashed_password="hashed_password",
    )
    session.add(user)
    await session.flush()
    
    # Create AdminUserMeta with roles
    admin_meta = AdminUserMeta(
        user_id=user.id,
        email=user.email,
        roles=["lover", "critic", "talent"],
        status="Active",
    )
    session.add(admin_meta)
    await session.commit()
    
    return user


@pytest.mark.asyncio
async def test_get_user_roles(test_user: User):
    """Test GET /api/v1/users/me/roles"""
    token = create_access_token(str(test_user.id))
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/api/v1/users/me/roles",
            headers={"Authorization": f"Bearer {token}"},
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "roles" in data
    assert "active_role" in data
    assert len(data["roles"]) == 3
    assert data["roles"][0]["role"] in ["lover", "critic", "talent"]


@pytest.mark.asyncio
async def test_get_active_role(test_user: User):
    """Test GET /api/v1/users/me/active-role"""
    token = create_access_token(str(test_user.id))
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/api/v1/users/me/active-role",
            headers={"Authorization": f"Bearer {token}"},
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "active_role" in data
    assert "role_name" in data
    assert "role_description" in data


@pytest.mark.asyncio
async def test_set_active_role(test_user: User):
    """Test POST /api/v1/users/me/active-role"""
    token = create_access_token(str(test_user.id))
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/users/me/active-role",
            headers={"Authorization": f"Bearer {token}"},
            json={"role": "critic"},
        )
    
    assert response.status_code == 200
    data = response.json()
    assert data["active_role"] == "critic"
    assert data["role_name"] == "Critic"


@pytest.mark.asyncio
async def test_set_invalid_role(test_user: User):
    """Test POST /api/v1/users/me/active-role with invalid role"""
    token = create_access_token(str(test_user.id))
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/users/me/active-role",
            headers={"Authorization": f"Bearer {token}"},
            json={"role": "invalid_role"},
        )
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_unauthorized_access():
    """Test endpoints without authentication"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/users/me/roles")
    
    assert response.status_code == 401

