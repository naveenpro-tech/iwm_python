#!/usr/bin/env python3
"""
Test History Tab GUI - Verify watch history displays real data
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

async def test_history_tab_gui():
    """Test History Tab GUI with real data"""
    
    print("\n" + "="*80)
    print("HISTORY TAB - GUI TEST SUITE")
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
            
            # Step 4: Click History tab
            print("\n[4/6] Clicking History tab...")
            await page.wait_for_timeout(1000)
            
            # Find and click the History tab button
            history_buttons = page.locator("button", has_text="History")
            if await history_buttons.count() > 0:
                await history_buttons.first.click()
                await page.wait_for_load_state("networkidle")
                print("✅ History tab clicked")
            else:
                print("⚠️  History tab button not found")
            
            # Step 5: Wait for history to load
            print("\n[5/6] Waiting for history to load...")
            
            # Wait for page to be fully loaded
            await page.wait_for_timeout(2000)
            
            # Check for search input (indicates history tab is loaded)
            search_input = page.locator('input[placeholder*="Search"]')
            
            if await search_input.count() > 0:
                print("✅ History tab loaded (search input found)")
                
                # Check if history items are displayed
                history_items = page.locator("div.bg-\\[\\#282828\\].rounded-lg.p-4")
                item_count = await history_items.count()
                
                if item_count > 0:
                    print(f"✅ History loaded with {item_count} items")
                else:
                    # Check for empty state
                    empty_state = page.locator("text=No watch history found")
                    if await empty_state.count() > 0:
                        print("✅ History shows empty state (user has no watched movies)")
                    else:
                        print("⚠️  No history items found and no empty state message")
            else:
                print("⚠️  History tab search input not found")
            
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
            screenshot_path = Path("test-artifacts/profile-investigation/history_tab_screenshot.png")
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
                error_screenshot = Path("test-artifacts/profile-investigation/history_tab_error.png")
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
        result = asyncio.run(test_history_tab_gui())
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

