import json
import sys
import urllib.request
import urllib.error

URL = "http://localhost:8000/api/v1/admin/movies/import"

def main():
    # Build a minimal valid payload: array of MovieImportIn
    payload = [
        {
            "external_id": "manual-tt999",
            "title": "Manual Import Sample",
            "tagline": None,
            "year": "2024",
            "release_date": None,
            "runtime": 101,
            "rating": None,
            "siddu_score": None,
            "critics_score": None,
            "imdb_rating": None,
            "rotten_tomatoes_score": None,
            "language": "EN",
            "country": "United States",
            "overview": "Sample imported movie for testing.",
            "poster_url": None,
            "backdrop_url": None,
            "budget": None,
            "revenue": None,
            "status": "released",
            "genres": ["Drama"],
            "directors": [{"name": "John Doe"}],
            "writers": [],
            "producers": [],
            "cast": [{"name": "Jane Roe", "character": "Lead"}],
            "streaming": [
                {"platform": "Netflix", "region": "US", "type": "subscription", "price": None, "quality": None, "url": None}
            ],
        }
    ]
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            print(body)
    except urllib.error.HTTPError as e:
        print(f"HTTPError {e.code}")
        try:
            print(e.read().decode("utf-8"))
        except Exception:
            pass
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

