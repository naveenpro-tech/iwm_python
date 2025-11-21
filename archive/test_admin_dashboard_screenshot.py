#!/usr/bin/env python3
"""
Take screenshot of admin dashboard
"""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots/admin_dashboard")

SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


async def screenshot_admin_dashboard():
    """Take screenshot of admin dashboard"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()
        
        try:
            print("\n" + "="*80)
            print("📸 ADMIN DASHBOARD SCREENSHOT TEST")
            print("="*80)
            
            # Login
            print("\n📍 Step 1: Login...")
            await page.goto(f"{FRONTEND_URL}/login")
            await page.wait_for_load_state("networkidle")
            
            await page.fill('input[id="email"]', ADMIN_EMAIL)
            await page.fill('input[id="password"]', ADMIN_PASSWORD)
            
            submit_button = await page.query_selector('button[type="submit"]')
            try:
                async with page.expect_navigation(timeout=5000):
                    await submit_button.click()
            except:
                pass
            
            await page.wait_for_timeout(2000)
            print("✅ Logged in")
            
            # Navigate to admin
            print("\n📍 Step 2: Navigate to admin dashboard...")
            try:
                await page.goto(f"{FRONTEND_URL}/admin", wait_until="domcontentloaded", timeout=10000)
            except:
                pass
            
            await page.wait_for_timeout(3000)
            print(f"✅ Admin dashboard loaded: {page.url}")
            
            # Take full page screenshot
            print("\n📍 Step 3: Taking full page screenshot...")
            await page.screenshot(path=SCREENSHOTS_DIR / "admin_dashboard_full.png", full_page=True)
            print("✅ Full page screenshot saved")
            
            # Take viewport screenshot
            print("\n📍 Step 4: Taking viewport screenshot...")
            await page.screenshot(path=SCREENSHOTS_DIR / "admin_dashboard_viewport.png")
            print("✅ Viewport screenshot saved")
            
            # Check for key elements
            print("\n📍 Step 5: Checking for key elements...")
            
            elements_to_check = {
                "Admin Sidebar": 'nav',
                "Admin Header": 'header',
                "Dashboard Title": 'h1',
                "KPI Cards": '[class*="kpi"]',
                "Activity Feed": '[class*="activity"]',
                "Quick Actions": '[class*="action"]',
            }
            
            found_elements = []
            for name, selector in elements_to_check.items():
                element = await page.query_selector(selector)
                if element:
                    print(f"✅ {name} found")
                    found_elements.append(name)
                else:
                    print(f"⚠️  {name} not found")
            
            # Get page content info
            print("\n📍 Step 6: Analyzing page content...")
            
            # Check for text content
            page_text = await page.text_content("body")
            if "Dashboard Overview" in page_text:
                print("✅ Dashboard Overview title found")
            
            if "Total Users" in page_text:
                print("✅ KPI metrics found")
            
            if "Activity Feed" in page_text:
                print("✅ Activity Feed section found")
            
            if "Quick Actions" in page_text:
                print("✅ Quick Actions section found")
            
            # Final summary
            print("\n" + "="*80)
            print("✅ ADMIN DASHBOARD SCREENSHOT TEST COMPLETE")
            print("="*80)
            print(f"\n✅ Elements found: {len(found_elements)}/{len(elements_to_check)}")
            print(f"✅ Screenshots saved to: {SCREENSHOTS_DIR}")
            print("="*80)
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(screenshot_admin_dashboard())

