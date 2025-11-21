import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

DB_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm")

SQL_ENABLE_ALL = """
UPDATE feature_flags SET is_enabled = true;
"""

SQL_COUNT = """
SELECT COUNT(*) FILTER (WHERE is_enabled) as enabled,
       COUNT(*) as total
FROM feature_flags;
"""

async def main():
    engine = create_async_engine(DB_URL)
    async with engine.begin() as conn:
        await conn.execute(text(SQL_ENABLE_ALL))
        res = await conn.execute(text(SQL_COUNT))
        row = res.fetchone()
        print(f"✅ Feature flags enabled: {row[0]}/{row[1]}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())

