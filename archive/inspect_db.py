import asyncio
from sqlalchemy import text, inspect
from sqlalchemy.ext.asyncio import create_async_engine
import ssl

DATABASE_URL = "postgresql+asyncpg://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb"

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

async def inspect_table():
    engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"ssl": ssl_context})
    
    async with engine.connect() as conn:
        # Asyncpg doesn't support SQLAlchemy inspector well, so use raw SQL
        result = await conn.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
        """))
        
        print("Columns in users table:")
        for row in result:
            print(f"- {row[0]} ({row[1]}, nullable={row[2]})")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(inspect_table())
