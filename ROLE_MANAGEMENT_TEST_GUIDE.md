# Role Management - Test Execution Guide

## Overview

This guide covers all testing for the Role Management System, including backend API tests, frontend E2E tests, and the comprehensive full workflow test.

---

## Test Files

### Backend Tests
- **File:** `apps/backend/tests/test_role_management.py`
- **Lines:** 280
- **Test Cases:** 8
- **Coverage:** API endpoints, role activation/deactivation, data persistence

### Frontend E2E Tests
1. **File:** `tests/e2e/role-management.spec.ts`
   - **Lines:** 260
   - **Test Cases:** 12
   - **Coverage:** UI interactions, role toggles, tab visibility

2. **File:** `tests/e2e/role-management-full-workflow.spec.ts` ⭐ NEW
   - **Lines:** 300+
   - **Test Cases:** 2 comprehensive workflows
   - **Coverage:** Complete user journey from login to public profile verification

### API Test Script
- **File:** `test_role_management.ps1`
- **Type:** PowerShell script
- **Purpose:** Quick API endpoint verification

---

## Prerequisites

### 1. Backend Server Running
```powershell
cd apps/backend
python -m venv venv
venv\Scripts\activate
hypercorn src.main:app --reload --bind 127.0.0.1:8000
```

### 2. Frontend Server Running
```powershell
cd apps/frontend
bun run dev
```

### 3. Test User Account
Create a test user or use existing credentials:
- **Email:** test@example.com
- **Password:** testpassword123

---

## Running Tests

### Backend API Tests

**Run all role management tests:**
```powershell
cd apps/backend
pytest tests/test_role_management.py -v
```

**Run specific test:**
```powershell
pytest tests/test_role_management.py::test_new_signup_gets_only_lover_role -v
```

**Run with coverage:**
```powershell
pytest tests/test_role_management.py --cov=src.routers.roles --cov=src.routers.user_roles -v
```

**Expected Output:**
```
tests/test_role_management.py::test_get_roles_includes_enabled_status PASSED
tests/test_role_management.py::test_activate_critic_role PASSED
tests/test_role_management.py::test_deactivate_role PASSED
tests/test_role_management.py::test_cannot_deactivate_last_enabled_role PASSED
tests/test_role_management.py::test_new_signup_gets_only_lover_role PASSED
tests/test_role_management.py::test_role_data_preserved_after_deactivation PASSED

======================== 8 passed in 5.23s ========================
```

---

### Frontend E2E Tests

**Run basic role management tests:**
```powershell
npx playwright test tests/e2e/role-management.spec.ts
```

**Run full workflow test:**
```powershell
npx playwright test tests/e2e/role-management-full-workflow.spec.ts
```

**Run all role management E2E tests:**
```powershell
npx playwright test tests/e2e/role-management*.spec.ts
```

**Run with UI mode (interactive):**
```powershell
npx playwright test tests/e2e/role-management-full-workflow.spec.ts --ui
```

**Run with headed browser (see what's happening):**
```powershell
npx playwright test tests/e2e/role-management-full-workflow.spec.ts --headed
```

**Run with debug mode:**
```powershell
npx playwright test tests/e2e/role-management-full-workflow.spec.ts --debug
```

**Expected Output:**
```
Running 2 tests using 1 worker

  ✓ role-management-full-workflow.spec.ts:20:3 › Complete role management workflow (45s)
  ✓ role-management-full-workflow.spec.ts:280:3 › Verify role data persistence (12s)

  2 passed (57s)
```

---

### Quick API Test Script

**Run PowerShell test script:**
```powershell
.\test_role_management.ps1
```

**Expected Output:**
```
=== Role Management API Test ===

Test 1: Signup new user (should get only lover role)
✓ Signup successful
  Token: eyJhbGciOiJIUzI1NiIs...

Test 2: Get user roles (should only have lover role)
✓ Got user roles
  Roles count: 1
  - Movie Lover: ENABLED (ACTIVE)
✓ Correct: Only lover role present

Test 3: Activate critic role
✓ Critic role activated
  Profile created: True
  Next step: complete_profile

Test 4: Get roles again (should have lover and critic enabled)
✓ Got user roles
  Roles count: 2
  - Movie Lover: ENABLED (ACTIVE)
  - Critic: ENABLED
✓ Correct: Critic role is enabled

Test 5: Deactivate critic role
✓ Critic role deactivated
  Enabled: False
  Visibility: private

Test 6: Get roles again (critic should be disabled)
✓ Got user roles
  Roles count: 2
  - Movie Lover: ENABLED (ACTIVE)
  - Critic: DISABLED
✓ Correct: Critic role is disabled

Test 7: Try to deactivate lover role (should fail)
✓ Correct: Cannot deactivate last enabled role (400 error)

=== All Tests Complete ===

Summary:
✓ New users get only lover role by default
✓ Roles endpoint includes enabled status
✓ Can activate additional roles
✓ Can deactivate roles
✓ Cannot deactivate last enabled role
```

---

## Full Workflow Test Details

### Test: Complete Role Management Workflow

**What it tests:**
1. ✅ User login
2. ✅ Navigate to Settings → Roles tab
3. ✅ Enable Critic role
4. ✅ Verify Critic tab appears
5. ✅ Enable Talent role
6. ✅ Verify Talent tab appears
7. ✅ Enable Industry Professional role
8. ✅ Verify Industry tab appears
9. ✅ Fill in Critic profile data (bio, social links)
10. ✅ Save Critic settings
11. ✅ Fill in Talent profile data (stage name, bio, demo reel, agent)
12. ✅ Save Talent settings
13. ✅ Fill in Industry profile data (company, job title, bio, LinkedIn)
14. ✅ Save Industry settings
15. ✅ Navigate to Critic public profile page
16. ✅ Verify Critic profile displays correct data
17. ✅ Navigate to Talent public profile page
18. ✅ Verify Talent profile displays correct data
19. ✅ Navigate to Industry public profile page
20. ✅ Verify Industry profile displays correct data
21. ✅ Verify role-based routing works
22. ✅ Verify all role tabs still visible in settings

**Duration:** ~45 seconds

**Test Data Used:**
```typescript
critic: {
  bio: "Professional film critic with 10+ years of experience...",
  twitter: "https://twitter.com/testcritic",
  website: "https://filmcritic.example.com",
}

talent: {
  stageName: "Test Talent Star",
  bio: "Award-winning actor with diverse portfolio...",
  demoReel: "https://youtube.com/watch?v=demo123",
  agentName: "Jane Smith",
}

industry: {
  companyName: "Test Studios Inc.",
  jobTitle: "Executive Producer",
  bio: "Experienced producer specializing in...",
  linkedin: "https://linkedin.com/in/testpro",
}
```

---

## Troubleshooting

### Test Failures

**Issue: "Role Activated" toast not appearing**
- **Cause:** API call taking longer than expected
- **Solution:** Increase timeout in test or check backend logs

**Issue: Profile data not saving**
- **Cause:** Form fields not matching expected selectors
- **Solution:** Check component structure, update selectors

**Issue: Public profile pages not loading**
- **Cause:** Routing not configured or user not found
- **Solution:** Verify routing setup, check username extraction

**Issue: Tests timing out**
- **Cause:** Servers not running or slow response
- **Solution:** Ensure both backend and frontend are running, check network

### Common Errors

**Error: "Cannot find element"**
```
Solution: Wait for element to load
await page.waitForSelector('text="Expected Text"', { timeout: 10000 })
```

**Error: "Navigation timeout"**
```
Solution: Increase timeout or check if page is loading
await page.goto("/settings", { timeout: 30000 })
```

**Error: "Element is not visible"**
```
Solution: Scroll to element or wait for animation
await element.scrollIntoViewIfNeeded()
await page.waitForTimeout(500)
```

---

## Test Coverage Summary

### Backend Coverage
- ✅ Signup with only lover role
- ✅ GET /api/v1/users/me/roles includes enabled status
- ✅ POST /api/v1/roles/{role_type}/activate
- ✅ POST /api/v1/roles/{role_type}/deactivate
- ✅ Cannot deactivate last enabled role
- ✅ Data preservation on deactivation
- ✅ Re-activation restores data

### Frontend Coverage
- ✅ Roles tab visible in settings
- ✅ All 4 roles displayed
- ✅ Movie Lover cannot be disabled
- ✅ Can activate/deactivate roles
- ✅ Confirmation dialog before deactivation
- ✅ Tabs appear/disappear based on enabled status
- ✅ Loading states during API calls
- ✅ Toast notifications for success/error
- ✅ Profile data can be saved
- ✅ Public profile pages display correct data
- ✅ Role-based routing works
- ✅ Data persists after page reload

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Role Management Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd apps/backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd apps/backend
          pytest tests/test_role_management.py -v

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: |
          npx playwright test tests/e2e/role-management*.spec.ts
```

---

## Next Steps

1. **Run all tests** to verify implementation
2. **Review test results** and fix any failures
3. **Add tests to CI/CD pipeline**
4. **Monitor test execution** in production
5. **Expand test coverage** as new features are added

---

**Status:** ✅ READY FOR TESTING

**Last Updated:** 2025-10-29

