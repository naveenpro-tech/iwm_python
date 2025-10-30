#!/usr/bin/env python3
"""
Login test with correct button selector
"""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots/login_correct")

SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


async def test_login_correct():
    """Test login with correct button selector"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        console_messages = []
        
        def on_console(msg):
            console_messages.append({"type": msg.type, "text": msg.text})
            if msg.type in ["error", "log"]:
                print(f"   [{msg.type.upper()}] {msg.text}")
        
        page.on("console", on_console)
        
        try:
            print("\n" + "="*80)
            print("🔍 LOGIN TEST WITH CORRECT BUTTON")
            print("="*80)
            
            # Navigate to login
            print("\n📍 Navigate to login page...")
            await page.goto(f"{FRONTEND_URL}/login")
            await page.wait_for_load_state("networkidle")
            print("✅ Login page loaded")
            
            # Fill credentials
            print("\n📍 Fill credentials...")
            await page.fill('input[id="email"]', ADMIN_EMAIL)
            await page.fill('input[id="password"]', ADMIN_PASSWORD)
            print(f"✅ Filled: {ADMIN_EMAIL}")
            await page.screenshot(path=SCREENSHOTS_DIR / "01_filled.png")
            
            # Click submit button (type=submit)
            print("\n📍 Click submit button...")
            submit_button = await page.query_selector('button[type="submit"]')
            if submit_button:
                print("✅ Found submit button")
                
                # Monitor network requests
                network_requests = []
                def on_response(response):
                    if "/auth" in response.url:
                        network_requests.append({
                            "url": response.url,
                            "status": response.status
                        })
                        print(f"   📡 {response.request.method} {response.url} → {response.status}")
                
                page.on("response", on_response)
                
                # Click and wait for navigation
                print("   Clicking button...")
                try:
                    async with page.expect_navigation(timeout=5000):
                        await submit_button.click()
                    print("✅ Navigation detected")
                except:
                    print("⚠️  No navigation detected")
                
                await page.wait_for_timeout(2000)
            else:
                print("❌ Could not find submit button")
                return
            
            # Check result
            final_url = page.url
            print(f"\n   Final URL: {final_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "02_result.png")
            
            # Check localStorage
            print("\n📍 Check localStorage...")
            storage = await page.evaluate("() => JSON.stringify(localStorage)")
            storage_data = json.loads(storage)
            
            if "access_token" in storage_data:
                print("✅ Access token in localStorage!")
                print(f"   Token: {storage_data['access_token'][:50]}...")
            else:
                print("❌ No access token in localStorage")
                print(f"   Keys: {list(storage_data.keys())}")
            
            # Print console messages
            print("\n📍 Console messages:")
            for msg in console_messages:
                if msg["type"] in ["error", "log"]:
                    print(f"   [{msg['type']}] {msg['text']}")
            
            # Summary
            print("\n" + "="*80)
            if "/profile/" in final_url or "/dashboard" in final_url:
                print("✅ LOGIN SUCCESSFUL!")
                print(f"   Redirected to: {final_url}")
                
                if "access_token" in storage_data:
                    print("\n📍 Attempting to navigate to /admin...")
                    await page.goto(f"{FRONTEND_URL}/admin")
                    await page.wait_for_load_state("networkidle")
                    admin_url = page.url
                    print(f"   Final URL: {admin_url}")
                    await page.screenshot(path=SCREENSHOTS_DIR / "03_admin.png")
                    
                    if "/admin" in admin_url:
                        print("✅ ADMIN DASHBOARD ACCESSIBLE!")
                    else:
                        print(f"❌ Redirected from /admin to: {admin_url}")
            else:
                print("❌ LOGIN FAILED")
                print(f"   Final URL: {final_url}")
            print("="*80)
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(test_login_correct())

