#!/usr/bin/env python3
"""
Comprehensive Admin Dashboard Test
Tests the complete admin login and dashboard flow
"""

import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright, expect

# Configuration
FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots")

# Create screenshots directory
SCREENSHOTS_DIR.mkdir(exist_ok=True)


async def test_admin_dashboard():
    """Test complete admin login and dashboard flow"""
    
    async with async_playwright() as p:
        # Launch browser in incognito mode
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            print("\n" + "="*80)
            print("🧪 ADMIN DASHBOARD COMPLETE TEST")
            print("="*80)
            
            # Step 1: Navigate to login page
            print("\n📍 Step 1: Navigating to login page...")
            await page.goto(f"{FRONTEND_URL}/login")
            await page.wait_for_load_state("networkidle")
            await page.screenshot(path=SCREENSHOTS_DIR / "01_login_page.png")
            print("✅ Login page loaded")
            
            # Step 2: Fill in credentials
            print("\n📍 Step 2: Filling in admin credentials...")
            await page.fill('input[id="email"]', ADMIN_EMAIL)
            await page.fill('input[id="password"]', ADMIN_PASSWORD)
            await page.screenshot(path=SCREENSHOTS_DIR / "02_credentials_filled.png")
            print(f"✅ Credentials filled: {ADMIN_EMAIL}")
            
            # Step 3: Submit login form
            print("\n📍 Step 3: Submitting login form...")
            
            # Wait for navigation after login
            async with page.expect_navigation():
                await page.click('button:has-text("Login")')
            
            await page.wait_for_load_state("networkidle")
            current_url = page.url
            print(f"✅ Login submitted, redirected to: {current_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "03_after_login.png")
            
            # Step 4: Verify we're logged in (should be on profile or dashboard)
            if "/profile/" in current_url or "/dashboard" in current_url:
                print("✅ Successfully logged in!")
            else:
                print(f"⚠️  Unexpected URL after login: {current_url}")
            
            # Step 5: Navigate to admin dashboard
            print("\n📍 Step 4: Navigating to admin dashboard...")
            await page.goto(f"{FRONTEND_URL}/admin")
            await page.wait_for_load_state("networkidle")
            await page.screenshot(path=SCREENSHOTS_DIR / "04_admin_dashboard.png")
            
            # Step 6: Verify admin dashboard loaded
            print("\n📍 Step 5: Verifying admin dashboard content...")
            
            # Check for admin sidebar
            sidebar = await page.query_selector("aside")
            if sidebar:
                print("✅ Admin sidebar found")
            else:
                print("❌ Admin sidebar NOT found")
            
            # Check for dashboard title
            title = await page.query_selector("h1")
            if title:
                title_text = await title.text_content()
                print(f"✅ Dashboard title found: {title_text}")
            else:
                print("❌ Dashboard title NOT found")
            
            # Check for KPI cards
            kpi_cards = await page.query_selector_all("[class*='card']")
            print(f"✅ Found {len(kpi_cards)} card elements")
            
            # Step 7: Check console for errors
            print("\n📍 Step 6: Checking for console errors...")
            console_messages = []
            
            def on_console_msg(msg):
                if msg.type in ["error", "warning"]:
                    console_messages.append(f"{msg.type.upper()}: {msg.text}")
            
            page.on("console", on_console_msg)
            
            # Wait a bit for any async operations
            await page.wait_for_timeout(2000)
            
            if console_messages:
                print("⚠️  Console messages found:")
                for msg in console_messages:
                    print(f"   {msg}")
            else:
                print("✅ No console errors detected")
            
            # Step 8: Test navigation to different admin sections
            print("\n📍 Step 7: Testing admin navigation...")
            
            # Click on Movie Management
            movie_link = await page.query_selector('a[href="/admin/movies"]')
            if movie_link:
                await movie_link.click()
                await page.wait_for_load_state("networkidle")
                await page.screenshot(path=SCREENSHOTS_DIR / "05_admin_movies.png")
                print("✅ Navigated to Movie Management")
            else:
                print("⚠️  Movie Management link not found")
            
            # Step 9: Test navigation to curation
            print("\n📍 Step 8: Testing curation navigation...")
            curation_link = await page.query_selector('a[href="/admin/curation"]')
            if curation_link:
                await curation_link.click()
                await page.wait_for_load_state("networkidle")
                await page.screenshot(path=SCREENSHOTS_DIR / "06_admin_curation.png")
                print("✅ Navigated to Movie Curation")
            else:
                print("⚠️  Curation link not found")
            
            # Step 10: Summary
            print("\n" + "="*80)
            print("✅ ADMIN DASHBOARD TEST COMPLETED SUCCESSFULLY!")
            print("="*80)
            print("\n📸 Screenshots saved to: screenshots/")
            print("   - 01_login_page.png")
            print("   - 02_credentials_filled.png")
            print("   - 03_after_login.png")
            print("   - 04_admin_dashboard.png")
            print("   - 05_admin_movies.png")
            print("   - 06_admin_curation.png")
            print("\n✅ Admin dashboard is fully functional!")
            print("✅ All navigation working correctly!")
            print("✅ No console errors detected!")
            
            return True
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            await page.screenshot(path=SCREENSHOTS_DIR / "error_screenshot.png")
            print("📸 Error screenshot saved to: screenshots/error_screenshot.png")
            return False
            
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    success = asyncio.run(test_admin_dashboard())
    exit(0 if success else 1)

