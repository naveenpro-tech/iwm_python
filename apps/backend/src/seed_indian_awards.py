"""
Seed data for Indian and international award ceremonies.
Comprehensive list of 30+ major Indian awards across all languages and categories.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from .models import AwardCeremony
from .db import get_session, init_db
import asyncio


INDIAN_AWARDS_SEED_DATA = [
    # NATIONAL AWARDS
    {
        "external_id": "national-film-awards",
        "name": "National Film Awards",
        "short_name": "National Awards",
        "description": "India's highest film honors presented by the Directorate of Film Festivals",
        "country": "India",
        "language": "Multi-language",
        "category_type": "Film",
        "prestige_level": "national",
        "established_year": 1954,
        "is_active": True,
        "display_order": 1
    },
    
    # FILMFARE AWARDS - HINDI
    {
        "external_id": "filmfare-awards-hindi",
        "name": "Filmfare Awards",
        "short_name": "Filmfare",
        "description": "Prestigious awards for Hindi cinema presented by The Times Group",
        "country": "India",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1954,
        "is_active": True,
        "display_order": 2
    },
    
    # FILMFARE AWARDS SOUTH - TAMIL
    {
        "external_id": "filmfare-awards-tamil",
        "name": "Filmfare Awards South - Tamil",
        "short_name": "Filmfare Tamil",
        "description": "Filmfare Awards for Tamil cinema",
        "country": "India",
        "language": "Tamil",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1953,
        "is_active": True,
        "display_order": 3
    },
    
    # FILMFARE AWARDS SOUTH - TELUGU
    {
        "external_id": "filmfare-awards-telugu",
        "name": "Filmfare Awards South - Telugu",
        "short_name": "Filmfare Telugu",
        "description": "Filmfare Awards for Telugu cinema",
        "country": "India",
        "language": "Telugu",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1964,
        "is_active": True,
        "display_order": 4
    },
    
    # FILMFARE AWARDS SOUTH - MALAYALAM
    {
        "external_id": "filmfare-awards-malayalam",
        "name": "Filmfare Awards South - Malayalam",
        "short_name": "Filmfare Malayalam",
        "description": "Filmfare Awards for Malayalam cinema",
        "country": "India",
        "language": "Malayalam",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1964,
        "is_active": True,
        "display_order": 5
    },
    
    # FILMFARE AWARDS SOUTH - KANNADA
    {
        "external_id": "filmfare-awards-kannada",
        "name": "Filmfare Awards South - Kannada",
        "short_name": "Filmfare Kannada",
        "description": "Filmfare Awards for Kannada cinema",
        "country": "India",
        "language": "Kannada",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1970,
        "is_active": True,
        "display_order": 6
    },
    
    # IIFA AWARDS
    {
        "external_id": "iifa-awards",
        "name": "International Indian Film Academy Awards",
        "short_name": "IIFA",
        "description": "International awards celebrating Hindi cinema worldwide",
        "country": "International",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "international",
        "established_year": 2000,
        "is_active": True,
        "display_order": 7
    },
    
    # SCREEN AWARDS
    {
        "external_id": "screen-awards",
        "name": "Screen Awards",
        "short_name": "Screen",
        "description": "Annual awards for Hindi cinema by Express Group",
        "country": "India",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1995,
        "is_active": True,
        "display_order": 8
    },
    
    # ZEE CINE AWARDS
    {
        "external_id": "zee-cine-awards",
        "name": "Zee Cine Awards",
        "short_name": "Zee Cine",
        "description": "Popular awards for Hindi cinema by Zee Entertainment",
        "country": "India",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1998,
        "is_active": True,
        "display_order": 9
    },
    
    # STAR SCREEN AWARDS
    {
        "external_id": "star-screen-awards",
        "name": "Star Screen Awards",
        "short_name": "Star Screen",
        "description": "Awards for Hindi cinema by Star India",
        "country": "India",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 2004,
        "is_active": True,
        "display_order": 10
    },
    
    # STATE FILM AWARDS - TAMIL NADU
    {
        "external_id": "tamil-nadu-state-film-awards",
        "name": "Tamil Nadu State Film Awards",
        "short_name": "TN State Awards",
        "description": "Government of Tamil Nadu's official film awards",
        "country": "India",
        "language": "Tamil",
        "category_type": "Film",
        "prestige_level": "state",
        "established_year": 1967,
        "is_active": True,
        "display_order": 11
    },
    
    # STATE FILM AWARDS - KERALA
    {
        "external_id": "kerala-state-film-awards",
        "name": "Kerala State Film Awards",
        "short_name": "Kerala State Awards",
        "description": "Government of Kerala's official film awards",
        "country": "India",
        "language": "Malayalam",
        "category_type": "Film",
        "prestige_level": "state",
        "established_year": 1969,
        "is_active": True,
        "display_order": 12
    },
    
    # STATE FILM AWARDS - KARNATAKA
    {
        "external_id": "karnataka-state-film-awards",
        "name": "Karnataka State Film Awards",
        "short_name": "Karnataka State Awards",
        "description": "Government of Karnataka's official film awards",
        "country": "India",
        "language": "Kannada",
        "category_type": "Film",
        "prestige_level": "state",
        "established_year": 1966,
        "is_active": True,
        "display_order": 13
    },
    
    # NANDI AWARDS (ANDHRA PRADESH)
    {
        "external_id": "nandi-awards",
        "name": "Nandi Awards",
        "short_name": "Nandi",
        "description": "Government of Andhra Pradesh's official film awards",
        "country": "India",
        "language": "Telugu",
        "category_type": "Film",
        "prestige_level": "state",
        "established_year": 1964,
        "is_active": True,
        "display_order": 14
    },
    
    # STATE FILM AWARDS - WEST BENGAL
    {
        "external_id": "west-bengal-state-film-awards",
        "name": "West Bengal State Film Awards",
        "short_name": "WB State Awards",
        "description": "Government of West Bengal's official film awards",
        "country": "India",
        "language": "Bengali",
        "category_type": "Film",
        "prestige_level": "state",
        "established_year": 1968,
        "is_active": True,
        "display_order": 15
    },
    
    # STATE FILM AWARDS - MAHARASHTRA
    {
        "external_id": "maharashtra-state-film-awards",
        "name": "Maharashtra State Film Awards",
        "short_name": "Maharashtra State Awards",
        "description": "Government of Maharashtra's official film awards",
        "country": "India",
        "language": "Marathi",
        "category_type": "Film",
        "prestige_level": "state",
        "established_year": 1963,
        "is_active": True,
        "display_order": 16
    },

    # SIIMA (SOUTH INDIAN INTERNATIONAL MOVIE AWARDS)
    {
        "external_id": "siima",
        "name": "South Indian International Movie Awards",
        "short_name": "SIIMA",
        "description": "International awards for South Indian cinema",
        "country": "International",
        "language": "Multi-language",
        "category_type": "Film",
        "prestige_level": "international",
        "established_year": 2012,
        "is_active": True,
        "display_order": 17
    },

    # VIJAY AWARDS (TAMIL)
    {
        "external_id": "vijay-awards",
        "name": "Vijay Awards",
        "short_name": "Vijay",
        "description": "Popular awards for Tamil cinema by Star Vijay",
        "country": "India",
        "language": "Tamil",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 2006,
        "is_active": True,
        "display_order": 18
    },

    # SANTOSHAM FILM AWARDS (TELUGU)
    {
        "external_id": "santosham-film-awards",
        "name": "Santosham Film Awards",
        "short_name": "Santosham",
        "description": "Popular awards for Telugu cinema",
        "country": "India",
        "language": "Telugu",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 2003,
        "is_active": True,
        "display_order": 19
    },

    # ASIANET FILM AWARDS (MALAYALAM)
    {
        "external_id": "asianet-film-awards",
        "name": "Asianet Film Awards",
        "short_name": "Asianet",
        "description": "Popular awards for Malayalam cinema",
        "country": "India",
        "language": "Malayalam",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 1998,
        "is_active": True,
        "display_order": 20
    },

    # MIRCHI MUSIC AWARDS
    {
        "external_id": "mirchi-music-awards",
        "name": "Mirchi Music Awards",
        "short_name": "Mirchi Music",
        "description": "Awards for Indian film music by Radio Mirchi",
        "country": "India",
        "language": "Multi-language",
        "category_type": "Music",
        "prestige_level": "industry",
        "established_year": 2008,
        "is_active": True,
        "display_order": 21
    },

    # INDIAN TELEVISION ACADEMY AWARDS
    {
        "external_id": "ita-awards",
        "name": "Indian Television Academy Awards",
        "short_name": "ITA Awards",
        "description": "Awards for Indian television industry",
        "country": "India",
        "language": "Multi-language",
        "category_type": "Television",
        "prestige_level": "industry",
        "established_year": 2001,
        "is_active": True,
        "display_order": 22
    },

    # INDIAN TELLY STREAMING AWARDS
    {
        "external_id": "indian-telly-streaming-awards",
        "name": "Indian Telly Streaming Awards",
        "short_name": "Telly Streaming",
        "description": "Awards for OTT and streaming content",
        "country": "India",
        "language": "Multi-language",
        "category_type": "OTT",
        "prestige_level": "industry",
        "established_year": 2020,
        "is_active": True,
        "display_order": 23
    },

    # FILMFARE OTT AWARDS
    {
        "external_id": "filmfare-ott-awards",
        "name": "Filmfare OTT Awards",
        "short_name": "Filmfare OTT",
        "description": "Filmfare awards for OTT content",
        "country": "India",
        "language": "Multi-language",
        "category_type": "OTT",
        "prestige_level": "industry",
        "established_year": 2020,
        "is_active": True,
        "display_order": 24
    },

    # DADASAHEB PHALKE AWARD
    {
        "external_id": "dadasaheb-phalke-award",
        "name": "Dadasaheb Phalke Award",
        "short_name": "Dadasaheb Phalke",
        "description": "India's highest award in cinema - Lifetime Achievement",
        "country": "India",
        "language": "Multi-language",
        "category_type": "Film",
        "prestige_level": "national",
        "established_year": 1969,
        "is_active": True,
        "display_order": 25
    },

    # FILM CRITICS GUILD AWARDS
    {
        "external_id": "film-critics-guild-awards",
        "name": "Film Critics Guild Awards",
        "short_name": "Critics Guild",
        "description": "Awards by film critics for Indian cinema",
        "country": "India",
        "language": "Multi-language",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 2018,
        "is_active": True,
        "display_order": 26
    },

    # PRODUCERS GUILD FILM AWARDS
    {
        "external_id": "producers-guild-film-awards",
        "name": "Producers Guild Film Awards",
        "short_name": "Producers Guild",
        "description": "Awards by film producers for Hindi cinema",
        "country": "India",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 2004,
        "is_active": True,
        "display_order": 27
    },

    # STARDUST AWARDS
    {
        "external_id": "stardust-awards",
        "name": "Stardust Awards",
        "short_name": "Stardust",
        "description": "Popular awards for Hindi cinema",
        "country": "India",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 2003,
        "is_active": True,
        "display_order": 28
    },

    # BIG STAR ENTERTAINMENT AWARDS
    {
        "external_id": "big-star-entertainment-awards",
        "name": "BIG Star Entertainment Awards",
        "short_name": "BIG Star",
        "description": "Entertainment awards by BIG FM",
        "country": "India",
        "language": "Multi-language",
        "category_type": "Film",
        "prestige_level": "industry",
        "established_year": 2010,
        "is_active": True,
        "display_order": 29
    },

    # BOLLYWOOD MOVIE AWARDS
    {
        "external_id": "bollywood-movie-awards",
        "name": "Bollywood Movie Awards",
        "short_name": "BMA",
        "description": "International awards for Hindi cinema",
        "country": "International",
        "language": "Hindi",
        "category_type": "Film",
        "prestige_level": "international",
        "established_year": 1999,
        "is_active": True,
        "display_order": 30
    },

    # INTERNATIONAL AWARDS (for comparison)
    {
        "external_id": "academy-awards",
        "name": "Academy Awards",
        "short_name": "Oscars",
        "description": "The most prestigious film awards in the world",
        "country": "USA",
        "language": "English",
        "category_type": "Film",
        "prestige_level": "international",
        "established_year": 1929,
        "is_active": True,
        "display_order": 100
    },

    {
        "external_id": "golden-globe-awards",
        "name": "Golden Globe Awards",
        "short_name": "Golden Globes",
        "description": "Awards for film and television by Hollywood Foreign Press",
        "country": "USA",
        "language": "English",
        "category_type": "Film",
        "prestige_level": "international",
        "established_year": 1944,
        "is_active": True,
        "display_order": 101
    },

    {
        "external_id": "bafta-awards",
        "name": "British Academy Film Awards",
        "short_name": "BAFTA",
        "description": "British film awards by BAFTA",
        "country": "UK",
        "language": "English",
        "category_type": "Film",
        "prestige_level": "international",
        "established_year": 1947,
        "is_active": True,
        "display_order": 102
    },
]


async def seed_indian_awards():
    """Seed Indian award ceremonies into the database."""
    from sqlalchemy import select

    # Initialize database
    await init_db()

    session_gen = get_session()
    session = await anext(session_gen)

    if session is None:
        print("Error: Could not create database session")
        return

    try:
        # Check if awards already exist
        result = await session.execute(
            select(AwardCeremony).where(AwardCeremony.external_id == "national-film-awards")
        )
        existing = result.scalar_one_or_none()

        if existing:
            print("Indian awards already seeded. Skipping...")
            return

        # Insert all Indian awards
        for award_data in INDIAN_AWARDS_SEED_DATA:
            award = AwardCeremony(**award_data)
            session.add(award)

        await session.commit()
        print(f"Successfully seeded {len(INDIAN_AWARDS_SEED_DATA)} Indian award ceremonies!")

    except Exception as e:
        await session.rollback()
        print(f"Error seeding Indian awards: {e}")
        raise
    finally:
        await session.close()


if __name__ == "__main__":
    asyncio.run(seed_indian_awards())

