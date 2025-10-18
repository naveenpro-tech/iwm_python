#!/usr/bin/env python3
"""Check if movies are available in the API."""
import json
import urllib.request

url = 'http://localhost:8000/api/v1/movies'
try:
    with urllib.request.urlopen(url, timeout=10) as r:
        data = json.loads(r.read().decode())
        print(f"Total movies: {len(data)}")
        # Find our test movie
        test_movie = next((m for m in data if m['id'] == 'manual-test-complete-1'), None)
        if test_movie:
            print("\n✅ Test movie found!")
            print(json.dumps(test_movie, indent=2))
        else:
            print("\n❌ Test movie not found in list")
            print("Available movies:")
            for m in data[:5]:
                print(f"  - {m['id']}: {m['title']}")
except Exception as e:
    print(f'Error: {e}')

