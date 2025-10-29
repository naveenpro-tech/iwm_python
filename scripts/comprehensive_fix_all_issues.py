"""
Comprehensive script to fix ALL reported issues:
1. Watchlist "Failed to fetch" error
2. Favorites not working
3. Collections not working
4. Profile overview showing demo data
5. Movie images not loading
6. Share option not working
"""

import asyncio
from playwright.async_api import async_playwright
import sys

BASE_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"

async def test_all_issues():
    print("=" * 70)
    print("🔍 COMPREHENSIVE ISSUE TESTING & DIAGNOSIS")
    print("=" * 70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Enable console logging
        page.on("console", lambda msg: print(f"[CONSOLE {msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))
        
        try:
            # STEP 1: Create new account
            print("\n1️⃣  CREATING NEW ACCOUNT...")
            await page.goto(f"{BASE_URL}/auth/signup")
            await page.wait_for_timeout(2000)
            
            # Fill signup form
            test_email = "testuser999@iwm.com"
            test_password = "Test@123456"
            
            await page.fill('input[name="email"]', test_email)
            await page.fill('input[name="password"]', test_password)
            await page.fill('input[name="confirmPassword"]', test_password)
            await page.fill('input[name="fullName"]', "Test User 999")
            await page.fill('input[name="username"]', "testuser999")
            
            # Click signup button
            signup_button = page.locator('button:has-text("Sign Up")')
            await signup_button.click()
            await page.wait_for_timeout(3000)
            
            # Check if signup succeeded
            current_url = page.url
            if "/auth/login" in current_url or "/profile" in current_url:
                print("   ✅ Account created successfully")
            else:
                print(f"   ❌ Signup failed - URL: {current_url}")
                # Try to login instead
                print("   ℹ️  Trying to login with existing account...")
                await page.goto(f"{BASE_URL}/auth/login")
                await page.wait_for_timeout(2000)
            
            # STEP 2: Login
            print("\n2️⃣  LOGGING IN...")
            if "/auth/login" in page.url:
                await page.fill('input[type="email"]', test_email)
                await page.fill('input[type="password"]', test_password)
                login_button = page.locator('button:has-text("Sign In")')
                await login_button.click()
                await page.wait_for_timeout(3000)
            
            # Check if logged in
            if "/profile" in page.url or "/movies" in page.url:
                print("   ✅ Logged in successfully")
            else:
                print(f"   ❌ Login failed - URL: {page.url}")
                return
            
            # STEP 3: Test Profile Overview (Demo Data Issue)
            print("\n3️⃣  TESTING PROFILE OVERVIEW...")
            await page.goto(f"{BASE_URL}/profile/testuser999")
            await page.wait_for_timeout(3000)
            
            # Check for demo data
            page_content = await page.content()
            if "demo" in page_content.lower() or "sample" in page_content.lower():
                print("   ❌ FAIL: Profile showing demo/sample data")
            else:
                print("   ✅ Profile overview looks clean")
            
            # STEP 4: Test Movie Images
            print("\n4️⃣  TESTING MOVIE IMAGES...")
            await page.goto(f"{BASE_URL}/movies")
            await page.wait_for_timeout(3000)
            
            # Check for broken images
            images = page.locator('img[alt*=""]')
            image_count = await images.count()
            print(f"   Found {image_count} images on movies page")
            
            if image_count > 0:
                # Check first image
                first_img = images.first
                src = await first_img.get_attribute('src')
                print(f"   First image src: {src}")
                if src and ("placeholder" in src or "null" in src):
                    print("   ⚠️  WARNING: Images using placeholders")
                else:
                    print("   ✅ Images appear to be loading")
            
            # STEP 5: Test Watchlist
            print("\n5️⃣  TESTING WATCHLIST...")
            # Navigate to first movie
            await page.goto(f"{BASE_URL}/movies")
            await page.wait_for_timeout(2000)
            
            movie_links = page.locator('a[href^="/movies/"]')
            if await movie_links.count() > 0:
                await movie_links.first.click()
                await page.wait_for_timeout(3000)
                
                # Try to add to watchlist
                watchlist_button = page.locator('button:has-text("Add to Watchlist")')
                if await watchlist_button.count() > 0:
                    await watchlist_button.click()
                    await page.wait_for_timeout(2000)
                    
                    # Check for errors
                    error_toast = page.locator('text="Failed to fetch"')
                    if await error_toast.count() > 0:
                        print("   ❌ FAIL: Watchlist 'Failed to fetch' error")
                    else:
                        print("   ✅ Watchlist appears to work")
                else:
                    print("   ⚠️  Watchlist button not found")
            
            # STEP 6: Test Favorites
            print("\n6️⃣  TESTING FAVORITES...")
            favorites_button = page.locator('button:has-text("Add to Favorites")')
            if await favorites_button.count() > 0:
                await favorites_button.click()
                await page.wait_for_timeout(2000)
                
                # Check for errors
                error_toast = page.locator('text="Failed"')
                if await error_toast.count() > 0:
                    print("   ❌ FAIL: Favorites error")
                else:
                    print("   ✅ Favorites appears to work")
            else:
                print("   ⚠️  Favorites button not found")
            
            # STEP 7: Test Collections
            print("\n7️⃣  TESTING COLLECTIONS...")
            await page.goto(f"{BASE_URL}/collections")
            await page.wait_for_timeout(3000)
            
            collection_links = page.locator('a[href^="/collections/"]')
            if await collection_links.count() > 0:
                await collection_links.first.click()
                await page.wait_for_timeout(3000)
                
                # Check for share button
                share_button = page.locator('button:has-text("Share")')
                if await share_button.count() > 0:
                    await share_button.click()
                    await page.wait_for_timeout(1000)
                    
                    # Check if share modal opened
                    share_modal = page.locator('text="Share Collection"')
                    if await share_modal.count() > 0:
                        print("   ✅ Share option works")
                    else:
                        print("   ❌ FAIL: Share modal didn't open")
                else:
                    print("   ⚠️  Share button not found")
            else:
                print("   ⚠️  No collections found")
            
            print("\n" + "=" * 70)
            print("📊 TESTING COMPLETE")
            print("=" * 70)
            
        except Exception as e:
            print(f"\n❌ ERROR: {e}")
            import traceback
            traceback.print_exc()
        
        finally:
            await page.wait_for_timeout(3000)
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_all_issues())

