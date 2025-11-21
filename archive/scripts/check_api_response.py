"""Check API response for movieId field"""
import urllib.request
import json

BASE_URL = "http://localhost:8000"

# Login
login_data = json.dumps({"email": "user1@iwm.com", "password": "rmrnn0077"}).encode()
login_req = urllib.request.Request(
    f"{BASE_URL}/api/v1/auth/login",
    data=login_data,
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(login_req) as response:
    login_result = json.loads(response.read())
    token = login_result["access_token"]
    print(f"✅ Logged in, token: {token[:20]}...")

# Get favorites
favorites_req = urllib.request.Request(
    f"{BASE_URL}/api/v1/favorites?page=1&limit=100&type=movie",
    headers={"Authorization": f"Bearer {token}"}
)
with urllib.request.urlopen(favorites_req) as response:
    favorites_result = json.loads(response.read())

    # API returns a list directly
    if isinstance(favorites_result, list):
        items = favorites_result
    else:
        items = favorites_result.get("items", [])

    print(f"\n📊 Favorites count: {len(items)}")

    if items:
        print(f"\n📝 First favorite (full JSON):")
        print(json.dumps(items[0], indent=2))

        if "movieId" in items[0]:
            print(f"\n✅ SUCCESS: movieId field EXISTS!")
        else:
            print(f"\n❌ FAIL: movieId field MISSING")
    else:
        print("\n⚠️  No favorites found")

