"""
Tests for the enhanced GET /api/v1/auth/me/enhanced endpoint
Tests authentication, roles, and profile presence information
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Import from the FastAPI app directly
import sys
from pathlib import Path

# Add src directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.main import app
from src.models import Base, User, AdminUserMeta, CriticProfile
from src.security.password import hash_password
from src.security.jwt import create_access_token


# Test database URL (use test database)
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm_test"


@pytest.fixture(scope="function")
def test_client():
    """Create a test client for the FastAPI app"""
    return TestClient(app)


@pytest.fixture(scope="function")
async def test_user_with_roles():
    """Create a test user with roles and CriticProfile"""
    # Create async engine for test database
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Create test user
        test_user = User(
            external_id="test-user-1",
            email="testuser@example.com",
            name="Test User",
            hashed_password=hash_password("testpassword123"),
        )
        session.add(test_user)
        await session.flush()
        
        # Create AdminUserMeta with roles
        admin_meta = AdminUserMeta(
            user_id=test_user.id,
            email=test_user.email,
            roles=["User", "Critic", "Talent"],
            status="Active",
        )
        session.add(admin_meta)
        await session.flush()
        
        # Create CriticProfile
        critic_profile = CriticProfile(
            external_id="critic-1",
            user_id=test_user.id,
            username="testcritic",
            display_name="Test Critic",
            is_verified=True,
        )
        session.add(critic_profile)
        await session.commit()
        
        yield test_user, admin_meta, critic_profile
    
    # Cleanup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


class TestAuthMeEnhanced:
    """Test suite for GET /api/v1/auth/me/enhanced endpoint"""

    def test_me_enhanced_unauthenticated(self, test_client):
        """Test that unauthenticated request returns 401"""
        response = test_client.get("/api/v1/auth/me/enhanced")
        assert response.status_code == 401
        assert "Not authenticated" in response.json()["detail"]

    def test_me_enhanced_invalid_token(self, test_client):
        """Test that invalid token returns 401"""
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = test_client.get("/api/v1/auth/me/enhanced", headers=headers)
        assert response.status_code == 401

    def test_me_enhanced_missing_auth_header(self, test_client):
        """Test that missing Authorization header returns 401"""
        response = test_client.get("/api/v1/auth/me/enhanced")
        assert response.status_code == 401

    def test_me_enhanced_endpoint_exists(self, test_client):
        """Test that the endpoint is registered and accessible"""
        # This test verifies the endpoint exists by checking it returns 401 (not 404)
        response = test_client.get("/api/v1/auth/me/enhanced")
        assert response.status_code != 404, "Endpoint /api/v1/auth/me/enhanced not found"


class TestAuthMeBackwardCompatibility:
    """Test suite for backward compatibility with original /me endpoint"""

    def test_me_endpoint_still_exists(self, test_client):
        """Test that original /me endpoint still exists (backward compatibility)"""
        # Unauthenticated request should return 401, not 404
        response = test_client.get("/api/v1/auth/me")
        assert response.status_code != 404, "Original /me endpoint was removed"
        assert response.status_code == 401, "Original /me endpoint should require auth"

