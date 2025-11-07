# Critic Platform Testing Guide

## Prerequisites
- Backend running on `http://127.0.0.1:8000`
- Frontend running on `http://localhost:3000`
- PostgreSQL database with test data
- Admin account: `admin@iwm.com` / `AdminPassword123!`
- Test user account: `critic.tester@example.com` / `TestPassword123!`

---

## Manual Testing Workflow

### Step 1: Test Critic Role Activation

1. **Login as Test User**
   - Navigate to `http://localhost:3000/login`
   - Email: `critic.tester@example.com`
   - Password: `TestPassword123!`
   - Click "Sign In"

2. **Navigate to Settings**
   - Click on user avatar (top right)
   - Select "Settings"
   - Navigate to "Roles" tab

3. **Enable Critic Role**
   - Find "Critic" role card
   - Click "Enable" button
   - Should redirect to `/critic/application`

### Step 2: Test Critic Application Form

1. **Fill Application Form**
   - Username: `critic_tester_001` (or similar)
   - Display Name: `Test Critic`
   - Bio: Enter at least 100 characters describing yourself
   - Platform Links: Add at least 1 (e.g., YouTube, Twitter)
   - Sample Review URLs: Add 2-5 review URLs

2. **Submit Application**
   - Click "Submit Application" button
   - Should show success toast
   - Should redirect to `/critic/application-status`

3. **Verify Application Status**
   - Should show "Application Pending" status
   - Should display submitted information
   - Should show submission date/time

### Step 3: Test Admin Approval

1. **Login as Admin**
   - Logout from test user account
   - Navigate to `http://localhost:3000/login`
   - Email: `admin@iwm.com`
   - Password: `AdminPassword123!`
   - Click "Sign In"

2. **Navigate to Admin Panel**
   - Click on user avatar (top right)
   - Select "Admin Panel"
   - Navigate to "Critic Applications"

3. **Find and Approve Application**
   - Should see list of applications
   - Find the application from test user
   - Click "Approve" button
   - Optional: Add admin notes
   - Click "Confirm Approve"
   - Should show success message

4. **Verify Application Status Updated**
   - Application status should change to "approved"
   - Should show approval date/time

### Step 4: Test Critic Dashboard Access

1. **Login as Test User Again**
   - Logout from admin account
   - Login with test user credentials
   - Navigate to `/critic/dashboard`

2. **Verify Dashboard Loads**
   - Should NOT redirect to application status
   - Should display dashboard with stats
   - Should show drafts and recent reviews
   - Should have "Create Review" button

### Step 5: Test Review Creation

1. **Create New Review**
   - Click "Create Review" button
   - Should navigate to `/critic/dashboard/create-review`

2. **Fill Review Form**
   - Search for a movie (e.g., "Inception")
   - Select movie from results
   - Enter review title
   - Enter review content (min 100 chars)
   - Set rating (1-10)
   - Optional: Add YouTube video ID
   - Optional: Add tags

3. **Save as Draft**
   - Click "Save Draft" button
   - Should show success toast
   - Should save review with `is_draft=true`

4. **Publish Review**
   - Click "Publish" button
   - Should show success toast
   - Should redirect to dashboard
   - Review should appear in "Recent Reviews"

### Step 6: Test Critic Reviews on Movie Page

1. **Navigate to Movie Page**
   - Go to `http://localhost:3000/movies/tmdb-1054867` (Inception)
   - Should load movie details

2. **Check Critics Tab**
   - Click on "Critics" tab in reviews section
   - Should display critic reviews
   - Should show review from test user
   - Should display critic name, rating, content

### Step 7: Test Critic Profile

1. **Navigate to Critic Profile**
   - Go to `http://localhost:3000/critic/critic_tester_001`
   - Should load critic profile
   - Should display bio, stats, reviews

2. **Verify Profile Data**
   - Should show verified badge
   - Should display reviews created
   - Should show follower count
   - Should display social links

---

## API Testing (cURL)

### Submit Application
```bash
curl -X POST http://127.0.0.1:8000/api/v1/critic-verification \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "requested_username": "critic_tester_001",
    "requested_display_name": "Test Critic",
    "bio": "I am a passionate film critic with 10+ years of experience...",
    "platform_links": [
      {"platform": "youtube", "url": "https://youtube.com/@testcritic"}
    ],
    "sample_review_urls": [
      "https://example.com/review1",
      "https://example.com/review2"
    ]
  }'
```

### Get Application Status
```bash
curl -X GET http://127.0.0.1:8000/api/v1/critic-verification/my-application \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List Applications (Admin)
```bash
curl -X GET http://127.0.0.1:8000/api/v1/critic-verification/admin/applications \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Approve Application (Admin)
```bash
curl -X PUT http://127.0.0.1:8000/api/v1/critic-verification/admin/applications/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "admin_notes": "Great application!"
  }'
```

### Create Review
```bash
curl -X POST http://127.0.0.1:8000/api/v1/critic-reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movie_id": 1,
    "title": "Inception Review",
    "content": "This is a great movie...",
    "numeric_rating": 9.5,
    "is_draft": false
  }'
```

### Get Critic Reviews by Movie
```bash
curl -X GET http://127.0.0.1:8000/api/v1/critic-reviews/movie/tmdb-1054867 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Expected Results

### ✅ Success Criteria
- [ ] User can enable critic role
- [ ] User is redirected to application form
- [ ] User can submit application
- [ ] Application status shows "pending"
- [ ] Admin can view applications
- [ ] Admin can approve/reject applications
- [ ] User can access dashboard after approval
- [ ] User can create and publish reviews
- [ ] Reviews appear on movie pages
- [ ] Critic profile displays correctly
- [ ] No mock data is shown anywhere

### ❌ Common Issues
- **"Application not found"** - User hasn't submitted application yet
- **"Movie not found"** - Movie ID format incorrect (use external_id like "tmdb-1054867")
- **"Unauthorized"** - JWT token expired or invalid
- **"Critic role not activated"** - User needs to enable critic role first

---

## Debugging Tips

1. **Check Browser Console**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for API calls

2. **Check Backend Logs**
   - Look for error messages in backend terminal
   - Check database logs for query errors

3. **Verify Database State**
   - Check `critic_verification_applications` table
   - Check `critic_profiles` table
   - Check `user_role_profiles` table

4. **Test API Directly**
   - Use cURL or Postman to test endpoints
   - Verify request/response format
   - Check authentication headers

---

## Performance Testing

### Load Testing
- Test with multiple concurrent applications
- Test with large review content
- Test with many reviews on movie page

### Caching
- Verify critic profiles are cached
- Verify dashboard stats are cached
- Check cache invalidation on updates

---

## Regression Testing

After implementation, verify:
- [ ] Existing user roles still work (Movie Lover, Talent, Industry Pro)
- [ ] User authentication still works
- [ ] Movie pages still load correctly
- [ ] Admin panel still functions
- [ ] No performance degradation

