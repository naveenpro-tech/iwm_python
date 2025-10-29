"""Test fresh account favorites in GUI."""

import asyncio
import random
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
ARTIFACTS_DIR = Path("test-artifacts/profile-investigation")
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

async def test_fresh_account():
    """Test fresh account favorites in GUI."""
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        try:
            print("\n" + "="*60)
            print("🔍 FRESH ACCOUNT FAVORITES TEST")
            print("="*60)
            
            # Create fresh account
            email = f"testuser{random.randint(10000, 99999)}@iwm.com"
            password = "rmrnn0077"
            
            print(f"\n📝 Creating fresh account: {email}")
            await page.goto(f"{BASE_URL}/signup", wait_until="networkidle")
            await page.wait_for_timeout(1000)
            
            # Fill signup form
            await page.fill('input[type="email"]', email)
            await page.fill('input[type="password"]', password)
            
            # Find name input
            name_input = await page.query_selector('input[placeholder*="name" i]')
            if not name_input:
                name_input = await page.query_selector('input[placeholder*="full" i]')
            if not name_input:
                name_input = await page.query_selector('input:nth-of-type(3)')
            
            if name_input:
                await name_input.fill("Test User")
            
            # Submit
            await page.press('input[type="password"]', "Enter")
            await page.wait_for_timeout(3000)

            # Check if we're redirected
            current_url = page.url
            print(f"   Current URL after signup: {current_url}")

            if "/profile" in current_url or "/dashboard" in current_url:
                print(f"   ✅ Account created and logged in")
            else:
                print(f"   ⚠️  Not redirected to profile/dashboard")
            
            # Navigate to profile
            print(f"\n📄 Navigating to profile page")
            await page.goto(f"{BASE_URL}/profile", wait_until="networkidle")
            await page.wait_for_timeout(3000)

            # Check page content
            body = await page.query_selector('body')
            page_text = await body.text_content()
            print(f"   Page text length: {len(page_text)}")

            # Get all buttons
            all_buttons = await page.query_selector_all('button')
            print(f"   Found {len(all_buttons)} buttons")
            button_texts = []
            for btn in all_buttons[:20]:
                text = await btn.text_content()
                if text:
                    button_texts.append(text.strip())
            print(f"   Button texts: {button_texts[:10]}")

            # Take screenshot
            await page.screenshot(path=str(ARTIFACTS_DIR / "fresh_01_profile_overview.png"))
            print(f"   ✅ Screenshot: fresh_01_profile_overview.png")

            # Check Favorites tab
            print(f"\n📋 Checking Favorites tab")
            # Try multiple selectors
            fav_button = await page.query_selector('button:has-text("Favorites")')
            if not fav_button:
                # Try alternative selector
                all_buttons = await page.query_selector_all('button')
                for btn in all_buttons:
                    text = await btn.text_content()
                    if text and "Favorites" in text:
                        fav_button = btn
                        break

            if fav_button:
                await fav_button.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path=str(ARTIFACTS_DIR / "fresh_02_favorites_tab.png"))
                print(f"   ✅ Screenshot: fresh_02_favorites_tab.png")
                
                # Check for content
                body = await page.query_selector('body')
                text = await body.text_content()
                
                if "No" in text and "yet" in text:
                    print(f"   ✅ BUG #1 FIXED: Favorites tab is EMPTY (correct)")
                elif "movie" in text.lower() or "item" in text.lower():
                    print(f"   ❌ BUG #1 STILL EXISTS: Favorites tab has items")
                else:
                    print(f"   ⚠️  Favorites tab status unclear")
            else:
                print(f"   ⚠️  Favorites button not found")
            
            print("\n" + "="*60)
            print("✅ Test complete!")
            print("="*60)
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_fresh_account())

