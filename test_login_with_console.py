#!/usr/bin/env python3
"""
Login test with console error capture
"""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots/login_console")

SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


async def test_login_with_console():
    """Test login and capture all console messages"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        console_messages = []
        
        def on_console(msg):
            console_messages.append({
                "type": msg.type,
                "text": msg.text,
                "location": msg.location
            })
            if msg.type in ["error", "warning"]:
                print(f"   [{msg.type.upper()}] {msg.text}")
        
        page.on("console", on_console)
        
        try:
            print("\n" + "="*80)
            print("🔍 LOGIN TEST WITH CONSOLE CAPTURE")
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
            
            # Click login
            print("\n📍 Click login button...")
            await page.click('button:has-text("Login")')
            
            # Wait for response
            print("\n📍 Waiting for login response...")
            await page.wait_for_timeout(3000)
            
            # Check result
            final_url = page.url
            print(f"\n   Final URL: {final_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "login_result.png")
            
            # Print all console messages
            print("\n" + "="*80)
            print("CONSOLE MESSAGES")
            print("="*80)
            
            errors = [m for m in console_messages if m["type"] == "error"]
            warnings = [m for m in console_messages if m["type"] == "warning"]
            logs = [m for m in console_messages if m["type"] == "log"]
            
            print(f"\n📊 Total: {len(console_messages)} messages")
            print(f"   Errors: {len(errors)}")
            print(f"   Warnings: {len(warnings)}")
            print(f"   Logs: {len(logs)}")
            
            if errors:
                print("\n🔴 ERRORS:")
                for err in errors:
                    print(f"   {err['text']}")
            
            if warnings:
                print("\n🟡 WARNINGS:")
                for warn in warnings:
                    print(f"   {warn['text']}")
            
            if logs:
                print("\n🔵 LOGS:")
                for log in logs:
                    if "Login" in log['text'] or "error" in log['text'].lower():
                        print(f"   {log['text']}")
            
            # Check localStorage
            print("\n" + "="*80)
            print("STORAGE CHECK")
            print("="*80)
            
            storage = await page.evaluate("() => JSON.stringify(localStorage)")
            import json
            storage_data = json.loads(storage)
            
            if "access_token" in storage_data:
                print("✅ Access token in localStorage")
            else:
                print("❌ No access token in localStorage")
                print(f"   Keys: {list(storage_data.keys())}")
            
            # Summary
            print("\n" + "="*80)
            if "/profile/" in final_url or "/dashboard" in final_url:
                print("✅ LOGIN SUCCESSFUL")
            else:
                print("❌ LOGIN FAILED")
                print(f"   URL: {final_url}")
            print("="*80)
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(test_login_with_console())

