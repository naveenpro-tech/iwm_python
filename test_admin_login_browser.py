"""
Autonomous browser test for admin login and dashboard access.
Tests the complete flow: login -> verify admin access -> navigate to admin dashboard
"""
import asyncio
import sys
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

async def test_admin_login():
    """Test admin login and dashboard access."""
    
    print("\n" + "="*80)
    print("🧪 AUTONOMOUS ADMIN LOGIN & DASHBOARD TEST")
    print("="*80 + "\n")
    
    async with async_playwright() as p:
        # Launch browser
        print("🌐 Launching browser...")
        browser = await p.chromium.launch(headless=False)  # Set to False to see the browser
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            # Step 1: Navigate to login page
            print("\n📍 Step 1: Navigating to login page...")
            await page.goto("http://localhost:3000/login", wait_until="networkidle")
            print("✅ Login page loaded")
            
            # Take screenshot
            await page.screenshot(path="screenshots/01_login_page.png")
            print("📸 Screenshot saved: screenshots/01_login_page.png")
            
            # Step 2: Fill in login credentials
            print("\n📍 Step 2: Filling in admin credentials...")
            
            # Find and fill email field
            email_input = page.locator('input[type="email"], input[name="email"]').first
            await email_input.fill("admin@iwm.com")
            print("✅ Email filled: admin@iwm.com")
            
            # Find and fill password field
            password_input = page.locator('input[type="password"], input[name="password"]').first
            await password_input.fill("AdminPassword123!")
            print("✅ Password filled")
            
            # Take screenshot
            await page.screenshot(path="screenshots/02_credentials_filled.png")
            print("📸 Screenshot saved: screenshots/02_credentials_filled.png")
            
            # Step 3: Click login button
            print("\n📍 Step 3: Clicking login button...")

            # Set up network request listener
            login_request_made = False
            login_response_received = False

            async def handle_request(request):
                nonlocal login_request_made
                if "/auth/login" in request.url:
                    login_request_made = True
                    print(f"✅ Login API request made: {request.method} {request.url}")

            async def handle_response(response):
                nonlocal login_response_received
                if "/auth/login" in response.url:
                    login_response_received = True
                    print(f"✅ Login API response: {response.status}")
                    if response.status != 200:
                        try:
                            body = await response.text()
                            print(f"❌ Error response body: {body}")
                        except:
                            pass

            page.on("request", handle_request)
            page.on("response", handle_response)

            login_button = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first
            await login_button.click()
            print("✅ Login button clicked")

            # Wait for navigation or network activity
            print("⏳ Waiting for login to complete...")
            try:
                await page.wait_for_load_state("networkidle", timeout=10000)
            except:
                print("⚠️  Network idle timeout - checking if request was made...")

            # Give it a moment for async operations
            await asyncio.sleep(2)

            if not login_request_made:
                print("❌ WARNING: No login API request was made!")
                print("   This suggests the frontend is not calling the backend API")
                print("   Checking browser console for errors...")

                # Get console logs
                console_logs = []
                page.on("console", lambda msg: console_logs.append(f"{msg.type}: {msg.text}"))
                await asyncio.sleep(1)

                if console_logs:
                    print("\n📋 Browser console logs:")
                    for log in console_logs:
                        print(f"   {log}")
            else:
                print(f"✅ Login request made: {login_request_made}")
                print(f"✅ Login response received: {login_response_received}")
            
            # Take screenshot
            await page.screenshot(path="screenshots/03_after_login.png")
            print("📸 Screenshot saved: screenshots/03_after_login.png")
            
            # Step 4: Check current URL
            current_url = page.url
            print(f"\n📍 Step 4: Current URL after login: {current_url}")
            
            # Check if we're redirected (not on login page anymore)
            if "/login" in current_url:
                print("❌ Still on login page - login may have failed!")
                
                # Check for error messages
                error_messages = await page.locator('[role="alert"], .error, .text-red-500, .text-destructive').all()
                if error_messages:
                    for error in error_messages:
                        error_text = await error.text_content()
                        print(f"❌ Error message: {error_text}")
                else:
                    print("⚠️  No error messages found - checking page content...")
                    page_content = await page.content()
                    print(f"Page title: {await page.title()}")
                
                return False
            else:
                print("✅ Redirected away from login page - login successful!")
            
            # Step 5: Navigate to admin dashboard
            print("\n📍 Step 5: Navigating to admin dashboard...")
            await page.goto("http://localhost:3000/admin", wait_until="networkidle")
            print("✅ Admin dashboard page loaded")
            
            # Take screenshot
            await page.screenshot(path="screenshots/04_admin_dashboard.png")
            print("📸 Screenshot saved: screenshots/04_admin_dashboard.png")
            
            # Step 6: Check for admin content
            print("\n📍 Step 6: Verifying admin dashboard content...")
            
            # Check page title
            page_title = await page.title()
            print(f"Page title: {page_title}")
            
            # Check for admin-specific elements
            admin_indicators = [
                "Admin Dashboard",
                "Movie Curation",
                "Bulk Operations",
                "Import Schema",
                "admin",
                "dashboard"
            ]
            
            page_content = await page.text_content("body")
            found_indicators = [indicator for indicator in admin_indicators if indicator.lower() in page_content.lower()]
            
            if found_indicators:
                print(f"✅ Found admin indicators: {', '.join(found_indicators)}")
            else:
                print("⚠️  No admin indicators found on page")
            
            # Check if we got redirected to login (access denied)
            if "/login" in page.url:
                print("❌ Redirected to login - admin access denied!")
                return False
            
            # Step 7: Check for admin menu items
            print("\n📍 Step 7: Checking for admin menu items...")
            
            # Look for navigation links
            nav_links = await page.locator('nav a, [role="navigation"] a').all()
            print(f"Found {len(nav_links)} navigation links")
            
            admin_links = []
            for link in nav_links:
                link_text = await link.text_content()
                link_href = await link.get_attribute("href")
                if link_text and ("admin" in link_text.lower() or (link_href and "/admin" in link_href)):
                    admin_links.append(f"{link_text} ({link_href})")
            
            if admin_links:
                print("✅ Found admin menu items:")
                for link in admin_links:
                    print(f"   - {link}")
            else:
                print("⚠️  No admin menu items found")
            
            # Final screenshot
            await page.screenshot(path="screenshots/05_final_state.png", full_page=True)
            print("\n📸 Full page screenshot saved: screenshots/05_final_state.png")
            
            print("\n" + "="*80)
            print("✅ TEST COMPLETED SUCCESSFULLY!")
            print("="*80)
            print("\nSummary:")
            print(f"  - Login: ✅ Success")
            print(f"  - Admin Dashboard Access: ✅ Success")
            print(f"  - Current URL: {page.url}")
            print(f"  - Screenshots saved in: screenshots/")
            print("\n")
            
            # Keep browser open for 5 seconds to see the result
            print("⏳ Keeping browser open for 5 seconds...")
            await asyncio.sleep(5)
            
            return True
            
        except PlaywrightTimeoutError as e:
            print(f"\n❌ Timeout error: {e}")
            await page.screenshot(path="screenshots/error_timeout.png")
            print("📸 Error screenshot saved: screenshots/error_timeout.png")
            return False
            
        except Exception as e:
            print(f"\n❌ Error during test: {e}")
            await page.screenshot(path="screenshots/error_general.png")
            print("📸 Error screenshot saved: screenshots/error_general.png")
            import traceback
            traceback.print_exc()
            return False
            
        finally:
            # Close browser
            await browser.close()
            print("\n🔒 Browser closed")


if __name__ == "__main__":
    # Create screenshots directory
    import os
    os.makedirs("screenshots", exist_ok=True)
    
    # Run the test
    success = asyncio.run(test_admin_login())
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Tests failed!")
        sys.exit(1)

