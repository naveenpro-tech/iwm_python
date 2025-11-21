"""
Seed database with 2024-2025 movies (fallback when TMDB API is unavailable)
"""
import asyncio
from datetime import datetime
from sqlalchemy import select, delete, text, insert
from dotenv import load_dotenv

# Load environment variables
load_dotenv("apps/backend/.env")

try:
    from . import db as dbmod
except ImportError:
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    import db as dbmod  # type: ignore

from .models import (
    Movie, Genre, Person, Scene, Review, User, StreamingPlatform, MovieStreamingOption,
    movie_genres, movie_people, Pulse, scene_genres, collection_movies, Collection,
    AwardNomination
)
from .config import settings

print(f"[seed_2024] database_url={settings.database_url}")


async def clear_all_data(session):
    """Clear all existing movie data using TRUNCATE CASCADE"""
    print("\n=== Clearing existing data ===")
    
    # Use TRUNCATE CASCADE to handle all foreign keys automatically
    tables_to_clear = [
        "movie_people", "movie_genres", "collection_movies", "scene_genres",
        "movie_streaming_options", "scenes", "reviews", "pulses", 
        "award_nominations", "collections", "watchlist", "movies", "people",
        "streaming_platforms"
    ]
    
    for table in tables_to_clear:
        try:
            await session.execute(text(f"TRUNCATE TABLE {table} CASCADE"))
        except Exception as e:
            print(f"Warning: Could not truncate {table}: {e}")
    
    await session.commit()
    print("All existing data cleared!")


async def seed_2024_movies():
    """Seed with 2024-2025 movies"""
    await dbmod.init_db()
    if dbmod.SessionLocal is None:
        print("ERROR: Database not configured")
        return
    
    async with dbmod.SessionLocal() as session:
        # Clear existing data
        await clear_all_data(session)
        
        # Create genres
        genre_map = {}
        genres_data = [
            ("action", "Action"), ("adventure", "Adventure"), ("sci-fi", "Sci-Fi"),
            ("thriller", "Thriller"), ("drama", "Drama"), ("crime", "Crime"),
            ("mystery", "Mystery"), ("fantasy", "Fantasy"), ("romance", "Romance"),
            ("comedy", "Comedy"), ("horror", "Horror"), ("animation", "Animation"),
            ("biography", "Biography"), ("war", "War"), ("western", "Western"),
            ("family", "Family"), ("documentary", "Documentary"), ("music", "Music"),
        ]
        
        for slug, name in genres_data:
            result = await session.execute(select(Genre).where(Genre.slug == slug))
            genre = result.scalar_one_or_none()
            if not genre:
                genre = Genre(slug=slug, name=name)
                session.add(genre)
                await session.flush()
            genre_map[slug] = genre
        
        await session.commit()
        
        # Create streaming platforms
        platforms_data = [
            ("netflix", "Netflix", "/netflix-logo.png", "https://www.netflix.com"),
            ("hbo-max", "HBO Max", "/hbo-max-logo.png", "https://www.hbomax.com"),
            ("amazon-prime", "Amazon Prime Video", "/amazon-prime-logo.png", "https://www.primevideo.com"),
            ("apple-tv", "Apple TV+", "/apple-tv-logo.png", "https://tv.apple.com"),
            ("disney-plus", "Disney+", "/disney-plus-logo.png", "https://www.disneyplus.com"),
            ("hulu", "Hulu", "/hulu-logo.png", "https://www.hulu.com"),
        ]
        
        platform_map = {}
        for ext_id, name, logo, url in platforms_data:
            result = await session.execute(select(StreamingPlatform).where(StreamingPlatform.external_id == ext_id))
            platform = result.scalar_one_or_none()
            if not platform:
                platform = StreamingPlatform(external_id=ext_id, name=name, logo_url=logo, website_url=url)
                session.add(platform)
                await session.flush()
            platform_map[ext_id] = platform
        
        await session.commit()
        
        # 2024-2025 Movies Data
        movies_data = [
            {
                "external_id": "tmdb-1184918",
                "title": "The Wild Robot",
                "tagline": "Discover your true nature.",
                "year": "2024",
                "release_date": datetime(2024, 9, 27),
                "runtime": 102,
                "rating": "PG",
                "siddu_score": 8.6,
                "critics_score": 8.3,
                "imdb_rating": 8.4,
                "language": "EN",
                "country": "United States",
                "overview": "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island's animals and cares for an orphaned baby goose.",
                "poster_url": "https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/4zlOPT9CrtIX05bBIkYxNZsm5zN.jpg",
                "budget": 78000000,
                "revenue": 327000000,
                "status": "released",
                "genres": ["animation", "sci-fi", "family"],
                "director": {"name": "Chris Sanders", "image": None},
                "cast": [
                    {"name": "Lupita Nyong'o", "character": "Roz (voice)", "image": None},
                    {"name": "Pedro Pascal", "character": "Fink (voice)", "image": None},
                    {"name": "Kit Connor", "character": "Brightbill (voice)", "image": None},
                ],
                "streaming": [("netflix", "US", "subscription"), ("amazon-prime", "US", "rent")],
            },
            {
                "external_id": "tmdb-533535",
                "title": "Deadpool & Wolverine",
                "tagline": "Come together.",
                "year": "2024",
                "release_date": datetime(2024, 7, 24),
                "runtime": 128,
                "rating": "R",
                "siddu_score": 7.8,
                "critics_score": 7.9,
                "imdb_rating": 7.9,
                "language": "EN",
                "country": "United States",
                "overview": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
                "poster_url": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
                "budget": 200000000,
                "revenue": 1338000000,
                "status": "released",
                "genres": ["action", "comedy", "sci-fi"],
                "director": {"name": "Shawn Levy", "image": None},
                "cast": [
                    {"name": "Ryan Reynolds", "character": "Wade Wilson / Deadpool", "image": None},
                    {"name": "Hugh Jackman", "character": "Logan / Wolverine", "image": None},
                    {"name": "Emma Corrin", "character": "Cassandra Nova", "image": None},
                ],
                "streaming": [("disney-plus", "US", "subscription")],
            },
            {
                "external_id": "tmdb-1022789",
                "title": "Inside Out 2",
                "tagline": "Make room for new emotions.",
                "year": "2024",
                "release_date": datetime(2024, 6, 11),
                "runtime": 96,
                "rating": "PG",
                "siddu_score": 7.7,
                "critics_score": 7.6,
                "imdb_rating": 7.7,
                "language": "EN",
                "country": "United States",
                "overview": "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who've long been running a successful operation by all accounts, aren't sure how to feel when Anxiety shows up.",
                "poster_url": "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg",
                "budget": 200000000,
                "revenue": 1698000000,
                "status": "released",
                "genres": ["animation", "family", "adventure", "comedy"],
                "director": {"name": "Kelsey Mann", "image": None},
                "cast": [
                    {"name": "Amy Poehler", "character": "Joy (voice)", "image": None},
                    {"name": "Maya Hawke", "character": "Anxiety (voice)", "image": None},
                    {"name": "Phyllis Smith", "character": "Sadness (voice)", "image": None},
                ],
                "streaming": [("disney-plus", "US", "subscription")],
            },
            {
                "external_id": "tmdb-519182",
                "title": "Despicable Me 4",
                "tagline": "Things just got a little more despicable.",
                "year": "2024",
                "release_date": datetime(2024, 6, 20),
                "runtime": 95,
                "rating": "PG",
                "siddu_score": 7.2,
                "critics_score": 6.9,
                "imdb_rating": 7.1,
                "language": "EN",
                "country": "United States",
                "overview": "Gru and Lucy and their girls—Margo, Edith and Agnes—welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, and the family is forced to go on the run.",
                "poster_url": "https://image.tmdb.org/t/p/w500/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/lgkPzcOSnTvjeMnuFzozRO5HHw1.jpg",
                "budget": 100000000,
                "revenue": 969000000,
                "status": "released",
                "genres": ["animation", "family", "comedy", "action"],
                "director": {"name": "Chris Renaud", "image": None},
                "cast": [
                    {"name": "Steve Carell", "character": "Gru (voice)", "image": None},
                    {"name": "Kristen Wiig", "character": "Lucy (voice)", "image": None},
                    {"name": "Will Ferrell", "character": "Maxime Le Mal (voice)", "image": None},
                ],
                "streaming": [("netflix", "US", "subscription")],
            },
            {
                "external_id": "tmdb-573435",
                "title": "Bad Boys: Ride or Die",
                "tagline": "Miami's finest are now its most wanted.",
                "year": "2024",
                "release_date": datetime(2024, 6, 5),
                "runtime": 115,
                "rating": "R",
                "siddu_score": 7.6,
                "critics_score": 7.3,
                "imdb_rating": 7.5,
                "language": "EN",
                "country": "United States",
                "overview": "After their late former Captain is framed, Lowrey and Burnett try to clear his name, only to end up on the run themselves.",
                "poster_url": "https://image.tmdb.org/t/p/w500/oGythE98MYleE6mZlGs5oBGkux1.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/ga4OLh4oPzLc4Wfv3FhUhJJVOw2.jpg",
                "budget": 100000000,
                "revenue": 404000000,
                "status": "released",
                "genres": ["action", "crime", "thriller", "comedy"],
                "director": {"name": "Adil El Arbi", "image": None},
                "cast": [
                    {"name": "Will Smith", "character": "Mike Lowrey", "image": None},
                    {"name": "Martin Lawrence", "character": "Marcus Burnett", "image": None},
                    {"name": "Vanessa Hudgens", "character": "Kelly", "image": None},
                ],
                "streaming": [("netflix", "US", "subscription"), ("amazon-prime", "US", "rent")],
            },
        ]
        
        # Create movies
        for movie_data in movies_data:
            # Create movie
            movie = Movie(
                external_id=movie_data["external_id"],
                title=movie_data["title"],
                tagline=movie_data.get("tagline"),
                year=movie_data["year"],
                release_date=movie_data.get("release_date"),
                runtime=movie_data.get("runtime"),
                rating=movie_data.get("rating"),
                siddu_score=movie_data.get("siddu_score"),
                critics_score=movie_data.get("critics_score"),
                imdb_rating=movie_data.get("imdb_rating"),
                language=movie_data.get("language"),
                country=movie_data.get("country"),
                overview=movie_data.get("overview"),
                poster_url=movie_data.get("poster_url"),
                backdrop_url=movie_data.get("backdrop_url"),
                budget=movie_data.get("budget"),
                revenue=movie_data.get("revenue"),
                status=movie_data.get("status", "released"),
            )
            session.add(movie)
            await session.flush()
            
            # Add genres
            for genre_slug in movie_data.get("genres", []):
                if genre_slug in genre_map:
                    await session.execute(insert(movie_genres).values(
                        movie_id=movie.id,
                        genre_id=genre_map[genre_slug].id
                    ))
            
            # Add director
            director_data = movie_data.get("director")
            if director_data:
                person_ext_id = f"person-{director_data['name'].lower().replace(' ', '-')}"
                result = await session.execute(select(Person).where(Person.external_id == person_ext_id))
                person = result.scalar_one_or_none()
                if not person:
                    person = Person(
                        external_id=person_ext_id,
                        name=director_data["name"],
                        image_url=director_data.get("image")
                    )
                    session.add(person)
                    await session.flush()
                
                await session.execute(insert(movie_people).values(
                    movie_id=movie.id,
                    person_id=person.id,
                    role="director",
                    character_name=None
                ))
            
            # Add cast
            for cast_member in movie_data.get("cast", []):
                person_ext_id = f"person-{cast_member['name'].lower().replace(' ', '-')}"
                result = await session.execute(select(Person).where(Person.external_id == person_ext_id))
                person = result.scalar_one_or_none()
                if not person:
                    person = Person(
                        external_id=person_ext_id,
                        name=cast_member["name"],
                        image_url=cast_member.get("image")
                    )
                    session.add(person)
                    await session.flush()
                
                await session.execute(insert(movie_people).values(
                    movie_id=movie.id,
                    person_id=person.id,
                    role="actor",
                    character_name=cast_member.get("character")
                ))
            
            # Add streaming options
            for idx, (platform_id, region, stream_type) in enumerate(movie_data.get("streaming", [])):
                if platform_id in platform_map:
                    stream_opt = MovieStreamingOption(
                        external_id=f"{movie_data['external_id']}-{platform_id}-{region}-{idx}",
                        movie_id=movie.id,
                        platform_id=platform_map[platform_id].id,
                        region=region,
                        type=stream_type,
                        price="$3.99" if stream_type == "rent" else None,
                        quality="HD",
                        verified=True,
                        url=""
                    )
                    session.add(stream_opt)
            
            print(f"Created movie: {movie.title} ({movie.year})")
        
        await session.commit()
        print("\n=== 2024 Movies seed complete! ===")


if __name__ == "__main__":
    asyncio.run(seed_2024_movies())

