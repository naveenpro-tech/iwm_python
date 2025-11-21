#!/usr/bin/env python3
"""
Test Overview Tab API - Verify activity feed endpoints work correctly
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

async def test_activity_feed_api():
    """Test the activity feed API endpoints"""
    
    print("\n" + "="*80)
    print("OVERVIEW TAB - API TEST SUITE")
    print("="*80)
    
    async with httpx.AsyncClient() as client:
        # Step 1: Login to get JWT token
        print("\n[1/5] Logging in as test user...")
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
        
        # Step 2: Test reviews endpoint
        print("\n[2/5] Testing GET /api/v1/reviews?userId={userId}...")
        reviews_response = await client.get(
            f"{BASE_URL}/api/v1/reviews?userId={TEST_USER_ID}&page=1&limit=10",
            headers=headers
        )
        
        if reviews_response.status_code != 200:
            print(f"❌ Reviews endpoint failed: {reviews_response.status_code}")
            print(reviews_response.text)
            return False
        
        reviews_data = reviews_response.json()
        print(f"✅ Reviews endpoint works, returned {len(reviews_data)} reviews")
        
        if reviews_data:
            review = reviews_data[0]
            print(f"   Sample review: {review.get('title', 'N/A')} (rating: {review.get('rating')})")
            print(f"   Movie: {review.get('movie', {}).get('title', 'N/A')}")
            print(f"   Date: {review.get('date', 'N/A')}")
        
        # Step 3: Test watchlist endpoint
        print("\n[3/5] Testing GET /api/v1/watchlist?userId={userId}...")
        watchlist_response = await client.get(
            f"{BASE_URL}/api/v1/watchlist?userId={TEST_USER_ID}&page=1&limit=10",
            headers=headers
        )
        
        if watchlist_response.status_code != 200:
            print(f"❌ Watchlist endpoint failed: {watchlist_response.status_code}")
            print(watchlist_response.text)
            return False
        
        watchlist_data = watchlist_response.json()
        print(f"✅ Watchlist endpoint works, returned {len(watchlist_data)} items")
        
        if watchlist_data:
            item = watchlist_data[0]
            print(f"   Sample item: {item.get('movie', {}).get('title', 'N/A')}")
            print(f"   Status: {item.get('status', 'N/A')}")
            print(f"   Date added: {item.get('dateAdded', 'N/A')}")
        
        # Step 4: Verify data structure
        print("\n[4/5] Verifying data structure...")
        
        # Check reviews structure
        if reviews_data:
            review = reviews_data[0]
            required_fields = ["id", "title", "content", "rating", "date", "movie"]
            missing = [f for f in required_fields if f not in review]
            if missing:
                print(f"❌ Review missing fields: {missing}")
                return False
            print("✅ Review data structure is correct")
        
        # Check watchlist structure
        if watchlist_data:
            item = watchlist_data[0]
            required_fields = ["id", "status", "movie"]
            missing = [f for f in required_fields if f not in item]
            if missing:
                print(f"❌ Watchlist item missing fields: {missing}")
                return False
            print("✅ Watchlist data structure is correct")
        
        # Step 5: Test combined activity
        print("\n[5/5] Testing combined activity data...")
        
        total_activities = len(reviews_data) + len(watchlist_data)
        print(f"✅ Total activities available: {total_activities}")
        print(f"   - Reviews: {len(reviews_data)}")
        print(f"   - Watchlist items: {len(watchlist_data)}")
        
        if total_activities == 0:
            print("⚠️  No activities found (user may not have any reviews or watchlist items)")
        
        print("\n" + "="*80)
        print("✅ ALL API TESTS PASSED")
        print("="*80)
        return True

if __name__ == "__main__":
    try:
        result = asyncio.run(test_activity_feed_api())
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

