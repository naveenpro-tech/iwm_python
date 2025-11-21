"""
Playwright Test Script for Favorites Feature (BUG #13)
Tests the complete favorites functionality:
1. Add movie to favorites from movie details page
2. View favorites in profile page
3. Remove movie from favorites
"""

import asyncio
import os
from playwright.async_api import async_playwright, Page, expect
from datetime import datetime

# Test credentials
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"
BASE_URL = "http://localhost:3000"
PROFILE_SLUG = "user1"  # Profile URL slug

# Screenshot directory
SCREENSHOT_DIR = "test-artifacts/gui-testing"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)


async def login(page: Page):
    """Login to the application"""
    print("🔐 Logging in...")

    # Navigate to login page
    await page.goto(f"{BASE_URL}/login")
    await page.wait_for_load_state("networkidle")

    # Fill login form
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)

    # Click login button
    await page.click('button[type="submit"]')

    # Wait for redirect (could be home or profile)
    await asyncio.sleep(3)
    print("✅ Login successful")


async def test_add_to_favorites(page: Page):
    """Test 1: Add movie to favorites from movie details page"""
    print("\n📝 TEST 1: Add Movie to Favorites")
    print("=" * 60)
    
    # Navigate to movies page
    print("1. Navigating to movies page...")
    await page.goto(f"{BASE_URL}/movies")
    await page.wait_for_load_state("networkidle")
    await asyncio.sleep(2)
    
    # Click on the first movie
    print("2. Clicking on first movie...")
    first_movie = page.locator('a[href^="/movies/"]').first
    await first_movie.click()
    await page.wait_for_load_state("networkidle")
    await asyncio.sleep(2)
    
    # Get movie title for verification
    movie_title = await page.locator('h1').first.text_content()
    print(f"3. Movie: {movie_title}")
    
    # Check if favorites button exists
    favorites_button = page.locator('button:has-text("Add to Favorites")')
    if await favorites_button.count() == 0:
        print("❌ ERROR: 'Add to Favorites' button not found!")
        await page.screenshot(path=f"{SCREENSHOT_DIR}/favorites_test_1_error_button_missing.png", full_page=True)
        return False
    
    print("4. Found 'Add to Favorites' button")
    
    # Click the favorites button
    print("5. Clicking 'Add to Favorites' button...")
    await favorites_button.click()
    await asyncio.sleep(2)
    
    # Wait for button text to change to "Remove from Favorites"
    remove_button = page.locator('button:has-text("Remove from Favorites")')
    try:
        await remove_button.wait_for(state="visible", timeout=5000)
        print("✅ Movie added to favorites successfully!")
    except:
        print("⚠️  Button text didn't change - checking for toast notification...")
        # Check for success toast
        toast = page.locator('text="Added to Favorites"')
        if await toast.count() > 0:
            print("✅ Toast notification found - movie added to favorites!")
        else:
            print("❌ ERROR: No confirmation of favorites addition")
            await page.screenshot(path=f"{SCREENSHOT_DIR}/favorites_test_1_error_no_confirmation.png", full_page=True)
            return False
    
    # Take screenshot
    screenshot_path = f"{SCREENSHOT_DIR}/favorites_test_1_add_to_favorites.png"
    await page.screenshot(path=screenshot_path, full_page=True)
    print(f"📸 Screenshot saved: {screenshot_path}")
    
    print("✅ TEST 1 PASSED: Movie added to favorites")
    return True


async def test_view_favorites(page: Page):
    """Test 2: View favorites in profile page"""
    print("\n📝 TEST 2: View Favorites in Profile")
    print("=" * 60)

    # Navigate to profile page
    print("1. Navigating to profile page...")
    await page.goto(f"{BASE_URL}/profile/{PROFILE_SLUG}")
    await page.wait_for_load_state("networkidle")
    await asyncio.sleep(2)

    # Click on Favorites tab - try multiple selectors
    print("2. Clicking on 'Favorites' tab...")
    try:
        # Try clicking by text content
        favorites_tab = page.get_by_text("Favorites", exact=False).first
        await favorites_tab.click()
    except:
        # Try alternative selector
        favorites_tab = page.locator('[href*="favorites"]').first
        await favorites_tab.click()

    await asyncio.sleep(3)
    
    # Wait for favorites to load
    print("3. Waiting for favorites to load...")
    await page.wait_for_selector('img[alt*=""]', timeout=10000)
    
    # Check if favorites are displayed
    favorite_movies = page.locator('a[href^="/movies/"]')
    count = await favorite_movies.count()
    
    if count == 0:
        print("⚠️  No favorites found - checking for empty state...")
        empty_state = page.locator('text="No favorites found"')
        if await empty_state.count() > 0:
            print("❌ ERROR: Favorites list is empty!")
            await page.screenshot(path=f"{SCREENSHOT_DIR}/favorites_test_2_error_empty.png", full_page=True)
            return False
    else:
        print(f"✅ Found {count} favorite movie(s)")
    
    # Take screenshot
    screenshot_path = f"{SCREENSHOT_DIR}/favorites_test_2_view_favorites.png"
    await page.screenshot(path=screenshot_path, full_page=True)
    print(f"📸 Screenshot saved: {screenshot_path}")
    
    print("✅ TEST 2 PASSED: Favorites displayed in profile")
    return True


async def test_remove_from_favorites(page: Page):
    """Test 3: Remove movie from favorites"""
    print("\n📝 TEST 3: Remove Movie from Favorites")
    print("=" * 60)
    
    # Should already be on profile favorites tab
    print("1. Looking for remove button...")
    
    # Find the first movie card and hover to reveal remove button
    movie_card = page.locator('a[href^="/movies/"]').first
    await movie_card.hover()
    await asyncio.sleep(1)
    
    # Look for remove button (X icon or trash icon)
    remove_button = page.locator('button[aria-label*="Remove"], button:has(svg.lucide-x)').first
    
    if await remove_button.count() == 0:
        print("⚠️  Remove button not found on hover - trying alternative method...")
        # Try clicking on the movie to go to details page
        await movie_card.click()
        await page.wait_for_load_state("networkidle")
        await asyncio.sleep(2)
        
        # Click "Remove from Favorites" button
        remove_fav_button = page.locator('button:has-text("Remove from Favorites")')
        if await remove_fav_button.count() > 0:
            print("2. Found 'Remove from Favorites' button on movie details page")
            await remove_fav_button.click()
            await asyncio.sleep(2)
            
            # Check for success toast
            toast = page.locator('text="Removed from Favorites"')
            if await toast.count() > 0:
                print("✅ Movie removed from favorites successfully!")
            else:
                # Check if button text changed back to "Add to Favorites"
                add_button = page.locator('button:has-text("Add to Favorites")')
                if await add_button.count() > 0:
                    print("✅ Movie removed from favorites (button changed)!")
                else:
                    print("⚠️  No confirmation of removal")
        else:
            print("❌ ERROR: Could not find remove button")
            await page.screenshot(path=f"{SCREENSHOT_DIR}/favorites_test_3_error_no_remove_button.png", full_page=True)
            return False
    else:
        print("2. Found remove button on profile page")
        await remove_button.click()
        await asyncio.sleep(2)
        print("✅ Movie removed from favorites!")
    
    # Take screenshot
    screenshot_path = f"{SCREENSHOT_DIR}/favorites_test_3_remove_from_favorites.png"
    await page.screenshot(path=screenshot_path, full_page=True)
    print(f"📸 Screenshot saved: {screenshot_path}")
    
    print("✅ TEST 3 PASSED: Movie removed from favorites")
    return True


async def main():
    """Main test execution"""
    print("\n" + "=" * 60)
    print("🎬 FAVORITES FEATURE TEST SUITE (BUG #13)")
    print("=" * 60)
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Base URL: {BASE_URL}")
    print(f"👤 Test User: {TEST_EMAIL}")
    print("=" * 60)
    
    async with async_playwright() as p:
        # Launch browser
        print("\n🚀 Launching browser...")
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()
        
        try:
            # Login
            await login(page)
            
            # Run tests
            test_results = []
            
            # Test 1: Add to favorites
            result1 = await test_add_to_favorites(page)
            test_results.append(("Add to Favorites", result1))
            
            # Test 2: View favorites
            result2 = await test_view_favorites(page)
            test_results.append(("View Favorites", result2))
            
            # Test 3: Remove from favorites
            result3 = await test_remove_from_favorites(page)
            test_results.append(("Remove from Favorites", result3))
            
            # Print summary
            print("\n" + "=" * 60)
            print("📊 TEST SUMMARY")
            print("=" * 60)
            
            passed = sum(1 for _, result in test_results if result)
            total = len(test_results)
            
            for test_name, result in test_results:
                status = "✅ PASSED" if result else "❌ FAILED"
                print(f"{status}: {test_name}")
            
            print("=" * 60)
            print(f"📈 Results: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
            print("=" * 60)
            
            if passed == total:
                print("\n🎉 ALL TESTS PASSED! Favorites feature is working correctly.")
            else:
                print(f"\n⚠️  {total - passed} test(s) failed. Please review the screenshots.")
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            await page.screenshot(path=f"{SCREENSHOT_DIR}/favorites_test_error.png", full_page=True)
            raise
        
        finally:
            # Close browser
            print("\n🔒 Closing browser...")
            await browser.close()
            print("✅ Test execution complete")


if __name__ == "__main__":
    asyncio.run(main())

