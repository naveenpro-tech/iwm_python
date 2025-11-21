import json, urllib.request, urllib.error
payload=[{
  "external_id": "manual-tt-1",
  "title": "TT Test",
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

