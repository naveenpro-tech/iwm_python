#!/usr/bin/env python3
"""
Final admin access test
"""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots/admin_final")

SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


async def test_admin_access():
    """Test admin access"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            print("\n" + "="*80)
            print("🔍 ADMIN ACCESS TEST")
            print("="*80)
            
            # Step 1: Login
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
            print(f"✅ Logged in, URL: {page.url}")
            
            # Step 2: Check token
            print("\n📍 Step 2: Check token...")
            storage = await page.evaluate("() => JSON.stringify(localStorage)")
            storage_data = json.loads(storage)
            
            if "access_token" in storage_data:
                token = storage_data["access_token"]
                print(f"✅ Token found: {token[:50]}...")
                
                # Decode token to see role_profiles
                import base64
                parts = token.split(".")
                if len(parts) >= 2:
                    payload_part = parts[1]
                    padding = 4 - len(payload_part) % 4
                    if padding != 4:
                        payload_part += "=" * padding
                    try:
                        payload = json.loads(base64.urlsafe_b64decode(payload_part))
                        print(f"   Token payload: {json.dumps(payload, indent=2)}")
                    except Exception as e:
                        print(f"   Could not decode payload: {e}")
            else:
                print("❌ No token found")
                return
            
            # Step 3: Navigate to /admin
            print("\n📍 Step 3: Navigate to /admin...")
            try:
                await page.goto(f"{FRONTEND_URL}/admin", wait_until="domcontentloaded", timeout=10000)
            except:
                pass

            await page.wait_for_timeout(3000)

            final_url = page.url
            print(f"   Final URL: {final_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "admin_result.png")
            
            # Step 4: Check result
            print("\n" + "="*80)
            if "/admin" in final_url:
                print("✅ ADMIN DASHBOARD ACCESSIBLE!")
                print("   Admin access is working correctly!")
            else:
                print("❌ ADMIN ACCESS DENIED")
                print(f"   Redirected to: {final_url}")
                
                # Check for error parameter
                if "error=" in final_url:
                    error = final_url.split("error=")[1].split("&")[0]
                    print(f"   Error: {error}")
            print("="*80)
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(test_admin_access())

