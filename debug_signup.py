#!/usr/bin/env python3
"""
Debug signup flow
"""

import asyncio
from playwright.async_api import async_playwright
import random
import string

BASE_URL = "http://localhost:3000"

# Generate unique test user
random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
TEST_USER_EMAIL = f"newuser.{random_suffix}@example.com"
TEST_USER_PASSWORD = "NewUser!23456789"
TEST_USER_NAME = f"New User {random_suffix}"

async def debug_signup():
    """Debug the signup flow"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Enable console logging
        page.on("console", lambda msg: print(f"[CONSOLE] {msg.text}"))
        
        try:
            print("1. Navigating to signup page...")
            await page.goto(f"{BASE_URL}/signup")
            await page.wait_for_load_state("networkidle")
            print(f"   Current URL: {page.url}")
            
            print("\n2. Checking for form inputs...")
            text_inputs = page.locator('input[type="text"]')
            email_inputs = page.locator('input[type="email"]')
            password_inputs = page.locator('input[type="password"]')
            
            print(f"   Text inputs: {await text_inputs.count()}")
            print(f"   Email inputs: {await email_inputs.count()}")
            print(f"   Password inputs: {await password_inputs.count()}")
            
            print("\n3. Filling in form...")
            if await text_inputs.count() > 0:
                await text_inputs.first.fill(TEST_USER_NAME)
                print(f"   Name: {TEST_USER_NAME}")
            
            if await email_inputs.count() > 0:
                await email_inputs.first.fill(TEST_USER_EMAIL)
                print(f"   Email: {TEST_USER_EMAIL}")
            
            if await password_inputs.count() > 0:
                await password_inputs.first.fill(TEST_USER_PASSWORD)
                print(f"   Password: ****")
            
            print("\n4. Checking for submit button...")
            submit_btn = page.locator('button[type="submit"]')
            print(f"   Found {await submit_btn.count()} submit buttons")
            
            if await submit_btn.count() > 0:
                print("\n5. Clicking submit...")
                await submit_btn.first.click()
                
                print("\n6. Waiting for response...")
                await page.wait_for_timeout(5000)
                
                print(f"   Current URL: {page.url}")
                
                print("\n7. Checking for errors...")
                error_messages = page.locator('[role="alert"]')
                if await error_messages.count() > 0:
                    for i in range(await error_messages.count()):
                        text = await error_messages.nth(i).text_content()
                        print(f"   Error {i+1}: {text}")
                
                print("\n8. Checking page content...")
                page_text = await page.text_content("body")
                if "already exists" in page_text.lower():
                    print("   Found: User already exists message")
                if "error" in page_text.lower():
                    print("   Found: Error message")
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_signup())

