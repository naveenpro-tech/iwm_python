#!/usr/bin/env python3
"""Debug script to inspect collections page"""

import asyncio
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.getenv("BASE_URL", "http://localhost:3002")
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        try:
            # Login first
            print("1. Logging in...")
            await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
            await page.fill('input[type="email"]', TEST_EMAIL)
            await page.fill('input[type="password"]', TEST_PASSWORD)
            await page.click('button:has-text("Login")')
            await page.wait_for_load_state("networkidle")
            print("✅ Logged in")
            
            # Navigate to collections
            print("\n2. Navigating to /collections...")
            await page.goto(f"{BASE_URL}/collections", wait_until="networkidle")
            await page.wait_for_timeout(5000)
            print("✅ Collections page loaded")
            
            # Get all buttons
            print("\n3. Inspecting buttons...")
            buttons = await page.query_selector_all('button')
            print(f"Found {len(buttons)} buttons:")
            for i, btn in enumerate(buttons):
                text = await btn.text_content()
                html = await btn.evaluate("el => el.outerHTML")
                print(f"\n  Button {i}:")
                print(f"    Text: {text}")
                print(f"    HTML: {html[:200]}...")
            
            # Get page structure
            print("\n4. Page structure...")
            content = await page.content()
            print(f"Page HTML length: {len(content)} chars")
            
            # Look for "Create" text anywhere
            print("\n5. Searching for 'Create' text...")
            create_elements = await page.query_selector_all('text="Create"')
            print(f"Found {len(create_elements)} elements with 'Create' text")
            
            # Look for Plus icon
            print("\n6. Searching for Plus icon...")
            plus_elements = await page.query_selector_all('svg[class*="Plus"]')
            print(f"Found {len(plus_elements)} Plus icons")
            
            # Get all text content
            print("\n7. All text content on page:")
            body = await page.query_selector('body')
            if body:
                text_content = await body.text_content()
                print(text_content[:1000])

            # Check current URL
            print(f"\n8. Current URL: {page.url}")
            
            # Take screenshot
            print("\n9. Taking screenshot...")
            Path("test-artifacts/gui-testing").mkdir(parents=True, exist_ok=True)
            await page.screenshot(path="test-artifacts/gui-testing/debug_collections.png")
            print("✅ Screenshot saved")
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

