"""
Test script for TMDB Dashboard API endpoints
Tests all 4 endpoints with proper authentication
"""

import asyncio
import httpx
import json
from datetime import datetime, timedelta
import jwt

# Configuration
API_BASE = "http://localhost:8000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"

# Test data
TEST_MOVIES = [
    {"tmdb_id": 550, "title": "Fight Club"},  # Well-known movie
    {"tmdb_id": 278, "title": "The Shawshank Redemption"},  # Another well-known
    {"tmdb_id": 238, "title": "The Godfather"},  # Classic
]

async def get_admin_token():
    """Get JWT token for admin user"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/v1/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            print(f"❌ Login failed: {response.text}")
            return None
        data = response.json()
        return data.get("access_token")

async def test_new_releases():
    """Test GET /api/v1/admin/tmdb/new-releases"""
    print("\n📺 Testing New Releases Endpoint...")
    token = await get_admin_token()
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        # Test with different categories
        for category in ["now_playing", "upcoming", "popular", "top_rated"]:
            response = await client.get(
                f"{API_BASE}/api/v1/admin/tmdb/new-releases",
                params={"category": category, "page": 1},
                headers=headers
            )
            
            if response.status_code != 200:
                print(f"  ❌ Category '{category}' failed: {response.status_code}")
                return False
            
            data = response.json()
            print(f"  ✅ {category}: {len(data['movies'])} movies, page {data['current_page']}/{data['total_pages']}")
    
    return True

async def test_search():
    """Test GET /api/v1/admin/tmdb/search"""
    print("\n🔍 Testing Search Endpoint...")
    token = await get_admin_token()
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        # Test search with different queries
        queries = [
            {"query": "Inception", "year": None},
            {"query": "Avatar", "year": 2009},
            {"query": "Matrix", "year": None},
        ]
        
        for test_case in queries:
            params = {"query": test_case["query"], "page": 1}
            if test_case["year"]:
                params["year"] = test_case["year"]
            
            response = await client.get(
                f"{API_BASE}/api/v1/admin/tmdb/search",
                params=params,
                headers=headers
            )
            
            if response.status_code != 200:
                print(f"  ❌ Search '{test_case['query']}' failed: {response.status_code}")
                return False
            
            data = response.json()
            print(f"  ✅ '{test_case['query']}': {len(data['movies'])} results")
    
    return True

async def test_check_exists():
    """Test GET /api/v1/admin/tmdb/check-exists/{tmdb_id}"""
    print("\n🔎 Testing Check Exists Endpoint...")
    token = await get_admin_token()
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        for movie in TEST_MOVIES:
            response = await client.get(
                f"{API_BASE}/api/v1/admin/tmdb/check-exists/{movie['tmdb_id']}",
                headers=headers
            )
            
            if response.status_code != 200:
                print(f"  ❌ Check exists for {movie['title']} failed: {response.status_code}")
                return False
            
            data = response.json()
            status = "already imported" if data["exists"] else "not imported"
            print(f"  ✅ {movie['title']} (ID: {movie['tmdb_id']}): {status}")
    
    return True

async def test_import():
    """Test POST /api/v1/admin/tmdb/import/{tmdb_id}"""
    print("\n📥 Testing Import Endpoint...")
    token = await get_admin_token()
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    async with httpx.AsyncClient() as client:
        for movie in TEST_MOVIES:
            # First check if it exists
            check_response = await client.get(
                f"{API_BASE}/api/v1/admin/tmdb/check-exists/{movie['tmdb_id']}",
                headers=headers
            )
            
            if check_response.json()["exists"]:
                print(f"  ⏭️  {movie['title']} already imported, skipping...")
                continue
            
            # Try to import
            response = await client.post(
                f"{API_BASE}/api/v1/admin/tmdb/import/{movie['tmdb_id']}",
                headers=headers
            )
            
            if response.status_code == 201:
                data = response.json()
                print(f"  ✅ {movie['title']} imported successfully (ID: {data['id']})")
            elif response.status_code == 409:
                print(f"  ⚠️  {movie['title']} already exists in database")
            else:
                print(f"  ❌ Import failed: {response.status_code} - {response.text}")
                return False
    
    return True

async def test_authentication():
    """Test that endpoints require authentication"""
    print("\n🔐 Testing Authentication...")
    
    async with httpx.AsyncClient() as client:
        # Try without token
        response = await client.get(
            f"{API_BASE}/api/v1/admin/tmdb/new-releases"
        )
        
        if response.status_code == 401:
            print("  ✅ Endpoints correctly require authentication")
            return True
        else:
            print(f"  ❌ Expected 401, got {response.status_code}")
            return False

async def main():
    """Run all tests"""
    print("=" * 60)
    print("TMDB DASHBOARD API TEST SUITE")
    print("=" * 60)
    
    tests = [
        ("Authentication", test_authentication),
        ("New Releases", test_new_releases),
        ("Search", test_search),
        ("Check Exists", test_check_exists),
        ("Import", test_import),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results[test_name] = "✅ PASS" if result else "❌ FAIL"
        except Exception as e:
            print(f"  ❌ Exception: {str(e)}")
            results[test_name] = "❌ ERROR"
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    for test_name, result in results.items():
        print(f"{test_name}: {result}")
    
    passed = sum(1 for r in results.values() if "✅" in r)
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())

