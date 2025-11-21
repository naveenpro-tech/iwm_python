#!/usr/bin/env python3
"""Test import with Shawshank Redemption"""

import json
import sys
import urllib.request
import urllib.error

URL = "http://localhost:8000/api/v1/admin/movies/import"

# Just Shawshank
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
    }
]

def main():
    print(f"🎬 Importing Shawshank Redemption...")
    print(f"📡 Target: {URL}\n")
    
    print("Request payload:")
    print(json.dumps(MOVIES, indent=2))
    print()
    
    data = json.dumps(MOVIES).encode("utf-8")
    req = urllib.request.Request(
        URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            
            print("✅ Import completed!")
            print(f"   Result: {json.dumps(result, indent=2)}")
            
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
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

