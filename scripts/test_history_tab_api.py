#!/usr/bin/env python3
"""
Test History Tab API - Verify watch history endpoints work correctly
"""

import asyncio
import json
import sys
from datetime import datetime

# Add backend to path
sys.path.insert(0, "apps/backend")

import httpx

BASE_URL = "http://localhost:8000"
TEST_USER_ID = "user1"
TEST_USER_EMAIL = "user1@iwm.com"
TEST_USER_PASSWORD = "rmrnn0077"

async def test_history_api():
    """Test the watch history API endpoints"""
    
    print("\n" + "="*80)
    print("HISTORY TAB - API TEST SUITE")
    print("="*80)
    
    async with httpx.AsyncClient() as client:
        # Step 1: Login to get JWT token
        print("\n[1/4] Logging in as test user...")
        login_response = await client.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(login_response.text)
            return False
        
        token_data = login_response.json()
        access_token = token_data.get("access_token")
        print(f"✅ Login successful, token: {access_token[:20]}...")
        
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Step 2: Test watchlist endpoint with status=watched filter
        print("\n[2/4] Testing GET /api/v1/watchlist?userId={userId}&status=watched...")
        history_response = await client.get(
            f"{BASE_URL}/api/v1/watchlist?userId={TEST_USER_ID}&status=watched&page=1&limit=100",
            headers=headers
        )
        
        if history_response.status_code != 200:
            print(f"❌ History endpoint failed: {history_response.status_code}")
            print(history_response.text)
            return False
        
        history_data = history_response.json()
        print(f"✅ History endpoint works, returned {len(history_data)} watched items")
        
        if history_data:
            item = history_data[0]
            print(f"   Sample item: {item.get('movie', {}).get('title', 'N/A')}")
            print(f"   Status: {item.get('status', 'N/A')}")
            print(f"   Date added: {item.get('dateAdded', 'N/A')}")
            print(f"   Rating: {item.get('rating', 'N/A')}")
        
        # Step 3: Verify data structure
        print("\n[3/4] Verifying data structure...")
        
        if history_data:
            item = history_data[0]
            required_fields = ["id", "status", "movie", "dateAdded"]
            missing = [f for f in required_fields if f not in item]
            if missing:
                print(f"❌ History item missing fields: {missing}")
                return False
            
            # Check movie structure
            movie = item.get("movie", {})
            movie_fields = ["id", "title", "posterUrl", "year", "genres"]
            missing_movie = [f for f in movie_fields if f not in movie]
            if missing_movie:
                print(f"❌ Movie missing fields: {missing_movie}")
                return False
            
            print("✅ History data structure is correct")
        
        # Step 4: Verify status filter works
        print("\n[4/4] Verifying status filter...")
        
        if history_data:
            # All items should have status=watched
            all_watched = all(item.get("status") == "watched" for item in history_data)
            if not all_watched:
                print(f"❌ Not all items have status=watched")
                return False
            print(f"✅ All {len(history_data)} items have status=watched")
        else:
            print("⚠️  No watched items found (user may not have watched any movies)")
        
        print("\n" + "="*80)
        print("✅ ALL API TESTS PASSED")
        print("="*80)
        return True

if __name__ == "__main__":
    try:
        result = asyncio.run(test_history_api())
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

