"""Quick login test to verify credentials work"""
import asyncio
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"

async def test_login():
    print("=" * 60)
    print("🔐 QUICK LOGIN TEST")
    print("=" * 60)
    print(f"Email: {TEST_EMAIL}")
    print(f"Password: {TEST_PASSWORD}")
    print(f"URL: {BASE_URL}/login")
    print("=" * 60)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Navigate to login page
            print("\n1. Navigating to login page...")
            await page.goto(f"{BASE_URL}/login")
            await page.wait_for_load_state("networkidle")
            await asyncio.sleep(2)
            
            # Fill login form
            print("2. Filling login form...")
            await page.fill('input[type="email"]', TEST_EMAIL)
            await page.fill('input[type="password"]', TEST_PASSWORD)
            
            # Click login button
            print("3. Clicking login button...")
            await page.click('button[type="submit"]')
            
            # Wait for navigation
            print("4. Waiting for redirect...")
            await asyncio.sleep(5)
            
            # Check current URL
            current_url = page.url
            print(f"\n✅ Current URL: {current_url}")
            
            # Check for error messages
            error_elements = await page.query_selector_all('[role="alert"], .error, .text-red-500')
            if error_elements:
                print("\n❌ ERROR MESSAGES FOUND:")
                for elem in error_elements:
                    text = await elem.text_content()
                    print(f"  - {text}")
            else:
                print("\n✅ No error messages found")
            
            # Check if we're logged in (look for profile link or user menu)
            profile_link = await page.query_selector('a[href*="/profile"]')
            if profile_link:
                print("✅ Profile link found - LOGIN SUCCESSFUL")
                href = await profile_link.get_attribute('href')
                print(f"   Profile URL: {href}")
            else:
                print("⚠️  Profile link not found - checking page content...")
                
            # Take screenshot
            screenshot_path = "test-artifacts/gui-testing/quick_login_test.png"
            await page.screenshot(path=screenshot_path)
            print(f"\n📸 Screenshot saved: {screenshot_path}")
            
            # Wait a bit to see the result
            print("\n⏳ Waiting 5 seconds before closing...")
            await asyncio.sleep(5)
            
        except Exception as e:
            print(f"\n❌ ERROR: {e}")
            await page.screenshot(path="test-artifacts/gui-testing/login_error.png")
        
        finally:
            await browser.close()
            print("\n✅ Test complete")

if __name__ == "__main__":
    asyncio.run(test_login())

