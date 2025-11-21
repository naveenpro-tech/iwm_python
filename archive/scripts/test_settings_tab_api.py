#!/usr/bin/env python3
"""
Settings Tab API Tests
Tests the backend settings endpoints with authentication
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
TEST_USER_EMAIL = "user1@iwm.com"
TEST_USER_PASSWORD = "rmrnn0077"

async def login():
    """Login and get access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
        )
        
        if response.status_code != 200:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
            return None
        
        data = response.json()
        token = data.get("access_token")
        print(f"✅ Login successful")
        print(f"   Token: {token[:20]}...")
        return token

async def test_get_profile_settings(token):
    """Test GET /api/v1/settings/profile"""
    print("\n📋 Testing: GET /api/v1/settings/profile")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/api/v1/settings/profile",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 200:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
            return False
        
        data = response.json()
        print(f"✅ Success: {response.status_code}")
        print(f"   Data: {json.dumps(data, indent=2)}")
        return True

async def test_update_profile_settings(token):
    """Test PUT /api/v1/settings/profile"""
    print("\n📋 Testing: PUT /api/v1/settings/profile")
    
    update_data = {
        "fullName": "Test User Updated",
        "bio": "Updated bio from API test",
        "username": "testuser"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{BASE_URL}/api/v1/settings/profile",
            headers={"Authorization": f"Bearer {token}"},
            json=update_data
        )
        
        if response.status_code != 200:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
            return False
        
        data = response.json()
        print(f"✅ Success: {response.status_code}")
        print(f"   Updated data: {json.dumps(data, indent=2)}")
        return True

async def test_get_preferences(token):
    """Test GET /api/v1/settings/preferences"""
    print("\n📋 Testing: GET /api/v1/settings/preferences")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/api/v1/settings/preferences",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 200:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
            return False
        
        data = response.json()
        print(f"✅ Success: {response.status_code}")
        print(f"   Data: {json.dumps(data, indent=2)}")
        return True

async def test_update_preferences(token):
    """Test PUT /api/v1/settings/preferences"""
    print("\n📋 Testing: PUT /api/v1/settings/preferences")
    
    update_data = {
        "language": "en",
        "region": "us",
        "hideSpoilers": True
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{BASE_URL}/api/v1/settings/preferences",
            headers={"Authorization": f"Bearer {token}"},
            json=update_data
        )
        
        if response.status_code != 200:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
            return False
        
        data = response.json()
        print(f"✅ Success: {response.status_code}")
        print(f"   Updated data: {json.dumps(data, indent=2)}")
        return True

async def test_unauthorized_access():
    """Test that endpoints require authentication"""
    print("\n📋 Testing: Unauthorized access (no token)")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/api/v1/settings/profile"
        )
        
        if response.status_code == 401:
            print(f"✅ Correctly rejected: {response.status_code}")
            return True
        else:
            print(f"❌ Should have returned 401, got: {response.status_code}")
            return False

async def main():
    """Run all tests"""
    print("=" * 60)
    print("SETTINGS TAB - API TESTS")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Base URL: {BASE_URL}")
    print(f"Test User: {TEST_USER_EMAIL}")
    
    # Login
    token = await login()
    if not token:
        print("\n❌ Cannot proceed without authentication token")
        return
    
    # Run tests
    results = []
    results.append(("GET /settings/profile", await test_get_profile_settings(token)))
    results.append(("PUT /settings/profile", await test_update_profile_settings(token)))
    results.append(("GET /settings/preferences", await test_get_preferences(token)))
    results.append(("PUT /settings/preferences", await test_update_preferences(token)))
    results.append(("Unauthorized access", await test_unauthorized_access()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")

if __name__ == "__main__":
    asyncio.run(main())

