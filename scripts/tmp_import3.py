import json, urllib.request, urllib.error
payload=[{
  "external_id": "manual-gem-sample",
  "title": "Sample Movie Title",
  "year": "2025",
  "release_date": "2025-06-01",
  "runtime": 123,
  "rating": "PG-13",
  "siddu_score": 8.2,
  "critics_score": 82.5,
  "imdb_rating": 7.8,
  "rotten_tomatoes_score": 90,
  "language": "English",
  "country": "United States",
  "overview": "One paragraph plot overview.",
  "poster_url": "https://example.com/poster.jpg",
  "backdrop_url": "https://example.com/backdrop.jpg",
  "budget": 100000000,
  "revenue": 350000000,
  "status": "released",
  "genres": ["Action", "Sci-Fi"],
  "directors": [{ "name": "Jane Director", "image": None }],
  "cast": [ { "name": "John Star", "character": "Hero", "image": None } ],
  "streaming": [
    { "platform": "Netflix", "region": "US", "type": "subscription", "price": None, "quality": "HD", "url": "https://netflix.com/title/xyz" }
  ],
  "trivia": [ {"question": "Trivia Q", "category": "General", "answer": "A1", "explanation": "E1"} ],
  "timeline": [ {"date": "2025-06-01", "title": "Theatrical Release", "description": "Released in US", "type": "Theatrical"} ]
}]

req=urllib.request.Request('http://127.0.0.1:8000/api/v1/admin/movies/import', data=json.dumps(payload).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
  with urllib.request.urlopen(req, timeout=25) as r:
    print(r.status)
    print(r.read().decode())
except urllib.error.HTTPError as e:
  print('HTTP', e.code)
  print(e.read().decode())

