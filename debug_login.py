#!/usr/bin/env python3
"""
Debug login flow to understand what's happening
"""

import asyncio
from playwright.async_api import async_playwright
import json

BASE_URL = "http://localhost:3000"
TEST_USER_EMAIL = "critic.tester@example.com"
TEST_USER_PASSWORD = "Test!23456789"

async def debug_login():
    """Debug the login flow"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Enable console logging
        page.on("console", lambda msg: print(f"[CONSOLE] {msg.text}"))
        
        try:
            print("1. Navigating to login page...")
            await page.goto(f"{BASE_URL}/login")
            await page.wait_for_load_state("networkidle")
            print(f"   Current URL: {page.url}")
            
            print("\n2. Checking for email input...")
            email_inputs = page.locator('input[type="email"]')
            print(f"   Found {await email_inputs.count()} email inputs")
            
            print("\n3. Checking for password input...")
            password_inputs = page.locator('input[type="password"]')
            print(f"   Found {await password_inputs.count()} password inputs")
            
            print("\n4. Checking for submit button...")
            submit_buttons = page.locator('button[type="submit"]')
            print(f"   Found {await submit_buttons.count()} submit buttons")
            
            if await email_inputs.count() > 0 and await password_inputs.count() > 0:
                print("\n5. Filling in credentials...")
                await email_inputs.first.fill(TEST_USER_EMAIL)
                await password_inputs.first.fill(TEST_USER_PASSWORD)
                print(f"   Email: {TEST_USER_EMAIL}")
                print(f"   Password: ****")
                
                print("\n6. Clicking submit button...")
                if await submit_buttons.count() > 0:
                    await submit_buttons.first.click()
                    print("   Submit button clicked")
                    
                    print("\n7. Waiting for navigation...")
                    await page.wait_for_load_state("networkidle")
                    await page.wait_for_timeout(2000)
                    
                    print(f"   Current URL after submission: {page.url}")
                    
                    print("\n8. Checking for errors...")
                    error_messages = page.locator('[role="alert"]')
                    if await error_messages.count() > 0:
                        for i in range(await error_messages.count()):
                            text = await error_messages.nth(i).text_content()
                            print(f"   Error {i+1}: {text}")
                    
                    print("\n9. Checking page content...")
                    page_text = await page.text_content("body")
                    if "Invalid credentials" in page_text:
                        print("   Found: Invalid credentials message")
                    if "User not found" in page_text:
                        print("   Found: User not found message")
                    if "Welcome" in page_text or "Dashboard" in page_text:
                        print("   Found: Welcome/Dashboard message (login successful)")

                    print("\n10. Checking for redirect...")
                    # Wait a bit more for redirect
                    await page.wait_for_timeout(3000)
                    print(f"   Final URL: {page.url}")

                    print("\n11. Checking localStorage...")
                    token = await page.evaluate("() => localStorage.getItem('token')")
                    print(f"   Token in localStorage: {token[:20] if token else 'None'}...")

                    print("\n12. Checking cookies...")
                    cookies = await page.context.cookies()
                    print(f"   Cookies: {len(cookies)} found")
                    for cookie in cookies:
                        print(f"     - {cookie['name']}: {cookie['value'][:20]}...")
                else:
                    print("   ERROR: Submit button not found!")
            else:
                print("   ERROR: Email or password input not found!")
                print("   Page HTML snippet:")
                html = await page.content()
                print(html[:1000])
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_login())

