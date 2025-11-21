#!/usr/bin/env python3
"""
Detailed Admin Login Test with Network Monitoring
"""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots/login_detailed")

SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


async def test_admin_login_detailed():
    """Test admin login with detailed network monitoring"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Capture all network requests
        network_requests = []
        
        def on_response(response):
            network_requests.append({
                "url": response.url,
                "status": response.status,
                "method": response.request.method,
                "timestamp": len(network_requests)
            })
            if "/auth" in response.url or "/admin" in response.url:
                print(f"   📡 {response.request.method} {response.url} → {response.status}")
        
        page.on("response", on_response)
        
        try:
            print("\n" + "="*80)
            print("🔍 DETAILED ADMIN LOGIN TEST")
            print("="*80)
            
            # Step 1: Navigate to login
            print("\n📍 Step 1: Navigate to login page...")
            await page.goto(f"{FRONTEND_URL}/login")
            await page.wait_for_load_state("networkidle")
            print("✅ Login page loaded")
            await page.screenshot(path=SCREENSHOTS_DIR / "01_login_page.png")
            
            # Step 2: Fill credentials
            print("\n📍 Step 2: Fill in credentials...")
            email_input = await page.query_selector('input[id="email"]')
            password_input = await page.query_selector('input[id="password"]')
            
            if not email_input or not password_input:
                print("❌ Could not find email or password input!")
                print(f"   Email input: {email_input}")
                print(f"   Password input: {password_input}")
                return
            
            await email_input.fill(ADMIN_EMAIL)
            await password_input.fill(ADMIN_PASSWORD)
            print(f"✅ Filled credentials: {ADMIN_EMAIL}")
            await page.screenshot(path=SCREENSHOTS_DIR / "02_credentials_filled.png")
            
            # Step 3: Find and click login button
            print("\n📍 Step 3: Find and click login button...")
            login_button = await page.query_selector('button:has-text("Login")')
            if not login_button:
                print("❌ Could not find Login button!")
                # Try to find any button
                buttons = await page.query_selector_all("button")
                print(f"   Found {len(buttons)} buttons:")
                for i, btn in enumerate(buttons):
                    text = await btn.text_content()
                    print(f"     {i}: {text}")
                return
            
            print("✅ Found Login button")
            
            # Step 4: Monitor network requests during login
            print("\n📍 Step 4: Clicking login button and monitoring network...")
            print("   Watching for network requests...")
            
            # Clear previous requests
            network_requests.clear()
            
            # Click login button and wait for navigation
            try:
                async with page.expect_navigation(timeout=10000):
                    await login_button.click()
                print("✅ Navigation detected after login click")
            except Exception as e:
                print(f"⚠️  No navigation detected: {e}")
            
            await page.wait_for_load_state("networkidle")
            
            # Step 5: Check result
            print("\n📍 Step 5: Check login result...")
            final_url = page.url
            print(f"   Final URL: {final_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "03_after_login.png")
            
            # Step 6: Check localStorage
            print("\n📍 Step 6: Check localStorage...")
            storage = await page.evaluate("() => JSON.stringify(localStorage)")
            storage_data = json.loads(storage)
            
            if "access_token" in storage_data:
                print(f"✅ Access token found in localStorage")
                print(f"   Token: {storage_data['access_token'][:50]}...")
            else:
                print(f"❌ Access token NOT in localStorage")
                print(f"   localStorage keys: {list(storage_data.keys())}")
            
            # Step 7: Check cookies
            print("\n📍 Step 7: Check cookies...")
            cookies = await context.cookies()
            auth_cookies = [c for c in cookies if "token" in c["name"].lower()]
            if auth_cookies:
                print(f"✅ Found {len(auth_cookies)} auth cookies:")
                for cookie in auth_cookies:
                    print(f"   - {cookie['name']}: {cookie['value'][:50]}...")
            else:
                print(f"❌ No auth cookies found")
                print(f"   All cookies: {[c['name'] for c in cookies]}")
            
            # Step 8: Check console for errors
            print("\n📍 Step 8: Check console for errors...")
            console_logs = []
            
            def on_console(msg):
                console_logs.append({"type": msg.type, "text": msg.text})
            
            page.on("console", on_console)
            await page.wait_for_timeout(1000)
            
            errors = [log for log in console_logs if log["type"] == "error"]
            if errors:
                print(f"❌ Found {len(errors)} console errors:")
                for err in errors:
                    print(f"   - {err['text']}")
            else:
                print(f"✅ No console errors")
            
            # Step 9: Summary
            print("\n" + "="*80)
            print("SUMMARY")
            print("="*80)
            
            if "/profile/" in final_url or "/dashboard" in final_url:
                print("✅ LOGIN SUCCESSFUL!")
                print(f"   Redirected to: {final_url}")
                
                if "access_token" in storage_data:
                    print("✅ Token stored in localStorage")
                    
                    # Try to navigate to admin
                    print("\n📍 Attempting to navigate to /admin...")
                    await page.goto(f"{FRONTEND_URL}/admin")
                    await page.wait_for_load_state("networkidle")
                    admin_url = page.url
                    print(f"   Final URL: {admin_url}")
                    await page.screenshot(path=SCREENSHOTS_DIR / "04_admin_result.png")
                    
                    if "/admin" in admin_url:
                        print("✅ ADMIN DASHBOARD ACCESSIBLE!")
                    else:
                        print(f"❌ Redirected from /admin to: {admin_url}")
                else:
                    print("❌ Token NOT in localStorage despite successful redirect")
            else:
                print(f"❌ LOGIN FAILED!")
                print(f"   Final URL: {final_url}")
                print(f"   Expected: /profile/* or /dashboard")
            
            print("\n📸 Screenshots saved to: screenshots/login_detailed/")
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
            await page.screenshot(path=SCREENSHOTS_DIR / "error.png")
        
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(test_admin_login_detailed())

