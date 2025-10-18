"""
Comprehensive seed script for 10 complete, realistic movies with all details.
This script populates ALL fields required by the movie detail page.
"""
import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    from . import db as dbmod
except ImportError:
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    import db as dbmod  # type: ignore

from .models import (
    Movie, Genre, Person, Scene, Review, User, StreamingPlatform, MovieStreamingOption,
    movie_genres, movie_people, AwardCeremony, AwardCeremonyYear, AwardCategory, AwardNomination,
    Pulse
)
from .config import settings

print(f"[seed_comprehensive] settings.database_url={settings.database_url}")


async def seed_comprehensive():
    """Seed 10 complete movies with all details"""
    await dbmod.init_db()
    if dbmod.SessionLocal is None:
        print("ERROR: Database not configured")
        return

    async with dbmod.SessionLocal() as session:
        # First, ensure we have genres
        genres_data = [
            ("action", "Action"),
            ("adventure", "Adventure"),
            ("sci-fi", "Sci-Fi"),
            ("thriller", "Thriller"),
            ("drama", "Drama"),
            ("crime", "Crime"),
            ("mystery", "Mystery"),
            ("fantasy", "Fantasy"),
            ("romance", "Romance"),
            ("comedy", "Comedy"),
            ("horror", "Horror"),
            ("animation", "Animation"),
            ("biography", "Biography"),
            ("war", "War"),
            ("western", "Western"),
        ]
        
        genre_map = {}
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
            ("netflix", "Netflix", "/netflix-inspired-logo.png", "https://www.netflix.com"),
            ("hbo-max", "HBO Max", "/hbo-max-logo.png", "https://www.hbomax.com"),
            ("amazon-prime", "Amazon Prime Video", "/amazon-prime-video-logo.png", "https://www.primevideo.com"),
            ("apple-tv", "Apple TV+", "/apple-tv-plus-logo.png", "https://tv.apple.com"),
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
        
        # Create test users for reviews and pulses
        test_users = []
        for i in range(1, 11):
            result = await session.execute(select(User).where(User.external_id == f"test-user-{i}"))
            user = result.scalar_one_or_none()
            if not user:
                from .security.password import hash_password
                user = User(
                    external_id=f"test-user-{i}",
                    email=f"testuser{i}@example.com",
                    hashed_password=hash_password("password123"),
                    name=f"Test User {i}",
                    avatar_url=f"/user-avatar-{i}.png"
                )
                session.add(user)
                await session.flush()
            test_users.append(user)
        
        await session.commit()
        
        # Now create 10 comprehensive movies
        movies_data = [
            {
                "external_id": "tt1375666",
                "title": "Inception",
                "tagline": "Your mind is the scene of the crime",
                "year": "2010",
                "release_date": datetime(2010, 7, 16),
                "runtime": 148,
                "rating": "PG-13",
                "siddu_score": 9.2,
                "critics_score": 8.8,
                "imdb_rating": 8.8,
                "rotten_tomatoes_score": 87,
                "language": "English",
                "country": "USA",
                "overview": "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved.",
                "poster_url": "/inception-movie-poster.png",
                "backdrop_url": "/dark-blue-city-skyline.png",
                "budget": 160000000,
                "revenue": 836800000,
                "status": "released",
                "genres": ["sci-fi", "action", "thriller", "adventure"],
                "director": {"external_id": "nm0634240", "name": "Christopher Nolan"},
                "cast": [
                    {"external_id": "nm0000138", "name": "Leonardo DiCaprio", "character": "Dom Cobb", "profile_url": "/leonardo-dicaprio.png"},
                    {"external_id": "nm0330687", "name": "Joseph Gordon-Levitt", "character": "Arthur", "profile_url": "/joseph-gordon-levitt.png"},
                    {"external_id": "nm0680983", "name": "Elliot Page", "character": "Ariadne", "profile_url": "/elliot-page.png"},
                    {"external_id": "nm0362766", "name": "Tom Hardy", "character": "Eames", "profile_url": "/tom-hardy.png"},
                ],
                "streaming": [
                    {"platform": "netflix", "region": "US", "type": "subscription", "quality": "4K", "price": None, "url": "https://www.netflix.com/title/70131314"},
                    {"platform": "amazon-prime", "region": "US", "type": "rent", "quality": "HD", "price": "$3.99", "url": "https://www.amazon.com/Inception"},
                ],
                "scenes": [
                    {"external_id": "inception-scene-1", "title": "The Rotating Hallway Fight", "description": "Arthur fights in zero gravity", "timestamp": "1:23:45", "duration": "3:12", "scene_type": "action"},
                    {"external_id": "inception-scene-2", "title": "Paris Folding", "description": "The city folds in on itself", "timestamp": "0:45:20", "duration": "2:30", "scene_type": "vfx"},
                ],
            },
            # Movie 2: The Dark Knight
            {
                "external_id": "tt0468569",
                "title": "The Dark Knight",
                "tagline": "Why So Serious?",
                "year": "2008",
                "release_date": datetime(2008, 7, 18),
                "runtime": 152,
                "rating": "PG-13",
                "siddu_score": 9.5,
                "critics_score": 9.0,
                "imdb_rating": 9.0,
                "rotten_tomatoes_score": 94,
                "language": "English",
                "country": "USA",
                "overview": "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
                "poster_url": "/dark-knight-poster.png",
                "backdrop_url": "/dark-knight-backdrop.png",
                "budget": 185000000,
                "revenue": 1005000000,
                "status": "released",
                "genres": ["action", "crime", "drama", "thriller"],
                "director": {"external_id": "nm0634240", "name": "Christopher Nolan"},
                "cast": [
                    {"external_id": "nm0000288", "name": "Christian Bale", "character": "Bruce Wayne / Batman", "profile_url": "/christian-bale.png"},
                    {"external_id": "nm0005132", "name": "Heath Ledger", "character": "Joker", "profile_url": "/heath-ledger.png"},
                    {"external_id": "nm0001173", "name": "Aaron Eckhart", "character": "Harvey Dent", "profile_url": "/aaron-eckhart.png"},
                ],
                "streaming": [
                    {"platform": "hbo-max", "region": "US", "type": "subscription", "quality": "4K", "price": None, "url": "https://www.hbomax.com/dark-knight"},
                ],
                "scenes": [
                    {"external_id": "tdk-scene-1", "title": "Bank Heist Opening", "description": "The Joker's elaborate bank robbery", "timestamp": "0:00:00", "duration": "6:45", "scene_type": "action"},
                ],
            },
            # Movie 3: The Matrix
            {
                "external_id": "tt0133093",
                "title": "The Matrix",
                "tagline": "Welcome to the Real World",
                "year": "1999",
                "release_date": datetime(1999, 3, 31),
                "runtime": 136,
                "rating": "R",
                "siddu_score": 9.1,
                "critics_score": 8.7,
                "imdb_rating": 8.7,
                "rotten_tomatoes_score": 88,
                "language": "English",
                "country": "USA",
                "overview": "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
                "poster_url": "/matrix-poster.png",
                "backdrop_url": "/matrix-backdrop.png",
                "budget": 63000000,
                "revenue": 467000000,
                "status": "released",
                "genres": ["sci-fi", "action"],
                "director": {"external_id": "nm0905154", "name": "Lana Wachowski"},
                "cast": [
                    {"external_id": "nm0000206", "name": "Keanu Reeves", "character": "Neo", "profile_url": "/keanu-reeves.png"},
                    {"external_id": "nm0000401", "name": "Laurence Fishburne", "character": "Morpheus", "profile_url": "/laurence-fishburne.png"},
                    {"external_id": "nm0005251", "name": "Carrie-Anne Moss", "character": "Trinity", "profile_url": "/carrie-anne-moss.png"},
                ],
                "streaming": [
                    {"platform": "hbo-max", "region": "US", "type": "subscription", "quality": "4K", "price": None, "url": "https://www.hbomax.com/matrix"},
                ],
                "scenes": [],
            },
            # Movie 4: Interstellar
            {
                "external_id": "tt0816692",
                "title": "Interstellar",
                "tagline": "Mankind was born on Earth. It was never meant to die here.",
                "year": "2014",
                "release_date": datetime(2014, 11, 7),
                "runtime": 169,
                "rating": "PG-13",
                "siddu_score": 9.0,
                "critics_score": 8.6,
                "imdb_rating": 8.6,
                "rotten_tomatoes_score": 72,
                "language": "English",
                "country": "USA",
                "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
                "poster_url": "/interstellar-poster.png",
                "backdrop_url": "/interstellar-backdrop.png",
                "budget": 165000000,
                "revenue": 677000000,
                "status": "released",
                "genres": ["sci-fi", "drama", "adventure"],
                "director": {"external_id": "nm0634240", "name": "Christopher Nolan"},
                "cast": [
                    {"external_id": "nm0000190", "name": "Matthew McConaughey", "character": "Cooper", "profile_url": "/matthew-mcconaughey.png"},
                    {"external_id": "nm0000531", "name": "Anne Hathaway", "character": "Brand", "profile_url": "/anne-hathaway.png"},
                    {"external_id": "nm0000323", "name": "Jessica Chastain", "character": "Murph", "profile_url": "/jessica-chastain.png"},
                ],
                "streaming": [
                    {"platform": "amazon-prime", "region": "US", "type": "rent", "quality": "4K", "price": "$3.99", "url": "https://www.amazon.com/interstellar"},
                ],
                "scenes": [],
            },
            # Movie 5: Parasite
            {
                "external_id": "tt6751668",
                "title": "Parasite",
                "tagline": "Act like you own the place",
                "year": "2019",
                "release_date": datetime(2019, 5, 30),
                "runtime": 132,
                "rating": "R",
                "siddu_score": 9.3,
                "critics_score": 9.2,
                "imdb_rating": 8.5,
                "rotten_tomatoes_score": 98,
                "language": "Korean",
                "country": "South Korea",
                "overview": "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
                "poster_url": "/parasite-poster.png",
                "backdrop_url": "/parasite-backdrop.png",
                "budget": 11400000,
                "revenue": 258000000,
                "status": "released",
                "genres": ["thriller", "drama", "comedy"],
                "director": {"external_id": "nm0094435", "name": "Bong Joon-ho"},
                "cast": [
                    {"external_id": "nm0158856", "name": "Song Kang-ho", "character": "Kim Ki-taek", "profile_url": "/song-kang-ho.png"},
                    {"external_id": "nm1659547", "name": "Lee Sun-kyun", "character": "Park Dong-ik", "profile_url": "/lee-sun-kyun.png"},
                ],
                "streaming": [
                    {"platform": "hulu", "region": "US", "type": "subscription", "quality": "HD", "price": None, "url": "https://www.hulu.com/parasite"},
                ],
                "scenes": [],
            },
            # Movie 6: The Shawshank Redemption
            {
                "external_id": "tt0111161",
                "title": "The Shawshank Redemption",
                "tagline": "Fear can hold you prisoner. Hope can set you free.",
                "year": "1994",
                "release_date": datetime(1994, 9, 23),
                "runtime": 142,
                "rating": "R",
                "siddu_score": 9.6,
                "critics_score": 9.3,
                "imdb_rating": 9.3,
                "rotten_tomatoes_score": 91,
                "language": "English",
                "country": "USA",
                "overview": "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates for his integrity and unquenchable sense of hope.",
                "poster_url": "/shawshank-poster.png",
                "backdrop_url": "/shawshank-backdrop.png",
                "budget": 25000000,
                "revenue": 58300000,
                "status": "released",
                "genres": ["drama", "crime"],
                "director": {"external_id": "nm0001104", "name": "Frank Darabont"},
                "cast": [
                    {"external_id": "nm0000209", "name": "Tim Robbins", "character": "Andy Dufresne", "profile_url": "/tim-robbins.png"},
                    {"external_id": "nm0000151", "name": "Morgan Freeman", "character": "Ellis Boyd 'Red' Redding", "profile_url": "/morgan-freeman.png"},
                ],
                "streaming": [
                    {"platform": "netflix", "region": "US", "type": "subscription", "quality": "HD", "price": None, "url": "https://www.netflix.com/shawshank"},
                ],
                "scenes": [],
            },
            # Movie 7: Pulp Fiction
            {
                "external_id": "tt0110912",
                "title": "Pulp Fiction",
                "tagline": "You won't know the facts until you've seen the fiction.",
                "year": "1994",
                "release_date": datetime(1994, 10, 14),
                "runtime": 154,
                "rating": "R",
                "siddu_score": 9.0,
                "critics_score": 8.9,
                "imdb_rating": 8.9,
                "rotten_tomatoes_score": 92,
                "language": "English",
                "country": "USA",
                "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
                "poster_url": "/pulp-fiction-poster.png",
                "backdrop_url": "/pulp-fiction-backdrop.png",
                "budget": 8000000,
                "revenue": 213900000,
                "status": "released",
                "genres": ["crime", "thriller"],
                "director": {"external_id": "nm0000233", "name": "Quentin Tarantino"},
                "cast": [
                    {"external_id": "nm0000237", "name": "John Travolta", "character": "Vincent Vega", "profile_url": "/john-travolta.png"},
                    {"external_id": "nm0000168", "name": "Samuel L. Jackson", "character": "Jules Winnfield", "profile_url": "/samuel-l-jackson.png"},
                    {"external_id": "nm0000235", "name": "Uma Thurman", "character": "Mia Wallace", "profile_url": "/uma-thurman.png"},
                ],
                "streaming": [
                    {"platform": "amazon-prime", "region": "US", "type": "subscription", "quality": "HD", "price": None, "url": "https://www.amazon.com/pulp-fiction"},
                ],
                "scenes": [],
            },
            # Movie 8: Spirited Away
            {
                "external_id": "tt0245429",
                "title": "Spirited Away",
                "tagline": "The tunnel led Chihiro to a mysterious town...",
                "year": "2001",
                "release_date": datetime(2001, 7, 20),
                "runtime": 125,
                "rating": "PG",
                "siddu_score": 9.4,
                "critics_score": 9.1,
                "imdb_rating": 8.6,
                "rotten_tomatoes_score": 97,
                "language": "Japanese",
                "country": "Japan",
                "overview": "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
                "poster_url": "/spirited-away-poster.png",
                "backdrop_url": "/spirited-away-backdrop.png",
                "budget": 19000000,
                "revenue": 395800000,
                "status": "released",
                "genres": ["animation", "fantasy", "adventure"],
                "director": {"external_id": "nm0594503", "name": "Hayao Miyazaki"},
                "cast": [
                    {"external_id": "nm0000619", "name": "Rumi Hiiragi", "character": "Chihiro (voice)", "profile_url": "/rumi-hiiragi.png"},
                ],
                "streaming": [
                    {"platform": "hbo-max", "region": "US", "type": "subscription", "quality": "HD", "price": None, "url": "https://www.hbomax.com/spirited-away"},
                ],
                "scenes": [],
            },
            # Movie 9: Gladiator
            {
                "external_id": "tt0172495",
                "title": "Gladiator",
                "tagline": "A Hero Will Rise",
                "year": "2000",
                "release_date": datetime(2000, 5, 5),
                "runtime": 155,
                "rating": "R",
                "siddu_score": 8.8,
                "critics_score": 8.5,
                "imdb_rating": 8.5,
                "rotten_tomatoes_score": 80,
                "language": "English",
                "country": "USA",
                "overview": "In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus is one of the Roman army's most capable and trusted generals and a key advisor to the emperor. As Marcus' devious son Commodus ascends to the throne, Maximus is set to be executed. He escapes, but is captured by slave traders. Renamed Spaniard and forced to become a gladiator, Maximus must battle to the death with other men for the amusement of paying audiences.",
                "poster_url": "/gladiator-poster.png",
                "backdrop_url": "/gladiator-backdrop.png",
                "budget": 103000000,
                "revenue": 460500000,
                "status": "released",
                "genres": ["action", "drama", "adventure"],
                "director": {"external_id": "nm0000631", "name": "Ridley Scott"},
                "cast": [
                    {"external_id": "nm0000128", "name": "Russell Crowe", "character": "Maximus", "profile_url": "/russell-crowe.png"},
                    {"external_id": "nm0001618", "name": "Joaquin Phoenix", "character": "Commodus", "profile_url": "/joaquin-phoenix.png"},
                ],
                "streaming": [
                    {"platform": "amazon-prime", "region": "US", "type": "rent", "quality": "4K", "price": "$3.99", "url": "https://www.amazon.com/gladiator"},
                ],
                "scenes": [],
            },
            # Movie 10: Forrest Gump
            {
                "external_id": "tt0109830",
                "title": "Forrest Gump",
                "tagline": "Life is like a box of chocolates...you never know what you're gonna get.",
                "year": "1994",
                "release_date": datetime(1994, 7, 6),
                "runtime": 142,
                "rating": "PG-13",
                "siddu_score": 8.9,
                "critics_score": 8.8,
                "imdb_rating": 8.8,
                "rotten_tomatoes_score": 71,
                "language": "English",
                "country": "USA",
                "overview": "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.",
                "poster_url": "/forrest-gump-poster.png",
                "backdrop_url": "/forrest-gump-backdrop.png",
                "budget": 55000000,
                "revenue": 678200000,
                "status": "released",
                "genres": ["drama", "romance"],
                "director": {"external_id": "nm0000709", "name": "Robert Zemeckis"},
                "cast": [
                    {"external_id": "nm0000158", "name": "Tom Hanks", "character": "Forrest Gump", "profile_url": "/tom-hanks.png"},
                    {"external_id": "nm0000705", "name": "Robin Wright", "character": "Jenny Curran", "profile_url": "/robin-wright.png"},
                ],
                "streaming": [
                    {"platform": "amazon-prime", "region": "US", "type": "subscription", "quality": "4K", "price": None, "url": "https://www.amazon.com/forrest-gump"},
                ],
                "scenes": [],
            },
        ]
        
        # Process each movie
        for movie_data in movies_data:
            # Check if movie exists
            result = await session.execute(select(Movie).where(Movie.external_id == movie_data["external_id"]))
            existing_movie = result.scalar_one_or_none()
            
            if existing_movie:
                print(f"Movie {movie_data['title']} already exists, skipping...")
                continue
            
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
                rotten_tomatoes_score=movie_data.get("rotten_tomatoes_score"),
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
                    from sqlalchemy import insert
                    await session.execute(insert(movie_genres).values(movie_id=movie.id, genre_id=genre_map[genre_slug].id))
            
            # Add director
            if "director" in movie_data:
                dir_data = movie_data["director"]
                result = await session.execute(select(Person).where(Person.external_id == dir_data["external_id"]))
                director = result.scalar_one_or_none()
                if not director:
                    director = Person(external_id=dir_data["external_id"], name=dir_data["name"])
                    session.add(director)
                    await session.flush()
                
                from sqlalchemy import insert
                await session.execute(insert(movie_people).values(
                    movie_id=movie.id,
                    person_id=director.id,
                    role="director",
                    character_name=None
                ))
            
            # Add cast
            for cast_member in movie_data.get("cast", []):
                result = await session.execute(select(Person).where(Person.external_id == cast_member["external_id"]))
                person = result.scalar_one_or_none()
                if not person:
                    person = Person(
                        external_id=cast_member["external_id"],
                        name=cast_member["name"],
                        image_url=cast_member.get("profile_url")
                    )
                    session.add(person)
                    await session.flush()
                
                from sqlalchemy import insert
                await session.execute(insert(movie_people).values(
                    movie_id=movie.id,
                    person_id=person.id,
                    role="actor",
                    character_name=cast_member.get("character")
                ))

            # Add streaming options
            for stream_data in movie_data.get("streaming", []):
                platform_key = stream_data["platform"]
                if platform_key in platform_map:
                    stream_ext_id = f"{movie.external_id}-{platform_key}-{stream_data['region']}-{stream_data['type']}"
                    result = await session.execute(select(MovieStreamingOption).where(MovieStreamingOption.external_id == stream_ext_id))
                    existing_stream = result.scalar_one_or_none()

                    if not existing_stream:
                        stream_option = MovieStreamingOption(
                            external_id=stream_ext_id,
                            movie_id=movie.id,
                            platform_id=platform_map[platform_key].id,
                            region=stream_data["region"],
                            type=stream_data["type"],
                            price=stream_data.get("price"),
                            quality=stream_data.get("quality"),
                            url=stream_data.get("url"),
                            verified=stream_data.get("verified", True)
                        )
                        session.add(stream_option)

            # Add scenes
            for scene_data in movie_data.get("scenes", []):
                result = await session.execute(select(Scene).where(Scene.external_id == scene_data["external_id"]))
                existing_scene = result.scalar_one_or_none()

                if not existing_scene:
                    scene = Scene(
                        external_id=scene_data["external_id"],
                        title=scene_data["title"],
                        description=scene_data.get("description"),
                        thumbnail_url=f"/scene-thumbnails/{scene_data['external_id']}.png",
                        duration_str=scene_data.get("duration"),
                        scene_type=scene_data.get("scene_type"),
                        movie_id=movie.id
                    )
                    session.add(scene)

            print(f"Created movie: {movie.title}")

        await session.commit()

        # Phase 2: Add reviews for each movie
        print("\n=== Adding reviews ===")
        review_templates = [
            {
                "rating": 10,
                "title": "A Masterpiece!",
                "content": "This film completely exceeded my expectations. The direction, acting, and cinematography are all top-notch. A must-watch for any cinema enthusiast.",
                "has_spoilers": False,
            },
            {
                "rating": 9,
                "title": "Excellent Film",
                "content": "One of the best films I've seen in years. The story is compelling, the performances are outstanding, and the technical aspects are flawless. Highly recommended.",
                "has_spoilers": False,
            },
            {
                "rating": 8,
                "title": "Great Movie",
                "content": "A solid film with great performances and an engaging story. Some minor pacing issues, but overall a very enjoyable experience.",
                "has_spoilers": False,
            },
            {
                "rating": 7,
                "title": "Good but not great",
                "content": "Enjoyable film with some standout moments, but it doesn't quite reach the heights it aims for. Still worth watching.",
                "has_spoilers": False,
            },
        ]

        # Get all movies
        all_movies_result = await session.execute(select(Movie))
        all_movies = all_movies_result.scalars().all()

        for movie in all_movies:
            # Add 2-4 reviews per movie
            import random
            num_reviews = random.randint(2, 4)
            selected_templates = random.sample(review_templates, num_reviews)

            for idx, template in enumerate(selected_templates):
                review_ext_id = f"{movie.external_id}-review-{idx+1}"
                result = await session.execute(select(Review).where(Review.external_id == review_ext_id))
                existing_review = result.scalar_one_or_none()

                if not existing_review:
                    # Pick a random test user
                    user = random.choice(test_users)
                    review = Review(
                        external_id=review_ext_id,
                        title=template["title"],
                        content=template["content"],
                        rating=template["rating"],
                        has_spoilers=template["has_spoilers"],
                        is_verified=random.choice([True, False]),
                        helpful_votes=random.randint(10, 200),
                        unhelpful_votes=random.randint(0, 20),
                        user_id=user.id,
                        movie_id=movie.id
                    )
                    session.add(review)

        await session.commit()
        print("Reviews added!")

        # Phase 3: Add pulses for popular movies
        print("\n=== Adding pulses ===")
        pulse_templates = [
            "Just rewatched {title} for the {nth} time and I'm still noticing new details. Absolute masterpiece! #{hashtag1} #{hashtag2}",
            "The cinematography in {title} is breathtaking. Every frame is a work of art. #{hashtag1} #{hashtag2}",
            "{title} remains one of the most influential films of all time. Its impact on cinema cannot be overstated. #{hashtag1}",
            "Unpopular opinion: {title} is overrated. Good, but not the masterpiece everyone claims it to be. #{hashtag1}",
            "The score in {title} is phenomenal. It elevates every scene to another level. #{hashtag1} #{hashtag2}",
        ]

        # Add pulses for first 5 movies
        for movie in all_movies[:5]:
            num_pulses = random.randint(2, 4)
            for idx in range(num_pulses):
                pulse_ext_id = f"{movie.external_id}-pulse-{idx+1}"
                result = await session.execute(select(Pulse).where(Pulse.external_id == pulse_ext_id))
                existing_pulse = result.scalar_one_or_none()

                if not existing_pulse:
                    user = random.choice(test_users)
                    template = random.choice(pulse_templates)
                    nth_words = ["2nd", "3rd", "5th", "10th"]
                    content_text = template.format(
                        title=movie.title,
                        nth=random.choice(nth_words),
                        hashtag1=movie.title.replace(" ", ""),
                        hashtag2="Cinema"
                    )

                    import json
                    hashtags_list = [movie.title.replace(" ", ""), "Cinema", "Movies"]

                    pulse = Pulse(
                        external_id=pulse_ext_id,
                        content_text=content_text,
                        user_id=user.id,
                        linked_movie_id=movie.id,
                        linked_type="movie",
                        linked_external_id=movie.external_id,
                        linked_title=movie.title,
                        linked_poster_url=movie.poster_url,
                        hashtags=json.dumps(hashtags_list),
                        reactions_total=random.randint(10, 500),
                        comments_count=random.randint(2, 50),
                        shares_count=random.randint(0, 20)
                    )
                    session.add(pulse)

        await session.commit()
        print("Pulses added!")

        print("\n=== Comprehensive seed complete! ===")


if __name__ == "__main__":
    asyncio.run(seed_comprehensive())

