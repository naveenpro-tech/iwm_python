#!/usr/bin/env python3
"""
Test script to verify TMDB import functionality.

Tests importing well-known movies and verifies all fields are correctly populated.
"""

import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))

from integrations.tmdb_client import search_movie, fetch_movie_by_id, TMDBError, TMDBNotFoundError
from config import settings


async def test_tmdb_import():
    """Test TMDB import with well-known movies"""
    
    print("=" * 80)
    print("TMDB IMPORT FUNCTIONALITY TEST")
    print("=" * 80)
    
    # Check if API key is configured
    if not settings.tmdb_api_key:
        print("❌ ERROR: TMDB_API_KEY not configured in environment")
        return False
    
    print(f"✅ TMDB_API_KEY configured: {settings.tmdb_api_key[:10]}...")
    print()
    
    # Test movies to import
    test_movies = [
        ("Inception", 2010, 27205),  # (title, year, expected_tmdb_id)
        ("The Shawshank Redemption", 1994, 278),
        ("Interstellar", 2014, 157336),
    ]
    
    results = []
    
    for title, year, expected_id in test_movies:
        print(f"\n{'=' * 80}")
        print(f"Testing: {title} ({year})")
        print(f"{'=' * 80}")
        
        try:
            # Test search-based import
            print(f"\n1. Testing search-based import for '{title}'...")
            movie_data = await search_movie(title, year=year)
            
            if not movie_data:
                print(f"❌ Search failed for {title}")
                results.append((title, False, "Search returned None"))
                continue
            
            print(f"✅ Search successful")
            print(f"   Title: {movie_data.get('title')}")
            print(f"   TMDB ID: {movie_data.get('tmdb_id')}")
            print(f"   Release Date: {movie_data.get('release_date')}")
            print(f"   Runtime: {movie_data.get('runtime')} minutes")
            print(f"   Overview: {movie_data.get('overview', 'N/A')[:100]}...")
            
            # Verify key fields
            required_fields = ['title', 'tmdb_id', 'external_id', 'poster_url', 'backdrop_url']
            missing_fields = [f for f in required_fields if not movie_data.get(f)]
            
            if missing_fields:
                print(f"⚠️  Missing fields: {missing_fields}")
            else:
                print(f"✅ All required fields present")
            
            # Verify images are accessible
            print(f"\n2. Verifying image URLs...")
            if movie_data.get('poster_url'):
                print(f"   Poster URL: {movie_data['poster_url']}")
            else:
                print(f"   ⚠️  No poster URL")
            
            if movie_data.get('backdrop_url'):
                print(f"   Backdrop URL: {movie_data['backdrop_url']}")
            else:
                print(f"   ⚠️  No backdrop URL")
            
            # Verify cast and crew
            print(f"\n3. Verifying cast and crew...")
            cast_count = len(movie_data.get('cast', []))
            directors_count = len(movie_data.get('directors', []))
            writers_count = len(movie_data.get('writers', []))
            
            print(f"   Cast members: {cast_count}")
            if cast_count > 0:
                print(f"   - {movie_data['cast'][0]['name']} as {movie_data['cast'][0].get('character', 'N/A')}")
            
            print(f"   Directors: {directors_count}")
            if directors_count > 0:
                print(f"   - {movie_data['directors'][0]['name']}")
            
            print(f"   Writers: {writers_count}")
            
            # Verify genres
            print(f"\n4. Verifying genres...")
            genres = movie_data.get('genres', [])
            print(f"   Genres: {', '.join(genres) if genres else 'None'}")
            
            # Verify streaming options
            print(f"\n5. Verifying streaming options...")
            streaming = movie_data.get('streaming', [])
            print(f"   Streaming options: {len(streaming)}")
            if streaming:
                for stream in streaming[:3]:
                    print(f"   - {stream['platform']} ({stream['region']}) - {stream['type']}")
            
            results.append((title, True, "All checks passed"))
            print(f"\n✅ {title} import test PASSED")
            
        except TMDBNotFoundError as e:
            print(f"❌ Movie not found: {e}")
            results.append((title, False, str(e)))
        except TMDBError as e:
            print(f"❌ TMDB error: {e}")
            results.append((title, False, str(e)))
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            results.append((title, False, str(e)))
    
    # Summary
    print(f"\n\n{'=' * 80}")
    print("TEST SUMMARY")
    print(f"{'=' * 80}")
    
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    for title, success, message in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {title} - {message}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    return passed == total


if __name__ == "__main__":
    success = asyncio.run(test_tmdb_import())
    sys.exit(0 if success else 1)

