"""
Create test database for running tests.
This script creates the iwm_test database if it doesn't exist.
"""
import asyncio
import asyncpg


async def create_test_database():
    """Create the test database if it doesn't exist."""
    try:
        # Connect to the default postgres database
        conn = await asyncpg.connect(
            host='localhost',
            port=5433,
            user='postgres',
            password='postgres',
            database='postgres'
        )
        
        # Check if test database exists
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = 'iwm_test'"
        )
        
        if exists:
            print("✅ Test database 'iwm_test' already exists")
        else:
            # Create the test database
            await conn.execute('CREATE DATABASE iwm_test')
            print("✅ Test database 'iwm_test' created successfully")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Error creating test database: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(create_test_database())

