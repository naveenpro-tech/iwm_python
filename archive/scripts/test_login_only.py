#!/usr/bin/env python3
"""Test login only"""

import asyncio
import os
from playwright.async_api import async_playwright

BASE_URL = os.getenv("BASE_URL", "http://localhost:3002")
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        # Collect network requests and console messages
        requests = []
        console_messages = []
        page.on("request", lambda req: requests.append({
            "url": req.url,
            "method": req.method,
            "headers": dict(req.headers)
        }))
        page.on("console", lambda msg: console_messages.append({
            "type": msg.type,
            "text": msg.text
        }))
        
        try:
            print("1. Navigating to login page...")
            await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
            await page.wait_for_timeout(3000)  # Wait for React to hydrate
            print(f"   Current URL: {page.url}")

            print("\n2. Filling login form...")
            # Wait for inputs to be available
            await page.wait_for_selector('input[type="email"]', timeout=10000)
            email_input = await page.query_selector('input[type="email"]')
            password_input = await page.query_selector('input[type="password"]')
            
            if not email_input or not password_input:
                print("   ❌ Email or password input not found")
                return
            
            await email_input.fill(TEST_EMAIL)
            await password_input.fill(TEST_PASSWORD)
            print(f"   ✅ Filled email: {TEST_EMAIL}")
            print(f"   ✅ Filled password: ****")
            
            print("\n3. Finding login button...")
            buttons = await page.query_selector_all('button')
            print(f"   Found {len(buttons)} buttons")
            
            login_btn = None
            for i, btn in enumerate(buttons):
                text = await btn.text_content()
                print(f"   Button {i}: {text}")
                if text and text.strip() == "Login":
                    login_btn = btn
                    print(f"   ✅ Found login button at index {i}")
                    break
            
            if not login_btn:
                print("   ❌ Login button not found")
                return

            # Check environment variables
            print("\n4. Checking environment variables...")
            try:
                env_vars = await page.evaluate("""() => ({
                    NEXT_PUBLIC_API_BASE_URL: window.__ENV__?.NEXT_PUBLIC_API_BASE_URL || 'not set',
                    NEXT_PUBLIC_ENABLE_BACKEND: window.__ENV__?.NEXT_PUBLIC_ENABLE_BACKEND || 'not set',
                })""")
                print(f"   NEXT_PUBLIC_API_BASE_URL: {env_vars.get('NEXT_PUBLIC_API_BASE_URL')}")
                print(f"   NEXT_PUBLIC_ENABLE_BACKEND: {env_vars.get('NEXT_PUBLIC_ENABLE_BACKEND')}")
            except Exception as e:
                print(f"   ⚠️ Could not check env vars: {e}")

            print("\n5. Submitting form...")
            # Try to find the form and submit it
            form = await page.query_selector('form')
            if form:
                print("   ✅ Found form, submitting...")
                await form.evaluate("form => form.submit()")
            else:
                print("   ⚠️ Form not found, clicking button instead...")
                await login_btn.click()

            print("   Waiting for navigation...")
            try:
                await page.wait_for_load_state("networkidle", timeout=10000)
                print("   ✅ Page loaded")
            except:
                print("   ⚠️ Timeout waiting for networkidle")

            await page.wait_for_timeout(2000)

            print(f"\n6. After login:")
            print(f"   Current URL: {page.url}")
            
            # Check cookies
            cookies = await page.context.cookies()
            print(f"   Total cookies: {len(cookies)}")
            for cookie in cookies:
                print(f"   - {cookie['name']}: {cookie['value'][:30]}...")
            
            access_token = next((c for c in cookies if c["name"] == "access_token"), None)
            if access_token:
                print(f"   ✅ access_token cookie found")
            else:
                print(f"   ❌ access_token cookie NOT found")
            
            # Check localStorage
            print(f"\n7. Checking localStorage...")
            local_storage = await page.evaluate("() => JSON.stringify(localStorage)")
            print(f"   localStorage: {local_storage[:200]}...")

            # Check console messages
            print(f"\n8. Console messages:")
            for msg in console_messages[-10:]:
                print(f"   [{msg['type']}] {msg['text'][:100]}")

            # Check network requests
            print(f"\n9. Network requests made:")
            login_requests = [r for r in requests if "login" in r["url"].lower() or "auth" in r["url"].lower()]
            for req in login_requests[-5:]:
                print(f"   {req['method']} {req['url']}")

            # Try to navigate to collections
            print(f"\n10. Trying to navigate to /collections...")
            await page.goto(f"{BASE_URL}/collections", wait_until="networkidle")
            print(f"   Current URL: {page.url}")

            if "/login" in page.url:
                print(f"   ❌ Redirected back to login")
            else:
                print(f"   ✅ Successfully navigated to collections")
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

