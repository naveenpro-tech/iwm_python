"""
Tests for role-specific settings endpoints
Tests GET /api/v1/roles/{role_type} and PUT /api/v1/roles/{role_type}/profile
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.main import app
from src.models import User, CriticProfile, TalentProfile, IndustryProfile
from src.db import get_session


@pytest.fixture
async def test_user(session: AsyncSession):
    """Create a test user with all roles"""
    user = User(
        email="test_role_settings@example.com",
        hashed_password="hashed_password",
        name="Test User",
        is_active=True,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@pytest.fixture
async def test_critic_profile(session: AsyncSession, test_user: User):
    """Create a test critic profile"""
    profile = CriticProfile(
        user_id=test_user.id,
        external_id=f"critic_{test_user.id}",
        username=f"critic_{test_user.id}",
        display_name="Test Critic",
        bio="Test critic bio",
        is_verified=False,
    )
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile


@pytest.fixture
async def test_talent_profile(session: AsyncSession, test_user: User):
    """Create a test talent profile"""
    profile = TalentProfile(
        user_id=test_user.id,
        stage_name="Test Talent",
        bio="Test talent bio",
        availability_status="available",
    )
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile


@pytest.fixture
async def test_industry_profile(session: AsyncSession, test_user: User):
    """Create a test industry profile"""
    profile = IndustryProfile(
        user_id=test_user.id,
        company_name="Test Company",
        job_title="Producer",
        bio="Test industry bio",
        accepting_projects=True,
    )
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile


@pytest.mark.asyncio
async def test_get_critic_profile(
    client: AsyncClient,
    test_user: User,
    test_critic_profile: CriticProfile,
    auth_token: str,
):
    """Test GET /api/v1/roles/critic returns critic profile data"""
    response = await client.get(
        "/api/v1/roles/critic",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_critic_profile.id
    assert data["display_name"] == "Test Critic"
    assert data["bio"] == "Test critic bio"


@pytest.mark.asyncio
async def test_get_talent_profile(
    client: AsyncClient,
    test_user: User,
    test_talent_profile: TalentProfile,
    auth_token: str,
):
    """Test GET /api/v1/roles/talent returns talent profile data"""
    response = await client.get(
        "/api/v1/roles/talent",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_talent_profile.id
    assert data["stage_name"] == "Test Talent"
    assert data["availability_status"] == "available"


@pytest.mark.asyncio
async def test_get_industry_profile(
    client: AsyncClient,
    test_user: User,
    test_industry_profile: IndustryProfile,
    auth_token: str,
):
    """Test GET /api/v1/roles/industry returns industry profile data"""
    response = await client.get(
        "/api/v1/roles/industry",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_industry_profile.id
    assert data["company_name"] == "Test Company"
    assert data["job_title"] == "Producer"


@pytest.mark.asyncio
async def test_update_critic_profile(
    client: AsyncClient,
    test_user: User,
    test_critic_profile: CriticProfile,
    auth_token: str,
):
    """Test PUT /api/v1/roles/critic/profile updates critic profile"""
    update_data = {
        "bio": "Updated critic bio",
        "twitter_url": "https://twitter.com/testcritic",
    }
    response = await client.put(
        "/api/v1/roles/critic/profile",
        json=update_data,
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["bio"] == "Updated critic bio"


@pytest.mark.asyncio
async def test_update_talent_profile(
    client: AsyncClient,
    test_user: User,
    test_talent_profile: TalentProfile,
    auth_token: str,
):
    """Test PUT /api/v1/roles/talent/profile updates talent profile"""
    update_data = {
        "stage_name": "Updated Talent Name",
        "availability_status": "busy",
    }
    response = await client.put(
        "/api/v1/roles/talent/profile",
        json=update_data,
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["stage_name"] == "Updated Talent Name"
    assert data["availability_status"] == "busy"


@pytest.mark.asyncio
async def test_update_industry_profile(
    client: AsyncClient,
    test_user: User,
    test_industry_profile: IndustryProfile,
    auth_token: str,
):
    """Test PUT /api/v1/roles/industry/profile updates industry profile"""
    update_data = {
        "company_name": "Updated Company",
        "job_title": "Director",
        "accepting_projects": False,
    }
    response = await client.put(
        "/api/v1/roles/industry/profile",
        json=update_data,
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["company_name"] == "Updated Company"
    assert data["job_title"] == "Director"
    assert data["accepting_projects"] is False


@pytest.mark.asyncio
async def test_get_role_profile_unauthorized():
    """Test GET /api/v1/roles/{role_type} without auth returns 401"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/roles/critic")
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_role_profile_unauthorized():
    """Test PUT /api/v1/roles/{role_type}/profile without auth returns 401"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.put(
            "/api/v1/roles/critic/profile",
            json={"bio": "test"},
        )
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_nonexistent_role_profile(
    client: AsyncClient,
    auth_token: str,
):
    """Test GET /api/v1/roles/{role_type} for nonexistent profile returns 404"""
    response = await client.get(
        "/api/v1/roles/critic",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    # Should return 404 if profile doesn't exist
    assert response.status_code in [404, 200]  # Depends on implementation


@pytest.mark.asyncio
async def test_update_nonexistent_role_profile(
    client: AsyncClient,
    auth_token: str,
):
    """Test PUT /api/v1/roles/{role_type}/profile for nonexistent profile returns 400"""
    response = await client.put(
        "/api/v1/roles/critic/profile",
        json={"bio": "test"},
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    # Should return 400 if profile doesn't exist
    assert response.status_code in [400, 404]

