import sys, json, urllib.request

BASE = "http://localhost:8000/api/v1"
USER = {"email": "user1@iwm.com", "password": "rmrnn0077"}

def req(path, method="GET", data=None, headers=None):
    url = f"{BASE}{path}"
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Content-Type", "application/json")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read() or b"null")
    except urllib.error.HTTPError as e:
        try:
            content = json.loads(e.read() or b"null")
        except Exception:
            content = e.reason
        return e.code, content

# Login
status, data = req("/auth/login", method="POST", data=USER)
if status != 200:
    print("Login failed:", status, data)
    sys.exit(1)

token = data.get("access_token")
if not token:
    print("No token in response")
    sys.exit(1)

auth = {"Authorization": f"Bearer {token}"}

# Grab first movie
status, movies = req("/movies?page=1&limit=1", headers=auth)
if status != 200 or not isinstance(movies, list) or not movies:
    print("Movies fetch failed:", status, movies)
    sys.exit(1)
movie_id = movies[0].get("id")

# Get current user
status, me = req("/auth/me", headers=auth)
if status != 200:
    print("/auth/me failed:", status, me)
    sys.exit(1)
user_id = me["id"]

payload = {"userId": user_id, "movieId": movie_id, "status": "want-to-watch"}

s1, d1 = req("/watchlist", method="POST", data=payload, headers=auth)
s2, d2 = req("/watchlist", method="POST", data=payload, headers=auth)
print("POST #1:", s1, repr(d1))
print("POST #2:", s2, repr(d2))

# List and verify only one entry for that movie
s3, lst = req(f"/watchlist?userId={user_id}&limit=100", headers=auth)
items = lst if isinstance(lst, list) else lst.get("items", [])
count = sum(1 for it in items if it.get("movieId") == movie_id)
print("List length:", len(items))
print("Occurrences for movie", movie_id, ":", count)

# Show first 3 items' ids for debugging
print("First entries:", [it.get("id") for it in items[:3]])

if count != 1:
    print("FAIL: Duplicate entries still present")
    sys.exit(2)

print("PASS: No duplicates; create() is idempotent and list() dedup works")

