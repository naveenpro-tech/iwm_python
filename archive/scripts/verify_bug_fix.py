"""Verify that BUG #1 is fixed by testing with both existing and new users."""

import requests
import random

BASE_URL = "http://localhost:8000"

def test_existing_user():
    """Test existing user (user1) - should have their own favorites."""
    print("\n" + "="*60)
    print("TEST 1: Existing User (user1)")
    print("="*60)
    
    # Login
    login_response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": "user1@iwm.com", "password": "rmrnn0077"}
    )
    token = login_response.json().get("access_token")
    
    # Get favorites
    headers = {"Authorization": f"Bearer {token}"}
    fav_response = requests.get(
        f"{BASE_URL}/api/v1/favorites?page=1&limit=100&type=movie",
        headers=headers
    )
    
    favorites = fav_response.json()
    print(f"\nuser1 has {len(favorites)} favorites:")
    for fav in favorites:
        print(f"  - {fav.get('title')}")
    
    return len(favorites) > 0

def test_new_user():
    """Test new user - should have NO favorites."""
    print("\n" + "="*60)
    print("TEST 2: New User")
    print("="*60)
    
    email = f"testuser{random.randint(10000, 99999)}@iwm.com"
    password = "rmrnn0077"
    
    # Signup
    signup_response = requests.post(
        f"{BASE_URL}/api/v1/auth/signup",
        json={"email": email, "password": password, "name": "Test User"}
    )
    
    if signup_response.status_code != 200:
        print(f"❌ Signup failed: {signup_response.status_code}")
        return False
    
    token = signup_response.json().get("access_token")
    print(f"\n✅ Created new user: {email}")
    
    # Get favorites
    headers = {"Authorization": f"Bearer {token}"}
    fav_response = requests.get(
        f"{BASE_URL}/api/v1/favorites?page=1&limit=100&type=movie",
        headers=headers
    )
    
    favorites = fav_response.json()
    print(f"\nNew user has {len(favorites)} favorites")
    
    if len(favorites) == 0:
        print(f"✅ CORRECT: New user has NO favorites")
        return True
    else:
        print(f"❌ BUG: New user has {len(favorites)} favorites (should be 0)")
        for fav in favorites:
            print(f"  - {fav.get('title')}")
        return False

def main():
    print("\n" + "="*70)
    print("🔍 BUG #1 FIX VERIFICATION")
    print("="*70)
    
    test1_pass = test_existing_user()
    test2_pass = test_new_user()
    
    print("\n" + "="*70)
    print("RESULTS:")
    print("="*70)
    print(f"✅ Existing user has their favorites: {test1_pass}")
    print(f"✅ New user has NO default favorites: {test2_pass}")
    
    if test1_pass and test2_pass:
        print("\n🎉 BUG #1 IS FIXED!")
    else:
        print("\n❌ BUG #1 STILL EXISTS")

if __name__ == "__main__":
    main()

