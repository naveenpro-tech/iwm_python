import json, urllib.request, urllib.error
payload=[{
  "external_id": "manual-people-1",
  "title": "People Test",
  "directors": [{ "name": "Jane Director" }],
  "cast": [ { "name": "John Star", "character": "Hero" } ]
}]
req=urllib.request.Request('http://127.0.0.1:8000/api/v1/admin/movies/import', data=json.dumps(payload).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
  with urllib.request.urlopen(req, timeout=25) as r:
    print(r.status)
    print(r.read().decode())
except urllib.error.HTTPError as e:
  print('HTTP', e.code)
  print(e.read().decode())

