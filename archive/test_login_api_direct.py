#!/usr/bin/env python3
"""
Direct API test for login endpoint
Tests the backend login API directly without browser
"""

import asyncio
import json
import httpx

BACKEND_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"


async def test_login_api():
    """Test login API directly"""

    print("\n" + "="*80)
    print("🔍 DIRECT LOGIN API TEST")
    print("="*80)

    async with httpx.AsyncClient() as client:
        try:
            # Test 1: Check if backend is running
            print("\n📍 Test 1: Check if backend is running...")
            try:
                health = await client.get(f"{BACKEND_URL}/api/v1/health")
                print(f"✅ Backend is running: {health.status_code}")
                print(f"   Response: {health.json()}")
            except Exception as e:
                print(f"❌ Backend is NOT running: {e}")
                return

            # Test 2: Attempt login
            print("\n📍 Test 2: Attempt login with admin credentials...")
            login_data = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }

            print(f"   Email: {ADMIN_EMAIL}")
            print(f"   Password: {ADMIN_PASSWORD}")

            response = await client.post(
                f"{BACKEND_URL}/api/v1/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )

            print(f"\n   Status Code: {response.status_code}")
            print(f"   Headers: {dict(response.headers)}")

            if response.status_code == 200:
                print("✅ Login successful!")
                tokens = response.json()
                print(f"\n   Response:")
                print(f"   - access_token: {tokens.get('access_token', 'N/A')[:50]}...")
                print(f"   - refresh_token: {tokens.get('refresh_token', 'N/A')[:50]}...")
                print(f"   - token_type: {tokens.get('token_type', 'N/A')}")

                # Test 3: Use token to call /me endpoint
                print("\n📍 Test 3: Call /me endpoint with token...")
                access_token = tokens.get('access_token')
                me_response = await client.get(
                    f"{BACKEND_URL}/api/v1/auth/me",
                    headers={"Authorization": f"Bearer {access_token}"}
                )

                print(f"   Status Code: {me_response.status_code}")
                if me_response.status_code == 200:
                    print("✅ /me endpoint successful!")
                    user_data = me_response.json()
                    print(f"\n   User Data:")
                    print(f"   - ID: {user_data.get('id')}")
                    print(f"   - Email: {user_data.get('email')}")
                    print(f"   - Name: {user_data.get('name')}")
                    print(f"   - Is Admin: {user_data.get('is_admin')}")
                else:
                    print(f"❌ /me endpoint failed: {me_response.status_code}")
                    print(f"   Response: {me_response.text}")

                # Test 4: Call admin analytics endpoint
                print("\n📍 Test 4: Call /admin/analytics/overview endpoint...")
                admin_response = await client.get(
                    f"{BACKEND_URL}/api/v1/admin/analytics/overview",
                    headers={"Authorization": f"Bearer {access_token}"}
                )

                print(f"   Status Code: {admin_response.status_code}")
                if admin_response.status_code == 200:
                    print("✅ Admin endpoint successful!")
                    print(f"   Response: {admin_response.json()}")
                elif admin_response.status_code == 403:
                    print(f"❌ Admin endpoint returned 403 Forbidden")
                    print(f"   Response: {admin_response.text}")
                    print(f"   → User is authenticated but NOT admin")
                else:
                    print(f"❌ Admin endpoint failed: {admin_response.status_code}")
                    print(f"   Response: {admin_response.text}")

            elif response.status_code == 401:
                print("❌ Login failed: 401 Unauthorized")
                print(f"   Response: {response.json()}")
                print(f"   → Invalid credentials or user not found")
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")

        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_login_api())