#!/usr/bin/env python3
"""
Comprehensive Admin Access Diagnostic Test
Tests the complete admin login flow and captures detailed diagnostics
"""

import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright, expect

# Configuration
FRONTEND_URL = "http://localhost:3000"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"
SCREENSHOTS_DIR = Path("screenshots/diagnostic")
DIAGNOSTICS_DIR = Path("diagnostics")

# Create directories
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
DIAGNOSTICS_DIR.mkdir(parents=True, exist_ok=True)


async def test_admin_access_diagnostic():
    """Test admin access with comprehensive diagnostics"""
    
    async with async_playwright() as p:
        # Launch browser in incognito mode
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Collect diagnostics
        diagnostics = {
            "phase_1_login": {},
            "phase_2_admin_access": {},
            "network_requests": [],
            "console_logs": [],
            "storage": {}
        }
        
        # Capture network requests
        async def on_response(response):
            if "/api/v1/admin" in response.url or "/auth" in response.url:
                diagnostics["network_requests"].append({
                    "url": response.url,
                    "status": response.status,
                    "method": response.request.method,
                    "headers": dict(response.request.headers),
                    "timestamp": str(asyncio.get_event_loop().time())
                })
        
        # Capture console logs
        def on_console(msg):
            diagnostics["console_logs"].append({
                "type": msg.type,
                "text": msg.text,
                "location": msg.location
            })
        
        page.on("response", on_response)
        page.on("console", on_console)
        
        try:
            print("\n" + "="*80)
            print("🔍 ADMIN ACCESS DIAGNOSTIC TEST")
            print("="*80)
            
            # ===== PHASE 1: LOGIN =====
            print("\n" + "="*80)
            print("PHASE 1: LOGIN TEST")
            print("="*80)
            
            print("\n📍 Step 1.1: Navigate to login page...")
            await page.goto(f"{FRONTEND_URL}/login")
            await page.wait_for_load_state("networkidle")
            await page.screenshot(path=SCREENSHOTS_DIR / "01_login_page.png")
            diagnostics["phase_1_login"]["login_page_loaded"] = True
            print("✅ Login page loaded")
            
            print("\n📍 Step 1.2: Fill in credentials...")
            await page.fill('input[id="email"]', ADMIN_EMAIL)
            await page.fill('input[id="password"]', ADMIN_PASSWORD)
            await page.screenshot(path=SCREENSHOTS_DIR / "02_credentials_filled.png")
            diagnostics["phase_1_login"]["credentials_filled"] = True
            print(f"✅ Credentials filled: {ADMIN_EMAIL}")
            
            print("\n📍 Step 1.3: Submit login form...")
            async with page.expect_navigation():
                await page.click('button:has-text("Login")')
            
            await page.wait_for_load_state("networkidle")
            login_url = page.url
            diagnostics["phase_1_login"]["redirect_url"] = login_url
            print(f"✅ Login submitted, redirected to: {login_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "03_after_login.png")
            
            print("\n📍 Step 1.4: Check localStorage for tokens...")
            storage = await page.evaluate("() => JSON.stringify(localStorage)")
            storage_data = json.loads(storage)
            diagnostics["storage"]["localStorage"] = {
                "has_access_token": "access_token" in storage_data,
                "has_refresh_token": "refresh_token" in storage_data,
                "keys": list(storage_data.keys())
            }
            
            if "access_token" in storage_data:
                token = storage_data["access_token"]
                print(f"✅ Access token found: {token[:50]}...")
                # Try to decode JWT
                try:
                    import base64
                    parts = token.split('.')
                    if len(parts) == 3:
                        payload = parts[1]
                        # Add padding if needed
                        padding = 4 - len(payload) % 4
                        if padding != 4:
                            payload += '=' * padding
                        decoded = base64.urlsafe_b64decode(payload)
                        jwt_data = json.loads(decoded)
                        diagnostics["storage"]["jwt_payload"] = jwt_data
                        print(f"✅ JWT decoded: {json.dumps(jwt_data, indent=2)}")
                except Exception as e:
                    print(f"⚠️  Could not decode JWT: {e}")
            else:
                print("❌ Access token NOT found in localStorage!")
            
            # ===== PHASE 2: ADMIN ACCESS =====
            print("\n" + "="*80)
            print("PHASE 2: ADMIN DASHBOARD ACCESS TEST")
            print("="*80)
            
            print("\n📍 Step 2.1: Navigate to /admin...")
            await page.goto(f"{FRONTEND_URL}/admin")
            await page.wait_for_load_state("networkidle")
            admin_url = page.url
            diagnostics["phase_2_admin_access"]["final_url"] = admin_url
            print(f"✅ Navigated to /admin, final URL: {admin_url}")
            await page.screenshot(path=SCREENSHOTS_DIR / "04_admin_access_result.png")
            
            # Check if we got redirected
            if "error=admin_access_denied" in admin_url:
                print("❌ ADMIN ACCESS DENIED - Redirected to dashboard with error!")
                diagnostics["phase_2_admin_access"]["status"] = "DENIED"
                diagnostics["phase_2_admin_access"]["error"] = "admin_access_denied"
            elif "/admin" in admin_url:
                print("✅ Successfully accessed /admin!")
                diagnostics["phase_2_admin_access"]["status"] = "SUCCESS"
            else:
                print(f"⚠️  Unexpected URL: {admin_url}")
                diagnostics["phase_2_admin_access"]["status"] = "UNEXPECTED"
            
            print("\n📍 Step 2.2: Check for admin dashboard elements...")
            sidebar = await page.query_selector("aside")
            if sidebar:
                print("✅ Admin sidebar found")
                diagnostics["phase_2_admin_access"]["sidebar_found"] = True
            else:
                print("❌ Admin sidebar NOT found")
                diagnostics["phase_2_admin_access"]["sidebar_found"] = False
            
            title = await page.query_selector("h1")
            if title:
                title_text = await title.text_content()
                print(f"✅ Dashboard title found: {title_text}")
                diagnostics["phase_2_admin_access"]["title"] = title_text
            else:
                print("❌ Dashboard title NOT found")
                diagnostics["phase_2_admin_access"]["title"] = None
            
            # ===== PHASE 3: NETWORK ANALYSIS =====
            print("\n" + "="*80)
            print("PHASE 3: NETWORK REQUEST ANALYSIS")
            print("="*80)
            
            print(f"\n📍 Captured {len(diagnostics['network_requests'])} admin API requests:")
            for i, req in enumerate(diagnostics["network_requests"], 1):
                print(f"\n  Request {i}:")
                print(f"    URL: {req['url']}")
                print(f"    Status: {req['status']}")
                print(f"    Method: {req['method']}")
                print(f"    Has Authorization: {'Authorization' in req['headers']}")
            
            # ===== PHASE 4: CONSOLE ANALYSIS =====
            print("\n" + "="*80)
            print("PHASE 4: CONSOLE LOG ANALYSIS")
            print("="*80)
            
            errors = [log for log in diagnostics["console_logs"] if log["type"] == "error"]
            warnings = [log for log in diagnostics["console_logs"] if log["type"] == "warning"]
            
            print(f"\n📍 Console Logs: {len(diagnostics['console_logs'])} total")
            print(f"   Errors: {len(errors)}")
            print(f"   Warnings: {len(warnings)}")
            
            if errors:
                print("\n❌ ERRORS FOUND:")
                for err in errors:
                    print(f"   - {err['text']}")
            
            if warnings:
                print("\n⚠️  WARNINGS FOUND:")
                for warn in warnings:
                    print(f"   - {warn['text']}")
            
            # ===== SUMMARY =====
            print("\n" + "="*80)
            print("DIAGNOSTIC SUMMARY")
            print("="*80)
            
            print(f"\n✅ Phase 1 (Login): {'PASS' if diagnostics['phase_1_login'].get('credentials_filled') else 'FAIL'}")
            print(f"✅ Phase 2 (Admin Access): {diagnostics['phase_2_admin_access'].get('status', 'UNKNOWN')}")
            print(f"✅ Network Requests: {len(diagnostics['network_requests'])} captured")
            print(f"✅ Console Errors: {len(errors)}")
            
            # Save diagnostics to file
            diagnostics_file = DIAGNOSTICS_DIR / "admin_access_diagnostic.json"
            with open(diagnostics_file, "w") as f:
                json.dump(diagnostics, f, indent=2)
            print(f"\n📁 Diagnostics saved to: {diagnostics_file}")
            
            # Determine root cause
            print("\n" + "="*80)
            print("ROOT CAUSE ANALYSIS")
            print("="*80)
            
            if diagnostics["phase_2_admin_access"].get("status") == "DENIED":
                print("\n🔴 SCENARIO: Admin Access Denied (403 or Frontend Redirect)")
                
                # Check for 403 response
                admin_requests = [r for r in diagnostics["network_requests"] if "analytics/overview" in r["url"]]
                if admin_requests:
                    for req in admin_requests:
                        if req["status"] == 403:
                            print("   → Backend returned 403 Forbidden")
                            print("   → User is authenticated but admin role check failed")
                            print("   → Check: User role_profiles in database")
                            print("   → Check: require_admin dependency in backend")
                        elif req["status"] == 401:
                            print("   → Backend returned 401 Unauthorized")
                            print("   → JWT token is invalid or expired")
                            print("   → Check: Token storage in localStorage")
                            print("   → Check: Authorization header in request")
                        elif req["status"] == 500:
                            print("   → Backend returned 500 Internal Server Error")
                            print("   → Check: Backend logs for errors")
                else:
                    print("   → No admin API request was made")
                    print("   → Frontend is not calling /api/v1/admin/analytics/overview")
                    print("   → Check: app/admin/layout.tsx checkAdminAccess function")
            
            elif diagnostics["phase_2_admin_access"].get("status") == "SUCCESS":
                print("\n🟢 SCENARIO: Admin Access Successful")
                print("   ✅ Admin dashboard is accessible")
                print("   ✅ No issues detected")
            
            return diagnostics
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()
            await page.screenshot(path=SCREENSHOTS_DIR / "error_screenshot.png")
            return None
            
        finally:
            await context.close()
            await browser.close()


if __name__ == "__main__":
    result = asyncio.run(test_admin_access_diagnostic())
    if result:
        print("\n✅ Diagnostic test completed successfully!")
    else:
        print("\n❌ Diagnostic test failed!")

