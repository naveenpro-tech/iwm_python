import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Get database URL from environment or use default
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb"
)

# Handle SSL for Neon DB
connect_args = {}
if "sslmode" in DATABASE_URL or "neon.tech" in DATABASE_URL:
    import ssl
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    connect_args["ssl"] = ssl_context

async def add_banner_column():
    print(f"Connecting to database...")
    engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)
    
    async with engine.begin() as conn:
        print("Checking if banner_url column exists...")
        # Check if column exists
        result = await conn.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='banner_url'"
        ))
        exists = result.scalar()
        
        if not exists:
            print("Adding banner_url column to users table...")
            await conn.execute(text("ALTER TABLE users ADD COLUMN banner_url VARCHAR(255)"))
            print("Column added successfully!")
        else:
            print("Column banner_url already exists.")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(add_banner_column())
