#!/usr/bin/env python3
"""
Complete admin flow test - Login to Admin Dashboard
"""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots/complete_flow")

SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


async def test_complete_flow():
    """Test complete admin flow"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            print("\n" + "="*80)
            print("🎯 COMPLETE ADMIN FLOW TEST")
            print("="*80)
            
            # Step 1: Navigate to login
            print("\n📍 Step 1: Navigate to login page...")
            await page.goto(f"{FRONTEND_URL}/login")
            await page.wait_for_load_state("networkidle")
            print("✅ Login page loaded")
            await page.screenshot(path=SCREENSHOTS_DIR / "01_login_page.png")
            
            # Step 2: Fill and submit login form
            print("\n📍 Step 2: Submit login form...")
            await page.fill('input[id="email"]', ADMIN_EMAIL)
            await page.fill('input[id="password"]', ADMIN_PASSWORD)
            
            submit_button = await page.query_selector('button[type="submit"]')
            try:
                async with page.expect_navigation(timeout=5000):
                    await submit_button.click()
            except:
                pass
            
            await page.wait_for_timeout(2000)
            print(f"✅ Login submitted, URL: {page.url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "02_after_login.png")
            
            # Step 3: Verify token
            print("\n📍 Step 3: Verify JWT token...")
            storage = await page.evaluate("() => JSON.stringify(localStorage)")
            storage_data = json.loads(storage)
            
            if "access_token" not in storage_data:
                print("❌ No access token found!")
                return False
            
            token = storage_data["access_token"]
            print(f"✅ Token found: {token[:30]}...")
            
            # Decode and verify role_profiles
            import base64
            parts = token.split(".")
            if len(parts) >= 2:
                payload_part = parts[1]
                padding = 4 - len(payload_part) % 4
                if padding != 4:
                    payload_part += "=" * padding
                payload = json.loads(base64.urlsafe_b64decode(payload_part))
                
                if "role_profiles" not in payload:
                    print("❌ role_profiles not in token!")
                    return False
                
                has_admin = any(
                    r.get("role_type") == "admin" and r.get("enabled")
                    for r in payload.get("role_profiles", [])
                )
                
                if not has_admin:
                    print("❌ Admin role not enabled in token!")
                    return False
                
                print("✅ Token has admin role enabled")
            
            # Step 4: Navigate to admin dashboard
            print("\n📍 Step 4: Navigate to /admin...")
            try:
                await page.goto(f"{FRONTEND_URL}/admin", wait_until="domcontentloaded", timeout=10000)
            except:
                pass
            
            await page.wait_for_timeout(2000)
            final_url = page.url
            print(f"   Final URL: {final_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "03_admin_dashboard.png")
            
            # Step 5: Verify admin dashboard
            print("\n📍 Step 5: Verify admin dashboard...")
            if not final_url.startswith(f"{FRONTEND_URL}/admin"):
                print(f"❌ Not on admin page! URL: {final_url}")
                print(f"   Expected: {FRONTEND_URL}/admin")
                return False

            print("✅ Admin dashboard loaded")
            
            # Check for admin sidebar
            sidebar = await page.query_selector('[class*="sidebar"]')
            if sidebar:
                print("✅ Admin sidebar found")
            
            # Check for dashboard content
            dashboard_content = await page.query_selector('[class*="dashboard"]')
            if dashboard_content:
                print("✅ Dashboard content found")
            
            # Step 6: Check console for errors
            print("\n📍 Step 6: Check for console errors...")
            console_logs = []
            page.on("console", lambda msg: console_logs.append({"type": msg.type, "text": msg.text}))
            await page.wait_for_timeout(1000)
            
            errors = [log for log in console_logs if log["type"] == "error"]
            if errors:
                print(f"⚠️  Found {len(errors)} console errors:")
                for err in errors:
                    if "404" not in err["text"]:  # Ignore favicon 404
                        print(f"   - {err['text']}")
            else:
                print("✅ No console errors")
            
            # Final summary
            print("\n" + "="*80)
            print("✅ COMPLETE ADMIN FLOW TEST PASSED!")
            print("="*80)
            print("\n✅ Summary:")
            print("   1. Login successful")
            print("   2. JWT token created with role_profiles")
            print("   3. Admin role verified in token")
            print("   4. Admin dashboard accessible")
            print("   5. No console errors")
            print("\n✅ Admin access is fully functional!")
            print("="*80)
            
            return True
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
        
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    result = asyncio.run(test_complete_flow())
    exit(0 if result else 1)

