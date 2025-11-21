"""Test complete favorites workflow"""
import asyncio
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("=" * 70)
        print("🧪 FAVORITES FEATURE - FULL WORKFLOW TEST")
        print("=" * 70)
        
        # Step 1: Login
        print("\n1️⃣  LOGGING IN...")
        await page.goto(f"{BASE_URL}/login")
        await page.fill('input[type="email"]', TEST_EMAIL)
        await page.fill('input[type="password"]', TEST_PASSWORD)
        await page.click('button[type="submit"]')
        await page.wait_for_url(f"{BASE_URL}/profile/**", timeout=10000)
        print(f"   ✅ Logged in successfully")
        
        # Step 2: Navigate to a movie
        print("\n2️⃣  NAVIGATING TO MOVIE...")
        await page.goto(f"{BASE_URL}/movies")
        await page.wait_for_timeout(2000)
        
        # Click on first movie
        movie_link = page.locator('a[href^="/movies/"]').first
        movie_title = await movie_link.text_content()
        await movie_link.click()
        await page.wait_for_timeout(2000)
        print(f"   ✅ Opened movie: {movie_title[:50]}")
        
        # Step 3: Check initial button state
        print("\n3️⃣  CHECKING INITIAL BUTTON STATE...")
        button = page.locator('button:has-text("Favorites")').first
        button_text = await button.text_content()
        print(f"   ✅ Button shows: '{button_text}'")
        
        # Step 4: Add to favorites
        print("\n4️⃣  ADDING TO FAVORITES...")
        await button.click()
        await page.wait_for_timeout(2000)
        button_text_after = await button.text_content()
        print(f"   ✅ Button now shows: '{button_text_after}'")
        
        if "Remove" in button_text_after:
            print("   ✅ SUCCESS: Button changed to 'Remove from Favorites'")
        else:
            print("   ❌ FAIL: Button did not change")
        
        # Step 5: Check profile favorites tab
        print("\n5️⃣  CHECKING PROFILE FAVORITES TAB...")
        await page.goto(f"{BASE_URL}/profile/user1")
        await page.wait_for_timeout(2000)

        # Click Favorites tab
        favorites_tab = page.locator('button:has-text("Favorites")')
        await favorites_tab.click()
        await page.wait_for_timeout(3000)

        # Wait for loading to finish
        loading_spinner = page.locator('text="Loading favorites..."')
        if await loading_spinner.is_visible():
            await loading_spinner.wait_for(state="hidden", timeout=10000)

        # Count favorite items - look for movie cards in grid
        favorite_items = page.locator('a[href^="/movies/"]')
        count = await favorite_items.count()
        print(f"   ✅ Found {count} favorite(s) in profile")

        if count > 0:
            print("   ✅ SUCCESS: Favorites displayed in profile")
        else:
            print("   ❌ FAIL: No favorites displayed")
        
        # Step 6: Remove from favorites
        print("\n6️⃣  REMOVING FROM FAVORITES...")
        # Go back to movie page
        await page.go_back()
        await page.go_back()
        await page.wait_for_timeout(1000)
        
        button = page.locator('button:has-text("Favorites")').first
        button_text_before_remove = await button.text_content()
        print(f"   Button shows: '{button_text_before_remove}'")
        
        await button.click()
        await page.wait_for_timeout(2000)
        
        button_text_after_remove = await button.text_content()
        print(f"   ✅ Button now shows: '{button_text_after_remove}'")
        
        if "Add" in button_text_after_remove:
            print("   ✅ SUCCESS: Button changed to 'Add to Favorites'")
        else:
            print("   ❌ FAIL: Button did not change")
        
        # Step 7: Verify removal in profile
        print("\n7️⃣  VERIFYING REMOVAL IN PROFILE...")
        await page.goto(f"{BASE_URL}/profile/user1")
        await page.wait_for_timeout(2000)

        favorites_tab = page.locator('button:has-text("Favorites")')
        await favorites_tab.click()
        await page.wait_for_timeout(3000)

        # Wait for loading to finish
        loading_spinner = page.locator('text="Loading favorites..."')
        if await loading_spinner.is_visible():
            await loading_spinner.wait_for(state="hidden", timeout=10000)

        favorite_items = page.locator('a[href^="/movies/"]')
        count_after = await favorite_items.count()
        print(f"   ✅ Found {count_after} favorite(s) in profile")

        if count_after == 0:
            print("   ✅ SUCCESS: Favorite removed from profile")
        else:
            print("   ⚠️  WARNING: Still showing favorites")
        
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        print(f"✅ Login: PASSED")
        print(f"✅ Navigate to movie: PASSED")
        print(f"{'✅' if 'Remove' in button_text_after else '❌'} Add to favorites: {'PASSED' if 'Remove' in button_text_after else 'FAILED'}")
        print(f"{'✅' if count > 0 else '❌'} Display in profile: {'PASSED' if count > 0 else 'FAILED'}")
        print(f"{'✅' if 'Add' in button_text_after_remove else '❌'} Remove from favorites: {'PASSED' if 'Add' in button_text_after_remove else 'FAILED'}")
        print(f"{'✅' if count_after == 0 else '⚠️ '} Verify removal: {'PASSED' if count_after == 0 else 'PARTIAL'}")
        print("=" * 70)
        
        await page.wait_for_timeout(5000)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

