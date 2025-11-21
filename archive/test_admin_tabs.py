"""
Test script to audit admin movie detail page tabs and take screenshots.
This script will:
1. Login to admin panel
2. Navigate to a test movie (tmdb-238 "The Godfather")
3. Visit all 7 tabs and take screenshots
4. Analyze content to determine real vs placeholder data
"""

import asyncio
from playwright.async_api import async_playwright, Page
import os
from datetime import datetime

# Create screenshots directory
SCREENSHOTS_DIR = "admin_tabs_screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

async def login(page: Page):
    """Login to admin panel"""
    print("🔐 Logging in to admin panel...")
    await page.goto("http://localhost:3000/login")
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(1000)

    # Fill login form
    await page.fill('input[type="email"]', "admin@iwm.com")
    await page.fill('input[type="password"]', "AdminPassword123!")

    # Click login button and wait for navigation
    await page.click('button[type="submit"]')

    # Wait for navigation to complete (should go to /admin or /dashboard)
    await page.wait_for_url(lambda url: "/login" not in url, timeout=10000)
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(2000)

    print(f"✅ Logged in successfully - Current URL: {page.url}")

async def take_tab_screenshot(page: Page, tab_name: str, tab_value: str):
    """Take screenshot of a specific tab"""
    print(f"\n📸 Capturing {tab_name} tab...")

    # Click the tab using text content
    await page.click(f'button:has-text("{tab_name}")')
    await page.wait_for_timeout(1500)  # Wait for content to load
    
    # Take screenshot
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{SCREENSHOTS_DIR}/{tab_value}_{timestamp}.png"
    await page.screenshot(path=filename, full_page=True)
    print(f"✅ Screenshot saved: {filename}")
    
    # Analyze content
    await analyze_tab_content(page, tab_name, tab_value)

async def analyze_tab_content(page: Page, tab_name: str, tab_value: str):
    """Analyze tab content to determine if it's real data or placeholder"""
    print(f"🔍 Analyzing {tab_name} content...")
    
    # Get all text content
    content = await page.inner_text('body')
    
    # Check for common placeholder indicators
    placeholders = [
        "No data available",
        "Add new",
        "Import",
        "placeholder",
        "Coming soon",
        "Not available",
        "TBD",
        "Lorem ipsum"
    ]
    
    has_placeholder = any(p.lower() in content.lower() for p in placeholders)
    
    # Check for specific content based on tab
    if tab_value == "basic":
        has_data = "The Godfather" in content and "1972" in content
    elif tab_value == "media":
        has_data = "poster" in content.lower() or "backdrop" in content.lower()
    elif tab_value == "cast-crew":
        has_data = "Marlon Brando" in content or "Al Pacino" in content or "director" in content.lower()
    elif tab_value == "streaming":
        has_data = "platform" in content.lower() or "netflix" in content.lower() or "amazon" in content.lower()
    elif tab_value == "awards":
        has_data = "oscar" in content.lower() or "academy" in content.lower() or "golden globe" in content.lower()
    elif tab_value == "trivia":
        has_data = len(content) > 500 and not has_placeholder
    elif tab_value == "timeline":
        has_data = "production" in content.lower() or "filming" in content.lower() or "release" in content.lower()
    else:
        has_data = False
    
    status = "✅ REAL DATA" if has_data and not has_placeholder else "⚠️ PLACEHOLDER/EMPTY"
    print(f"   Status: {status}")
    
    return has_data and not has_placeholder

async def main():
    """Main test function"""
    print("=" * 80)
    print("ADMIN MOVIE DETAIL PAGE TAB AUDIT")
    print("=" * 80)
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()
        
        try:
            # Login
            await login(page)
            
            # Navigate to test movie
            print("\n🎬 Navigating to The Godfather (tmdb-238)...")
            await page.goto("http://localhost:3000/admin/movies/tmdb-238")
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(3000)

            # Take initial screenshot to see what's on the page
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/initial_page.png", full_page=True)
            print("📸 Initial page screenshot saved")

            # Print page title and URL
            print(f"   Page title: {await page.title()}")
            print(f"   Page URL: {page.url}")
            
            # Test all 7 tabs
            tabs = [
                ("Basic Info", "basic"),
                ("Media", "media"),
                ("Cast & Crew", "cast-crew"),
                ("Streaming", "streaming"),
                ("Awards", "awards"),
                ("Trivia", "trivia"),
                ("Timeline", "timeline"),
            ]
            
            results = {}
            for tab_name, tab_value in tabs:
                has_real_data = await take_tab_screenshot(page, tab_name, tab_value)
                results[tab_name] = has_real_data
            
            # Print summary
            print("\n" + "=" * 80)
            print("SUMMARY REPORT")
            print("=" * 80)
            print("\nTab Status:")
            for tab_name, has_data in results.items():
                status = "✅ Has Real Data" if has_data else "⚠️ Placeholder/Empty"
                print(f"  {tab_name:20} {status}")
            
            print(f"\nScreenshots saved in: {SCREENSHOTS_DIR}/")
            print("\n" + "=" * 80)
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

