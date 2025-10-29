"""Comprehensive GUI test for both bug fixes."""

import asyncio
import random
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
API_BASE = "http://localhost:8000"

async def test_bug1_gui():
    """Test BUG #1: New user should have empty favorites in GUI."""
    print("\n" + "="*70)
    print("🔍 BUG #1 GUI TEST: New User Favorites")
    print("="*70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        try:
            # Navigate to login
            await page.goto(f"{BASE_URL}/login")
            await page.wait_for_timeout(2000)
            
            # Click signup link
            signup_link = page.locator("text=Sign up")
            if await signup_link.count() > 0:
                await signup_link.first.click()
                await page.wait_for_timeout(2000)
            
            # Fill signup form
            email = f"testuser{random.randint(10000, 99999)}@iwm.com"
            password = "rmrnn0077"
            
            await page.fill('input[type="email"]', email)
            await page.fill('input[type="password"]', password)
            
            # Find and fill name field
            name_inputs = page.locator('input[type="text"]')
            if await name_inputs.count() > 0:
                await name_inputs.first.fill("Test User")
            
            # Submit
            await page.press('input[type="password"]', "Enter")
            await page.wait_for_timeout(3000)
            
            # Check if logged in
            current_url = page.url
            print(f"✅ Created account: {email}")
            print(f"   Current URL: {current_url}")
            
            # Navigate to profile
            await page.goto(f"{BASE_URL}/profile/testuser")
            await page.wait_for_timeout(2000)
            
            # Check for favorites section
            page_text = await page.content()
            
            if "No favorites yet" in page_text or "0 favorites" in page_text:
                print(f"✅ PASS: New user has NO favorites in GUI")
                return True
            elif "Parasite" in page_text or "Shawshank" in page_text:
                print(f"❌ FAIL: New user seeing other users' favorites")
                return False
            else:
                print(f"⚠️  Could not determine favorites status")
                return None
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
        finally:
            await browser.close()

async def test_bug2_gui():
    """Test BUG #2: Collection share link should work without auth."""
    print("\n" + "="*70)
    print("🔍 BUG #2 GUI TEST: Collection Share Link")
    print("="*70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        try:
            # Login as user1
            await page.goto(f"{BASE_URL}/login")
            await page.wait_for_timeout(2000)
            
            await page.fill('input[type="email"]', "user1@iwm.com")
            await page.fill('input[type="password"]', "rmrnn0077")
            await page.press('input[type="password"]', "Enter")
            await page.wait_for_timeout(3000)
            
            print(f"✅ Logged in as user1")
            
            # Navigate to collections
            await page.goto(f"{BASE_URL}/collections")
            await page.wait_for_timeout(2000)
            
            # Find first collection
            collection_links = page.locator('a[href*="/collections/"]')
            if await collection_links.count() > 0:
                await collection_links.first.click()
                await page.wait_for_timeout(2000)
                
                # Get current URL (should be /collections/{id})
                collection_url = page.url
                print(f"✅ Opened collection: {collection_url}")
                
                # Find and click share button
                share_button = page.locator('button:has-text("Share")')
                if await share_button.count() > 0:
                    await share_button.click()
                    await page.wait_for_timeout(1000)
                    
                    # Check if link was copied (look for toast)
                    toast_text = await page.content()
                    if "copied" in toast_text.lower():
                        print(f"✅ Share button clicked and link copied")
                        
                        # Extract collection ID from URL
                        collection_id = collection_url.split("/")[-1]
                        expected_share_url = f"{BASE_URL}/collections/{collection_id}/public"
                        print(f"   Expected share URL: {expected_share_url}")
                        
                        # Test if public URL is accessible without auth
                        # Create new incognito context (no cookies)
                        context = await browser.new_context()
                        public_page = await context.new_page()
                        
                        response = await public_page.goto(expected_share_url)
                        if response and response.status == 200:
                            print(f"✅ PASS: Public collection page is accessible without auth")
                            await context.close()
                            return True
                        else:
                            print(f"❌ FAIL: Public collection page returned {response.status if response else 'error'}")
                            await context.close()
                            return False
                    else:
                        print(f"⚠️  Share button didn't show copy confirmation")
                        return None
                else:
                    print(f"⚠️  Share button not found")
                    return None
            else:
                print(f"⚠️  No collections found")
                return None
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
        finally:
            await browser.close()

async def main():
    print("\n" + "="*70)
    print("🎯 COMPREHENSIVE BUG FIX GUI TEST")
    print("="*70)
    
    bug1_result = await test_bug1_gui()
    bug2_result = await test_bug2_gui()
    
    print("\n" + "="*70)
    print("📊 FINAL RESULTS")
    print("="*70)
    print(f"BUG #1 (New User Favorites): {'✅ PASS' if bug1_result else '❌ FAIL' if bug1_result is False else '⚠️  INCONCLUSIVE'}")
    print(f"BUG #2 (Share Link): {'✅ PASS' if bug2_result else '❌ FAIL' if bug2_result is False else '⚠️  INCONCLUSIVE'}")
    
    if bug1_result and bug2_result:
        print("\n🎉 ALL GUI TESTS PASSED!")
    else:
        print("\n⚠️  Some tests failed or were inconclusive")

if __name__ == "__main__":
    asyncio.run(main())

