"""
Comprehensive investigation script for:
1. Bug #1: Default/Demo data appearing in new user profiles
2. Bug #2: Collection share link showing profile URL instead of collection URL
"""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright
import random
import string

BASE_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"
ARTIFACTS_DIR = Path("test-artifacts/profile-investigation")
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

async def create_fresh_account(page):
    """Create a fresh test account."""
    email = f"testuser{random.randint(10000, 99999)}@iwm.com"
    password = "rmrnn0077"

    print(f"\n📝 Creating fresh account: {email}")

    # Navigate to signup page
    await page.goto(f"{BASE_URL}/signup", wait_until="networkidle")
    await page.wait_for_timeout(2000)

    # Fill signup form
    try:
        await page.fill('input[type="email"]', email)
        await page.fill('input[type="password"]', password)

        # Try different selectors for name field
        name_input = await page.query_selector('input[placeholder*="name" i]')
        if not name_input:
            name_input = await page.query_selector('input[placeholder*="full" i]')
        if not name_input:
            name_input = await page.query_selector('input:nth-of-type(3)')

        if name_input:
            await name_input.fill("Test User")

        # Submit
        submit_btn = await page.query_selector('button:has-text("Sign Up")')
        if submit_btn:
            await submit_btn.click()
        else:
            # Try pressing Enter
            await page.press('input[type="password"]', "Enter")

        await page.wait_for_timeout(3000)
        print(f"   ✅ Account created")
    except Exception as e:
        print(f"   ⚠️  Signup error: {str(e)[:50]}")

    return email, password

async def investigate_new_user_profile(page):
    """Bug #1: Check for default data in new user profile."""
    print("\n" + "="*60)
    print("🔍 BUG #1 INVESTIGATION: Default Data in New User Profile")
    print("="*60)
    
    # Create fresh account
    email, password = await create_fresh_account(page)
    
    # Login
    print(f"\n🔐 Logging in with {email}")
    await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.press('input[type="password"]', "Enter")
    await page.wait_for_timeout(3000)
    
    # Navigate to profile
    print(f"\n📄 Navigating to profile page")
    await page.goto(f"{BASE_URL}/profile", wait_until="networkidle")
    await page.wait_for_timeout(2000)
    
    # Get username from URL
    username = page.url.split("/profile/")[1] if "/profile/" in page.url else "unknown"
    print(f"   Username: {username}")
    
    # Take screenshot of overview tab
    await page.screenshot(path=str(ARTIFACTS_DIR / f"01_new_user_overview.png"))
    print(f"   ✅ Screenshot: 01_new_user_overview.png")
    
    # Check all tabs
    tabs_to_check = ["Favorites", "Watchlist", "Collections", "Reviews"]
    tab_results = {}

    for tab_name in tabs_to_check:
        try:
            # Try multiple selectors for tab button
            tab_button = await page.query_selector(f'button:has-text("{tab_name}")')
            if not tab_button:
                # Try alternative selector
                all_buttons = await page.query_selector_all('button')
                for btn in all_buttons:
                    text = await btn.text_content()
                    if text and tab_name.lower() in text.lower():
                        tab_button = btn
                        break

            if tab_button:
                await tab_button.click()
                await page.wait_for_timeout(1500)

                # Take screenshot
                screenshot_name = f"02_new_user_{tab_name.lower()}.png"
                await page.screenshot(path=str(ARTIFACTS_DIR / screenshot_name))
                print(f"   ✅ Screenshot: {screenshot_name}")

                # Check for content
                body = await page.query_selector('body')
                text_content = await body.text_content()

                # Look for indicators of default/demo data
                has_content = len(text_content) > 500  # Rough check
                has_items = "item" in text_content.lower() or "movie" in text_content.lower()

                tab_results[tab_name] = {
                    "has_content": has_content,
                    "has_items": has_items,
                    "text_preview": text_content[:200]
                }

                if has_items:
                    print(f"   ⚠️  {tab_name} tab has items (may be default data)")
                else:
                    print(f"   ✅ {tab_name} tab is empty (correct)")
            else:
                print(f"   ⚠️  {tab_name} tab button not found")
        except Exception as e:
            print(f"   ❌ Error checking {tab_name}: {str(e)[:50]}")
    
    return {
        "email": email,
        "username": username,
        "tab_results": tab_results
    }

async def investigate_collection_sharing(page):
    """Bug #2: Check collection share link."""
    print("\n" + "="*60)
    print("🔍 BUG #2 INVESTIGATION: Collection Share Link")
    print("="*60)
    
    # Login with existing account
    print(f"\n🔐 Logging in with user1@iwm.com")
    await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    await page.fill('input[type="email"]', "user1@iwm.com")
    await page.fill('input[type="password"]', "rmrnn0077")
    await page.press('input[type="password"]', "Enter")
    await page.wait_for_timeout(3000)
    
    # Navigate to collections
    print(f"\n📚 Navigating to collections page")
    await page.goto(f"{BASE_URL}/collections", wait_until="networkidle")
    await page.wait_for_timeout(2000)
    
    # Take screenshot
    await page.screenshot(path=str(ARTIFACTS_DIR / "03_collections_page.png"))
    print(f"   ✅ Screenshot: 03_collections_page.png")
    
    # Find share buttons - try multiple selectors
    share_buttons = await page.query_selector_all('button:has-text("Share")')
    if not share_buttons:
        # Try alternative selector
        all_buttons = await page.query_selector_all('button')
        for btn in all_buttons:
            text = await btn.text_content()
            if text and "share" in text.lower():
                share_buttons.append(btn)

    print(f"   Found {len(share_buttons)} share buttons")

    if share_buttons:
        # Click first share button
        try:
            await share_buttons[0].click(force=True)
            await page.wait_for_timeout(1500)

            # Take screenshot of share dialog
            await page.screenshot(path=str(ARTIFACTS_DIR / "04_share_dialog.png"))
            print(f"   ✅ Screenshot: 04_share_dialog.png")

            # Try to find the share URL
            # Look for input field or text showing the URL
            url_input = await page.query_selector('input[readonly], input[type="text"]')
            if url_input:
                share_url = await url_input.input_value()
                print(f"   📋 Share URL: {share_url}")

                # Check if it's pointing to profile or collection
                if "/profile/" in share_url:
                    print(f"   ❌ BUG CONFIRMED: Share URL points to profile, not collection")
                elif "/collections/" in share_url or "/shared/" in share_url:
                    print(f"   ✅ Share URL points to collection (correct)")
                else:
                    print(f"   ⚠️  Share URL format unclear")

                return {"share_url": share_url}
            else:
                # Look for text content
                body = await page.query_selector('body')
                text = await body.text_content()
                print(f"   ⚠️  Could not find URL input, checking page text...")
                if "/profile/" in text:
                    print(f"   ❌ BUG CONFIRMED: Profile URL found in share dialog")
                print(f"   Page text preview: {text[:300]}")
        except Exception as e:
            print(f"   ❌ Error clicking share button: {str(e)[:50]}")

    return {"share_buttons_found": len(share_buttons)}

async def main():
    """Run all investigations."""
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        try:
            # Bug #1 Investigation
            bug1_results = await investigate_new_user_profile(page)
            
            # Bug #2 Investigation
            bug2_results = await investigate_collection_sharing(page)
            
            # Save results
            results = {
                "bug_1_new_user_profile": bug1_results,
                "bug_2_collection_sharing": bug2_results
            }
            
            with open(ARTIFACTS_DIR / "investigation_results.json", "w") as f:
                json.dump(results, f, indent=2)
            
            print("\n" + "="*60)
            print("✅ Investigation complete!")
            print(f"📁 Results saved to: {ARTIFACTS_DIR}")
            print("="*60)
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

