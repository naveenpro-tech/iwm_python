#!/usr/bin/env python3
"""
Import 50+ popular movies into IWM database
This script imports a curated list of popular movies with complete metadata
"""

import json
import sys
import urllib.request
import urllib.error

URL = "http://localhost:8000/api/v1/admin/movies/import"

# 50+ Popular Movies with Complete Metadata
MOVIES = [
    {
        "external_id": "tt0111161",
        "title": "The Shawshank Redemption",
        "tagline": "Fear can hold you prisoner. Hope can set you free.",
        "year": "1994",
        "release_date": "1994-09-23",
        "runtime": 142,
        "imdb_rating": 9.3,
        "language": "English",
        "country": "United States",
        "overview": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "poster_url": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
        "budget": 25000000,
        "revenue": 28341469,
        "status": "released",
        "genres": ["Drama"],
        "directors": [{"name": "Frank Darabont"}],
        "writers": [{"name": "Stephen King"}, {"name": "Frank Darabont"}],
        "cast": [
            {"name": "Tim Robbins", "character": "Andy Dufresne"},
            {"name": "Morgan Freeman", "character": "Ellis Boyd 'Red' Redding"},
            {"name": "Bob Gunton", "character": "Warden Norton"},
            {"name": "William Sadler", "character": "Heywood"}
        ],
        "streaming": [
            {"platform": "Netflix", "region": "US", "type": "subscription", "quality": "4K"},
            {"platform": "Amazon Prime", "region": "US", "type": "subscription", "quality": "HD"}
        ]
    },
    {
        "external_id": "tt0068646",
        "title": "The Godfather",
        "tagline": "An offer you can't refuse.",
        "year": "1972",
        "release_date": "1972-03-24",
        "runtime": 175,
        "imdb_rating": 9.2,
        "language": "English",
        "country": "United States",
        "overview": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        "poster_url": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
        "budget": 6000000,
        "revenue": 246120974,
        "status": "released",
        "genres": ["Crime", "Drama"],
        "directors": [{"name": "Francis Ford Coppola"}],
        "writers": [{"name": "Mario Puzo"}, {"name": "Francis Ford Coppola"}],
        "cast": [
            {"name": "Marlon Brando", "character": "Don Vito Corleone"},
            {"name": "Al Pacino", "character": "Michael Corleone"},
            {"name": "James Caan", "character": "Sonny Corleone"},
            {"name": "Robert Duvall", "character": "Tom Hagen"}
        ],
        "streaming": [
            {"platform": "Paramount+", "region": "US", "type": "subscription", "quality": "4K"}
        ]
    },
    {
        "external_id": "tt0468569",
        "title": "The Dark Knight",
        "tagline": "Why So Serious?",
        "year": "2008",
        "release_date": "2008-07-18",
        "runtime": 152,
        "imdb_rating": 9.0,
        "language": "English",
        "country": "United States",
        "overview": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
        "poster_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
        "budget": 185000000,
        "revenue": 1004558444,
        "status": "released",
        "genres": ["Action", "Crime", "Drama", "Thriller"],
        "directors": [{"name": "Christopher Nolan"}],
        "writers": [{"name": "Jonathan Nolan"}, {"name": "Christopher Nolan"}],
        "cast": [
            {"name": "Christian Bale", "character": "Bruce Wayne / Batman"},
            {"name": "Heath Ledger", "character": "Joker"},
            {"name": "Aaron Eckhart", "character": "Harvey Dent / Two-Face"},
            {"name": "Michael Caine", "character": "Alfred"}
        ],
        "streaming": [
            {"platform": "HBO Max", "region": "US", "type": "subscription", "quality": "4K"},
            {"platform": "Amazon Prime", "region": "US", "type": "rent", "quality": "HD"}
        ]
    },
    {
        "external_id": "tt0108052",
        "title": "Schindler's List",
        "tagline": "Whoever saves one life, saves the world entire.",
        "year": "1993",
        "release_date": "1993-12-15",
        "runtime": 195,
        "imdb_rating": 9.0,
        "language": "English",
        "country": "United States",
        "overview": "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
        "poster_url": "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
        "budget": 22000000,
        "revenue": 322161245,
        "status": "released",
        "genres": ["Drama", "History", "War"],
        "directors": [{"name": "Steven Spielberg"}],
        "writers": [{"name": "Thomas Keneally"}, {"name": "Steven Zaillian"}],
        "cast": [
            {"name": "Liam Neeson", "character": "Oskar Schindler"},
            {"name": "Ben Kingsley", "character": "Itzhak Stern"},
            {"name": "Ralph Fiennes", "character": "Amon Goeth"}
        ]
    },
    {
        "external_id": "tt0167260",
        "title": "The Lord of the Rings: The Return of the King",
        "tagline": "The eye of the enemy is moving.",
        "year": "2003",
        "release_date": "2003-12-17",
        "runtime": 201,
        "imdb_rating": 9.0,
        "language": "English",
        "country": "New Zealand",
        "overview": "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        "poster_url": "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg",
        "budget": 94000000,
        "revenue": 1146030912,
        "status": "released",
        "genres": ["Adventure", "Fantasy", "Action"],
        "directors": [{"name": "Peter Jackson"}],
        "writers": [{"name": "J.R.R. Tolkien"}, {"name": "Fran Walsh"}, {"name": "Philippa Boyens"}],
        "cast": [
            {"name": "Elijah Wood", "character": "Frodo Baggins"},
            {"name": "Ian McKellen", "character": "Gandalf"},
            {"name": "Viggo Mortensen", "character": "Aragorn"},
            {"name": "Orlando Bloom", "character": "Legolas"}
        ]
    },
    {
        "external_id": "tt0110912",
        "title": "Pulp Fiction",
        "tagline": "Just because you are a character doesn't mean you have character.",
        "year": "1994",
        "release_date": "1994-10-14",
        "runtime": 154,
        "imdb_rating": 8.9,
        "language": "English",
        "country": "United States",
        "overview": "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        "poster_url": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
        "budget": 8000000,
        "revenue": 213928762,
        "status": "released",
        "genres": ["Crime", "Drama"],
        "directors": [{"name": "Quentin Tarantino"}],
        "writers": [{"name": "Quentin Tarantino"}, {"name": "Roger Avary"}],
        "cast": [
            {"name": "John Travolta", "character": "Vincent Vega"},
            {"name": "Samuel L. Jackson", "character": "Jules Winnfield"},
            {"name": "Uma Thurman", "character": "Mia Wallace"},
            {"name": "Bruce Willis", "character": "Butch Coolidge"}
        ]
    },
    {
        "external_id": "tt0137523",
        "title": "Fight Club",
        "tagline": "Mischief. Mayhem. Soap.",
        "year": "1999",
        "release_date": "1999-10-15",
        "runtime": 139,
        "imdb_rating": 8.8,
        "language": "English",
        "country": "United States",
        "overview": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
        "poster_url": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
        "budget": 63000000,
        "revenue": 100853753,
        "status": "released",
        "genres": ["Drama"],
        "directors": [{"name": "David Fincher"}],
        "writers": [{"name": "Chuck Palahniuk"}, {"name": "Jim Uhls"}],
        "cast": [
            {"name": "Brad Pitt", "character": "Tyler Durden"},
            {"name": "Edward Norton", "character": "The Narrator"},
            {"name": "Helena Bonham Carter", "character": "Marla Singer"}
        ]
    },
    {
        "external_id": "tt0109830",
        "title": "Forrest Gump",
        "tagline": "The world will never be the same once you've seen it through the eyes of Forrest Gump.",
        "year": "1994",
        "release_date": "1994-07-06",
        "runtime": 142,
        "imdb_rating": 8.8,
        "language": "English",
        "country": "United States",
        "overview": "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
        "poster_url": "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/7c9UVPPiTPltouxRVY6N9uUaHDa.jpg",
        "budget": 55000000,
        "revenue": 678226465,
        "status": "released",
        "genres": ["Drama", "Romance"],
        "directors": [{"name": "Robert Zemeckis"}],
        "writers": [{"name": "Winston Groom"}, {"name": "Eric Roth"}],
        "cast": [
            {"name": "Tom Hanks", "character": "Forrest Gump"},
            {"name": "Robin Wright", "character": "Jenny Curran"},
            {"name": "Gary Sinise", "character": "Lieutenant Dan Taylor"}
        ]
    },
    {
        "external_id": "tt0133093",
        "title": "The Matrix",
        "tagline": "Welcome to the Real World.",
        "year": "1999",
        "release_date": "1999-03-31",
        "runtime": 136,
        "imdb_rating": 8.7,
        "language": "English",
        "country": "United States",
        "overview": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        "poster_url": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/icmmSD4vTTDKOq2vvdulafOGw93.jpg",
        "budget": 63000000,
        "revenue": 463517383,
        "status": "released",
        "genres": ["Action", "Science Fiction"],
        "directors": [{"name": "Lana Wachowski"}, {"name": "Lilly Wachowski"}],
        "cast": [
            {"name": "Keanu Reeves", "character": "Neo"},
            {"name": "Laurence Fishburne", "character": "Morpheus"},
            {"name": "Carrie-Anne Moss", "character": "Trinity"},
            {"name": "Hugo Weaving", "character": "Agent Smith"}
        ]
    },
    {
        "external_id": "tt0120737",
        "title": "The Lord of the Rings: The Fellowship of the Ring",
        "tagline": "One ring to rule them all.",
        "year": "2001",
        "release_date": "2001-12-19",
        "runtime": 178,
        "imdb_rating": 8.8,
        "language": "English",
        "country": "New Zealand",
        "overview": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        "poster_url": "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
        "backdrop_url": "https://image.tmdb.org/t/p/original/pIUvQ9Ed35wlWhY2oU6OmwEsmzG.jpg",
        "budget": 93000000,
        "revenue": 871368364,
        "status": "released",
        "genres": ["Adventure", "Fantasy", "Action"],
        "directors": [{"name": "Peter Jackson"}],
        "cast": [
            {"name": "Elijah Wood", "character": "Frodo Baggins"},
            {"name": "Ian McKellen", "character": "Gandalf"},
            {"name": "Viggo Mortensen", "character": "Aragorn"}
        ]
    }
]

def main():
    """Import movies into IWM database"""
    print(f"🎬 Importing {len(MOVIES)} popular movies...")
    print(f"📡 Target: {URL}\n")

    data = json.dumps(MOVIES).encode("utf-8")
    req = urllib.request.Request(
        URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            
            print("✅ Import completed successfully!")
            print(f"   - Imported: {result.get('imported', 0)} movies")
            print(f"   - Updated: {result.get('updated', 0)} movies")
            print(f"   - Failed: {result.get('failed', 0)} movies")
            
            if result.get('errors'):
                print("\n❌ Errors:")
                for error in result['errors']:
                    print(f"   - {error}")
            
            print("\n🎉 Done! Movies are now in the database.")
            print("   Next step: Run enrichment script to add trivia and timeline")
            
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error {e.code}")
        try:
            error_body = e.read().decode("utf-8")
            print(f"   Error details: {error_body}")
        except Exception:
            pass
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

