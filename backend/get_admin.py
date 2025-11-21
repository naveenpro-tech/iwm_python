import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def get_admin():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5433/iwm')
    async with engine.connect() as conn:
        result = await conn.execute(
            text('SELECT email FROM users WHERE role = :role LIMIT 1'),
            {'role': 'admin'}
        )
        row = result.fetchone()
        if row:
            print(f"Email: {row[0]}")
        else:
            print("No admin found")
    await engine.dispose()

asyncio.run(get_admin())

