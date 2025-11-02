"""Check database state and table count"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv("apps/backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm")

async def check_database():
    print(f"🔍 Checking database: {DATABASE_URL}")
    
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    try:
        async with engine.begin() as conn:
            # Count tables
            result = await conn.execute(text("""
                SELECT COUNT(*) as table_count 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            table_count = result.scalar()
            print(f"✅ Database 'iwm' exists")
            print(f"✅ Total tables: {table_count}")
            
            # Check for key tables
            key_tables = ['users', 'movies', 'admin_user_meta', 'user_role_profiles', 'reviews']
            for table in key_tables:
                result = await conn.execute(text(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name = '{table}'
                    )
                """))
                exists = result.scalar()
                status = "✅" if exists else "❌"
                print(f"{status} Table '{table}': {'exists' if exists else 'MISSING'}")
            
            # Check alembic version
            result = await conn.execute(text("""
                SELECT version_num FROM alembic_version LIMIT 1
            """))
            version = result.scalar()
            print(f"✅ Alembic version: {version}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_database())

