"""
Pytest Configuration and Fixtures for Critic Platform Tests

This module provides shared fixtures for all tests including:
- FastAPI test client
- Database session with transaction rollback
- Test users (regular user, critic, admin, other critic)
- Authentication tokens for different user types
- Test data factories (movies, blog posts, recommendations, etc.)

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime, timedelta
from typing import Dict, Any
import sys
from pathlib import Path
import uuid

# Add src directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.main import app
from src.models import (
    Base, User, CriticProfile, Movie, Genre,
    CriticBlogPost, CriticRecommendation, CriticPinnedContent,
    CriticAffiliateLink, CriticBrandDeal, CriticSponsorDisclosure
)
from src.db import get_session
from src.security.jwt import create_access_token
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test database URL - use in-memory SQLite for speed
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# ============================================================================
# DATABASE FIXTURES
# ============================================================================

@pytest_asyncio.fixture(scope="function")
async def async_engine():
    """Create async engine for tests"""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        poolclass=StaticPool,
        connect_args={"check_same_thread": False}
    )

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    # Drop all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def async_db_session(async_engine):
    """Create async database session with transaction rollback for test isolation"""
    async_session_factory = async_sessionmaker(
        async_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )

    async with async_session_factory() as session:
        # Start a transaction
        async with session.begin():
            # Override the get_session dependency
            async def override_get_session():
                yield session

            app.dependency_overrides[get_session] = override_get_session

            yield session

            # Rollback transaction after test
            await session.rollback()

        # Cleanup
        app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client():
    """Create a test client for the FastAPI app"""
    return TestClient(app)


# ============================================================================
# USER FIXTURES
# ============================================================================

@pytest_asyncio.fixture
async def test_user(async_db_session: AsyncSession) -> User:
    """Create a regular test user (not a critic)"""
    user = User(
        external_id=f"user_{uuid.uuid4().hex[:12]}",
        username=f"testuser_{uuid.uuid4().hex[:8]}",
        email=f"testuser_{uuid.uuid4().hex[:8]}@example.com",
        hashed_password=pwd_context.hash("testpassword123"),
        is_active=True,
        is_verified=True,
        role_profiles={"movie_lover": True}
    )
    async_db_session.add(user)
    await async_db_session.commit()
    await async_db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_critic_user(async_db_session: AsyncSession) -> User:
    """Create a test user with critic profile"""
    user = User(
        external_id=f"user_{uuid.uuid4().hex[:12]}",
        username=f"critic_{uuid.uuid4().hex[:8]}",
        email=f"critic_{uuid.uuid4().hex[:8]}@example.com",
        hashed_password=pwd_context.hash("criticpassword123"),
        is_active=True,
        is_verified=True,
        role_profiles={"movie_lover": True, "critic": True}
    )
    async_db_session.add(user)
    await async_db_session.flush()

    # Create critic profile
    critic_profile = CriticProfile(
        external_id=f"critic_{uuid.uuid4().hex[:12]}",
        user_id=user.id,
        bio="Test critic bio",
        is_verified=True,
        verification_status="approved"
    )
    async_db_session.add(critic_profile)
    await async_db_session.commit()
    await async_db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_other_critic_user(async_db_session: AsyncSession) -> User:
    """Create another test critic user (for ownership tests)"""
    user = User(
        external_id=f"user_{uuid.uuid4().hex[:12]}",
        username=f"othercritic_{uuid.uuid4().hex[:8]}",
        email=f"othercritic_{uuid.uuid4().hex[:8]}@example.com",
        hashed_password=pwd_context.hash("otherpassword123"),
        is_active=True,
        is_verified=True,
        role_profiles={"movie_lover": True, "critic": True}
    )
    async_db_session.add(user)
    await async_db_session.flush()

    # Create critic profile
    critic_profile = CriticProfile(
        external_id=f"critic_{uuid.uuid4().hex[:12]}",
        user_id=user.id,
        bio="Other test critic bio",
        is_verified=True,
        verification_status="approved"
    )
    async_db_session.add(critic_profile)
    await async_db_session.commit()
    await async_db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_admin_user(async_db_session: AsyncSession) -> User:
    """Create a test admin user"""
    user = User(
        external_id=f"user_{uuid.uuid4().hex[:12]}",
        username=f"admin_{uuid.uuid4().hex[:8]}",
        email=f"admin_{uuid.uuid4().hex[:8]}@example.com",
        hashed_password=pwd_context.hash("adminpassword123"),
        is_active=True,
        is_verified=True,
        is_admin=True,
        role_profiles={"movie_lover": True, "moderator": True}
    )
    async_db_session.add(user)
    await async_db_session.commit()
    await async_db_session.refresh(user)
    return user


# ============================================================================
# AUTHENTICATION FIXTURES
# ============================================================================

@pytest.fixture
def auth_headers_user(test_user: User) -> Dict[str, str]:
    """Get authentication headers for regular user"""
    token = create_access_token(
        data={"sub": test_user.email, "user_id": test_user.id}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_critic(test_critic_user: User) -> Dict[str, str]:
    """Get authentication headers for critic user"""
    token = create_access_token(
        data={"sub": test_critic_user.email, "user_id": test_critic_user.id}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_other_critic(test_other_critic_user: User) -> Dict[str, str]:
    """Get authentication headers for other critic user"""
    token = create_access_token(
        data={"sub": test_other_critic_user.email, "user_id": test_other_critic_user.id}
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_admin(test_admin_user: User) -> Dict[str, str]:
    """Get authentication headers for admin user"""
    token = create_access_token(
        data={"sub": test_admin_user.email, "user_id": test_admin_user.id}
    )
    return {"Authorization": f"Bearer {token}"}


# ============================================================================
# TEST DATA FIXTURES
# ============================================================================

@pytest_asyncio.fixture
async def test_movie(async_db_session: AsyncSession) -> Movie:
    """Create a test movie"""
    movie = Movie(
        external_id=f"movie_{uuid.uuid4().hex[:12]}",
        title="Test Movie",
        release_date=datetime(2024, 1, 1),
        runtime=120,
        overview="A test movie for testing purposes",
        poster_url="https://example.com/poster.jpg",
        backdrop_url="https://example.com/backdrop.jpg",
        tmdb_id=12345,
        imdb_id="tt1234567"
    )
    async_db_session.add(movie)
    await async_db_session.commit()
    await async_db_session.refresh(movie)
    return movie


@pytest_asyncio.fixture
async def test_genre(async_db_session: AsyncSession) -> Genre:
    """Create a test genre"""
    genre = Genre(
        external_id=f"genre_{uuid.uuid4().hex[:12]}",
        name="Action",
        tmdb_id=28
    )
    async_db_session.add(genre)
    await async_db_session.commit()
    await async_db_session.refresh(genre)
    return genre


@pytest_asyncio.fixture
async def test_critic_profile(test_critic_user: User, async_db_session: AsyncSession) -> CriticProfile:
    """Get the critic profile for test_critic_user"""
    from sqlalchemy import select
    result = await async_db_session.execute(
        select(CriticProfile).where(CriticProfile.user_id == test_critic_user.id)
    )
    return result.scalar_one()


@pytest_asyncio.fixture
async def test_other_critic_profile(test_other_critic_user: User, async_db_session: AsyncSession) -> CriticProfile:
    """Get the critic profile for test_other_critic_user"""
    from sqlalchemy import select
    result = await async_db_session.execute(
        select(CriticProfile).where(CriticProfile.user_id == test_other_critic_user.id)
    )
    return result.scalar_one()


