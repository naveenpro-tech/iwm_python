"""Diagnose favorites feature with detailed console/network logging"""
import asyncio
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
TEST_EMAIL = "user1@iwm.com"
TEST_PASSWORD = "rmrnn0077"

async def main():
    print("=" * 70)
    print("🔍 FAVORITES FEATURE DIAGNOSTIC TEST")
    print("=" * 70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=1000)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Collect console messages
        console_messages = []
        page.on("console", lambda msg: console_messages.append(f"[{msg.type}] {msg.text}"))
        
        # Collect network requests
        network_requests = []
        page.on("request", lambda req: network_requests.append({
            "method": req.method,
            "url": req.url,
            "headers": dict(req.headers) if "/api/" in req.url else None
        }))
        
        # Collect network responses
        network_responses = []
        async def handle_response(response):
            if "/api/" in response.url:
                try:
                    body = await response.text()
                    network_responses.append({
                        "status": response.status,
                        "url": response.url,
                        "body": body[:500] if body else None  # First 500 chars
                    })
                except:
                    network_responses.append({
                        "status": response.status,
                        "url": response.url,
                        "body": "[Could not read body]"
                    })
        
        page.on("response", handle_response)
        
        try:
            # Login
            print("\n1️⃣  LOGGING IN...")
            await page.goto(f"{BASE_URL}/login")
            await page.wait_for_load_state("networkidle")
            await page.fill('input[type="email"]', TEST_EMAIL)
            await page.fill('input[type="password"]', TEST_PASSWORD)
            await page.click('button[type="submit"]')
            await asyncio.sleep(3)
            print(f"   ✅ Logged in - Current URL: {page.url}")
            
            # Navigate to a movie
            print("\n2️⃣  NAVIGATING TO MOVIE...")
            await page.goto(f"{BASE_URL}/movies")
            await page.wait_for_load_state("networkidle")
            await asyncio.sleep(2)
            
            # Click first movie
            first_movie = page.locator('a[href^="/movies/"]').first
            movie_title = await first_movie.text_content()
            print(f"   📽️  Clicking on: {movie_title}")
            await first_movie.click()
            await page.wait_for_load_state("networkidle")
            await asyncio.sleep(2)
            print(f"   ✅ Movie page loaded: {page.url}")
            
            # Look for favorites button
            print("\n3️⃣  CHECKING FAVORITES BUTTON...")
            favorites_button = page.locator('button:has-text("Favorites")').first
            button_exists = await favorites_button.count() > 0
            
            if button_exists:
                button_text = await favorites_button.text_content()
                print(f"   ✅ Button found: '{button_text}'")
                
                # Click the button
                print("\n4️⃣  CLICKING FAVORITES BUTTON...")
                await favorites_button.click()
                await asyncio.sleep(3)
                
                # Check button text after click
                new_button_text = await favorites_button.text_content()
                print(f"   Button text after click: '{new_button_text}'")
                
                # Check for toast notifications
                toast = page.locator('[role="status"], .toast, [data-sonner-toast]')
                toast_count = await toast.count()
                if toast_count > 0:
                    toast_text = await toast.first.text_content()
                    print(f"   📢 Toast notification: {toast_text}")
                else:
                    print("   ⚠️  No toast notification found")
            else:
                print("   ❌ Favorites button NOT FOUND")
            
            # Navigate to profile favorites
            print("\n5️⃣  NAVIGATING TO PROFILE FAVORITES...")
            await page.goto(f"{BASE_URL}/profile/user1")
            await page.wait_for_load_state("networkidle")
            await asyncio.sleep(2)
            
            # Click Favorites tab
            print("   Clicking Favorites tab...")
            favorites_tab = page.get_by_text("Favorites", exact=False).first
            await favorites_tab.click()
            await asyncio.sleep(3)
            
            # Check for favorites content
            print("\n6️⃣  CHECKING FAVORITES CONTENT...")
            favorites_items = page.locator('[data-testid="favorite-item"], .favorite-card, img[alt*=""]')
            item_count = await favorites_items.count()
            print(f"   Found {item_count} favorite items")
            
            # Take screenshot
            await page.screenshot(path="test-artifacts/gui-testing/favorites_diagnostic.png", full_page=True)
            print("\n📸 Screenshot saved: favorites_diagnostic.png")
            
            # Print console messages
            print("\n" + "=" * 70)
            print("📋 CONSOLE MESSAGES:")
            print("=" * 70)
            for msg in console_messages[-20:]:  # Last 20 messages
                print(msg)
            
            # Print API requests
            print("\n" + "=" * 70)
            print("🌐 API REQUESTS:")
            print("=" * 70)
            for req in network_requests:
                if "/api/" in req["url"]:
                    print(f"{req['method']} {req['url']}")
                    if req["headers"] and "authorization" in str(req["headers"]).lower():
                        print(f"   ✅ Has Authorization header")
            
            # Print API responses
            print("\n" + "=" * 70)
            print("📥 API RESPONSES:")
            print("=" * 70)
            for resp in network_responses[-10:]:  # Last 10 responses
                print(f"[{resp['status']}] {resp['url']}")
                if resp["body"]:
                    print(f"   Body: {resp['body'][:200]}...")
            
            print("\n⏳ Keeping browser open for 30 seconds for manual inspection...")
            await asyncio.sleep(30)
            
        except Exception as e:
            print(f"\n❌ ERROR: {e}")
            await page.screenshot(path="test-artifacts/gui-testing/favorites_diagnostic_error.png")
        
        finally:
            await browser.close()
            print("\n✅ Diagnostic complete")

if __name__ == "__main__":
    asyncio.run(main())

