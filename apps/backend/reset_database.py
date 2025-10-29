"""
Database Reset Script
Drops all tables and recreates schema using Alembic migrations
"""
import asyncio
import subprocess
import sys
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm")


async def drop_all_tables():
    """Drop all tables in the database"""
    print("🔹 Dropping all tables...")
    
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        # Drop all tables
        await conn.execute(text("""
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        """))
        
        # Drop alembic version table
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
    
    await engine.dispose()
    print("✅ All tables dropped")


async def run_migrations():
    """Run Alembic migrations to recreate schema"""
    print("🔹 Running Alembic migrations...")
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    try:
        # Run alembic upgrade head
        result = subprocess.run(
            [sys.executable, "-m", "alembic", "upgrade", "head"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
        print("✅ Migrations completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Migration failed: {e.stderr}")
        return False


async def verify_schema():
    """Verify that all tables were created"""
    print("🔹 Verifying schema...")
    
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        result = await conn.execute(text("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
        """))
        tables = [row[0] for row in result]
    
    await engine.dispose()
    
    print(f"✅ Found {len(tables)} tables:")
    for table in tables:
        print(f"   - {table}")
    
    return tables


async def main():
    """Main reset function"""
    print("🚀 Starting database reset...")
    print("⚠️  WARNING: This will delete ALL data in the database!")
    
    try:
        # Step 1: Drop all tables
        await drop_all_tables()
        
        # Step 2: Run migrations
        success = await run_migrations()
        if not success:
            print("❌ Database reset failed during migrations")
            return False
        
        # Step 3: Verify schema
        tables = await verify_schema()
        
        if len(tables) > 0:
            print("\n✅ Database reset completed successfully!")
            print("   Next step: Run seed_database.py to populate with test data")
            return True
        else:
            print("❌ No tables found after migration")
            return False
            
    except Exception as e:
        print(f"\n❌ Error during database reset: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)

