"""
Direct investigation of two critical bugs using existing test account.
"""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"
ARTIFACTS_DIR = Path("test-artifacts/profile-investigation")
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

async def investigate_bugs():
    """Investigate both bugs using existing test account."""
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        try:
            print("\n" + "="*60)
            print("🔍 DIRECT BUG INVESTIGATION")
            print("="*60)
            
            # Login with existing account
            print(f"\n🔐 Logging in with user1@iwm.com")
            await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
            await page.fill('input[type="email"]', "user1@iwm.com")
            await page.fill('input[type="password"]', "rmrnn0077")
            await page.press('input[type="password"]', "Enter")
            await page.wait_for_timeout(3000)
            
            # Navigate to profile
            print(f"\n📄 Navigating to profile page")
            await page.goto(f"{BASE_URL}/profile/user1", wait_until="networkidle")
            await page.wait_for_timeout(2000)
            
            # Take screenshot of profile
            await page.screenshot(path=str(ARTIFACTS_DIR / "01_profile_overview.png"))
            print(f"   ✅ Screenshot: 01_profile_overview.png")
            
            # Check Favorites tab
            print(f"\n📋 Checking Favorites tab")
            fav_button = await page.query_selector('button:has-text("Favorites")')
            if fav_button:
                await fav_button.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path=str(ARTIFACTS_DIR / "02_favorites_tab.png"))
                print(f"   ✅ Screenshot: 02_favorites_tab.png")
                
                # Check for content
                body = await page.query_selector('body')
                text = await body.text_content()
                if "No" in text and "yet" in text:
                    print(f"   ✅ Favorites tab is EMPTY (correct)")
                elif "movie" in text.lower() or "item" in text.lower():
                    print(f"   ❌ BUG #1 CONFIRMED: Favorites tab has items (should be empty)")
                else:
                    print(f"   ⚠️  Favorites tab status unclear")
            
            # Navigate to collections
            print(f"\n📚 Navigating to collections page")
            await page.goto(f"{BASE_URL}/collections", wait_until="networkidle")
            await page.wait_for_timeout(2000)
            
            # Take screenshot
            await page.screenshot(path=str(ARTIFACTS_DIR / "03_collections_page.png"))
            print(f"   ✅ Screenshot: 03_collections_page.png")
            
            # Check for collections
            body = await page.query_selector('body')
            text = await body.text_content()
            
            # Count collections
            collection_count = text.count("Test Collection")
            print(f"   Found {collection_count} collections")
            
            # Look for share buttons
            share_buttons = await page.query_selector_all('button')
            share_count = 0
            for btn in share_buttons:
                btn_text = await btn.text_content()
                if btn_text and "share" in btn_text.lower():
                    share_count += 1
            
            print(f"   Found {share_count} share buttons")
            
            if share_count > 0:
                # Click first share button
                print(f"\n🔗 Clicking share button")
                share_buttons = []
                all_buttons = await page.query_selector_all('button')
                for btn in all_buttons:
                    btn_text = await btn.text_content()
                    if btn_text and "share" in btn_text.lower():
                        share_buttons.append(btn)
                
                if share_buttons:
                    await share_buttons[0].click(force=True)
                    await page.wait_for_timeout(1500)
                    
                    # Take screenshot of share dialog
                    await page.screenshot(path=str(ARTIFACTS_DIR / "04_share_dialog.png"))
                    print(f"   ✅ Screenshot: 04_share_dialog.png")
                    
                    # Look for URL
                    body = await page.query_selector('body')
                    text = await body.text_content()
                    
                    if "/profile/" in text:
                        print(f"   ❌ BUG #2 CONFIRMED: Share URL points to /profile/")
                    elif "/collections/" in text or "/shared/" in text:
                        print(f"   ✅ Share URL points to /collections/ or /shared/ (correct)")
                    else:
                        print(f"   ⚠️  Share URL format unclear")
                    
                    # Try to find input field
                    url_input = await page.query_selector('input[readonly], input[type="text"]')
                    if url_input:
                        share_url = await url_input.input_value()
                        print(f"   📋 Share URL: {share_url}")
            else:
                print(f"   ⚠️  No share buttons found")
            
            print("\n" + "="*60)
            print("✅ Investigation complete!")
            print("="*60)
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(investigate_bugs())

