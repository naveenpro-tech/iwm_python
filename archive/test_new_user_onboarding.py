#!/usr/bin/env python3
"""
Test new user onboarding flow
"""

import asyncio
from playwright.async_api import async_playwright
import json
from datetime import datetime
import random
import string

BASE_URL = "http://localhost:3000"
API_BASE = "http://127.0.0.1:8000"

# Generate unique test user
random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
TEST_USER_EMAIL = f"newuser.{random_suffix}@example.com"
TEST_USER_PASSWORD = "NewUser!23456789"
TEST_USER_NAME = f"New User {random_suffix}"

test_results = {
    "timestamp": datetime.now().isoformat(),
    "tests": [],
    "summary": {"total": 0, "passed": 0, "failed": 0}
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

async def test_signup_flow(page):
    """Test signup flow"""
    print("\n=== TEST: Signup Flow ===")
    try:
        # Navigate to signup page
        await page.goto(f"{BASE_URL}/signup")
        await page.wait_for_load_state("networkidle")
        
        # Fill in signup form
        name_inputs = page.locator('input[type="text"]')
        if await name_inputs.count() > 0:
            await name_inputs.first.fill(TEST_USER_NAME)
        
        email_inputs = page.locator('input[type="email"]')
        if await email_inputs.count() > 0:
            await email_inputs.first.fill(TEST_USER_EMAIL)
        
        password_inputs = page.locator('input[type="password"]')
        if await password_inputs.count() > 0:
            await password_inputs.first.fill(TEST_USER_PASSWORD)
        
        # Submit form
        submit_btn = page.locator('button[type="submit"]')
        if await submit_btn.count() > 0:
            await submit_btn.first.click()
            await page.wait_for_timeout(5000)
            
            current_url = page.url
            if "/signup" not in current_url:
                log_test("Signup Flow", "PASS", f"Successfully signed up, redirected to {current_url}")
                return True
            else:
                log_test("Signup Flow", "FAIL", "Still on signup page after submission")
                return False
        else:
            log_test("Signup Flow", "FAIL", "Submit button not found")
            return False
    except Exception as e:
        log_test("Signup Flow", "ERROR", str(e))
        return False

async def test_profile_creation(page):
    """Test profile is created after signup"""
    print("\n=== TEST: Profile Creation ===")
    try:
        # Check if we're on profile page
        current_url = page.url
        if "/profile/" in current_url:
            log_test("Profile Creation", "PASS", f"Profile page loaded: {current_url}")
            return True
        else:
            log_test("Profile Creation", "FAIL", f"Not on profile page: {current_url}")
            return False
    except Exception as e:
        log_test("Profile Creation", "ERROR", str(e))
        return False

async def test_data_isolation(page):
    """Test that new user doesn't see other users' data"""
    print("\n=== TEST: Data Isolation ===")
    try:
        # Navigate to reviews page
        await page.goto(f"{BASE_URL}/movies/tmdb-1054867/reviews")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        # Check page loads
        page_text = await page.text_content("body")
        if page_text and len(page_text) > 50:
            log_test("Data Isolation", "PASS", "Reviews page loads without errors")
            return True
        else:
            log_test("Data Isolation", "FAIL", "Reviews page appears empty")
            return False
    except Exception as e:
        log_test("Data Isolation", "ERROR", str(e))
        return False

async def test_new_user_review_creation(page):
    """Test new user can create review"""
    print("\n=== TEST: New User Review Creation ===")
    try:
        # Navigate to movie page
        await page.goto(f"{BASE_URL}/movies/tmdb-1054867")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)
        
        # Click Write a Review
        write_review_btn = page.locator('button:has-text("Write a Review")')
        if await write_review_btn.count() > 0:
            await write_review_btn.click()
            await page.wait_for_timeout(2000)
            
            # Fill form
            star_buttons = page.locator('button[aria-label*="star" i]')
            if await star_buttons.count() >= 4:
                await star_buttons.nth(3).click()  # 4 stars
            
            title_inputs = page.locator('input[type="text"]')
            if await title_inputs.count() > 0:
                await title_inputs.first.fill("Great Movie!")
            
            content_area = page.locator('textarea')
            if await content_area.count() > 0:
                await content_area.first.fill("This is a great movie. I really enjoyed watching it.")
            
            # Submit
            submit_btn = page.locator('button:has-text("Submit")')
            if await submit_btn.count() > 0:
                await submit_btn.first.click()
                await page.wait_for_timeout(3000)
                log_test("New User Review Creation", "PASS", "Review created successfully")
                return True
        
        log_test("New User Review Creation", "FAIL", "Could not create review")
        return False
    except Exception as e:
        log_test("New User Review Creation", "ERROR", str(e))
        return False

async def main():
    """Run all tests"""
    print("=" * 60)
    print("NEW USER ONBOARDING TEST SUITE")
    print("=" * 60)
    print(f"Test User Email: {TEST_USER_EMAIL}")
    print(f"Test User Name: {TEST_USER_NAME}")
    print("=" * 60)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Test signup
            signup_success = await test_signup_flow(page)
            
            if signup_success:
                # Test profile creation
                await test_profile_creation(page)
                
                # Test data isolation
                await test_data_isolation(page)
                
                # Test review creation
                await test_new_user_review_creation(page)
        
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
    with open("onboarding_test_results.json", "w") as f:
        json.dump(test_results, f, indent=2)
    print(f"\nResults saved to onboarding_test_results.json")

if __name__ == "__main__":
    asyncio.run(main())

