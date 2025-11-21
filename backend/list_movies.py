"""List movies in database"""
import asyncio
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm")


async def list_movies():
    """List all movies"""
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        result = await conn.execute(
            text("""
                SELECT id, external_id, tmdb_id, title, year
                FROM movies
                ORDER BY id
                LIMIT 20
            """)
        )
        
        movies = result.fetchall()
        print("\n📽️  Movies in database:")
        print(f"   Total: {len(movies)}")
        print()
        for movie in movies:
            print(f"   ID: {movie[0]}, External ID: {movie[1]}, TMDB ID: {movie[2]}, Title: {movie[3]}, Year: {movie[4]}")
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(list_movies())

