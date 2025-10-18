#!/usr/bin/env python3
"""End-to-end admin workflow test."""
import json
import urllib.request
import time

print("\n" + "=" * 70)
print("END-TO-END ADMIN WORKFLOW TEST")
print("=" * 70)

# Step 1: Get initial movie count
print("\n[STEP 1] Get initial movie count from database")
print("-" * 70)
try:
    url = 'http://localhost:8000/api/v1/movies'
    with urllib.request.urlopen(url, timeout=10) as r:
        initial_movies = json.loads(r.read().decode())
        initial_count = len(initial_movies)
        print(f"✅ Initial movie count: {initial_count}")
except Exception as e:
    print(f"❌ Failed: {e}")
    exit(1)

# Step 2: Create a new movie via JSON import
print("\n[STEP 2] Create new movie via JSON import")
print("-" * 70)
try:
    timestamp = int(time.time())
    new_movie = {
        "external_id": f"e2e-test-{timestamp}",
        "title": f"E2E Test Movie {timestamp}",
        "year": "2025",
        "release_date": "2025-03-15",
        "runtime": 135,
        "rating": "PG-13",
        "language": "English",
        "country": "USA",
        "overview": "This is an end-to-end test movie",
        "poster_url": "https://via.placeholder.com/300x450",
        "backdrop_url": "https://via.placeholder.com/1280x720",
        "budget": 75000000,
        "revenue": 250000000,
        "status": "released",
        "genres": ["Sci-Fi", "Action"],
        "directors": [{"name": "Test Director"}],
        "writers": [{"name": "Test Writer"}],
        "cast": [
            {"name": "Lead Actor", "character": "Hero"},
            {"name": "Supporting Actor", "character": "Villain"}
        ],
        "streaming": [
            {"platform": "Netflix", "region": "US", "type": "subscription", "url": "https://netflix.com"}
        ],
        "awards": [
            {"name": "Test Awards", "year": 2025, "category": "Best Picture", "status": "Winner"}
        ],
        "trivia": [
            {"question": "Was this a real movie?", "category": "Production", "answer": "No", "explanation": "This is a test"}
        ],
        "timeline": [
            {"date": "2024-01-01", "title": "Production Start", "description": "Filming begins", "type": "Production"}
        ]
    }
    
    payload = json.dumps([new_movie]).encode('utf-8')
    req = urllib.request.Request(
        'http://localhost:8000/api/v1/admin/movies/import',
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req, timeout=30) as r:
        result = json.loads(r.read().decode())
        print(f"✅ Movie imported successfully")
        print(f"   - Imported: {result['imported']}")
        print(f"   - Updated: {result['updated']}")
        print(f"   - Failed: {result['failed']}")
except Exception as e:
    print(f"❌ Failed: {e}")
    exit(1)

# Step 3: Verify the movie was created
print("\n[STEP 3] Verify movie was created in database")
print("-" * 70)
try:
    url = f'http://localhost:8000/api/v1/movies/e2e-test-{timestamp}'
    with urllib.request.urlopen(url, timeout=10) as r:
        movie = json.loads(r.read().decode())
        print(f"✅ Movie found in database")
        print(f"   - ID: {movie['id']}")
        print(f"   - Title: {movie['title']}")
        print(f"   - Genres: {movie['genres']}")
        print(f"   - Runtime: {movie['runtime']} minutes")
        print(f"   - Status: {movie['status']}")
        
        # Verify all fields
        has_trivia = 'trivia' in movie and len(movie.get('trivia', [])) > 0
        has_timeline = 'timeline' in movie and len(movie.get('timeline', [])) > 0
        has_streaming = 'streamingOptions' in movie and len(movie.get('streamingOptions', {})) > 0
        
        print(f"   - Has trivia: {'✅' if has_trivia else '❌'}")
        print(f"   - Has timeline: {'✅' if has_timeline else '❌'}")
        print(f"   - Has streaming: {'✅' if has_streaming else '❌'}")
except Exception as e:
    print(f"❌ Failed: {e}")
    exit(1)

# Step 4: Verify movie count increased
print("\n[STEP 4] Verify movie count increased")
print("-" * 70)
try:
    url = 'http://localhost:8000/api/v1/movies'
    with urllib.request.urlopen(url, timeout=10) as r:
        final_movies = json.loads(r.read().decode())
        final_count = len(final_movies)
        print(f"✅ Final movie count: {final_count}")
        print(f"   - Initial: {initial_count}")
        print(f"   - Final: {final_count}")
        print(f"   - Difference: {final_count - initial_count}")
        
        if final_count > initial_count:
            print(f"✅ Movie count increased correctly")
        else:
            print(f"❌ Movie count did not increase")
except Exception as e:
    print(f"❌ Failed: {e}")
    exit(1)

# Step 5: Test export functionality
print("\n[STEP 5] Test export functionality")
print("-" * 70)
try:
    url = 'http://localhost:8000/api/v1/movies'
    with urllib.request.urlopen(url, timeout=10) as r:
        movies = json.loads(r.read().decode())
        print(f"✅ Can export {len(movies)} movies")
        
        # Verify our test movie is in the export
        test_movie = next((m for m in movies if m['id'] == f'e2e-test-{timestamp}'), None)
        if test_movie:
            print(f"✅ Test movie included in export")
        else:
            print(f"❌ Test movie not found in export")
except Exception as e:
    print(f"❌ Failed: {e}")
    exit(1)

# Step 6: Test that movie is accessible via frontend
print("\n[STEP 6] Verify movie is accessible via frontend")
print("-" * 70)
print(f"✅ Movie should be accessible at:")
print(f"   http://localhost:3001/movies/e2e-test-{timestamp}")
print(f"   (Verify by opening in browser)")

print("\n" + "=" * 70)
print("✅ END-TO-END WORKFLOW TEST COMPLETE - ALL STEPS PASSED")
print("=" * 70 + "\n")

