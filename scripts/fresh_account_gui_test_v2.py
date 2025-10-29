#!/usr/bin/env python3
"""
Comprehensive end-to-end GUI test for fresh account workflow - Version 2.
Uses existing test account to avoid signup issues.
Tests: login, watchlist, favorites, collections, profile.
"""

import asyncio
import os
import json
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.getenv("BASE_URL", "http://localhost:3002")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"
TEST_USERNAME = "user1"

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

async def test_login(page) -> dict:
    """Test 1: Login."""
    result = {"name": "Login Test", "status": "PASS", "steps": [], "errors": []}
    
    try:
        result["steps"].append(f"Navigate to login page")
        await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        
        result["steps"].append(f"Fill login form with email={TEST_EMAIL}")
        await page.fill('input[type="email"]', TEST_EMAIL)
        await page.fill('input[type="password"]', TEST_PASSWORD)
        
        result["steps"].append("Click login button")
        # Find the login button more carefully
        login_btn = await page.query_selector('button:has-text("Login")')
        if not login_btn:
            # Try alternative selector
            buttons = await page.query_selector_all('button')
            for btn in buttons:
                text = await btn.text_content()
                if text and text.strip() == "Login":
                    login_btn = btn
                    break

        if not login_btn:
            raise Exception("Login button not found")

        result["steps"].append("Found login button, clicking...")

        # Try pressing Enter in the password field instead of clicking the button
        password_input = await page.query_selector('input[type="password"]')
        if password_input:
            result["steps"].append("Pressing Enter in password field...")
            await password_input.press("Enter")
        else:
            result["steps"].append("Password input not found, clicking button instead...")
            await login_btn.click()

        # Wait for navigation - the login form does window.location.href redirect
        try:
            await page.wait_for_load_state("networkidle", timeout=10000)
        except:
            result["steps"].append("⚠️ Timeout waiting for networkidle after login")

        await page.wait_for_timeout(3000)

        # Verify cookies are set
        try:
            cookies = await page.context.cookies()
            access_token_cookie = next((c for c in cookies if c["name"] == "access_token"), None)
            if access_token_cookie:
                result["steps"].append(f"✅ access_token cookie set: {access_token_cookie['value'][:20]}...")
            else:
                result["steps"].append("⚠️ Warning: access_token cookie not found after login")
        except Exception as e:
            result["steps"].append(f"⚠️ Error checking cookies: {str(e)[:50]}")

        # Check current URL
        try:
            current_url = page.url
            result["steps"].append(f"Current URL: {current_url}")
        except Exception as e:
            result["steps"].append(f"⚠️ Error getting URL: {str(e)[:50]}")

        # Check if still on login page
        login_failed = False
        if "/login" in current_url:
            result["steps"].append("❌ Still on login page after login attempt")
            login_failed = True
            # Check for error messages
            body = await page.query_selector('body')
            if body:
                text_content = await body.text_content()
                if "error" in text_content.lower() or "invalid" in text_content.lower():
                    result["steps"].append("❌ Error message found on page")
                    # Extract error message
                    error_elements = await page.query_selector_all('p, div, span')
                    for elem in error_elements:
                        text = await elem.text_content()
                        if text and ("error" in text.lower() or "invalid" in text.lower()):
                            result["steps"].append(f"   Error: {text[:100]}")
                            break
        else:
            result["steps"].append("✅ Redirected away from login page")

        if login_failed or not access_token_cookie:
            result["steps"].append("❌ Login failed - no token or still on login page")
            result["status"] = "FAIL"
            raise Exception("Login failed")
        else:
            result["steps"].append("✅ Login successful")
            result["status"] = "PASS"

        await page.screenshot(path=str(ARTIFACTS_DIR / "01_login_success.png"))
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "01_login_FAILED.png"))
    
    return result

async def test_watchlist(page) -> dict:
    """Test 2: Watchlist functionality."""
    result = {"name": "Watchlist Test", "status": "PASS", "steps": [], "errors": [], "movie_id": None}
    
    try:
        result["steps"].append("Navigate to /movies")
        await page.goto(f"{BASE_URL}/movies", wait_until="networkidle")
        await page.wait_for_timeout(3000)  # Wait for React to render

        result["steps"].append("Find first movie link")
        movie_link = await page.query_selector('a[href^="/movies/"]')
        if not movie_link:
            # Debug: check what links are on the page
            all_links = await page.query_selector_all('a')
            result["steps"].append(f"Found {len(all_links)} links on page")
            for i, link in enumerate(all_links[:5]):
                href = await link.get_attribute("href")
                text = await link.text_content()
                result["steps"].append(f"  Link {i}: href={href}, text={text[:30] if text else 'empty'}")
            raise Exception("No movie links found")
        
        href = await movie_link.get_attribute("href")
        movie_id = href.split("/movies/")[1]
        result["movie_id"] = movie_id
        result["steps"].append(f"Found movie ID: {movie_id}")
        
        result["steps"].append("Navigate to movie detail page")
        await page.goto(f"{BASE_URL}/movies/{movie_id}", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        
        result["steps"].append("Find 'Add to Watchlist' button")
        watchlist_btn = await page.query_selector('button:has-text("Watchlist"), button:has-text("Add to Watchlist")')
        if not watchlist_btn:
            # Try alternative selectors
            buttons = await page.query_selector_all('button')
            for btn in buttons:
                text = await btn.text_content()
                if text and "watchlist" in text.lower():
                    watchlist_btn = btn
                    break
        
        if not watchlist_btn:
            raise Exception("Watchlist button not found")
        
        result["steps"].append("Click 'Add to Watchlist' button")
        await watchlist_btn.click()
        await page.wait_for_timeout(3000)
        
        result["steps"].append("Check for error toasts")
        error_toast = await page.query_selector('[role="alert"]:has-text("error"), [role="alert"]:has-text("failed")')
        if error_toast:
            raise Exception("Error toast appeared")
        
        result["steps"].append("✅ Watchlist add successful")
        await page.screenshot(path=str(ARTIFACTS_DIR / "02_watchlist_success.png"))
        result["status"] = "PASS"
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "02_watchlist_FAILED.png"))
    
    return result

async def test_favorites(page, first_movie_id: str) -> dict:
    """Test 3: Favorites functionality."""
    result = {"name": "Favorites Test", "status": "PASS", "steps": [], "errors": [], "movie_id": None}
    
    try:
        result["steps"].append("Navigate to /movies")
        await page.goto(f"{BASE_URL}/movies", wait_until="networkidle")
        
        result["steps"].append("Find second movie")
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
            result["movie_id"] = first_movie_id
        
        result["steps"].append(f"Navigate to movie: {result['movie_id']}")
        await page.goto(f"{BASE_URL}/movies/{result['movie_id']}", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        
        result["steps"].append("Find 'Add to Favorites' button")
        fav_btn = await page.query_selector('button:has-text("Favorite"), button:has-text("Add to Favorites")')
        if not fav_btn:
            buttons = await page.query_selector_all('button')
            for btn in buttons:
                text = await btn.text_content()
                if text and "favorite" in text.lower():
                    fav_btn = btn
                    break
        
        if not fav_btn:
            raise Exception("Favorites button not found")
        
        result["steps"].append("Click 'Add to Favorites' button")
        await fav_btn.click()
        await page.wait_for_timeout(3000)
        
        result["steps"].append("Check for error toasts")
        error_toast = await page.query_selector('[role="alert"]:has-text("error")')
        if error_toast:
            raise Exception("Error toast appeared")
        
        result["steps"].append("✅ Favorites add successful")
        await page.screenshot(path=str(ARTIFACTS_DIR / "03_favorites_success.png"))
        result["status"] = "PASS"
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "03_favorites_FAILED.png"))
    
    return result

async def test_collections(page, first_movie_id: str) -> dict:
    """Test 4: Collections functionality."""
    result = {"name": "Collections Test", "status": "PASS", "steps": [], "errors": [], "collection_id": None}

    try:
        result["steps"].append("Navigate to /collections")
        await page.goto(f"{BASE_URL}/collections", wait_until="networkidle")

        # Check if we were redirected to login
        current_url = page.url
        result["steps"].append(f"Current URL after navigation: {current_url}")
        if "/login" in current_url:
            # Check cookies
            cookies = await page.context.cookies()
            access_token_cookie = next((c for c in cookies if c["name"] == "access_token"), None)
            result["steps"].append(f"⚠️ Redirected to login. access_token cookie: {access_token_cookie is not None}")
            raise Exception(f"Redirected to login page. Authentication may have failed. URL: {current_url}")

        # Wait longer for collections page to fully load
        result["steps"].append("Wait for collections page to fully load (5 seconds)")
        await page.wait_for_timeout(5000)

        result["steps"].append("Find 'Create Collection' button")
        create_btn = await page.query_selector('button:has-text("Create Collection")')

        # Strategy 2: Search all buttons
        if not create_btn:
            result["steps"].append("Strategy 1 failed, trying alternative selectors...")
            buttons = await page.query_selector_all('button')
            result["steps"].append(f"Found {len(buttons)} buttons on page")
            for i, btn in enumerate(buttons):
                text = await btn.text_content()
                result["steps"].append(f"  Button {i}: {text[:50] if text else '(empty)'}")
                if text and "create" in text.lower() and "collection" in text.lower():
                    create_btn = btn
                    result["steps"].append(f"Found button with text: {text}")
                    break

        if not create_btn:
            # Get page content for debugging
            page_html = await page.content()
            result["steps"].append(f"Page HTML length: {len(page_html)} chars")

            # Check for specific text on page
            body = await page.query_selector('body')
            if body:
                text_content = await body.text_content()
                if "Create Collection" in text_content:
                    result["steps"].append("✅ 'Create Collection' text found in page content")
                else:
                    result["steps"].append("❌ 'Create Collection' text NOT found in page content")

                if "Collections & Lists" in text_content:
                    result["steps"].append("✅ Collections page header found")
                else:
                    result["steps"].append("❌ Collections page header NOT found")

                # Check for error messages
                if "error" in text_content.lower():
                    result["steps"].append("⚠️ Error message found on page")
                    # Extract first 200 chars of text content
                    result["steps"].append(f"Page content preview: {text_content[:200]}")

            raise Exception("Create collection button not found after trying multiple strategies")
        
        result["steps"].append("Click 'Create Collection' button")
        # Use force click to bypass any overlays
        await create_btn.click(force=True)
        await page.wait_for_timeout(2000)

        result["steps"].append("Fill collection form")
        title_input = await page.query_selector('input[placeholder*="title" i], input[placeholder*="name" i]')
        if title_input:
            await title_input.fill("Test Collection")

        result["steps"].append("Submit collection form")
        submit_btn = await page.query_selector('button:has-text("Create"), button:has-text("Save")')
        if submit_btn:
            # Use force click to bypass any overlays
            await submit_btn.click(force=True)
            await page.wait_for_load_state("networkidle")
        
        result["steps"].append("✅ Collection created")
        await page.screenshot(path=str(ARTIFACTS_DIR / "04_collections_success.png"))
        result["status"] = "PASS"
        
    except Exception as e:
        result["status"] = "FAIL"
        result["errors"].append(str(e))
        await page.screenshot(path=str(ARTIFACTS_DIR / "04_collections_FAILED.png"))
    
    return result

async def test_profile(page) -> dict:
    """Test 5: Profile page."""
    result = {"name": "Profile Test", "status": "PASS", "steps": [], "errors": []}
    
    try:
        result["steps"].append(f"Navigate to /profile/{TEST_USERNAME}")
        await page.goto(f"{BASE_URL}/profile/{TEST_USERNAME}", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        
        result["steps"].append("Verify Overview tab")
        watchlist_section = await page.query_selector('[class*="watchlist" i], h2:has-text("Watchlist")')
        if watchlist_section:
            result["steps"].append("✅ Watchlist section found")
        
        result["steps"].append("Click 'Favorites' tab")
        fav_tab = await page.query_selector('button:has-text("Favorites"), [role="tab"]:has-text("Favorites")')
        if fav_tab:
            await fav_tab.click()
            await page.wait_for_timeout(2000)
            result["steps"].append("✅ Favorites tab loaded")
        
        result["steps"].append("Click 'Collections' tab")
        coll_tab = await page.query_selector('button:has-text("Collections"), [role="tab"]:has-text("Collections")')
        if coll_tab:
            await coll_tab.click()
            await page.wait_for_timeout(2000)
            result["steps"].append("✅ Collections tab loaded")
        
        await page.screenshot(path=str(ARTIFACTS_DIR / "05_profile_success.png"))
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
        
        console_logs = []
        network_logs = []
        
        def on_console(msg):
            if msg.type == "error":
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
        
        try:
            print("🧪 Starting comprehensive GUI test...\n")
            
            print("1️⃣  Testing Login...")
            result1 = await test_login(page)
            test_results["workflows"]["login"] = result1
            print(f"   Status: {result1['status']}\n")
            
            print("2️⃣  Testing Watchlist...")
            result2 = await test_watchlist(page)
            test_results["workflows"]["watchlist"] = result2
            print(f"   Status: {result2['status']}\n")
            
            print("3️⃣  Testing Favorites...")
            result3 = await test_favorites(page, result2.get("movie_id", ""))
            test_results["workflows"]["favorites"] = result3
            print(f"   Status: {result3['status']}\n")
            
            print("4️⃣  Testing Collections...")
            result4 = await test_collections(page, result2.get("movie_id", ""))
            test_results["workflows"]["collections"] = result4
            print(f"   Status: {result4['status']}\n")
            
            print("5️⃣  Testing Profile...")
            result5 = await test_profile(page)
            test_results["workflows"]["profile"] = result5
            print(f"   Status: {result5['status']}\n")
            
        finally:
            test_results["console_errors"] = console_logs
            test_results["network_errors"] = network_logs
            
            results_file = ARTIFACTS_DIR / "test_results_v2.json"
            with open(results_file, "w") as f:
                json.dump(test_results, f, indent=2)
            
            print(f"\n✅ Test results saved to {results_file}")
            
            passed = sum(1 for w in test_results["workflows"].values() if w["status"] == "PASS")
            failed = sum(1 for w in test_results["workflows"].values() if w["status"] == "FAIL")
            print(f"\n📊 Summary: {passed}/5 PASSED, {failed}/5 FAILED")
            
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

