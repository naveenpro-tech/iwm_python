"""
Script to investigate BUG #15 - Collection Data Mismatch
Query the database to understand what data exists for the collection UUID
"""
import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "apps" / "backend" / "src"))

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm"

async def investigate_collection():
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        print("=" * 80)
        print("INVESTIGATING BUG #15 - Collection Data Mismatch")
        print("=" * 80)
        
        # Query 1: Get collection by external_id
        print("\n1. Collection with UUID 50a0b83c-6e2b-47be-ad9f-5f8fa469b248:")
        print("-" * 80)
        result = await session.execute(
            text("""
                SELECT id, external_id, title, description, user_id, is_public, 
                       created_at, updated_at
                FROM collections
                WHERE external_id = '50a0b83c-6e2b-47be-ad9f-5f8fa469b248'
            """)
        )
        collection = result.fetchone()
        if collection:
            print(f"ID: {collection[0]}")
            print(f"External ID: {collection[1]}")
            print(f"Title: {collection[2]}")
            print(f"Description: {collection[3]}")
            print(f"User ID: {collection[4]}")
            print(f"Is Public: {collection[5]}")
            print(f"Created At: {collection[6]}")
            print(f"Updated At: {collection[7]}")
            collection_id = collection[0]
        else:
            print("NOT FOUND!")
            collection_id = None
        
        # Query 2: Get movies in this collection
        if collection_id:
            print("\n2. Movies in this collection:")
            print("-" * 80)
            result = await session.execute(
                text("""
                    SELECT m.id, m.external_id, m.title, m.year
                    FROM collection_movies cm
                    JOIN movies m ON cm.movie_id = m.id
                    WHERE cm.collection_id = :collection_id
                """),
                {"collection_id": collection_id}
            )
            movies = result.fetchall()
            if movies:
                for idx, movie in enumerate(movies, 1):
                    print(f"{idx}. {movie[2]} ({movie[3]})")
                    print(f"   Movie ID: {movie[0]}, External ID: {movie[1]}")
            else:
                print("No movies found in this collection!")
        
        # Query 3: Search for "My Favorite Nolan Films" collection
        print("\n3. Searching for 'My Favorite Nolan Films' collection:")
        print("-" * 80)
        result = await session.execute(
            text("""
                SELECT id, external_id, title, description, created_at
                FROM collections
                WHERE title ILIKE '%Nolan%'
            """)
        )
        nolan_collections = result.fetchall()
        if nolan_collections:
            for coll in nolan_collections:
                print(f"Found: {coll[2]}")
                print(f"  External ID: {coll[1]}")
                print(f"  Created At: {coll[4]}")
        else:
            print("No collections with 'Nolan' in title found!")
        
        # Query 4: List all collections
        print("\n4. All collections in database:")
        print("-" * 80)
        result = await session.execute(
            text("""
                SELECT id, external_id, title, created_at
                FROM collections
                ORDER BY created_at DESC
            """)
        )
        all_collections = result.fetchall()
        for idx, coll in enumerate(all_collections, 1):
            print(f"{idx}. {coll[2]}")
            print(f"   External ID: {coll[1]}")
            print(f"   Created At: {coll[3]}")
        
        # Query 5: Check if there are Nolan movies in database
        print("\n5. Christopher Nolan movies in database:")
        print("-" * 80)
        result = await session.execute(
            text("""
                SELECT id, external_id, title, year
                FROM movies
                WHERE title IN ('Inception', 'Interstellar', 'The Dark Knight', 'The Prestige')
                ORDER BY title
            """)
        )
        nolan_movies = result.fetchall()
        if nolan_movies:
            for movie in nolan_movies:
                print(f"- {movie[2]} ({movie[3]})")
                print(f"  ID: {movie[0]}, External ID: {movie[1]}")
        else:
            print("No Nolan movies found!")
        
        print("\n" + "=" * 80)
        print("INVESTIGATION COMPLETE")
        print("=" * 80)
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(investigate_collection())

