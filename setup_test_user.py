#!/usr/bin/env python3
"""
Setup test user for GUI testing
"""

import asyncio
import httpx
import json

API_BASE = "http://127.0.0.1:8000"
TEST_USER_EMAIL = "critic.tester@example.com"
TEST_USER_PASSWORD = "Test!23456789"
TEST_USER_NAME = "Critic Tester"

async def create_test_user():
    """Create a test user via API"""
    async with httpx.AsyncClient() as client:
        print("1. Attempting to create test user...")
        
        signup_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "name": TEST_USER_NAME
        }
        
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/auth/signup",
                json=signup_data,
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            
            if response.status_code in [200, 201]:
                print("   ✓ User created successfully!")
                data = response.json()
                print(f"   User ID: {data.get('id')}")
                print(f"   Email: {data.get('email')}")
                return True
            elif response.status_code == 409:
                print("   ℹ User already exists")
                return True
            else:
                print(f"   ✗ Failed to create user: {response.status_code}")
                return False
        except Exception as e:
            print(f"   ✗ Error: {e}")
            return False

async def verify_login():
    """Verify the user can login"""
    async with httpx.AsyncClient() as client:
        print("\n2. Verifying login...")
        
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/auth/login",
                json=login_data,
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("   ✓ Login successful!")
                print(f"   Access Token: {data.get('access_token')[:20]}...")
                print(f"   User ID: {data.get('user', {}).get('id')}")
                return True
            else:
                print(f"   ✗ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"   ✗ Error: {e}")
            return False

async def main():
    """Main function"""
    print("=" * 60)
    print("TEST USER SETUP")
    print("=" * 60)
    print(f"Email: {TEST_USER_EMAIL}")
    print(f"Password: {TEST_USER_PASSWORD}")
    print(f"Name: {TEST_USER_NAME}")
    print("=" * 60)
    
    # Create user
    created = await create_test_user()
    
    if created:
        # Verify login
        await verify_login()
    
    print("\n" + "=" * 60)
    print("Setup complete!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())

