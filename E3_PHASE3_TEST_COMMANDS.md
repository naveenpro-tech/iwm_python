# Epic E-3 Phase 3 - Test Commands

## Prerequisites

Ensure both servers are running:

```bash
# Terminal 1: Backend
cd C:\iwm\v142\apps\backend
python -m venv venv
venv\Scripts\activate
hypercorn src.main:app --reload --bind 127.0.0.1:8000

# Terminal 2: Frontend
cd C:\iwm\v142\apps\frontend
bun run dev
```

---

## Backend API Tests

### Run All Role Settings Tests

```bash
cd C:\iwm\v142\apps\backend
pytest tests/test_role_settings.py -v
```

### Run Specific Test

```bash
# Test GET critic profile
pytest tests/test_role_settings.py::test_get_critic_profile -v

# Test PUT critic profile
pytest tests/test_role_settings.py::test_update_critic_profile -v

# Test authentication
pytest tests/test_role_settings.py::test_get_role_profile_unauthorized -v
```

### Run with Coverage

```bash
cd C:\iwm\v142\apps\backend
pytest tests/test_role_settings.py --cov=src.routers.roles --cov-report=html
```

---

## Frontend E2E Tests

### Run All Role Settings E2E Tests

```bash
cd C:\iwm\v142\apps\frontend
npx playwright test tests/e2e/role-settings.spec.ts
```

### Run All Role Routing E2E Tests

```bash
cd C:\iwm\v142\apps\frontend
npx playwright test tests/e2e/role-based-routing.spec.ts
```

### Run All E2E Tests (Both Files)

```bash
cd C:\iwm\v142\apps\frontend
npx playwright test tests/e2e/role-settings.spec.ts tests/e2e/role-based-routing.spec.ts
```

### Run Specific Test

```bash
# Test critic settings tab visibility
npx playwright test tests/e2e/role-settings.spec.ts -g "User with critic role sees Critic Settings tab"

# Test role-based routing
npx playwright test tests/e2e/role-based-routing.spec.ts -g "With activeRole=critic, clicking Profile navigates"
```

### Run with UI Mode (Interactive)

```bash
cd C:\iwm\v142\apps\frontend
npx playwright test tests/e2e/role-settings.spec.ts --ui
npx playwright test tests/e2e/role-based-routing.spec.ts --ui
```

### Run with Debug Mode

```bash
cd C:\iwm\v142\apps\frontend
npx playwright test tests/e2e/role-settings.spec.ts --debug
```

### Generate HTML Report

```bash
cd C:\iwm\v142\apps\frontend
npx playwright test tests/e2e/role-settings.spec.ts tests/e2e/role-based-routing.spec.ts --reporter=html
# Open report
npx playwright show-report
```

---

## Manual Testing Checklist

### Test Role-Specific Settings

1. **Navigate to Settings**
   ```
   http://localhost:3001/settings
   ```

2. **Check for Role Tabs**
   - Should see tabs for: Profile, Account, Privacy, Display, Preferences, Notifications
   - Plus tabs for each role user has (Critic, Talent, Industry)

3. **Test Critic Settings**
   - Click "Critic" tab
   - Fill in bio: "Test critic bio"
   - Fill in twitter_url: "https://twitter.com/testcritic"
   - Click "Save Critic Settings"
   - Should see success toast: "Critic settings updated successfully"

4. **Test Talent Settings**
   - Click "Talent" tab
   - Fill in stage_name: "Test Talent"
   - Fill in bio: "Test talent bio"
   - Click "Save Talent Settings"
   - Should see success toast: "Talent settings updated successfully"

5. **Test Industry Settings**
   - Click "Industry" tab
   - Fill in company_name: "Test Company"
   - Fill in job_title: "Producer"
   - Click "Save Industry Settings"
   - Should see success toast: "Industry settings updated successfully"

### Test Role-Based Routing

1. **Navigate to Profile Dropdown**
   - Click profile avatar in navbar

2. **Test Lover Profile**
   - Ensure "Movie Lover" role is active (checkmark visible)
   - Click "Profile"
   - Should navigate to `/profile/{username}`

3. **Test Critic Profile**
   - Click on "Critic" role in dropdown to switch
   - Wait for role switch to complete
   - Click profile avatar again
   - Click "Profile"
   - Should navigate to `/critic/{username}`

4. **Test Talent Profile**
   - Click on "Talent" role in dropdown to switch
   - Wait for role switch to complete
   - Click profile avatar again
   - Click "Profile"
   - Should navigate to `/talent-hub/profile/me`

5. **Test Industry Profile**
   - Click on "Industry" role in dropdown to switch
   - Wait for role switch to complete
   - Click profile avatar again
   - Click "Profile"
   - Should navigate to `/people` (temporary placeholder)

---

## API Testing with cURL

### Get Critic Profile

```bash
curl -X GET http://localhost:8000/api/v1/roles/critic \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Update Critic Profile

```bash
curl -X PUT http://localhost:8000/api/v1/roles/critic/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated critic bio",
    "twitter_url": "https://twitter.com/testcritic"
  }'
```

### Get Talent Profile

```bash
curl -X GET http://localhost:8000/api/v1/roles/talent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Update Talent Profile

```bash
curl -X PUT http://localhost:8000/api/v1/roles/talent/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stage_name": "Updated Stage Name",
    "availability_status": "busy"
  }'
```

### Get Industry Profile

```bash
curl -X GET http://localhost:8000/api/v1/roles/industry \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Update Industry Profile

```bash
curl -X PUT http://localhost:8000/api/v1/roles/industry/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Updated Company",
    "job_title": "Director",
    "accepting_projects": false
  }'
```

---

## Troubleshooting

### Tests Not Running

1. **Check servers are running**
   ```bash
   # Backend should be at http://localhost:8000
   curl http://localhost:8000/health
   
   # Frontend should be at http://localhost:3001
   curl http://localhost:3001
   ```

2. **Check test file paths**
   ```bash
   # Verify test files exist
   ls tests/e2e/role-settings.spec.ts
   ls tests/e2e/role-based-routing.spec.ts
   ```

3. **Clear Playwright cache**
   ```bash
   npx playwright install
   ```

### API Tests Failing

1. **Check authentication**
   - Verify JWT token is valid
   - Check token is not expired

2. **Check database**
   - Verify test user exists
   - Verify role profiles exist

3. **Check backend logs**
   - Look for validation errors
   - Check for database errors

### E2E Tests Failing

1. **Check selectors**
   - Verify element selectors match current UI
   - Check for dynamic class names

2. **Check timing**
   - Increase wait times if needed
   - Check for race conditions

3. **Check browser**
   - Verify Playwright browser is installed
   - Check for browser compatibility

---

## Test Results Summary

**Expected Results:**
- ✅ All 12 backend tests pass
- ✅ All 18+ frontend E2E tests pass
- ✅ No console errors
- ✅ No network errors
- ✅ All forms submit successfully
- ✅ All navigation works correctly

---

## Continuous Integration

### GitHub Actions (if configured)

```yaml
# .github/workflows/test-e3-phase3.yml
name: E-3 Phase 3 Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run backend tests
        run: |
          cd apps/backend
          pytest tests/test_role_settings.py -v

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run frontend E2E tests
        run: |
          cd apps/frontend
          npx playwright test tests/e2e/role-settings.spec.ts tests/e2e/role-based-routing.spec.ts
```

---

**Last Updated:** 2025-10-29

