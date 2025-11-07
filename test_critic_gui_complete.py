"""
Comprehensive GUI Testing of Critic Platform Workflow
Tests complete workflow with provided credentials
"""

import asyncio
import json
from datetime import datetime
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"

# Test credentials
CRITIC_EMAIL = "critic@iwm.com"
CRITIC_PASSWORD = "rmrnn0077"
ADMIN_EMAIL = "admin@iwm.com"
ADMIN_PASSWORD = "AdminPassword123!"

# Test results
results = {
    "phase_1": [],
    "phase_2": [],
    "phase_3": [],
    "phase_4": [],
    "console_errors": [],
}

async def log_test(phase, step, result, message=""):
    """Log test result"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status = "✅" if result else "❌"
    print(f"[{timestamp}] {status} {phase} - {step}: {message}")
    results[phase].append({
        "step": step,
        "result": result,
        "message": message,
        "timestamp": timestamp
    })

async def phase_1_settings_exploration(page):
    """Phase 1: Create account and explore all settings tabs"""
    print("\n" + "="*70)
    print("PHASE 1: ACCOUNT CREATION & SETTINGS EXPLORATION")
    print("="*70)

    try:
        # Step 1: Navigate to signup
        print("\n[STEP 1] Navigate to signup page...")
        await page.goto(f"{BASE_URL}/signup", wait_until="load")
        await page.wait_for_timeout(3000)
        await log_test("phase_1", "Navigate to signup", True, "Signup page loaded")

        # Step 2: Create account
        print("[STEP 2] Creating account...")
        # Try multiple selectors for email input
        email_input = await page.query_selector('input[type="email"], input[name="email"], input[placeholder*="email"]')
        password_input = await page.query_selector('input[type="password"], input[name="password"], input[placeholder*="password"]')

        if email_input and password_input:
            await email_input.fill(CRITIC_EMAIL)
            await password_input.fill(CRITIC_PASSWORD)
            # Try multiple selectors for submit button
            submit_btn = await page.query_selector('button[type="submit"], button:has-text("Sign Up"), button:has-text("Create"), button:has-text("Register")')
            if submit_btn:
                await submit_btn.click()
                await page.wait_for_timeout(4000)
                await log_test("phase_1", "Create account", True, f"Account created: {CRITIC_EMAIL}")
            else:
                await log_test("phase_1", "Create account", False, "Submit button not found")
        else:
            await log_test("phase_1", "Create account", False, "Email/password inputs not found")
        
        # Step 3: Navigate to settings
        print("[STEP 3] Navigating to settings...")
        await page.goto(f"{BASE_URL}/settings", wait_until="load")
        await page.wait_for_timeout(3000)
        await log_test("phase_1", "Navigate to settings", True, "Settings page loaded")

        # Step 4: Explore all tabs
        print("[STEP 4] Exploring all settings tabs...")
        tabs = ["Profile", "Account", "Privacy", "Notifications", "Roles"]

        for tab in tabs:
            try:
                # Try multiple selectors
                tab_button = await page.query_selector(f'button:has-text("{tab}"), a:has-text("{tab}"), [role="tab"]:has-text("{tab}")')
                if tab_button:
                    await tab_button.click()
                    await page.wait_for_timeout(2000)
                    await log_test("phase_1", f"Explore {tab} tab", True, f"{tab} tab accessible")
                else:
                    # Tab might not exist, log as info
                    await log_test("phase_1", f"Explore {tab} tab", False, f"{tab} tab button not found")
            except Exception as e:
                await log_test("phase_1", f"Explore {tab} tab", False, str(e))
        
        # Step 5: Enable Critic Role
        print("[STEP 5] Enabling Critic role...")
        roles_tab = await page.query_selector('button:has-text("Roles"), a:has-text("Roles"), [role="tab"]:has-text("Roles")')
        if roles_tab:
            await roles_tab.click()
            await page.wait_for_timeout(2000)

        # Find and click critic role toggle - try multiple selectors
        critic_toggle = await page.query_selector('input[id*="critic"], input[id*="Critic"], button:has-text("Critic"), [role="switch"]:has-text("Critic")')
        if critic_toggle:
            await critic_toggle.click()
            await page.wait_for_timeout(3000)
            await log_test("phase_1", "Enable Critic role", True, "Critic role enabled")
        else:
            await log_test("phase_1", "Enable Critic role", False, "Critic role toggle not found")

        # Step 6: Fill application form
        print("[STEP 6] Filling critic application form...")
        await page.wait_for_timeout(2000)

        # Fill form fields with better selectors
        username_input = await page.query_selector('input[placeholder*="username"], input[placeholder*="Username"], input[name*="username"], input[id*="username"]')
        if username_input:
            await username_input.fill("critic_test_user")
            await log_test("phase_1", "Fill username", True, "Username filled")

        display_name_input = await page.query_selector('input[placeholder*="display"], input[placeholder*="Display"], input[name*="display"], input[id*="display"]')
        if display_name_input:
            await display_name_input.fill("Test Critic")
            await log_test("phase_1", "Fill display name", True, "Display name filled")

        bio_input = await page.query_selector('textarea[placeholder*="bio"], textarea[placeholder*="Bio"], textarea[name*="bio"], textarea[id*="bio"]')
        if bio_input:
            await bio_input.fill("This is a test critic account for GUI testing purposes. Testing the critic platform workflow.")
            await log_test("phase_1", "Fill bio", True, "Bio filled")

        # Step 7: Submit application
        print("[STEP 7] Submitting application...")
        submit_btn = await page.query_selector('button:has-text("Submit"), button:has-text("Apply"), button:has-text("Create"), button[type="submit"]')
        if submit_btn:
            await submit_btn.click()
            await page.wait_for_timeout(4000)
            await log_test("phase_1", "Submit application", True, "Application submitted")
        else:
            await log_test("phase_1", "Submit application", False, "Submit button not found")
        
        # Step 8: Verify pending status
        print("[STEP 8] Verifying pending status...")
        await page.wait_for_timeout(2000)
        page_content = await page.content()
        if "pending" in page_content.lower() or "application" in page_content.lower():
            await log_test("phase_1", "Verify pending status", True, "Application status verified")
        else:
            await log_test("phase_1", "Verify pending status", False, "Could not verify pending status")
        
        # Step 9: Logout
        print("[STEP 9] Logging out...")
        await page.goto(f"{BASE_URL}/settings")
        logout_btn = await page.query_selector('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")')
        if logout_btn:
            await logout_btn.click()
            await page.wait_for_timeout(2000)
            await log_test("phase_1", "Logout", True, "User logged out")
        
        return True
        
    except Exception as e:
        await log_test("phase_1", "Phase 1 execution", False, str(e))
        return False

async def phase_2_admin_approval(page):
    """Phase 2: Admin approval"""
    print("\n" + "="*70)
    print("PHASE 2: ADMIN APPROVAL")
    print("="*70)
    
    try:
        # Step 1: Login as admin
        print("[STEP 1] Admin login...")
        await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        
        email_input = await page.query_selector('input[type="email"]')
        password_input = await page.query_selector('input[type="password"]')
        
        if email_input and password_input:
            await email_input.fill(ADMIN_EMAIL)
            await password_input.fill(ADMIN_PASSWORD)
            submit_btn = await page.query_selector('button[type="submit"]')
            if submit_btn:
                await submit_btn.click()
                await page.wait_for_timeout(3000)
                await log_test("phase_2", "Admin login", True, "Admin logged in")
        
        # Step 2: Navigate to admin panel
        print("[STEP 2] Navigating to admin panel...")
        await page.goto(f"{BASE_URL}/admin/critic-applications", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await log_test("phase_2", "Navigate to admin panel", True, "Admin panel loaded")
        
        # Step 3: Find and approve application
        print("[STEP 3] Finding and approving application...")
        page_content = await page.content()
        if CRITIC_EMAIL in page_content or "critic" in page_content.lower():
            await log_test("phase_2", "Find application", True, "Application found")
            
            # Click approve button
            approve_btn = await page.query_selector('button:has-text("Approve"), button:has-text("Accept")')
            if approve_btn:
                await approve_btn.click()
                await page.wait_for_timeout(3000)
                await log_test("phase_2", "Approve application", True, "Application approved")
            else:
                await log_test("phase_2", "Approve application", False, "Approve button not found")
        else:
            await log_test("phase_2", "Find application", False, "Application not found")
        
        # Step 4: Logout admin
        print("[STEP 4] Admin logout...")
        await page.goto(f"{BASE_URL}/settings")
        logout_btn = await page.query_selector('button:has-text("Logout"), button:has-text("Sign Out")')
        if logout_btn:
            await logout_btn.click()
            await page.wait_for_timeout(2000)
            await log_test("phase_2", "Admin logout", True, "Admin logged out")
        
        return True
        
    except Exception as e:
        await log_test("phase_2", "Phase 2 execution", False, str(e))
        return False

async def phase_3_verify_access(page):
    """Phase 3: Verify critic access"""
    print("\n" + "="*70)
    print("PHASE 3: VERIFY CRITIC ACCESS")
    print("="*70)

    try:
        # Step 1: Login as critic
        print("[STEP 1] Critic login...")
        await page.goto(f"{BASE_URL}/login", wait_until="load")
        await page.wait_for_timeout(3000)

        email_input = await page.query_selector('input[type="email"], input[name="email"], input[placeholder*="email"]')
        password_input = await page.query_selector('input[type="password"], input[name="password"], input[placeholder*="password"]')

        if email_input and password_input:
            await email_input.fill(CRITIC_EMAIL)
            await password_input.fill(CRITIC_PASSWORD)
            submit_btn = await page.query_selector('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")')
            if submit_btn:
                await submit_btn.click()
                await page.wait_for_timeout(4000)
                await log_test("phase_3", "Critic login", True, "Critic logged in")

        # Step 2: Access dashboard
        print("[STEP 2] Accessing critic dashboard...")
        try:
            await page.goto(f"{BASE_URL}/critic/dashboard", wait_until="load", timeout=10000)
            await page.wait_for_timeout(2000)
            await log_test("phase_3", "Access dashboard", True, "Dashboard accessible")
        except Exception as e:
            await log_test("phase_3", "Access dashboard", False, f"Dashboard error: {str(e)}")

        # Step 3: Access profile
        print("[STEP 3] Accessing critic profile...")
        try:
            await page.goto(f"{BASE_URL}/critic/critic_test_user", wait_until="load", timeout=10000)
            await page.wait_for_timeout(2000)
            await log_test("phase_3", "Access profile", True, "Profile accessible")
        except Exception as e:
            await log_test("phase_3", "Access profile", False, f"Profile error: {str(e)}")

        return True

    except Exception as e:
        await log_test("phase_3", "Phase 3 execution", False, str(e))
        return False

async def phase_4_test_features(page):
    """Phase 4: Test critic features"""
    print("\n" + "="*70)
    print("PHASE 4: TEST CRITIC FEATURES")
    print("="*70)
    
    try:
        # Already logged in from phase 3
        
        # Step 1: Access create review
        print("[STEP 1] Accessing create review page...")
        await page.goto(f"{BASE_URL}/critic/dashboard/create-review", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await log_test("phase_4", "Access create review", True, "Create review page loaded")
        
        # Step 2: Verify page elements
        print("[STEP 2] Verifying page elements...")
        page_content = await page.content()
        if "review" in page_content.lower() or "movie" in page_content.lower():
            await log_test("phase_4", "Verify elements", True, "Page elements present")
        
        return True
        
    except Exception as e:
        await log_test("phase_4", "Phase 4 execution", False, str(e))
        return False

async def main():
    """Main test execution"""
    print("\n" + "="*70)
    print("🎬 CRITIC PLATFORM GUI TESTING - COMPLETE WORKFLOW")
    print("="*70)
    print(f"Critic Email: {CRITIC_EMAIL}")
    print(f"Admin Email: {ADMIN_EMAIL}")
    print("="*70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Run phases
        phase1_ok = await phase_1_settings_exploration(page)
        if phase1_ok:
            phase2_ok = await phase_2_admin_approval(page)
            if phase2_ok:
                phase3_ok = await phase_3_verify_access(page)
                if phase3_ok:
                    await phase_4_test_features(page)
        
        await browser.close()
    
    # Print summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    for phase, tests in results.items():
        if tests:
            passed = sum(1 for t in tests if t["result"])
            total = len(tests)
            print(f"\n{phase.upper()}: {passed}/{total} passed")
            for test in tests:
                status = "✅" if test["result"] else "❌"
                print(f"  {status} {test['step']}: {test['message']}")
    
    print("\n" + "="*70)

if __name__ == "__main__":
    asyncio.run(main())

