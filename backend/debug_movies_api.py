import asyncio
import httpx
import sys

API_URL = "http://127.0.0.1:8000/api/v1"

async def check_movies():
    async with httpx.AsyncClient() as client:
        # 1. List Movies
        print(f"Checking {API_URL}/movies ...")
        try:
            resp = await client.get(f"{API_URL}/movies")
            if resp.status_code != 200:
                print(f"❌ Failed to list movies: {resp.status_code} {resp.text}")
                return
            
            movies = resp.json()
            print(f"✅ Found {len(movies)} movies")
            
            if not movies:
                print("⚠️ No movies returned. Database might be empty.")
                return

            # 2. Get First Movie Detail
            first_movie = movies[0]
            movie_id = first_movie.get('id')
            print(f"\nChecking details for movie: {first_movie.get('title')} (ID: {movie_id})")
            
            resp_detail = await client.get(f"{API_URL}/movies/{movie_id}")
            if resp_detail.status_code != 200:
                print(f"❌ Failed to get movie detail: {resp_detail.status_code} {resp_detail.text}")
            else:
                detail = resp_detail.json()
                print(f"✅ Successfully fetched details for: {detail.get('title')}")
                print(f"   - Director: {detail.get('directors', [{'name': 'Unknown'}])[0]['name']}")
                print(f"   - Cast count: {len(detail.get('cast', []))}")

        except Exception as e:
            print(f"❌ Error connecting to API: {e}")

if __name__ == "__main__":
    asyncio.run(check_movies())
