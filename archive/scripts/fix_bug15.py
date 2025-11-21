"""
Script to fix BUG #15 - Update the collection to have the correct data
"""
import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "apps" / "backend" / "src"))

from sqlalchemy import select, text, delete, insert
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm"

async def fix_collection():
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        print("=" * 80)
        print("FIXING BUG #15 - Updating Collection Data")
        print("=" * 80)
        
        collection_id = 1
        collection_external_id = "50a0b83c-6e2b-47be-ad9f-5f8fa469b248"
        
        # Step 1: Update collection title and description
        print("\n1. Updating collection title and description...")
        await session.execute(
            text("""
                UPDATE collections
                SET title = :title,
                    description = :description,
                    updated_at = NOW()
                WHERE id = :collection_id
            """),
            {
                "collection_id": collection_id,
                "title": "My Favorite Nolan Films",
                "description": "Christopher Nolan's best works"
            }
        )
        print("✅ Collection title and description updated")
        
        # Step 2: Remove existing movies from collection
        print("\n2. Removing existing movies from collection...")
        await session.execute(
            text("""
                DELETE FROM collection_movies
                WHERE collection_id = :collection_id
            """),
            {"collection_id": collection_id}
        )
        print("✅ Existing movies removed")
        
        # Step 3: Get Nolan movie IDs
        print("\n3. Getting Nolan movie IDs...")
        result = await session.execute(
            text("""
                SELECT id, title
                FROM movies
                WHERE title IN ('Inception', 'Interstellar', 'The Dark Knight', 'The Prestige')
                ORDER BY title
            """)
        )
        nolan_movies = result.fetchall()
        print(f"Found {len(nolan_movies)} Nolan movies:")
        for movie in nolan_movies:
            print(f"  - {movie[1]} (ID: {movie[0]})")
        
        # Step 4: Add Nolan movies to collection
        print("\n4. Adding Nolan movies to collection...")
        for movie in nolan_movies:
            await session.execute(
                text("""
                    INSERT INTO collection_movies (collection_id, movie_id)
                    VALUES (:collection_id, :movie_id)
                """),
                {
                    "collection_id": collection_id,
                    "movie_id": movie[0]
                }
            )
            print(f"  ✅ Added {movie[1]}")
        
        # Commit all changes
        await session.commit()
        print("\n✅ All changes committed to database")
        
        # Step 5: Verify the fix
        print("\n5. Verifying the fix...")
        result = await session.execute(
            text("""
                SELECT id, external_id, title, description
                FROM collections
                WHERE id = :collection_id
            """),
            {"collection_id": collection_id}
        )
        collection = result.fetchone()
        print(f"Collection ID: {collection[0]}")
        print(f"External ID: {collection[1]}")
        print(f"Title: {collection[2]}")
        print(f"Description: {collection[3]}")
        
        result = await session.execute(
            text("""
                SELECT m.title, m.year
                FROM collection_movies cm
                JOIN movies m ON cm.movie_id = m.id
                WHERE cm.collection_id = :collection_id
                ORDER BY m.title
            """),
            {"collection_id": collection_id}
        )
        movies = result.fetchall()
        print(f"\nMovies in collection ({len(movies)}):")
        for movie in movies:
            print(f"  - {movie[0]} ({movie[1]})")
        
        print("\n" + "=" * 80)
        print("BUG #15 FIXED SUCCESSFULLY!")
        print("=" * 80)
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(fix_collection())

