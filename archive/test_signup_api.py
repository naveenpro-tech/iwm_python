#!/usr/bin/env python3
"""
Test signup API directly
"""

import asyncio
import httpx
import random
import string

API_BASE = "http://127.0.0.1:8000"

# Generate unique test user
random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
TEST_USER_EMAIL = f"apitest.{random_suffix}@example.com"
TEST_USER_PASSWORD = "ApiTest!23456789"
TEST_USER_NAME = f"API Test {random_suffix}"

async def test_signup_api():
    """Test signup via API"""
    async with httpx.AsyncClient() as client:
        print("Testing Signup API")
        print("=" * 60)
        print(f"Email: {TEST_USER_EMAIL}")
        print(f"Name: {TEST_USER_NAME}")
        print(f"Password: {TEST_USER_PASSWORD}")
        print("=" * 60)
        
        signup_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "name": TEST_USER_NAME
        }
        
        print("\n1. Sending signup request...")
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/auth/signup",
                json=signup_data,
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:500]}")
            
            if response.status_code in [200, 201]:
                print("\n✓ Signup successful!")
                data = response.json()
                print(f"   Access Token: {data.get('access_token', 'N/A')[:30]}...")
                return True
            else:
                print(f"\n✗ Signup failed!")
                return False
        except Exception as e:
            print(f"   Error: {e}")
            return False

if __name__ == "__main__":
    asyncio.run(test_signup_api())

