import json, urllib.request, urllib.error
b = json.dumps({"query":"Oppenheimer","provider":"gemini"}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:8000/api/v1/admin/movies/enrich', data=b, headers={'Content-Type':'application/json'})
try:
  with urllib.request.urlopen(req, timeout=25) as r:
    print(r.status)
    print(r.read().decode())
except urllib.error.HTTPError as e:
  print('HTTP', e.code)
  print(e.read().decode())

