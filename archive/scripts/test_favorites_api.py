"""Test favorites API directly to verify movieId is returned"""
import requests

BASE_URL = "http://localhost:8000"
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"

def main():
    # Login
    print("1. Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    login_data = login_response.json()
    token = login_data.get("access_token")
    print(f"   ✅ Token: {token[:20]}...")

    # Get favorites
    print("\n2. Getting favorites...")
    headers = {"Authorization": f"Bearer {token}"}
    favorites_response = requests.get(
        f"{BASE_URL}/api/v1/favorites?page=1&limit=100&type=movie",
        headers=headers
    )
    favorites_data = favorites_response.json()

    print(f"\n📊 Favorites Response:")
    print(f"   Status: {favorites_response.status_code}")
    print(f"   Count: {len(favorites_data.get('items', favorites_data))}")

    items = favorites_data.get('items', favorites_data)
    if items:
        print(f"\n📝 First Favorite:")
        first = items[0]
        for key, value in first.items():
            print(f"   {key}: {value}")

        # Check if movieId exists
        if "movieId" in first:
            print(f"\n✅ movieId field EXISTS: {first['movieId']}")
        else:
            print(f"\n❌ movieId field MISSING")
            print(f"   Available fields: {list(first.keys())}")
    else:
        print("\n⚠️  No favorites found")

if __name__ == "__main__":
    main()

