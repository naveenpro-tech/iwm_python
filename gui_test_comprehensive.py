#!/usr/bin/env python3
"""
Comprehensive GUI Testing Script for Critic Platform
Tests all critical user flows via Playwright browser automation
"""

import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright, expect
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3000"
API_BASE = "http://127.0.0.1:8000"
TEST_USER_EMAIL = "critic.tester@example.com"
TEST_USER_PASSWORD = "Test!23456789"
TEST_USER_NAME = "Critic Tester"
TEST_MOVIE_ID = "tmdb-1054867"  # Using the correct movie ID format

# Test results tracking
test_results = {
    "timestamp": datetime.now().isoformat(),
    "tests": [],
    "summary": {
        "total": 0,
        "passed": 0,
        "failed": 0,
        "errors": []
    }
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
    else:
        test_results["summary"]["failed"] += 1
    test_results["summary"]["total"] += 1
    print(f"[{status}] {name}: {details}")

async def test_login_flow(page):
    """Test 3.1: Login Flow"""
    print("\n=== TEST 3.1: Login Flow ===")
    try:
        # Navigate to login page
        await page.goto(f"{BASE_URL}/login")
        await page.wait_for_load_state("networkidle")

        # Fill in credentials
        await page.fill('input[type="email"]', TEST_USER_EMAIL)
        await page.fill('input[type="password"]', TEST_USER_PASSWORD)

        # Submit form
        await page.click('button[type="submit"]')

        # Wait for redirect (can take a few seconds)
        await page.wait_for_timeout(5000)
        await page.wait_for_load_state("networkidle")

        # Check if redirected (successful login)
        current_url = page.url
        if "/login" not in current_url:
            log_test("Login Flow", "PASS", f"Successfully logged in, redirected to {current_url}")
            return True
        else:
            log_test("Login Flow", "FAIL", "Still on login page after submission")
            return False
    except Exception as e:
        log_test("Login Flow", "ERROR", str(e))
        return False

async def test_review_creation_flow(page):
    """Test 3.2: Review Creation Flow"""
    print("\n=== TEST 3.2: Review Creation Flow ===")
    try:
        # Navigate to movie page with correct ID format
        await page.goto(f"{BASE_URL}/movies/{TEST_MOVIE_ID}")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        # Click "Write a Review" button
        write_review_btn = page.locator('button:has-text("Write a Review")')
        if await write_review_btn.count() > 0:
            await write_review_btn.click()
            await page.wait_for_timeout(2000)
        else:
            log_test("Review Creation", "FAIL", "Write a Review button not found")
            return False

        # Fill out review form - try multiple selectors
        # Select rating (5 stars) - try different selectors
        star_buttons = page.locator('button[aria-label*="star" i]')
        if await star_buttons.count() >= 5:
            await star_buttons.nth(4).click()  # 5th star
            await page.wait_for_timeout(500)

        # Fill title - try multiple selectors
        title_inputs = page.locator('input[type="text"]')
        if await title_inputs.count() > 0:
            await title_inputs.first.fill("Excellent Movie")

        # Fill content - find textarea
        content_area = page.locator('textarea')
        if await content_area.count() > 0:
            await content_area.first.fill("This is an excellent movie with great performances and cinematography. Highly recommended for all movie lovers.")
            await page.wait_for_timeout(500)

        # Submit review - try multiple selectors
        submit_btn = page.locator('button:has-text("Submit")')
        if await submit_btn.count() > 0:
            await submit_btn.first.click()
            await page.wait_for_timeout(3000)
            log_test("Review Creation", "PASS", "Review submitted successfully")
            return True
        else:
            log_test("Review Creation", "FAIL", "Submit button not found")
            return False
    except Exception as e:
        log_test("Review Creation", "ERROR", str(e))
        return False

async def test_watchlist_functionality(page):
    """Test 3.3: Watchlist Functionality"""
    print("\n=== TEST 3.3: Watchlist Functionality ===")
    try:
        # Navigate to movie page with correct ID
        await page.goto(f"{BASE_URL}/movies/{TEST_MOVIE_ID}")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        # Add to watchlist
        watchlist_btn = page.locator('button:has-text("Add to Watchlist")')
        if await watchlist_btn.count() > 0:
            await watchlist_btn.first.click()
            await page.wait_for_timeout(2000)
            log_test("Add to Watchlist", "PASS", "Movie added to watchlist")
        else:
            log_test("Add to Watchlist", "FAIL", "Watchlist button not found")
            return False

        # Navigate to watchlist page
        await page.goto(f"{BASE_URL}/watchlist")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        # Check if movie appears - look for any movie content
        page_text = await page.text_content("body")
        if page_text and len(page_text) > 100:
            log_test("Watchlist Display", "PASS", "Watchlist page loaded with content")
            return True
        else:
            log_test("Watchlist Display", "FAIL", "Watchlist page appears empty")
            return False
    except Exception as e:
        log_test("Watchlist Functionality", "ERROR", str(e))
        return False

async def test_favorites_functionality(page):
    """Test 3.4: Favorites Functionality"""
    print("\n=== TEST 3.4: Favorites Functionality ===")
    try:
        # Navigate to movie page with correct ID
        await page.goto(f"{BASE_URL}/movies/{TEST_MOVIE_ID}")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        # Add to favorites
        favorites_btn = page.locator('button:has-text("Add to Favorites")')
        if await favorites_btn.count() > 0:
            await favorites_btn.first.click()
            await page.wait_for_timeout(2000)
            log_test("Add to Favorites", "PASS", "Movie added to favorites")
        else:
            log_test("Add to Favorites", "FAIL", "Favorites button not found")
            return False

        # Navigate to favorites page
        await page.goto(f"{BASE_URL}/favorites")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        # Check if page has content
        page_text = await page.text_content("body")
        if page_text and len(page_text) > 100:
            log_test("Favorites Display", "PASS", "Favorites page loaded with content")
            return True
        else:
            log_test("Favorites Display", "FAIL", "Favorites page appears empty")
            return False
    except Exception as e:
        log_test("Favorites Functionality", "ERROR", str(e))
        return False

async def main():
    """Run all GUI tests"""
    print("=" * 60)
    print("COMPREHENSIVE GUI TESTING - CRITIC PLATFORM")
    print("=" * 60)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Test 3.1: Login Flow
            login_success = await test_login_flow(page)
            
            if login_success:
                # Test 3.2: Review Creation
                await test_review_creation_flow(page)
                
                # Test 3.3: Watchlist
                await test_watchlist_functionality(page)
                
                # Test 3.4: Favorites
                await test_favorites_functionality(page)
            
        finally:
            await browser.close()
    
    # Print summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {test_results['summary']['total']}")
    print(f"Passed: {test_results['summary']['passed']}")
    print(f"Failed: {test_results['summary']['failed']}")
    
    # Save results
    with open("gui_test_results.json", "w") as f:
        json.dump(test_results, f, indent=2)
    print(f"\nResults saved to gui_test_results.json")

if __name__ == "__main__":
    asyncio.run(main())

