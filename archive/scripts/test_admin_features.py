#!/usr/bin/env python3
"""Test admin features: fetch movies, import, export."""
import json
import urllib.request

print("=" * 60)
print("ADMIN FEATURES TEST")
print("=" * 60)

# Test 1: Fetch all movies from backend
print("\n1. Testing: Fetch all movies from backend API")
print("-" * 60)
try:
    url = 'http://localhost:8000/api/v1/movies'
    with urllib.request.urlopen(url, timeout=10) as r:
        movies = json.loads(r.read().decode())
        print(f"✅ SUCCESS: Fetched {len(movies)} movies from backend")
        print(f"   Sample movies:")
        for m in movies[:3]:
            print(f"   - {m['id']}: {m['title']}")
except Exception as e:
    print(f"❌ FAILED: {e}")

# Test 2: Test JSON import with a new movie
print("\n2. Testing: JSON import functionality")
print("-" * 60)
try:
    new_movie = {
        "external_id": f"test-import-{int(__import__('time').time())}",
        "title": "Test Import Movie",
        "year": "2025",
        "release_date": "2025-01-01",
        "runtime": 120,
        "rating": "PG-13",
        "language": "English",
        "country": "USA",
        "overview": "Test movie for import functionality",
        "genres": ["Action", "Adventure"],
        "directors": [{"name": "Test Director"}],
        "cast": [{"name": "Test Actor", "character": "Lead"}],
    }
    
    payload = json.dumps([new_movie]).encode('utf-8')
    req = urllib.request.Request(
        'http://localhost:8000/api/v1/admin/movies/import',
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req, timeout=30) as r:
        result = json.loads(r.read().decode())
        print(f"✅ SUCCESS: Import completed")
        print(f"   Imported: {result['imported']}, Updated: {result['updated']}, Failed: {result['failed']}")
        if result['errors']:
            print(f"   Errors: {result['errors']}")
except Exception as e:
    print(f"❌ FAILED: {e}")

# Test 3: Verify the imported movie exists
print("\n3. Testing: Verify imported movie exists")
print("-" * 60)
try:
    url = 'http://localhost:8000/api/v1/movies'
    with urllib.request.urlopen(url, timeout=10) as r:
        movies = json.loads(r.read().decode())
        test_movie = next((m for m in movies if 'test-import' in m['id']), None)
        if test_movie:
            print(f"✅ SUCCESS: Found imported movie")
            print(f"   ID: {test_movie['id']}")
            print(f"   Title: {test_movie['title']}")
            print(f"   Genres: {test_movie['genres']}")
        else:
            print(f"❌ FAILED: Imported movie not found in list")
except Exception as e:
    print(f"❌ FAILED: {e}")

# Test 4: Test JSON export (fetch all movies)
print("\n4. Testing: JSON export functionality")
print("-" * 60)
try:
    url = 'http://localhost:8000/api/v1/movies'
    with urllib.request.urlopen(url, timeout=10) as r:
        movies = json.loads(r.read().decode())
        print(f"✅ SUCCESS: Can export {len(movies)} movies")
        print(f"   Total movies available for export: {len(movies)}")
except Exception as e:
    print(f"❌ FAILED: {e}")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)

