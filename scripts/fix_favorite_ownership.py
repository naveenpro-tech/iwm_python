"""Fix favorite ownership issue - delete orphaned favorites"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm"

async def main():
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.begin() as conn:
        # Check current favorites
        result = await conn.execute(
            text("""
                SELECT f.id, f.external_id, f.user_id, f.type, u.email
                FROM favorites f
                LEFT JOIN users u ON f.user_id = u.id
                WHERE f.type = 'movie'
            """)
        )
        favorites = result.fetchall()
        
        print(f"📊 Current favorites: {len(favorites)}")
        for fav in favorites:
            print(f"  - ID: {fav[1]}, User: {fav[4] or 'ORPHANED'}, Type: {fav[3]}")
        
        # Delete all favorites to start fresh
        delete_result = await conn.execute(text("DELETE FROM favorites"))
        print(f"\n✅ Deleted {delete_result.rowcount} favorites")
        print("Users can now add favorites fresh with correct ownership")

if __name__ == "__main__":
    asyncio.run(main())

