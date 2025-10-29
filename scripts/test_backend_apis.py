"""
Test backend APIs directly to verify they're working
"""

import asyncio
import httpx

BACKEND_URL = "http://localhost:8000"

async def test_apis():
    print("=" * 70)
    print("🔍 TESTING BACKEND APIs")
    print("=" * 70)
    
    async with httpx.AsyncClient() as client:
        # Test 1: Health check
        print("\n1️⃣  TESTING HEALTH ENDPOINT...")
        try:
            response = await client.get(f"{BACKEND_URL}/health")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.json()}")
            if response.status_code == 200:
                print("   ✅ Health check passed")
            else:
                print("   ❌ Health check failed")
        except Exception as e:
            print(f"   ❌ ERROR: {e}")
        
        # Test 2: Login with existing user
        print("\n2️⃣  TESTING LOGIN...")
        try:
            login_data = {
                "email": "user1@iwm.com",
                "password": "rmrnn0077"
            }
            response = await client.post(
                f"{BACKEND_URL}/api/v1/auth/login",
                json=login_data
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                token = data.get("access_token")
                print(f"   ✅ Login successful")
                print(f"   Token: {token[:50]}...")
                
                # Test 3: Get user info
                print("\n3️⃣  TESTING USER INFO...")
                headers = {"Authorization": f"Bearer {token}"}
                response = await client.get(
                    f"{BACKEND_URL}/api/v1/auth/me",
                    headers=headers
                )
                print(f"   Status: {response.status_code}")
                if response.status_code == 200:
                    user = response.json()
                    print(f"   ✅ User: {user.get('email')}")
                    user_id = user.get("id")
                    
                    # Test 4: Get movies
                    print("\n4️⃣  TESTING MOVIES ENDPOINT...")
                    response = await client.get(f"{BACKEND_URL}/api/v1/movies?page=1&limit=5")
                    print(f"   Status: {response.status_code}")
                    if response.status_code == 200:
                        movies = response.json()
                        # Movies endpoint returns list directly
                        movies_list = movies if isinstance(movies, list) else movies.get('items', [])
                        print(f"   ✅ Found {len(movies_list)} movies")
                        if movies_list:
                            movie_id = movies_list[0]['id']
                            print(f"   First movie: {movies_list[0]['title']}")
                            
                            # Test 5: Add to watchlist
                            print("\n5️⃣  TESTING WATCHLIST ADD...")
                            watchlist_data = {
                                "movieId": movie_id,
                                "userId": user_id,
                                "status": "want-to-watch"
                            }
                            response = await client.post(
                                f"{BACKEND_URL}/api/v1/watchlist",
                                json=watchlist_data,
                                headers=headers
                            )
                            print(f"   Status: {response.status_code}")
                            if response.status_code in [200, 201, 409]:
                                print("   ✅ Watchlist endpoint working")
                            else:
                                print(f"   ❌ Watchlist failed: {response.text}")
                            
                            # Test 6: Add to favorites
                            print("\n6️⃣  TESTING FAVORITES ADD...")
                            favorites_data = {
                                "type": "movie",
                                "movieId": movie_id
                            }
                            response = await client.post(
                                f"{BACKEND_URL}/api/v1/favorites",
                                json=favorites_data,
                                headers=headers
                            )
                            print(f"   Status: {response.status_code}")
                            if response.status_code in [200, 201, 409]:
                                print("   ✅ Favorites endpoint working")
                            else:
                                print(f"   ❌ Favorites failed: {response.text}")
                            
                            # Test 7: Get collections
                            print("\n7️⃣  TESTING COLLECTIONS ENDPOINT...")
                            response = await client.get(
                                f"{BACKEND_URL}/api/v1/collections?page=1&limit=5",
                                headers=headers
                            )
                            print(f"   Status: {response.status_code}")
                            if response.status_code == 200:
                                collections = response.json()
                                collections_list = collections if isinstance(collections, list) else collections.get('items', [])
                                print(f"   ✅ Found {len(collections_list)} collections")
                            else:
                                print(f"   ❌ Collections failed: {response.text}")
                    else:
                        print(f"   ❌ Movies failed: {response.text}")
                else:
                    print(f"   ❌ User info failed: {response.text}")
            else:
                print(f"   ❌ Login failed: {response.text}")
        except Exception as e:
            print(f"   ❌ ERROR: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "=" * 70)
    print("📊 BACKEND API TESTING COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(test_apis())

