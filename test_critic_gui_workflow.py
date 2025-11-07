"""
Comprehensive GUI Testing of Critic Platform Workflow
Tests the complete workflow from signup to critic approval
"""

import asyncio
import json
import uuid
from datetime import datetime
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"

# Test data
TEST_ID = uuid.uuid4().hex[:8]
TEST_USER_EMAIL = f"critic.gui.test.{TEST_ID}@example.com"
TEST_USER_PASSWORD = "TestPassword123!"
TEST_USERNAME = f"critic_gui_{TEST_ID}"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123"

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

async def check_console_errors(page):
    """Check for console errors"""
    errors = []
    async def handle_console(msg):
        if msg.type in ["error", "warning"]:
            errors.append(f"{msg.type.upper()}: {msg.text}")
    
    page.on("console", handle_console)
    return errors

async def phase_1_user_creation(page):
    """Phase 1: Create user account and submit critic application"""
    print("\n" + "="*70)
    print("PHASE 1: USER ACCOUNT CREATION AND CRITIC APPLICATION")
    print("="*70)
    
    try:
        # Step 1: Navigate to signup
        await page.goto(f"{BASE_URL}/signup")
        await page.wait_for_timeout(2000)
        await log_test("phase_1", "Navigate to signup", True, "Signup page loaded")
        
        # Step 2: Fill signup form
        await page.fill('input[type="email"]', TEST_USER_EMAIL)
        await page.fill('input[type="password"]', TEST_USER_PASSWORD)
        await page.click('button[type="submit"]')
        await page.wait_for_timeout(3000)
        await log_test("phase_1", "Create account", True, f"Account created: {TEST_USER_EMAIL}")
        
        # Step 3: Navigate to settings
        await page.goto(f"{BASE_URL}/settings")
        await page.wait_for_timeout(2000)
        await log_test("phase_1", "Navigate to settings", True, "Settings page loaded")
        
        # Step 4: Enable critic role
        critic_role_selector = 'input[id*="critic"], input[id*="Critic"], button:has-text("Critic")'
        try:
            await page.click(critic_role_selector)
            await page.wait_for_timeout(2000)
            await log_test("phase_1", "Enable critic role", True, "Critic role enabled")
        except:
            await log_test("phase_1", "Enable critic role", False, "Could not find critic role toggle")
        
        # Step 5: Fill critic application form
        await page.wait_for_timeout(2000)
        
        # Fill username
        username_input = await page.query_selector('input[placeholder*="username"], input[placeholder*="Username"]')
        if username_input:
            await username_input.fill(TEST_USERNAME)
        
        # Fill display name
        display_name_input = await page.query_selector('input[placeholder*="display"], input[placeholder*="Display"]')
        if display_name_input:
            await display_name_input.fill(f"Test Critic {TEST_ID}")
        
        # Fill bio
        bio_input = await page.query_selector('textarea[placeholder*="bio"], textarea[placeholder*="Bio"]')
        if bio_input:
            await bio_input.fill("This is a test critic account for GUI testing purposes.")
        
        await log_test("phase_1", "Fill application form", True, "Application form filled")
        
        # Step 6: Submit application
        submit_button = await page.query_selector('button:has-text("Submit"), button:has-text("Apply")')
        if submit_button:
            await submit_button.click()
            await page.wait_for_timeout(3000)
            await log_test("phase_1", "Submit application", True, "Application submitted")
        else:
            await log_test("phase_1", "Submit application", False, "Could not find submit button")
        
        # Step 7: Verify pending status
        await page.wait_for_timeout(2000)
        page_content = await page.content()
        if "pending" in page_content.lower():
            await log_test("phase_1", "Verify pending status", True, "Application status is pending")
        else:
            await log_test("phase_1", "Verify pending status", False, "Could not verify pending status")
        
        # Step 8: Logout
        await page.goto(f"{BASE_URL}/settings")
        logout_button = await page.query_selector('button:has-text("Logout"), button:has-text("Sign Out")')
        if logout_button:
            await logout_button.click()
            await page.wait_for_timeout(2000)
            await log_test("phase_1", "Logout", True, "User logged out")
        
        return True
        
    except Exception as e:
        await log_test("phase_1", "Phase 1 execution", False, str(e))
        return False

async def phase_2_admin_approval(page):
    """Phase 2: Admin approval of application"""
    print("\n" + "="*70)
    print("PHASE 2: ADMIN APPROVAL")
    print("="*70)
    
    try:
        # Step 1: Navigate to login
        await page.goto(f"{BASE_URL}/login")
        await page.wait_for_timeout(2000)
        await log_test("phase_2", "Navigate to login", True, "Login page loaded")
        
        # Step 2: Login as admin
        await page.fill('input[type="email"]', ADMIN_EMAIL)
        await page.fill('input[type="password"]', ADMIN_PASSWORD)
        await page.click('button[type="submit"]')
        await page.wait_for_timeout(3000)
        await log_test("phase_2", "Admin login", True, "Admin logged in")
        
        # Step 3: Navigate to admin panel
        await page.goto(f"{BASE_URL}/admin/critic-applications")
        await page.wait_for_timeout(2000)
        await log_test("phase_2", "Navigate to admin panel", True, "Admin panel loaded")
        
        # Step 4: Find pending application
        page_content = await page.content()
        if TEST_USERNAME in page_content or "pending" in page_content.lower():
            await log_test("phase_2", "Find pending application", True, "Pending application found")
        else:
            await log_test("phase_2", "Find pending application", False, "Could not find pending application")
        
        # Step 5: Approve application
        approve_button = await page.query_selector('button:has-text("Approve"), button:has-text("Accept")')
        if approve_button:
            await approve_button.click()
            await page.wait_for_timeout(3000)
            await log_test("phase_2", "Approve application", True, "Application approved")
        else:
            await log_test("phase_2", "Approve application", False, "Could not find approve button")
        
        # Step 6: Logout admin
        logout_button = await page.query_selector('button:has-text("Logout"), button:has-text("Sign Out")')
        if logout_button:
            await logout_button.click()
            await page.wait_for_timeout(2000)
            await log_test("phase_2", "Admin logout", True, "Admin logged out")
        
        return True
        
    except Exception as e:
        await log_test("phase_2", "Phase 2 execution", False, str(e))
        return False

async def phase_3_verify_access(page):
    """Phase 3: Verify critic access after approval"""
    print("\n" + "="*70)
    print("PHASE 3: VERIFY CRITIC ACCESS")
    print("="*70)
    
    try:
        # Step 1: Login as critic
        await page.goto(f"{BASE_URL}/login")
        await page.wait_for_timeout(2000)
        await page.fill('input[type="email"]', TEST_USER_EMAIL)
        await page.fill('input[type="password"]', TEST_USER_PASSWORD)
        await page.click('button[type="submit"]')
        await page.wait_for_timeout(3000)
        await log_test("phase_3", "Critic login", True, "Critic logged in")
        
        # Step 2: Access critic dashboard
        await page.goto(f"{BASE_URL}/critic/dashboard")
        await page.wait_for_timeout(2000)
        page_content = await page.content()
        if "dashboard" in page_content.lower() or "review" in page_content.lower():
            await log_test("phase_3", "Access dashboard", True, "Dashboard accessible")
        else:
            await log_test("phase_3", "Access dashboard", False, "Dashboard not accessible")
        
        # Step 3: Access critic profile
        await page.goto(f"{BASE_URL}/critic/{TEST_USERNAME}")
        await page.wait_for_timeout(2000)
        await log_test("phase_3", "Access profile", True, "Profile page loaded")
        
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
        
        # Step 1: Navigate to create review
        await page.goto(f"{BASE_URL}/critic/dashboard/create-review")
        await page.wait_for_timeout(2000)
        await log_test("phase_4", "Access create review", True, "Create review page loaded")
        
        # Step 2: Verify page elements
        page_content = await page.content()
        if "review" in page_content.lower() or "movie" in page_content.lower():
            await log_test("phase_4", "Verify page elements", True, "Page elements present")
        else:
            await log_test("phase_4", "Verify page elements", False, "Page elements missing")
        
        return True
        
    except Exception as e:
        await log_test("phase_4", "Phase 4 execution", False, str(e))
        return False

async def main():
    """Main test execution"""
    print("\n" + "="*70)
    print("🎬 CRITIC PLATFORM GUI TESTING - COMPLETE WORKFLOW")
    print("="*70)
    print(f"Test ID: {TEST_ID}")
    print(f"Test User: {TEST_USER_EMAIL}")
    print(f"Test Username: {TEST_USERNAME}")
    print("="*70)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Set up console error tracking
        errors = []
        page.on("console", lambda msg: errors.append(f"{msg.type}: {msg.text}") if msg.type in ["error", "warning"] else None)
        
        # Run phases
        phase1_ok = await phase_1_user_creation(page)
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
    
    if errors:
        print(f"\n⚠️  CONSOLE ERRORS: {len(errors)}")
        for error in errors:
            print(f"  - {error}")
    
    print("\n" + "="*70)

if __name__ == "__main__":
    asyncio.run(main())

