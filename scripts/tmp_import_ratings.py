import json, urllib.request, urllib.error
payload=[{
  "external_id": "manual-ratings-1",
  "title": "Ratings Test",
  "siddu_score": 8.2,
  "critics_score": 82.5,
  "imdb_rating": 7.8,
  "rotten_tomatoes_score": 90
}]
req=urllib.request.Request('http://127.0.0.1:8000/api/v1/admin/movies/import', data=json.dumps(payload).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
  with urllib.request.urlopen(req, timeout=25) as r:
    print(r.status)
    print(r.read().decode())
except urllib.error.HTTPError as e:
  print('HTTP', e.code)
  print(e.read().decode())

