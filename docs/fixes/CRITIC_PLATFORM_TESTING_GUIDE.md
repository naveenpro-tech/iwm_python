# Critic Platform Testing Guide

**Date:** 2025-11-07  
**Backend:** Running on `http://127.0.0.1:8000`  
**Frontend:** Running on `http://localhost:3000`

---

## ✅ All Issues Fixed

### 1. Critics List Page - Real Data ✅
- **URL:** `http://localhost:3000/critics`
- **Fix:** Removed mock data fallback, always fetches from `/api/v1/critics?is_verified=true`
- **Status:** Ready to test

### 2. Critic Dashboard Access ✅
- **URL:** `http://localhost:3000/critic/dashboard`
- **Fix:** Added `/api/v1/critics/me` and `/api/v1/critics/me/stats` endpoints
- **Status:** Ready to test

### 3. Error Handling ✅
- **Fix:** Better error messages and redirects
- **Status:** Ready to test

### 4. Security ✅
- **Fix:** All endpoints have proper authentication
- **Status:** Verified

---

## Testing Workflow

### Test 1: Critics List Page

**URL:** `http://localhost:3000/critics`

**Steps:**
1. Open browser and navigate to `http://localhost:3000/critics`
2. Verify page loads without errors
3. Check if real critics from database are displayed
4. Test search functionality (search for a critic name)
5. Test sorting dropdown (Most Followers, Most Reviews, A-Z, Newest)
6. Verify empty state if no critics exist

**Expected Results:**
- ✅ Page loads successfully
- ✅ Real data from database is displayed (not mock data)
- ✅ Search works correctly
- ✅ Sorting works correctly
- ✅ Empty state shows: "No verified critics yet. Be the first to become a verified critic!"

**How to Verify Real Data:**
- Open browser console (F12)
- Go to Network tab
- Refresh the page
- Look for request to `/api/v1/critics?is_verified=true&limit=100`
- Check the response - should show real critics from database

---

### Test 2: Critic Application & Approval Workflow

**Prerequisites:** You need admin access

**Steps:**

#### Step 2.1: Create New User Account
1. Navigate to `http://localhost:3000/signup`
2. Create a new account:
   - Email: `testcritic@example.com`
   - Password: `TestPassword123!`
   - Name: `Test Critic`
3. Login with the new account

#### Step 2.2: Submit Critic Application
1. Navigate to `http://localhost:3000/critic/apply`
2. Fill out the application form:
   - Username: `testcritic`
   - Display Name: `Test Critic`
   - Bio: `Test bio for critic application`
   - Platform Links: Add at least one social media link
   - Sample Review URLs: Add at least one review URL
3. Submit the application
4. Verify redirect to `/critic/application-status`
5. Verify status shows "Pending"

#### Step 2.3: Approve Application (Admin)
1. Logout from test critic account
2. Login as admin (`admin@iwm.com` / `AdminPassword123!`)
3. Navigate to `http://localhost:3000/admin/critic-applications`
4. Find the test critic application
5. Click "View" to see details
6. Click "Approve" button
7. Add admin notes (optional)
8. Confirm approval
9. Verify application status changes to "Approved"

#### Step 2.4: Access Critic Dashboard
1. Logout from admin account
2. Login as test critic (`testcritic@example.com` / `TestPassword123!`)
3. Navigate to `http://localhost:3000/critic/dashboard`
4. **EXPECTED:** Dashboard loads successfully
5. **EXPECTED:** Stats are displayed (total reviews, views, followers, etc.)
6. **EXPECTED:** No errors in console

**If Dashboard Doesn't Load:**
- Check browser console for errors
- Check if `/api/v1/critics/me` returns 404
- If 404, the critic profile wasn't created during approval
- Contact support or check backend logs

---

### Test 3: Individual Critic Profile Page

**Prerequisites:** At least one approved critic exists

**Steps:**
1. Navigate to `http://localhost:3000/critics`
2. Click on any critic card
3. Verify redirect to `/critic/[username]`
4. Verify all sections load:
   - Hero section with banner
   - Stats constellation (followers, reviews, blog posts, etc.)
   - Pinned content section
   - Tabbed layout (Reviews, Recommendations, Blog)
   - Sidebar with analytics (desktop only)
5. Click on different tabs and verify content loads
6. Verify no errors in console

**Expected Results:**
- ✅ Profile loads successfully
- ✅ All sections display correctly
- ✅ Real data is shown
- ✅ Tabs work correctly
- ✅ No console errors

---

### Test 4: Unapproved User Access Control

**Prerequisites:** User account without approved critic application

**Steps:**
1. Login as a regular user (no critic application)
2. Try to navigate to `http://localhost:3000/critic/dashboard`
3. **EXPECTED:** Redirect to `/critic/application-status`
4. **EXPECTED:** Message shows "You haven't applied yet" or similar

**Alternative Test:**
1. Login as user with pending application
2. Try to navigate to `http://localhost:3000/critic/dashboard`
3. **EXPECTED:** Redirect to `/critic/application-status`
4. **EXPECTED:** Message shows "Your application is pending review"

---

## API Testing with cURL

### Test `/api/v1/critics` (Public Endpoint)

```bash
curl -X GET "http://localhost:8000/api/v1/critics?is_verified=true&limit=10"
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "external_id": "uuid",
    "username": "critic_username",
    "display_name": "Critic Name",
    "bio": "Bio text",
    "is_verified": true,
    "is_active": true,
    "follower_count": 1000,
    "total_reviews": 50,
    ...
  }
]
```

---

### Test `/api/v1/critics/me` (Authenticated Endpoint)

**Get Access Token:**
1. Login via frontend
2. Open browser console
3. Run: `localStorage.getItem('access_token')`
4. Copy the token

**Test with cURL:**
```bash
curl -X GET http://localhost:8000/api/v1/critics/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200 OK) - If user has critic profile:**
```json
{
  "id": 1,
  "external_id": "uuid",
  "username": "critic_username",
  "display_name": "Critic Name",
  "bio": "Bio text",
  "is_verified": true,
  "is_active": true,
  "follower_count": 1000,
  "total_reviews": 50,
  ...
}
```

**Expected Response (404 Not Found) - If user has no critic profile:**
```json
{
  "detail": "User does not have a critic profile"
}
```

**Expected Response (401 Unauthorized) - If no token:**
```json
{
  "detail": "Not authenticated"
}
```

---

### Test `/api/v1/critics/me/stats` (Authenticated Endpoint)

```bash
curl -X GET http://localhost:8000/api/v1/critics/me/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200 OK):**
```json
{
  "total_reviews": 50,
  "total_views": 10000,
  "total_likes": 500,
  "follower_count": 1000,
  "avg_engagement": 0.08,
  "reviews_this_month": 5,
  "views_this_month": 1000,
  "growth_rate": 0.0
}
```

---

## Common Issues & Solutions

### Issue 1: Critics List Page Shows Empty
**Symptom:** Page loads but shows "No verified critics yet"  
**Cause:** No approved critics in database  
**Solution:** 
1. Create a user account
2. Submit critic application
3. Login as admin and approve the application
4. Refresh critics list page

---

### Issue 2: Dashboard Shows 404 After Approval
**Symptom:** Application approved but dashboard returns 404  
**Cause:** Critic profile wasn't created during approval  
**Solution:**
1. Check backend logs for errors during approval
2. Verify `/api/v1/critics/me` endpoint exists
3. Check if `CriticProfile` record was created in database
4. Contact support if issue persists

---

### Issue 3: CORS Errors
**Symptom:** Network requests fail with CORS errors  
**Cause:** Backend CORS configuration issue  
**Solution:**
1. Verify backend is running on `http://127.0.0.1:8000`
2. Verify frontend is running on `http://localhost:3000`
3. Check backend CORS origins include `http://localhost:3000`
4. Restart backend server

---

### Issue 4: Authentication Errors
**Symptom:** 401 Unauthorized errors  
**Cause:** JWT token expired or invalid  
**Solution:**
1. Logout and login again
2. Clear browser localStorage
3. Check if token is being sent in Authorization header
4. Verify token format: `Bearer <token>`

---

## Success Criteria Checklist

- [ ] Critics list page loads and shows real data
- [ ] Search functionality works
- [ ] Sorting functionality works
- [ ] Empty state shows appropriate message
- [ ] Critic application can be submitted
- [ ] Admin can approve applications
- [ ] Approved critics can access dashboard
- [ ] Dashboard shows real stats
- [ ] Individual critic profiles load correctly
- [ ] Unapproved users are redirected appropriately
- [ ] All API endpoints return correct responses
- [ ] No console errors during normal operation
- [ ] Authentication works correctly
- [ ] Authorization works correctly

---

## Next Steps After Testing

1. **If all tests pass:**
   - Mark all issues as resolved
   - Deploy to staging environment
   - Perform smoke tests on staging
   - Deploy to production

2. **If tests fail:**
   - Document the failure
   - Check backend logs
   - Check browser console
   - Report the issue with:
     - Steps to reproduce
     - Expected behavior
     - Actual behavior
     - Screenshots/logs

---

## Support

**Backend Logs Location:** Terminal running Hypercorn server  
**Frontend Logs Location:** Browser console (F12)  
**Database:** PostgreSQL on port 5433 (local dev)

**Admin Credentials:**
- Email: `admin@iwm.com`
- Password: `AdminPassword123!`

---

**Status:** ✅ **READY FOR TESTING**

All fixes have been implemented and committed. Backend server is running. Ready for comprehensive testing.

