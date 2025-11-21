import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def check_movies():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5433/iwm')
    async with engine.begin() as conn:
        # Count movies
        result = await conn.execute(text('SELECT COUNT(*) FROM movies'))
        count = result.scalar()
        print(f'\n✅ Movies in database: {count}')
        
        # List first 5 movies
        result2 = await conn.execute(text('SELECT title, year, external_id FROM movies LIMIT 5'))
        print('\n📽️  Sample movies:')
        for row in result2:
            print(f'  - {row[0]} ({row[1]}) [ID: {row[2]}]')
        
        # Check genres
        result3 = await conn.execute(text('SELECT COUNT(*) FROM genres'))
        genre_count = result3.scalar()
        print(f'\n✅ Genres in database: {genre_count}')
        
        # Check movie_genres associations
        result4 = await conn.execute(text('SELECT COUNT(*) FROM movie_genres'))
        assoc_count = result4.scalar()
        print(f'\n✅ Movie-Genre associations: {assoc_count}')
    
    await engine.dispose()

if __name__ == '__main__':
    asyncio.run(check_movies())

