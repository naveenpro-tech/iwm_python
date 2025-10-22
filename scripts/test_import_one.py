#!/usr/bin/env python3
"""Test import with just one movie"""

import json
import sys
import urllib.request
import urllib.error

URL = "http://localhost:8000/api/v1/admin/movies/import"

# Just one simple movie
MOVIES = [
    {
        "external_id": "tt9999999",
        "title": "Test Movie",
        "year": "2024",
        "runtime": 120,
        "overview": "A test movie",
        "genres": ["Drama"],
        "directors": [{"name": "Test Director"}],
        "cast": [{"name": "Test Actor", "character": "Main Character"}]
    }
]

def main():
    print(f"🎬 Importing test movie...")
    print(f"📡 Target: {URL}\n")
    
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

