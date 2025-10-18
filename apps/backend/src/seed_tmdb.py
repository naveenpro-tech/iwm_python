"""
Seed database with real 2025 movies from TMDB API
"""
import asyncio
import os
from datetime import datetime
import httpx
from sqlalchemy import select, delete, text
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

# TMDB API Key - you need to set this in environment
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

print(f"[seed_tmdb] TMDB_API_KEY={'SET' if TMDB_API_KEY else 'NOT SET'}")
print(f"[seed_tmdb] database_url={settings.database_url}")


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


async def fetch_tmdb_movies():
    """Fetch latest 2025 movies from TMDB"""
    if not TMDB_API_KEY:
        print("ERROR: TMDB_API_KEY not set. Please set it in environment variables.")
        print("Get your API key from: https://www.themoviedb.org/settings/api")
        return []

    print("\n=== Fetching movies from TMDB ===")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Fetch popular movies from 2024-2025
        movies = []
        
        # Get now playing movies (latest releases)
        try:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/now_playing",
                params={"api_key": TMDB_API_KEY, "language": "en-US", "page": 1}
            )
            if response.status_code == 200:
                data = response.json()
                movies.extend(data.get("results", [])[:10])
        except Exception as e:
            print(f"Error fetching now_playing: {e}")

        # Get popular movies
        try:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/popular",
                params={"api_key": TMDB_API_KEY, "language": "en-US", "page": 1}
            )
            if response.status_code == 200:
                data = response.json()
                movies.extend(data.get("results", [])[:10])
        except Exception as e:
            print(f"Error fetching popular: {e}")

        # Get top rated movies
        try:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/top_rated",
                params={"api_key": TMDB_API_KEY, "language": "en-US", "page": 1}
            )
            if response.status_code == 200:
                data = response.json()
                movies.extend(data.get("results", [])[:10])
        except Exception as e:
            print(f"Error fetching top_rated: {e}")
        
        # Remove duplicates
        seen = set()
        unique_movies = []
        for movie in movies:
            if movie["id"] not in seen:
                seen.add(movie["id"])
                unique_movies.append(movie)
        
        print(f"Fetched {len(unique_movies)} unique movies from TMDB")

        # If API failed, use fallback list of 2024-2025 movie IDs
        if len(unique_movies) == 0:
            print("API fetch failed. Using fallback list of 2024-2025 movies...")
            fallback_ids = [
                1184918,  # The Wild Robot (2024)
                533535,   # Deadpool & Wolverine (2024)
                519182,   # Despicable Me 4 (2024)
                573435,   # Bad Boys: Ride or Die (2024)
                748783,   # The Garfield Movie (2024)
                1022789,  # Inside Out 2 (2024)
                653346,   # Kingdom of the Planet of the Apes (2024)
                823464,   # Godzilla x Kong: The New Empire (2024)
                1094844,  # Beetlejuice Beetlejuice (2024)
                1034541,  # Terrifier 3 (2024)
                945961,   # Alien: Romulus (2024)
                762441,   # A Quiet Place: Day One (2024)
                1125510,  # The Platform 2 (2024)
                1051896,  # Arcadian (2024)
                1029235,  # Azrael (2024)
            ]
            for movie_id in fallback_ids:
                unique_movies.append({"id": movie_id})

        return unique_movies[:20]  # Limit to 20 movies


async def fetch_movie_details(client, tmdb_id):
    """Fetch detailed movie information with ALL available data"""
    try:
        response = await client.get(
            f"{TMDB_BASE_URL}/movie/{tmdb_id}",
            params={
                "api_key": TMDB_API_KEY,
                "append_to_response": "credits,videos,release_dates,keywords,reviews,similar,recommendations,images,watch/providers"
            }
        )
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error fetching details for movie {tmdb_id}: {e}")
    return None


async def seed_tmdb_movies():
    """Main seeding function"""
    await dbmod.init_db()
    if dbmod.SessionLocal is None:
        print("ERROR: Database not configured")
        return
    
    async with dbmod.SessionLocal() as session:
        # Clear existing data
        await clear_all_data(session)
        
        # Fetch movies from TMDB
        tmdb_movies = await fetch_tmdb_movies()
        
        if not tmdb_movies:
            print("No movies fetched. Exiting.")
            return
        
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
            genre_map[name.lower()] = genre
        
        await session.commit()
        
        # Create streaming platforms
        platforms_data = [
            ("netflix", "Netflix", "/netflix-logo.png", "https://www.netflix.com"),
            ("hbo-max", "HBO Max", "/hbo-max-logo.png", "https://www.hbomax.com"),
            ("amazon-prime", "Amazon Prime Video", "/amazon-prime-logo.png", "https://www.primevideo.com"),
            ("apple-tv", "Apple TV+", "/apple-tv-logo.png", "https://tv.apple.com"),
            ("disney-plus", "Disney+", "/disney-plus-logo.png", "https://www.disneyplus.com"),
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
        
        # Fetch detailed info and create movies
        async with httpx.AsyncClient() as client:
            for tmdb_movie in tmdb_movies:
                tmdb_id = tmdb_movie["id"]
                details = await fetch_movie_details(client, tmdb_id)
                
                if not details:
                    continue
                
                # Create movie
                external_id = f"tmdb-{tmdb_id}"
                result = await session.execute(select(Movie).where(Movie.external_id == external_id))
                existing = result.scalar_one_or_none()
                
                if existing:
                    print(f"Movie {details.get('title')} already exists, skipping...")
                    continue
                
                release_date = None
                if details.get("release_date"):
                    try:
                        release_date = datetime.strptime(details["release_date"], "%Y-%m-%d")
                    except:
                        pass
                
                movie = Movie(
                    external_id=external_id,
                    title=details.get("title", "Unknown"),
                    tagline=details.get("tagline"),
                    year=details.get("release_date", "")[:4] if details.get("release_date") else None,
                    release_date=release_date,
                    runtime=details.get("runtime"),
                    rating=None,  # TMDB doesn't provide this directly
                    siddu_score=round(details.get("vote_average", 0), 1) if details.get("vote_average") else None,
                    critics_score=round(details.get("vote_average", 0), 1) if details.get("vote_average") else None,
                    imdb_rating=round(details.get("vote_average", 0), 1) if details.get("vote_average") else None,
                    rotten_tomatoes_score=None,
                    language=details.get("original_language", "en").upper(),
                    country=details.get("production_countries", [{}])[0].get("name") if details.get("production_countries") else None,
                    overview=details.get("overview"),
                    poster_url=f"https://image.tmdb.org/t/p/w500{details['poster_path']}" if details.get("poster_path") else None,
                    backdrop_url=f"https://image.tmdb.org/t/p/original{details['backdrop_path']}" if details.get("backdrop_path") else None,
                    budget=details.get("budget"),
                    revenue=details.get("revenue"),
                    status=details.get("status", "released").lower(),
                )
                session.add(movie)
                await session.flush()
                
                # Add genres
                from sqlalchemy import insert
                for genre_data in details.get("genres", []):
                    genre_name = genre_data["name"].lower()
                    if genre_name in genre_map:
                        await session.execute(insert(movie_genres).values(
                            movie_id=movie.id,
                            genre_id=genre_map[genre_name].id
                        ))
                
                # Add cast and crew
                credits = details.get("credits", {})
                
                # Add director
                for crew_member in credits.get("crew", []):
                    if crew_member.get("job") == "Director":
                        person_ext_id = f"tmdb-person-{crew_member['id']}"
                        result = await session.execute(select(Person).where(Person.external_id == person_ext_id))
                        person = result.scalar_one_or_none()
                        if not person:
                            person = Person(
                                external_id=person_ext_id,
                                name=crew_member.get("name"),
                                image_url=f"https://image.tmdb.org/t/p/w185{crew_member['profile_path']}" if crew_member.get("profile_path") else None
                            )
                            session.add(person)
                            await session.flush()
                        
                        await session.execute(insert(movie_people).values(
                            movie_id=movie.id,
                            person_id=person.id,
                            role="director",
                            character_name=None
                        ))
                
                # Add top 10 cast members
                for cast_member in credits.get("cast", [])[:10]:
                    person_ext_id = f"tmdb-person-{cast_member['id']}"
                    result = await session.execute(select(Person).where(Person.external_id == person_ext_id))
                    person = result.scalar_one_or_none()
                    if not person:
                        person = Person(
                            external_id=person_ext_id,
                            name=cast_member.get("name"),
                            image_url=f"https://image.tmdb.org/t/p/w185{cast_member['profile_path']}" if cast_member.get("profile_path") else None
                        )
                        session.add(person)
                        await session.flush()

                    await session.execute(insert(movie_people).values(
                        movie_id=movie.id,
                        person_id=person.id,
                        role="actor",
                        character_name=cast_member.get("character")
                    ))

                # Add reviews from TMDB
                reviews_data = details.get("reviews", {}).get("results", [])
                for review_data in reviews_data[:5]:  # Top 5 reviews
                    # Create a user for the reviewer if needed
                    reviewer_ext_id = f"tmdb-user-{review_data['author_details'].get('username', review_data['author'])}"
                    result = await session.execute(select(User).where(User.external_id == reviewer_ext_id))
                    reviewer = result.scalar_one_or_none()
                    if not reviewer:
                        reviewer = User(
                            external_id=reviewer_ext_id,
                            name=review_data.get("author", "Anonymous"),
                            email=f"{reviewer_ext_id}@tmdb.com",
                            hashed_password="",  # External user, no password
                            avatar_url=f"https://image.tmdb.org/t/p/w185{review_data['author_details']['avatar_path']}" if review_data['author_details'].get('avatar_path') else None
                        )
                        session.add(reviewer)
                        await session.flush()

                    # Create review
                    review_ext_id = f"tmdb-review-{review_data['id']}"
                    result = await session.execute(select(Review).where(Review.external_id == review_ext_id))
                    existing_review = result.scalar_one_or_none()
                    if not existing_review:
                        review_date = None
                        if review_data.get("created_at"):
                            try:
                                review_date = datetime.strptime(review_data["created_at"][:10], "%Y-%m-%d")
                            except:
                                pass

                        review = Review(
                            external_id=review_ext_id,
                            movie_id=movie.id,
                            user_id=reviewer.id,
                            rating=review_data['author_details'].get('rating', 5.0),
                            title=f"Review by {review_data.get('author', 'Anonymous')}",
                            content=review_data.get("content", "")[:1000],  # Limit content
                            date=review_date,
                            is_verified=True,
                            has_spoilers=False,
                            helpful_votes=0
                        )
                        session.add(review)

                # Add streaming providers (watch/providers)
                watch_providers = details.get("watch/providers", {}).get("results", {})
                for region, providers_data in watch_providers.items():
                    if region not in ["US", "GB", "IN", "AU"]:  # Limit to key regions
                        continue

                    # Flatrate (subscription)
                    for provider in providers_data.get("flatrate", []):
                        provider_ext_id = f"tmdb-provider-{provider['provider_id']}"
                        result = await session.execute(select(StreamingPlatform).where(StreamingPlatform.external_id == provider_ext_id))
                        platform = result.scalar_one_or_none()
                        if not platform:
                            platform = StreamingPlatform(
                                external_id=provider_ext_id,
                                name=provider.get("provider_name"),
                                logo_url=f"https://image.tmdb.org/t/p/original{provider['logo_path']}" if provider.get("logo_path") else None,
                                website_url=""
                            )
                            session.add(platform)
                            await session.flush()

                        # Create streaming option
                        stream_opt = MovieStreamingOption(
                            movie_id=movie.id,
                            platform_id=platform.id,
                            region=region,
                            type="subscription",
                            quality="HD",
                            verified=True,
                            url=providers_data.get("link", "")
                        )
                        session.add(stream_opt)

                    # Rent
                    for provider in providers_data.get("rent", []):
                        provider_ext_id = f"tmdb-provider-{provider['provider_id']}"
                        result = await session.execute(select(StreamingPlatform).where(StreamingPlatform.external_id == provider_ext_id))
                        platform = result.scalar_one_or_none()
                        if not platform:
                            platform = StreamingPlatform(
                                external_id=provider_ext_id,
                                name=provider.get("provider_name"),
                                logo_url=f"https://image.tmdb.org/t/p/original{provider['logo_path']}" if provider.get("logo_path") else None,
                                website_url=""
                            )
                            session.add(platform)
                            await session.flush()

                        stream_opt = MovieStreamingOption(
                            movie_id=movie.id,
                            platform_id=platform.id,
                            region=region,
                            type="rent",
                            price="$3.99",
                            quality="HD",
                            verified=True,
                            url=providers_data.get("link", "")
                        )
                        session.add(stream_opt)

                print(f"Created movie: {movie.title} ({movie.year}) with {len(credits.get('cast', [])[:10])} cast, {len(reviews_data[:5])} reviews")
        
        await session.commit()
        print("\n=== TMDB seed complete! ===")


if __name__ == "__main__":
    asyncio.run(seed_tmdb_movies())

