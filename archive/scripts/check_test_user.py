"""Check if test user exists in database"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def check_user():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5433/iwm')
    
    async with engine.begin() as conn:
        # Check for test user
        result = await conn.execute(
            text("SELECT id, external_id, name, email FROM users WHERE email = 'naveenvide2@gmail.com'")
        )
        row = result.fetchone()

        if row:
            print("✅ User found:")
            print(f"  ID: {row[0]}")
            print(f"  External ID: {row[1]}")
            print(f"  Name: {row[2]}")
            print(f"  Email: {row[3]}")
            print(f"\n📍 Profile URL: /profile/{row[1]}")  # Use external_id for profile URL
        else:
            print("❌ User NOT found")
            print("\nAvailable users:")
            result2 = await conn.execute(text("SELECT name, email, external_id FROM users LIMIT 10"))
            for user_row in result2:
                print(f"  - {user_row[0]} ({user_row[1]}) - external_id: {user_row[2]}")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_user())

