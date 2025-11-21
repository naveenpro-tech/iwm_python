#!/usr/bin/env python3
"""
Inspect login page structure
"""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

FRONTEND_URL = "http://localhost:3000"
SCREENSHOTS_DIR = Path("screenshots/inspect")

SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)


async def test_inspect():
    """Inspect login page"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            print("\n" + "="*80)
            print("🔍 LOGIN PAGE INSPECTION")
            print("="*80)
            
            # Navigate to login
            print("\n📍 Navigate to login page...")
            await page.goto(f"{FRONTEND_URL}/login")
            await page.wait_for_load_state("networkidle")
            print("✅ Login page loaded")
            await page.screenshot(path=SCREENSHOTS_DIR / "login_page.png")
            
            # Inspect form
            print("\n📍 Inspecting form elements...")
            form = await page.query_selector("form")
            if form:
                print("✅ Found form element")
            else:
                print("❌ No form element found")
            
            # Inspect inputs
            print("\n📍 Inspecting input elements...")
            email_input = await page.query_selector('input[id="email"]')
            password_input = await page.query_selector('input[id="password"]')
            
            if email_input:
                print("✅ Found email input")
                email_value = await email_input.input_value()
                print(f"   Value: {email_value}")
            else:
                print("❌ No email input found")
            
            if password_input:
                print("✅ Found password input")
                password_value = await password_input.input_value()
                print(f"   Value: {password_value}")
            else:
                print("❌ No password input found")
            
            # Inspect buttons
            print("\n📍 Inspecting button elements...")
            buttons = await page.query_selector_all("button")
            print(f"   Found {len(buttons)} buttons:")
            for i, btn in enumerate(buttons):
                text = await btn.text_content()
                btn_type = await btn.get_attribute("type")
                disabled = await btn.get_attribute("disabled")
                print(f"     {i}: type={btn_type}, disabled={disabled}, text='{text}'")
            
            # Try to find login button
            login_button = await page.query_selector('button:has-text("Login")')
            if login_button:
                print("\n✅ Found Login button with selector 'button:has-text(\"Login\")'")
                
                # Try clicking it
                print("\n📍 Attempting to click Login button...")
                await login_button.click()
                print("✅ Clicked Login button")
                
                # Wait and check if anything happened
                await page.wait_for_timeout(2000)
                final_url = page.url
                print(f"   URL after click: {final_url}")
                await page.screenshot(path=SCREENSHOTS_DIR / "after_click.png")
            else:
                print("\n❌ Could not find Login button with selector 'button:has-text(\"Login\")'")
                
                # Try alternative selectors
                print("\n📍 Trying alternative selectors...")
                
                # Try by text content
                for btn in buttons:
                    text = await btn.text_content()
                    if "Login" in text:
                        print(f"✅ Found button with 'Login' in text: '{text}'")
                        break
            
            # Check if form has onSubmit
            if form:
                print("\n📍 Checking form attributes...")
                form_html = await form.inner_html()
                print(f"   Form HTML (first 200 chars): {form_html[:200]}")
        
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(test_inspect())

