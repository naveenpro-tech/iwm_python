"""
Pytest Configuration and Fixtures for Admin RBAC Tests

This module provides shared fixtures for all admin tests including:
- FastAPI test client
- Database session
- Test users (admin, non-admin, disabled admin)

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import sys
from pathlib import Path

# Add src directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.main import app
from src.models import Base
from src.db import get_session


# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="function")
def client():
    """Create a test client for the FastAPI app"""
    return TestClient(app)


@pytest.fixture(scope="function")
async def session():
    """Create an async database session for tests"""
    # Create in-memory SQLite database for testing
    engine = create_async_engine(TEST_DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session factory
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    # Create session
    async with async_session() as session:
        # Override the get_session dependency
        def override_get_session():
            return session
        
        app.dependency_overrides[get_session] = override_get_session
        
        yield session
        
        # Cleanup
        app.dependency_overrides.clear()
    
    # Drop all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()

