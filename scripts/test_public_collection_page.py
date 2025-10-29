"""Test that public collection pages work without authentication."""

import asyncio
import requests
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
API_BASE = "http://localhost:8000"

def get_user1_collection():
    """Get a collection from user1 via API."""
    # Login
    login_response = requests.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": "user1@iwm.com", "password": "rmrnn0077"}
    )
    token = login_response.json().get("access_token")
    
    # Get collections
    headers = {"Authorization": f"Bearer {token}"}
    collections_response = requests.get(
        f"{API_BASE}/api/v1/collections?page=1&limit=100",
        headers=headers
    )
    
    collections = collections_response.json()
    if collections:
        return collections[0]
    return None

async def test_public_collection_page():
    """Test that public collection page is accessible without auth."""
    print("\n" + "="*70)
    print("🔍 PUBLIC COLLECTION PAGE TEST")
    print("="*70)
    
    # Get a collection
    collection = get_user1_collection()
    if not collection:
        print("❌ No collections found")
        return False
    
    collection_id = collection.get("id")
    collection_title = collection.get("title")
    print(f"✅ Found collection: {collection_title} (ID: {collection_id})")
    
    # Test public URL
    public_url = f"{BASE_URL}/collections/{collection_id}/public"
    print(f"\n📋 Testing public URL: {public_url}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Create context WITHOUT cookies (simulates unauthenticated user)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            # Navigate to public collection page
            response = await page.goto(public_url)
            
            if response and response.status == 200:
                print(f"✅ Page loaded successfully (status 200)")
                
                # Check page content
                page_text = await page.content()
                
                # Verify collection title is displayed
                if collection_title in page_text:
                    print(f"✅ Collection title displayed: {collection_title}")
                else:
                    print(f"⚠️  Collection title not found in page")
                
                # Verify no login redirect
                current_url = page.url
                if "/login" not in current_url:
                    print(f"✅ No redirect to login (stayed on public page)")
                else:
                    print(f"❌ Redirected to login: {current_url}")
                    return False
                
                # Check for movies section
                if "movies" in page_text.lower() or "film" in page_text.lower():
                    print(f"✅ Movies section found on page")
                
                print(f"\n✅ PUBLIC COLLECTION PAGE TEST PASSED!")
                return True
            else:
                print(f"❌ Page returned status {response.status if response else 'error'}")
                return False
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
        finally:
            await context.close()
            await browser.close()

async def main():
    print("\n" + "="*70)
    print("🎯 PUBLIC COLLECTION PAGE VERIFICATION")
    print("="*70)
    
    result = await test_public_collection_page()
    
    print("\n" + "="*70)
    if result:
        print("🎉 BUG #2 FIX VERIFIED - Public collection pages work!")
    else:
        print("❌ BUG #2 FIX FAILED - Public collection pages not working")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(main())

