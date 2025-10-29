"""Test if new users see default favorites."""

import requests
import random

BASE_URL = "http://localhost:8000"

def main():
    # Create a new account
    email = f"testuser{random.randint(10000, 99999)}@iwm.com"
    password = "rmrnn0077"
    name = "Test User"
    
    print(f"1. Creating new account: {email}")
    signup_response = requests.post(
        f"{BASE_URL}/api/v1/auth/signup",
        json={"email": email, "password": password, "name": name}
    )
    
    if signup_response.status_code != 200:
        print(f"   ❌ Signup failed: {signup_response.status_code}")
        print(f"   {signup_response.json()}")
        return
    
    signup_data = signup_response.json()
    token = signup_data.get("access_token")
    print(f"   ✅ Account created, token: {token[:20]}...")

    # Get favorites for new user
    print(f"\n2. Getting favorites for new user...")
    headers = {"Authorization": f"Bearer {token}"}
    favorites_response = requests.get(
        f"{BASE_URL}/api/v1/favorites?page=1&limit=100&type=movie",
        headers=headers
    )
    
    print(f"   Status: {favorites_response.status_code}")
    favorites_data = favorites_response.json()
    
    if isinstance(favorites_data, list):
        print(f"   Got list with {len(favorites_data)} items")
        if len(favorites_data) == 0:
            print(f"   ✅ CORRECT: New user has NO favorites")
        else:
            print(f"   ❌ BUG: New user has {len(favorites_data)} favorites (should be 0)")
            for i, fav in enumerate(favorites_data[:5]):
                print(f"      {i+1}. {fav.get('title', 'Unknown')} (ID: {fav.get('id')})")
    else:
        print(f"   ❌ Got object: {favorites_data}")

if __name__ == "__main__":
    main()

