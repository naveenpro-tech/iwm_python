"""
Test script for Movie Export/Import API endpoints

Tests all 7 category export endpoints and import endpoints.
"""

import asyncio
import httpx
import json
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:8000/api/v1"

# Admin credentials
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"


async def get_admin_token():
    """Login as admin and get access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code == 200:
            data = response.json()
            return data["access_token"]
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
            return None


async def test_export_endpoints(token: str, movie_id: str):
    """Test all export endpoints"""
    headers = {"Authorization": f"Bearer {token}"}
    
    categories = [
        "basic-info",
        "cast-crew",
        "timeline",
        "trivia",
        "awards",
        "media",
        "streaming"
    ]
    
    print("\n" + "="*80)
    print("TESTING EXPORT ENDPOINTS")
    print("="*80)
    
    async with httpx.AsyncClient() as client:
        for category in categories:
            print(f"\n📤 Testing export: {category}")
            response = await client.get(
                f"{BASE_URL}/admin/movies/{movie_id}/export/{category}",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Export {category} successful")
                print(f"   Category: {data['category']}")
                print(f"   Movie ID: {data['movie_id']}")
                print(f"   Exported at: {data['exported_at']}")
                print(f"   Data keys: {list(data['data'].keys())}")
                
                # Save to file for inspection
                output_dir = Path("test_exports")
                output_dir.mkdir(exist_ok=True)
                output_file = output_dir / f"{movie_id}-{category}.json"
                with open(output_file, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"   Saved to: {output_file}")
            else:
                print(f"❌ Export {category} failed: {response.status_code}")
                print(f"   {response.text}")


async def test_bulk_export(token: str, movie_id: str):
    """Test bulk export (ZIP file)"""
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n" + "="*80)
    print("TESTING BULK EXPORT (ZIP)")
    print("="*80)
    
    async with httpx.AsyncClient() as client:
        print(f"\n📦 Testing bulk export for movie: {movie_id}")
        response = await client.get(
            f"{BASE_URL}/admin/movies/{movie_id}/export/all",
            headers=headers
        )
        
        if response.status_code == 200:
            print(f"✅ Bulk export successful")
            print(f"   Content-Type: {response.headers.get('content-type')}")
            print(f"   Content-Length: {len(response.content)} bytes")
            
            # Save ZIP file
            output_dir = Path("test_exports")
            output_dir.mkdir(exist_ok=True)
            output_file = output_dir / f"{movie_id}-export.zip"
            with open(output_file, "wb") as f:
                f.write(response.content)
            print(f"   Saved to: {output_file}")
        else:
            print(f"❌ Bulk export failed: {response.status_code}")
            print(f"   {response.text}")


async def test_import_timeline(token: str, movie_id: str):
    """Test timeline import"""
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n" + "="*80)
    print("TESTING TIMELINE IMPORT")
    print("="*80)
    
    # Create sample timeline data
    import_data = {
        "category": "timeline",
        "movie_id": movie_id,
        "version": "1.0",
        "data": {
            "events": [
                {
                    "date": "2023-01-15",
                    "title": "Pre-production begins",
                    "description": "Script finalized and casting started"
                },
                {
                    "date": "2023-03-01",
                    "title": "Principal photography starts",
                    "description": "Filming begins in Los Angeles"
                },
                {
                    "date": "2023-06-30",
                    "title": "Filming wraps",
                    "description": "Principal photography completed"
                },
                {
                    "date": "2023-12-15",
                    "title": "Theatrical release",
                    "description": "Movie released in theaters worldwide"
                }
            ]
        },
        "metadata": {
            "source": "llm-generated",
            "last_updated": "2025-01-15T10:00:00Z",
            "updated_by": ADMIN_EMAIL
        }
    }
    
    async with httpx.AsyncClient() as client:
        print(f"\n📥 Importing timeline for movie: {movie_id}")
        print(f"   Events count: {len(import_data['data']['events'])}")
        
        response = await client.post(
            f"{BASE_URL}/admin/movies/{movie_id}/import/timeline",
            headers=headers,
            json=import_data
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Timeline import successful")
            print(f"   Success: {data['success']}")
            print(f"   Message: {data['message']}")
            print(f"   Updated fields: {data['updated_fields']}")
        else:
            print(f"❌ Timeline import failed: {response.status_code}")
            print(f"   {response.text}")


async def test_import_trivia(token: str, movie_id: str):
    """Test trivia import"""
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n" + "="*80)
    print("TESTING TRIVIA IMPORT")
    print("="*80)
    
    # Create sample trivia data
    import_data = {
        "category": "trivia",
        "movie_id": movie_id,
        "version": "1.0",
        "data": {
            "items": [
                {
                    "text": "The iconic spinning top scene was filmed in a single take.",
                    "category": "production"
                },
                {
                    "text": "Christopher Nolan spent 10 years writing the screenplay.",
                    "category": "writing"
                },
                {
                    "text": "The film's budget was $160 million.",
                    "category": "budget"
                }
            ]
        },
        "metadata": {
            "source": "llm-generated",
            "last_updated": "2025-01-15T10:00:00Z",
            "updated_by": ADMIN_EMAIL
        }
    }
    
    async with httpx.AsyncClient() as client:
        print(f"\n📥 Importing trivia for movie: {movie_id}")
        print(f"   Trivia items count: {len(import_data['data']['items'])}")
        
        response = await client.post(
            f"{BASE_URL}/admin/movies/{movie_id}/import/trivia",
            headers=headers,
            json=import_data
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Trivia import successful")
            print(f"   Success: {data['success']}")
            print(f"   Message: {data['message']}")
            print(f"   Updated fields: {data['updated_fields']}")
        else:
            print(f"❌ Trivia import failed: {response.status_code}")
            print(f"   {response.text}")


async def verify_import(token: str, movie_id: str):
    """Verify that imported data is persisted"""
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n" + "="*80)
    print("VERIFYING IMPORTED DATA")
    print("="*80)
    
    async with httpx.AsyncClient() as client:
        # Export timeline to verify
        print(f"\n🔍 Verifying timeline import...")
        response = await client.get(
            f"{BASE_URL}/admin/movies/{movie_id}/export/timeline",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            events = data['data']['events']
            print(f"✅ Timeline verified: {len(events)} events found")
            for event in events:
                print(f"   - {event.get('date')}: {event.get('title')}")
        else:
            print(f"❌ Timeline verification failed")
        
        # Export trivia to verify
        print(f"\n🔍 Verifying trivia import...")
        response = await client.get(
            f"{BASE_URL}/admin/movies/{movie_id}/export/trivia",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            items = data['data']['items']
            print(f"✅ Trivia verified: {len(items)} items found")
            for item in items:
                print(f"   - {item.get('text')[:60]}...")
        else:
            print(f"❌ Trivia verification failed")


async def main():
    """Main test runner"""
    print("\n" + "="*80)
    print("MOVIE EXPORT/IMPORT API TEST SUITE")
    print("="*80)
    
    # Get admin token
    print("\n🔐 Logging in as admin...")
    token = await get_admin_token()
    if not token:
        print("❌ Failed to get admin token. Exiting.")
        return
    print("✅ Admin token obtained")
    
    # Use a known movie ID (from TMDB import)
    movie_id = "tmdb-550"  # Fight Club
    
    # Test export endpoints
    await test_export_endpoints(token, movie_id)
    
    # Test bulk export
    await test_bulk_export(token, movie_id)
    
    # Test import endpoints
    await test_import_timeline(token, movie_id)
    await test_import_trivia(token, movie_id)
    
    # Verify imports
    await verify_import(token, movie_id)
    
    print("\n" + "="*80)
    print("TEST SUITE COMPLETED")
    print("="*80)


if __name__ == "__main__":
    asyncio.run(main())

