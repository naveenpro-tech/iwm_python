import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import ssl
import traceback

# Hardcoded URL from .env (without ssl param)
url = "postgresql+asyncpg://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4alw00b-pooler.us-east-2.aws.neon.tech/moviemadders"

# Manual SSL context
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

print(f"Testing connection to: {url}")
print("Using SSL context with CERT_NONE")

engine = create_async_engine(url, connect_args={"ssl": ssl_context})

async def main():
    try:
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT 1"))
            print(f"Success: {res.scalar()}")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
