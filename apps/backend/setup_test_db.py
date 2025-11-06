"""
Setup test database with all tables.
This script creates all tables in the test database using SQLAlchemy models.
"""
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine

# Set environment to test
os.environ['ENVIRONMENT'] = 'test'

from src.models import Base


async def setup_test_database():
    """Create all tables in the test database."""
    try:
        # Create engine for test database
        engine = create_async_engine(
            "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm_test",
            echo=False
        )
        
        print("🔄 Creating all tables in test database...")
        
        # Create all tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        print("✅ All tables created successfully in test database")
        
        await engine.dispose()
        
    except Exception as e:
        print(f"❌ Error setting up test database: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(setup_test_database())

