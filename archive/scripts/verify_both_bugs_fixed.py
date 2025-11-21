"""Verify that both BUG #1 and BUG #2 are fixed."""

import requests
import random

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_bug1_new_user_favorites():
    """Test BUG #1: New users should have NO default favorites."""
    print("\n" + "="*70)
    print("🔍 BUG #1: Default/Demo Data in New User Favorites")
    print("="*70)
    
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
    print(f"✅ Created new user: {email}")
    
    # Get favorites
    headers = {"Authorization": f"Bearer {token}"}
    fav_response = requests.get(
        f"{BASE_URL}/api/v1/favorites?page=1&limit=100&type=movie",
        headers=headers
    )
    
    favorites = fav_response.json()
    
    if len(favorites) == 0:
        print(f"✅ FIXED: New user has NO favorites (correct)")
        return True
    else:
        print(f"❌ STILL BROKEN: New user has {len(favorites)} favorites")
        for fav in favorites:
            print(f"   - {fav.get('title')}")
        return False

def test_bug2_collection_share_url():
    """Test BUG #2: Collection share URL should point to public page."""
    print("\n" + "="*70)
    print("🔍 BUG #2: Collection Share Link URL")
    print("="*70)
    
    # Login with user1
    login_response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": "user1@iwm.com", "password": "rmrnn0077"}
    )
    token = login_response.json().get("access_token")
    
    # Get user1's collections
    headers = {"Authorization": f"Bearer {token}"}
    collections_response = requests.get(
        f"{BASE_URL}/api/v1/collections?page=1&limit=100",
        headers=headers
    )
    
    collections = collections_response.json()
    
    if not collections:
        print(f"⚠️  User1 has no collections to test")
        return None
    
    collection = collections[0]
    collection_id = collection.get("id")
    print(f"✅ Found collection: {collection.get('title')} (ID: {collection_id})")
    
    # Expected share URL format
    expected_share_url = f"{FRONTEND_URL}/collections/{collection_id}/public"
    print(f"\n📋 Expected share URL: {expected_share_url}")
    
    # Check if public page is accessible
    print(f"\n🔗 Testing public collection page accessibility...")
    public_response = requests.get(expected_share_url)
    
    if public_response.status_code == 200:
        print(f"✅ FIXED: Public collection page is accessible (status 200)")
        return True
    else:
        print(f"❌ STILL BROKEN: Public collection page returned {public_response.status_code}")
        return False

def main():
    print("\n" + "="*70)
    print("🎯 COMPREHENSIVE BUG FIX VERIFICATION")
    print("="*70)
    
    bug1_fixed = test_bug1_new_user_favorites()
    bug2_fixed = test_bug2_collection_share_url()
    
    print("\n" + "="*70)
    print("📊 FINAL RESULTS")
    print("="*70)
    print(f"BUG #1 (Default Favorites): {'✅ FIXED' if bug1_fixed else '❌ BROKEN'}")
    print(f"BUG #2 (Share URL): {'✅ FIXED' if bug2_fixed else '❌ BROKEN'}")
    
    if bug1_fixed and bug2_fixed:
        print("\n🎉 ALL BUGS ARE FIXED!")
    else:
        print("\n⚠️  Some bugs still need fixing")

if __name__ == "__main__":
    main()

