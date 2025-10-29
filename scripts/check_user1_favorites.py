"""Check what favorites user1 actually has in the database."""

import asyncio
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
    print("\n2. Getting favorites for user1...")
    headers = {"Authorization": f"Bearer {token}"}
    favorites_response = requests.get(
        f"{BASE_URL}/api/v1/favorites?page=1&limit=100&type=movie",
        headers=headers
    )
    
    print(f"   Status: {favorites_response.status_code}")
    favorites_data = favorites_response.json()
    
    if isinstance(favorites_data, list):
        print(f"   ✅ Got list with {len(favorites_data)} items")
        for i, fav in enumerate(favorites_data[:5]):
            print(f"      {i+1}. {fav.get('title', 'Unknown')} (ID: {fav.get('id')})")
    else:
        print(f"   ❌ Got object: {favorites_data}")

if __name__ == "__main__":
    main()

