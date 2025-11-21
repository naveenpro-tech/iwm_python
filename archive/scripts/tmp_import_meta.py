import json, urllib.request, urllib.error
payload=[{
  "external_id": "manual-meta-1",
  "title": "Meta Test",
  "year": "2025",
  "release_date": "2025-06-01",
  "runtime": 123,
  "rating": "PG-13",
  "language": "English",
  "country": "United States",
  "overview": "One paragraph plot overview.",
  "poster_url": "https://example.com/poster.jpg",
  "backdrop_url": "https://example.com/backdrop.jpg",
  "budget": 100000000,
  "revenue": 350000000,
  "status": "released",
  "genres": ["Action", "Sci-Fi"]
}]
req=urllib.request.Request('http://127.0.0.1:8000/api/v1/admin/movies/import', data=json.dumps(payload).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
  with urllib.request.urlopen(req, timeout=25) as r:
    print(r.status)
    print(r.read().decode())
except urllib.error.HTTPError as e:
  print('HTTP', e.code)
  print(e.read().decode())

