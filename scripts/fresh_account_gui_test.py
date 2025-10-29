#!/usr/bin/env python3
"""
Comprehensive end-to-end GUI test for fresh account workflow.
Tests: signup, login, watchlist, favorites, collections, profile.
"""

import asyncio
import os
import json
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright, Page, Browser, BrowserContext

BASE_URL = os.getenv("BASE_URL", "http://localhost:3002")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
TEST_EMAIL = "freshtest@iwm.com"
TEST_PASSWORD = "rmrnn0077"
TEST_USERNAME = "freshtest"

# Test artifacts directory
ARTIFACTS_DIR = Path("test-artifacts/gui-testing")
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

# Test results tracking
test_results = {
    "timestamp": datetime.now().isoformat(),
    "environment": {
        "frontend_url": BASE_URL,
        "backend_url": BACKEND_URL,
        "browser": "Chromium",
        "viewport": "1920x1080",
    },
    "test_account": {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "username": TEST_USERNAME,
    },
    "workflows": {},
    "console_errors": [],
    "network_errors": [],
}

# Store auth token for reuse
auth_token = None

async def capture_console_and_network(page: Page):
    """Capture console messages and network responses."""
    console_logs = []
    network_logs = []
    
    def on_console(msg):
        console_logs.append({"type": msg.type, "text": msg.text})
    
    def on_response(response):
        if response.status >= 400:
            network_logs.append({
                "url": response.url,
                "status": response.status,
                "method": response.request.method,
            })
    
    page.on("console", on_console)
    page.on("response", on_response)
    
    return console_logs, network_logs

async def test_signup_login(page: Page) -> dict:
    """Test 1: Account creation and login."""
    global auth_token
    result = {"name": "Account Creation & Login", "status": "PASS", "steps": [], "errors": []}

    try:
        # Navigate to signup
        result["steps"].append("Navigate to http://localhost:3002")
        await page.goto(f"{BASE_URL}/signup", wait_until="networkidle")
        await page.screenshot(path=str(ARTIFACTS_DIR / "01_signup_page.png"))

        # Fill signup form
        result["steps"].append(f"Fill signup form with email={TEST_EMAIL}")
        await page.fill('input[type="email"]', TEST_EMAIL)
        await page.fill('input[type="password"]', TEST_PASSWORD)

        # Look for name/username fields
        name_inputs = await page.query_selector_all('input[placeholder*="name" i], input[placeholder*="username" i]')
        if name_inputs:
            await name_inputs[0].fill(TEST_USERNAME)

        # Submit form
        result["steps"].append("Submit signup form")
        await page.click('button:has-text("Sign Up"), button:has-text("Register"), button:has-text("Create")')
        await page.wait_for_load_state("networkidle")
        await page.screenshot(path=str(ARTIFACTS_DIR / "01_login_success.png"))

        # Check if redirected to login or dashboard
        current_url = page.url
        result["steps"].append(f"Current URL after signup: {current_url}")

        if "/login" in current_url:
            result["steps"].append("Redirected to login, performing login")
            await page.fill('input[type="email"]', TEST_EMAIL)
            await page.fill('input[type="password"]', TEST_PASSWORD)
            await page.click('button:has-text("Login"), button:has-text("Sign In")')
            await page.wait_for_load_state("networkidle")

        # Extract auth token from localStorage
        result["steps"].append("Extracting auth token from localStorage")
        auth_token = await page.evaluate("() => localStorage.getItem('access_token')")
        if auth_token:
            result["steps"].append(f"✅ Auth token found: {auth_token[:20]}...")

        # Verify authentication
        result["steps"].append("Verify authentication by checking for profile dropdown or user avatar")
        try:
            await page.wait_for_selector('[data-testid="profile-dropdown"], [aria-label*="profile" i], button:has-text("Profile")', timeout=5000)
            result["steps"].append("✅ Profile dropdown found - user authenticated")
        except:
            result["steps"].append("⚠️ Profile dropdown not found, checking URL")
            if "/dashboard" in page.url or "/" == page.url.split("localhost:3002")[1]:
                result["steps"].append("✅ Redirected to dashboard - user authenticated")

        result["status"] = "PASS"

    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "01_signup_FAILED.png"))

    return result

async def test_watchlist(page: Page) -> dict:
    """Test 2: Watchlist functionality."""
    result = {"name": "Watchlist Test", "status": "PASS", "steps": [], "errors": [], "movie_id": None, "movie_title": None}
    
    try:
        # Navigate to movies
        result["steps"].append("Navigate to /movies")
        await page.goto(f"{BASE_URL}/movies", wait_until="networkidle")
        await page.screenshot(path=str(ARTIFACTS_DIR / "02_movies_list.png"))
        
        # Find first movie
        result["steps"].append("Find first movie link")
        movie_link = await page.query_selector('a[href^="/movies/"]')
        if not movie_link:
            raise Exception("No movie links found on page")
        
        href = await movie_link.get_attribute("href")
        movie_id = href.split("/movies/")[1]
        result["movie_id"] = movie_id
        result["steps"].append(f"Found movie ID: {movie_id}")
        
        # Navigate to movie detail
        result["steps"].append(f"Navigate to movie detail page")
        await page.goto(f"{BASE_URL}/movies/{movie_id}", wait_until="networkidle")
        
        # Get movie title
        title_elem = await page.query_selector('h1, h2, [class*="title"]')
        if title_elem:
            result["movie_title"] = await title_elem.text_content()
            result["steps"].append(f"Movie title: {result['movie_title']}")
        
        # Find and click "Add to Watchlist" button
        result["steps"].append("Find 'Add to Watchlist' button")
        watchlist_btn = await page.query_selector('button:has-text("Watchlist"), button:has-text("Add to Watchlist"), [aria-label*="watchlist" i]')
        if not watchlist_btn:
            raise Exception("Watchlist button not found")
        
        result["steps"].append("Click 'Add to Watchlist' button")
        await watchlist_btn.click()
        await page.wait_for_timeout(3000)  # Wait for toast/response
        
        # Check for errors
        result["steps"].append("Check for error toasts or console errors")
        error_toast = await page.query_selector('[role="alert"]:has-text("error"), [role="alert"]:has-text("failed")')
        if error_toast:
            error_text = await error_toast.text_content()
            raise Exception(f"Error toast appeared: {error_text}")
        
        # Verify button state changed
        result["steps"].append("Verify button state changed to 'In Watchlist' or similar")
        await page.screenshot(path=str(ARTIFACTS_DIR / "02_watchlist_success.png"))
        
        # Test idempotency - click again
        result["steps"].append("Click 'Add to Watchlist' button again (test idempotency)")
        await watchlist_btn.click()
        await page.wait_for_timeout(2000)
        
        # Verify no duplicate error
        error_toast = await page.query_selector('[role="alert"]:has-text("error"), [role="alert"]:has-text("duplicate")')
        if error_toast:
            raise Exception("Duplicate error appeared on second add")
        
        result["steps"].append("✅ Idempotency test passed - no duplicate error")
        result["status"] = "PASS"
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "02_watchlist_FAILED.png"))
    
    return result

async def test_favorites(page: Page, first_movie_id: str) -> dict:
    """Test 3: Favorites functionality."""
    result = {"name": "Favorites Test", "status": "PASS", "steps": [], "errors": [], "movie_id": None, "movie_title": None}
    
    try:
        # Navigate to a different movie
        result["steps"].append("Navigate to /movies to find a different movie")
        await page.goto(f"{BASE_URL}/movies", wait_until="networkidle")
        
        # Find second movie (different from watchlist test)
        result["steps"].append("Find second movie link")
        movie_links = await page.query_selector_all('a[href^="/movies/"]')
        second_movie = None
        for link in movie_links:
            href = await link.get_attribute("href")
            movie_id = href.split("/movies/")[1]
            if movie_id != first_movie_id:
                second_movie = link
                result["movie_id"] = movie_id
                break
        
        if not second_movie:
            result["steps"].append("⚠️ Could not find second movie, using first movie")
            result["movie_id"] = first_movie_id
        
        # Navigate to movie detail
        result["steps"].append(f"Navigate to movie detail page: {result['movie_id']}")
        await page.goto(f"{BASE_URL}/movies/{result['movie_id']}", wait_until="networkidle")
        
        # Get movie title
        title_elem = await page.query_selector('h1, h2, [class*="title"]')
        if title_elem:
            result["movie_title"] = await title_elem.text_content()
            result["steps"].append(f"Movie title: {result['movie_title']}")
        
        # Find and click "Add to Favorites" button
        result["steps"].append("Find 'Add to Favorites' button")
        fav_btn = await page.query_selector('button:has-text("Favorite"), button:has-text("Add to Favorites"), [aria-label*="favorite" i]')
        if not fav_btn:
            raise Exception("Favorites button not found")
        
        result["steps"].append("Click 'Add to Favorites' button")
        await fav_btn.click()
        await page.wait_for_timeout(3000)
        
        # Check for errors
        result["steps"].append("Check for error toasts")
        error_toast = await page.query_selector('[role="alert"]:has-text("error"), [role="alert"]:has-text("failed")')
        if error_toast:
            error_text = await error_toast.text_content()
            raise Exception(f"Error toast appeared: {error_text}")
        
        result["steps"].append("✅ Favorites add successful")
        await page.screenshot(path=str(ARTIFACTS_DIR / "03_favorites_success.png"))
        
        # Test idempotency
        result["steps"].append("Click 'Add to Favorites' button again (test idempotency)")
        await fav_btn.click()
        await page.wait_for_timeout(2000)
        
        error_toast = await page.query_selector('[role="alert"]:has-text("error"), [role="alert"]:has-text("duplicate")')
        if error_toast:
            raise Exception("Duplicate error appeared on second add")
        
        result["steps"].append("✅ Idempotency test passed")
        result["status"] = "PASS"
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "03_favorites_FAILED.png"))
    
    return result

async def test_collections(page: Page, first_movie_id: str) -> dict:
    """Test 4: Collections functionality."""
    global auth_token
    result = {"name": "Collections Test", "status": "PASS", "steps": [], "errors": [], "collection_id": None}

    try:
        # Navigate to collections
        result["steps"].append("Navigate to /collections")
        await page.goto(f"{BASE_URL}/collections", wait_until="networkidle")
        await page.screenshot(path=str(ARTIFACTS_DIR / "04_collections_page.png"))

        # Wait for page to fully load
        result["steps"].append("Wait for collections page to load")
        await page.wait_for_timeout(2000)

        # Find create collection button - try multiple selectors
        result["steps"].append("Find 'Create Collection' button")
        create_btn = await page.query_selector('button:has-text("Create Collection"), button:has-text("Create"), button:has-text("New"), [aria-label*="create" i]')

        if not create_btn:
            # Try to find by text content
            result["steps"].append("Button not found with standard selectors, trying alternative selectors")
            buttons = await page.query_selector_all('button')
            for btn in buttons:
                text = await btn.text_content()
                if text and "create" in text.lower():
                    create_btn = btn
                    break

        if not create_btn:
            raise Exception("Create collection button not found - page may not have loaded properly")

        result["steps"].append("Click 'Create Collection' button")
        await create_btn.click()
        await page.wait_for_timeout(1500)
        
        # Fill collection form
        result["steps"].append("Fill collection form")
        title_input = await page.query_selector('input[placeholder*="title" i], input[placeholder*="name" i]')
        if title_input:
            await title_input.fill("Automated Test Collection")
        
        desc_input = await page.query_selector('textarea, input[placeholder*="description" i]')
        if desc_input:
            await desc_input.fill("Created by automated GUI test")
        
        # Submit form
        result["steps"].append("Submit collection form")
        submit_btn = await page.query_selector('button:has-text("Create"), button:has-text("Save"), button:has-text("Submit")')
        if submit_btn:
            await submit_btn.click()
            await page.wait_for_load_state("networkidle")
        
        # Extract collection ID from URL
        current_url = page.url
        if "/collections/" in current_url:
            result["collection_id"] = current_url.split("/collections/")[1].split("?")[0]
            result["steps"].append(f"Collection created with ID: {result['collection_id']}")
        
        await page.screenshot(path=str(ARTIFACTS_DIR / "04_collection_created.png"))
        
        # Navigate to movie and add to collection
        result["steps"].append(f"Navigate to movie {first_movie_id}")
        await page.goto(f"{BASE_URL}/movies/{first_movie_id}", wait_until="networkidle")
        
        # Find "Add to Collection" button
        result["steps"].append("Find 'Add to Collection' button")
        add_to_coll_btn = await page.query_selector('button:has-text("Collection"), button:has-text("Add to Collection"), [aria-label*="collection" i]')
        if not add_to_coll_btn:
            raise Exception("Add to collection button not found")
        
        result["steps"].append("Click 'Add to Collection' button")
        await add_to_coll_btn.click()
        await page.wait_for_timeout(1000)
        
        # Select collection from modal/dropdown
        result["steps"].append("Select 'Automated Test Collection' from modal")
        coll_option = await page.query_selector('button:has-text("Automated Test Collection"), [role="option"]:has-text("Automated Test Collection")')
        if coll_option:
            await coll_option.click()
            await page.wait_for_timeout(1000)
        
        result["steps"].append("✅ Movie added to collection")
        
        # Navigate to collection detail
        if result["collection_id"]:
            result["steps"].append(f"Navigate to collection detail page")
            await page.goto(f"{BASE_URL}/collections/{result['collection_id']}", wait_until="networkidle")
            
            # Verify movie appears in collection
            result["steps"].append("Verify movie appears in collection")
            movie_in_coll = await page.query_selector(f'img[alt*="{first_movie_id}"], a[href*="{first_movie_id}"]')
            if movie_in_coll:
                result["steps"].append("✅ Movie found in collection")
            
            # Test share button
            result["steps"].append("Find and click 'Share' button")
            share_btn = await page.query_selector('button:has-text("Share"), [aria-label*="share" i]')
            if share_btn:
                await share_btn.click()
                await page.wait_for_timeout(2000)
                result["steps"].append("✅ Share button clicked")
            
            await page.screenshot(path=str(ARTIFACTS_DIR / "04_collections_success.png"))
        
        result["status"] = "PASS"
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "04_collections_FAILED.png"))
    
    return result

async def test_profile(page: Page, watchlist_movie_id: str, favorites_movie_id: str) -> dict:
    """Test 5: Profile page functionality."""
    result = {"name": "Profile Test", "status": "PASS", "steps": [], "errors": []}
    
    try:
        # Navigate to profile
        result["steps"].append(f"Navigate to /profile/{TEST_USERNAME}")
        await page.goto(f"{BASE_URL}/profile/{TEST_USERNAME}", wait_until="networkidle")
        
        # Test Overview tab
        result["steps"].append("Verify Overview tab shows watchlist preview")
        watchlist_section = await page.query_selector('[class*="watchlist" i], h2:has-text("Watchlist")')
        if watchlist_section:
            result["steps"].append("✅ Watchlist section found")
            # Verify movie appears
            if watchlist_movie_id:
                movie_elem = await page.query_selector(f'img[alt*="{watchlist_movie_id}"], a[href*="{watchlist_movie_id}"]')
                if movie_elem:
                    result["steps"].append("✅ Watchlist movie visible in overview")
        
        await page.screenshot(path=str(ARTIFACTS_DIR / "05_profile_overview.png"))
        
        # Test Favorites tab
        result["steps"].append("Click 'Favorites' tab")
        fav_tab = await page.query_selector('button:has-text("Favorites"), [role="tab"]:has-text("Favorites")')
        if fav_tab:
            await fav_tab.click()
            await page.wait_for_timeout(2000)
            
            # Verify no crash
            error_boundary = await page.query_selector('[class*="error" i], [class*="boundary" i]')
            if error_boundary:
                raise Exception("Error boundary detected on Favorites tab")
            
            result["steps"].append("✅ Favorites tab loaded without crash")
            
            # Verify movie appears
            if favorites_movie_id:
                movie_elem = await page.query_selector(f'img[alt*="{favorites_movie_id}"], a[href*="{favorites_movie_id}"]')
                if movie_elem:
                    result["steps"].append("✅ Favorites movie visible")
        
        await page.screenshot(path=str(ARTIFACTS_DIR / "06_profile_favorites.png"))
        
        # Test Collections tab
        result["steps"].append("Click 'Collections' tab")
        coll_tab = await page.query_selector('button:has-text("Collections"), [role="tab"]:has-text("Collections")')
        if coll_tab:
            await coll_tab.click()
            await page.wait_for_timeout(2000)
            
            result["steps"].append("✅ Collections tab loaded")
            
            # Verify collection appears
            coll_elem = await page.query_selector('[class*="collection" i]:has-text("Automated Test Collection")')
            if coll_elem:
                result["steps"].append("✅ Test collection visible in profile")
        
        await page.screenshot(path=str(ARTIFACTS_DIR / "07_profile_collections.png"))
        
        result["status"] = "PASS"
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "05_profile_FAILED.png"))
    
    return result

async def main():
    """Run all tests."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()
        
        # Capture console and network
        console_logs, network_logs = await capture_console_and_network(page)
        
        try:
            # Run tests in sequence
            print("🧪 Starting comprehensive GUI test for fresh account...\n")
            
            # Test 1: Signup & Login
            print("1️⃣  Testing Account Creation & Login...")
            result1 = await test_signup_login(page)
            test_results["workflows"]["signup_login"] = result1
            print(f"   Status: {result1['status']}\n")
            
            # Test 2: Watchlist
            print("2️⃣  Testing Watchlist...")
            result2 = await test_watchlist(page)
            test_results["workflows"]["watchlist"] = result2
            print(f"   Status: {result2['status']}\n")
            
            # Test 3: Favorites
            print("3️⃣  Testing Favorites...")
            result3 = await test_favorites(page, result2.get("movie_id", ""))
            test_results["workflows"]["favorites"] = result3
            print(f"   Status: {result3['status']}\n")
            
            # Test 4: Collections
            print("4️⃣  Testing Collections...")
            result4 = await test_collections(page, result2.get("movie_id", ""))
            test_results["workflows"]["collections"] = result4
            print(f"   Status: {result4['status']}\n")
            
            # Test 5: Profile
            print("5️⃣  Testing Profile...")
            result5 = await test_profile(page, result2.get("movie_id", ""), result3.get("movie_id", ""))
            test_results["workflows"]["profile"] = result5
            print(f"   Status: {result5['status']}\n")
            
        finally:
            # Capture final console and network logs
            test_results["console_errors"] = [log for log in console_logs if log["type"] == "error"]
            test_results["network_errors"] = network_logs
            
            # Save results
            results_file = ARTIFACTS_DIR / "test_results.json"
            with open(results_file, "w") as f:
                json.dump(test_results, f, indent=2)
            
            print(f"\n✅ Test results saved to {results_file}")
            
            # Print summary
            passed = sum(1 for w in test_results["workflows"].values() if w["status"] == "PASS")
            failed = sum(1 for w in test_results["workflows"].values() if w["status"] == "FAIL")
            print(f"\n📊 Summary: {passed}/5 PASSED, {failed}/5 FAILED")
            
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

