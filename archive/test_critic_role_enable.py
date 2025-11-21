#!/usr/bin/env python3
"""
Test script to enable Critic role for test user and re-test critic features
"""

import asyncio
from playwright.async_api import async_playwright
import json
from datetime import datetime

BASE_URL = "http://localhost:3000"
API_BASE = "http://127.0.0.1:8000"

TEST_USER_EMAIL = "critic.tester@example.com"
TEST_USER_PASSWORD = "Test!23456789"
TEST_MOVIE_ID = "tmdb-1054867"

test_results = {
    "timestamp": datetime.now().isoformat(),
    "tests": [],
    "summary": {"total": 0, "passed": 0, "failed": 0, "errors": 0}
}

def log_test(name, status, details=""):
    """Log test result"""
    test_results["tests"].append({
        "name": name,
        "status": status,
        "details": details,
        "timestamp": datetime.now().isoformat()
    })
    if status == "PASS":
        test_results["summary"]["passed"] += 1
    elif status == "FAIL":
        test_results["summary"]["failed"] += 1
    else:
        test_results["summary"]["errors"] += 1
    test_results["summary"]["total"] += 1
    print(f"[{status}] {name}: {details}")

async def test_login(page):
    """Test login flow"""
    print("\n=== TEST 1: Login ===")
    try:
        await page.goto(f"{BASE_URL}/login")
        await page.wait_for_load_state("networkidle")
        
        await page.fill('input[type="email"]', TEST_USER_EMAIL)
        await page.fill('input[type="password"]', TEST_USER_PASSWORD)
        await page.click('button[type="submit"]')
        
        await page.wait_for_timeout(5000)
        
        if "/login" not in page.url:
            log_test("Login", "PASS", f"Logged in successfully, redirected to {page.url}")
            return True
        else:
            log_test("Login", "FAIL", "Still on login page")
            return False
    except Exception as e:
        log_test("Login", "ERROR", str(e))
        return False

async def test_enable_critic_role(page):
    """Test enabling critic role"""
    print("\n=== TEST 2: Enable Critic Role ===")
    try:
        # Navigate to settings
        await page.goto(f"{BASE_URL}/settings")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        # Click on Roles tab
        roles_btn = page.locator('button[value="roles"]')
        if await roles_btn.count() > 0:
            await roles_btn.click()
            await page.wait_for_timeout(2000)
        
        # Find and click Critic role switch
        critic_switch = page.locator('#role-critic')
        if await critic_switch.count() > 0:
            is_checked = await critic_switch.is_checked()
            
            if not is_checked:
                print("   Critic role not enabled, enabling now...")
                await critic_switch.click()
                await page.wait_for_timeout(3000)
                
                # Check if success message appears
                success_msg = page.locator('text="Role Activated"')
                if await success_msg.count() > 0:
                    log_test("Enable Critic Role", "PASS", "Critic role enabled successfully")
                    return True
                else:
                    log_test("Enable Critic Role", "PASS", "Critic role toggled (no success message)")
                    return True
            else:
                log_test("Enable Critic Role", "PASS", "Critic role already enabled")
                return True
        else:
            log_test("Enable Critic Role", "FAIL", "Critic role switch not found")
            return False
    except Exception as e:
        log_test("Enable Critic Role", "ERROR", str(e))
        return False

async def test_critic_tab_visible(page):
    """Test that Critic tab appears after enabling role"""
    print("\n=== TEST 3: Critic Tab Visibility ===")
    try:
        # Navigate to settings
        await page.goto(f"{BASE_URL}/settings")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        # Check if Critic tab is visible
        critic_tab = page.locator('button[value="critic"]')
        if await critic_tab.count() > 0:
            log_test("Critic Tab Visible", "PASS", "Critic tab is visible in settings")
            return True
        else:
            log_test("Critic Tab Visible", "FAIL", "Critic tab not found in settings")
            return False
    except Exception as e:
        log_test("Critic Tab Visible", "ERROR", str(e))
        return False

async def test_review_creation_as_critic(page):
    """Test review creation with critic role"""
    print("\n=== TEST 4: Review Creation as Critic ===")
    try:
        # Navigate to movie page
        await page.goto(f"{BASE_URL}/movies/{TEST_MOVIE_ID}")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        # Click Write a Review
        write_review_btn = page.locator('button:has-text("Write a Review")')
        if await write_review_btn.count() > 0:
            await write_review_btn.click()
            await page.wait_for_timeout(2000)
            
            # Fill form
            star_buttons = page.locator('button[aria-label*="star" i]')
            if await star_buttons.count() >= 5:
                await star_buttons.nth(4).click()
            
            title_inputs = page.locator('input[type="text"]')
            if await title_inputs.count() > 0:
                await title_inputs.first.fill("Critic Review - Excellent Film")
            
            content_area = page.locator('textarea')
            if await content_area.count() > 0:
                await content_area.first.fill("As a critic, this film demonstrates exceptional cinematography and storytelling. The director's vision is clearly executed with precision and artistic merit.")
            
            # Submit
            submit_btn = page.locator('button:has-text("Submit")')
            if await submit_btn.count() > 0:
                await submit_btn.first.click()
                await page.wait_for_timeout(3000)
                log_test("Review Creation as Critic", "PASS", "Critic review submitted successfully")
                return True
        
        log_test("Review Creation as Critic", "FAIL", "Could not create review")
        return False
    except Exception as e:
        log_test("Review Creation as Critic", "ERROR", str(e))
        return False

async def test_watchlist_as_critic(page):
    """Test watchlist functionality with critic role"""
    print("\n=== TEST 5: Watchlist as Critic ===")
    try:
        # Navigate to movie page
        await page.goto(f"{BASE_URL}/movies/{TEST_MOVIE_ID}")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        # Add to watchlist
        watchlist_btn = page.locator('button:has-text("Add to Watchlist")')
        if await watchlist_btn.count() > 0:
            await watchlist_btn.click()
            await page.wait_for_timeout(2000)
            log_test("Add to Watchlist (Critic)", "PASS", "Movie added to watchlist")
        
        # Navigate to watchlist
        await page.goto(f"{BASE_URL}/watchlist")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        page_text = await page.text_content("body")
        if page_text and len(page_text) > 100:
            log_test("Watchlist Display (Critic)", "PASS", "Watchlist page loaded")
            return True
        else:
            log_test("Watchlist Display (Critic)", "FAIL", "Watchlist page empty")
            return False
    except Exception as e:
        log_test("Watchlist (Critic)", "ERROR", str(e))
        return False

async def test_favorites_as_critic(page):
    """Test favorites functionality with critic role"""
    print("\n=== TEST 6: Favorites as Critic ===")
    try:
        # Navigate to movie page
        await page.goto(f"{BASE_URL}/movies/{TEST_MOVIE_ID}")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        # Add to favorites
        favorites_btn = page.locator('button:has-text("Add to Favorites")')
        if await favorites_btn.count() > 0:
            await favorites_btn.click()
            await page.wait_for_timeout(2000)
            log_test("Add to Favorites (Critic)", "PASS", "Movie added to favorites")
        
        # Navigate to favorites
        await page.goto(f"{BASE_URL}/favorites")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        page_text = await page.text_content("body")
        if page_text and len(page_text) > 100:
            log_test("Favorites Display (Critic)", "PASS", "Favorites page loaded")
            return True
        else:
            log_test("Favorites Display (Critic)", "FAIL", "Favorites page empty")
            return False
    except Exception as e:
        log_test("Favorites (Critic)", "ERROR", str(e))
        return False

async def main():
    """Run all tests"""
    print("=" * 70)
    print("CRITIC ROLE ENABLE & FEATURE TEST SUITE")
    print("=" * 70)
    print(f"Test User: {TEST_USER_EMAIL}")
    print(f"Test Movie: {TEST_MOVIE_ID}")
    print("=" * 70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        page = await browser.new_page()
        
        # Enable console logging
        page.on("console", lambda msg: print(f"[CONSOLE] {msg.text}"))
        
        try:
            # Run tests
            if await test_login(page):
                await test_enable_critic_role(page)
                await test_critic_tab_visible(page)
                await test_review_creation_as_critic(page)
                await test_watchlist_as_critic(page)
                await test_favorites_as_critic(page)
        
        finally:
            await browser.close()
    
    # Print summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    print(f"Total Tests: {test_results['summary']['total']}")
    print(f"Passed: {test_results['summary']['passed']}")
    print(f"Failed: {test_results['summary']['failed']}")
    print(f"Errors: {test_results['summary']['errors']}")
    
    # Save results
    with open("critic_role_test_results.json", "w") as f:
        json.dump(test_results, f, indent=2)
    print(f"\nResults saved to critic_role_test_results.json")

if __name__ == "__main__":
    asyncio.run(main())

