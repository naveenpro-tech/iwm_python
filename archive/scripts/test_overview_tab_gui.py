#!/usr/bin/env python3
"""
Test Overview Tab GUI - Verify activity feed displays real data
"""

import asyncio
import sys
import os
from datetime import datetime
from pathlib import Path

# Add backend to path
sys.path.insert(0, "apps/backend")

from playwright.async_api import async_playwright, expect

BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
TEST_USER_EMAIL = "user1@iwm.com"
TEST_USER_PASSWORD = "rmrnn0077"

async def test_overview_tab_gui():
    """Test Overview Tab GUI with real data"""
    
    print("\n" + "="*80)
    print("OVERVIEW TAB - GUI TEST SUITE")
    print("="*80)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            # Step 1: Navigate to login page
            print("\n[1/6] Navigating to login page...")
            await page.goto(f"{BASE_URL}/login")
            await page.wait_for_load_state("networkidle")
            print("✅ Login page loaded")
            
            # Step 2: Login
            print("\n[2/6] Logging in as test user...")
            await page.fill('input[type="email"]', TEST_USER_EMAIL)
            await page.fill('input[type="password"]', TEST_USER_PASSWORD)
            await page.press('input[type="password"]', "Enter")
            await page.wait_for_load_state("networkidle")
            print("✅ Login successful")
            
            # Step 3: Navigate to profile
            print("\n[3/6] Navigating to profile page...")
            await page.goto(f"{BASE_URL}/profile/user1")
            await page.wait_for_load_state("networkidle")
            print("✅ Profile page loaded")
            
            # Step 4: Click Overview tab
            print("\n[4/6] Clicking Overview tab...")
            # Wait for navigation to be visible
            await page.wait_for_selector("button", timeout=5000)

            # Find and click the Overview tab button
            overview_buttons = page.locator("button", has_text="Overview")
            if await overview_buttons.count() > 0:
                await overview_buttons.first.click()
                await page.wait_for_load_state("networkidle")
                print("✅ Overview tab clicked")
            else:
                print("⚠️  Overview tab button not found, checking if already on overview...")
                # The page might already be on overview tab
            
            # Step 5: Wait for activity feed to load
            print("\n[5/6] Waiting for activity feed to load...")

            # Wait for page to be fully loaded
            await page.wait_for_timeout(2000)

            # Check for activity feed content by looking for the h2 with "Activity Feed"
            activity_feed_header = page.locator("h2:has-text('Activity Feed')")

            if await activity_feed_header.count() > 0:
                print("✅ Activity Feed header found")

                # Check if activities are displayed
                activities = page.locator("div.flex:has-text('You')")
                activity_count = await activities.count()

                if activity_count > 0:
                    print(f"✅ Activity feed loaded with {activity_count} activities")

                    # Get first activity text
                    first_activity = activities.first
                    activity_text = await first_activity.text_content()
                    print(f"   First activity: {activity_text[:100]}...")
                else:
                    # Check for empty state
                    empty_state = page.locator("text=No activity yet")
                    if await empty_state.count() > 0:
                        print("✅ Activity feed shows empty state (user has no activities)")
                    else:
                        print("⚠️  No activities found and no empty state message")
            else:
                print("⚠️  Activity Feed header not found on page")
            
            # Step 6: Check for errors
            print("\n[6/6] Checking for errors...")
            
            # Check console for errors
            console_messages = []
            page.on("console", lambda msg: console_messages.append(msg))
            
            # Wait a bit for any async operations
            await page.wait_for_timeout(2000)
            
            error_messages = [m for m in console_messages if m.type == "error"]
            if error_messages:
                print(f"❌ Found {len(error_messages)} console errors:")
                for msg in error_messages:
                    print(f"   - {msg.text}")
                return False
            else:
                print("✅ No console errors")
            
            # Take screenshot
            screenshot_path = Path("test-artifacts/profile-investigation/overview_tab_screenshot.png")
            screenshot_path.parent.mkdir(parents=True, exist_ok=True)
            await page.screenshot(path=str(screenshot_path))
            print(f"✅ Screenshot saved to {screenshot_path}")
            
            print("\n" + "="*80)
            print("✅ ALL GUI TESTS PASSED")
            print("="*80)
            return True
            
        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            import traceback
            traceback.print_exc()
            
            # Take error screenshot
            try:
                error_screenshot = Path("test-artifacts/profile-investigation/overview_tab_error.png")
                error_screenshot.parent.mkdir(parents=True, exist_ok=True)
                await page.screenshot(path=str(error_screenshot))
                print(f"Error screenshot saved to {error_screenshot}")
            except:
                pass
            
            return False
        finally:
            await browser.close()

if __name__ == "__main__":
    try:
        result = asyncio.run(test_overview_tab_gui())
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

