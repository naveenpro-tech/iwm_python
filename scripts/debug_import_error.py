#!/usr/bin/env python3
"""Debug import error."""
import json
import urllib.request
import urllib.error

import time
timestamp = int(time.time())
new_movie = {
    "external_id": f"debug-test-{timestamp}",
    "title": f"Debug Test Movie {timestamp}",
    "year": "2025",
    "release_date": "2025-03-15",
    "runtime": 135,
    "rating": "PG-13",
    "language": "English",
    "country": "USA",
    "overview": "This is a debug test movie",
    "poster_url": "https://via.placeholder.com/300x450",
    "backdrop_url": "https://via.placeholder.com/1280x720",
    "budget": 75000000,
    "revenue": 250000000,
    "status": "released",



}

payload = json.dumps([new_movie]).encode('utf-8')
req = urllib.request.Request(
    'http://localhost:8000/api/v1/admin/movies/import',
    data=payload,
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req, timeout=30) as r:
        result = json.loads(r.read().decode())
        print("SUCCESS:", json.dumps(result, indent=2))
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}")
    error_body = e.read().decode()
    print("Error response:")
    print(error_body)
    try:
        error_json = json.loads(error_body)
        print(json.dumps(error_json, indent=2))
    except:
        print(error_body)
except Exception as e:
    print(f"Error: {e}")

