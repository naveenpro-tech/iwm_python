import asyncio
import sys
from pathlib import Path

# Add project root to sys.path
project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

from apps.backend.src.db import get_session, init_db
from apps.backend.src.repositories.movies import MovieRepository
from sqlalchemy import text

async def check_movies():
    await init_db()  # Initialize DB connection
    
    async for session in get_session():
        if session is None:
            print("Session is None! DB init failed?")
            return

        print("Checking database content...")
        
        # Check raw count
        result = await session.execute(text("SELECT COUNT(*) FROM movies"))
        count = result.scalar()
        print(f"Total movies in DB (SQL): {count}")
        
        # Check repository list
        repo = MovieRepository(session)
        movies = await repo.list(page=1, limit=10)
        print(f"Movies returned by repository: {len(movies['items'])}")
        if len(movies['items']) > 0:
            print(f"First movie: {movies['items'][0].title}")
        
        break

if __name__ == "__main__":
    asyncio.run(check_movies())
