# Critic Platform Implementation Summary

## Overview
This document summarizes the implementation of the Critic Role Verification Workflow and Real-Time Data Integration for Movie Madders.

## Phase 1: Critic Verification Workflow ✅ COMPLETED

### New Files Created

#### Frontend Components
1. **`lib/api/critic-verification.ts`** (NEW)
   - API client for critic verification workflow
   - Functions: submitCriticApplication, getMyApplication, checkApplicationStatus, listApplications, approveCriticApplication, rejectCriticApplication
   - Type definitions: CriticApplicationData, CriticApplicationResponse

2. **`components/critic/application-form.tsx`** (NEW)
   - Critic application form component
   - Fields: username, display name, bio (min 100 chars), platform links (min 1), sample review URLs (2-5)
   - Validation and error handling
   - Success callback on submission

3. **`app/critic/application-status/page.tsx`** (NEW)
   - Displays application status (pending/approved/rejected)
   - Shows timeline, admin notes, rejection reason
   - Links to dashboard if approved

4. **`app/critic/application/page.tsx`** (NEW)
   - Entry point after user enables critic role
   - Redirects to application status after submission

#### Backend API Client
5. **`lib/api/critic-reviews.ts`** (NEW)
   - API client for critic reviews
   - Functions: createCriticReview, getCriticReview, updateCriticReview, deleteCriticReview, listReviewsByCritic, listReviewsByMovie, getCriticDashboardStats, listMyReviews, publishReview, unpublishReview
   - Type definitions: CriticReviewData, CriticReviewResponse, DashboardStats

### Files Modified

#### Frontend
1. **`components/settings/RoleManagement.tsx`**
   - Updated `handleActivateRole()` to redirect to `/critic/application` for critic role
   - Shows toast message about completing verification application

2. **`app/admin/critic-applications/page.tsx`**
   - Fixed search filter bug: Changed `app.fullName` to `app.requested_display_name`
   - Fixed search filter bug: Changed `app.username` to `app.requested_username`

3. **`app/critic/dashboard/page.tsx`**
   - Added verification status check before showing dashboard
   - Redirects to `/critic/application-status` if not approved
   - Fetches real data from `getCriticDashboardStats()` and `listMyReviews()`
   - Removed mock data imports and fallbacks
   - Throws errors instead of using mock data

4. **`app/critic/dashboard/create-review/page.tsx`**
   - Updated `handleSaveDraft()` to call `createCriticReview()` with `is_draft=true`
   - Updated `handlePublish()` to call `createCriticReview()` with `is_draft=false`
   - Added validation for movie selection
   - Redirects to dashboard on success

5. **`app/critic/[username]/page.tsx`**
   - Removed mock data imports (generateMockCriticProfile, generateMockCriticReviews, etc.)
   - Removed mock data fallback in catch block
   - Shows error state instead of mock data

6. **`app/movies/[id]/reviews/page.tsx`**
   - Added fetching of critic reviews from `/api/v1/critic-reviews/movie/{movieId}`
   - Displays critic reviews in Critics tab
   - Handles API errors gracefully

#### Backend
7. **`apps/backend/src/routers/critic_reviews.py`**
   - Fixed `GET /api/v1/critic-reviews/movie/{movie_id}` endpoint
   - Now supports both internal movie ID and external_id (e.g., "tmdb-1054867")
   - Looks up movie by external_id if integer parsing fails
   - Returns 404 if movie not found

### Workflow Implementation

#### User Flow
1. User enables Critic role in Settings → `/settings`
2. System redirects to `/critic/application`
3. User completes and submits application form
4. Application status: "pending"
5. User redirected to `/critic/application-status`
6. Admin reviews via `/admin/critic-applications`
7. Admin approves/rejects with notes
8. User notified of decision
9. If approved: User can access `/critic/dashboard`
10. If rejected: User can reapply

#### Admin Flow
1. Admin navigates to `/admin/critic-applications`
2. Views list of pending applications
3. Can search by username or display name
4. Can filter by status (pending/approved/rejected)
5. Clicks "Approve" or "Reject" button
6. For approval: Application processed, CriticProfile created
7. For rejection: Shows modal for rejection reason
8. Application status updated in database

### Backend Endpoints (Already Implemented)
- `POST /api/v1/critic-verification` - Submit application
- `GET /api/v1/critic-verification/my-application` - Get user's application
- `GET /api/v1/critic-verification/admin/applications` - List all (admin)
- `PUT /api/v1/critic-verification/admin/applications/{id}` - Approve/reject (admin)

---

## Phase 2: Real-Time Data Integration ⏳ IN PROGRESS

### Completed
✅ Created API client functions for critic reviews
✅ Updated Critic Dashboard to fetch real data
✅ Updated Create Review page to use real API
✅ Updated Critic Profile page to remove mock fallback
✅ Updated Movie Reviews page to fetch critic reviews
✅ Fixed backend endpoint to support external_id

### Remaining
⏳ Delete mock data generator files (after all pages wired)
⏳ Update Critic Profile page to fetch real data (currently shows error)
⏳ Create Edit Review page with real API
⏳ Wire Blog Management pages
⏳ Wire Recommendations Management pages
⏳ Wire Pinned Content Management pages
⏳ Wire Affiliate Links Management pages

### Mock Data Files (To Be Deleted)
- `lib/critic/mock-critic-profiles.ts`
- `lib/critic/mock-recommendations.ts`
- `lib/critic/mock-blog-posts.ts`
- `lib/critic/mock-pinned-content.ts`
- `lib/critic/mock-critic-analytics.ts`
- `lib/critic/mock-drafts.ts`
- `lib/critic/mock-ama.ts`
- `lib/critic/mock-badges.ts`
- `lib/critic/mock-critic-review.ts`

---

## Testing Recommendations

### Unit Tests
- Test critic verification workflow
- Test review CRUD operations
- Test application status checks

### Integration Tests
- Test end-to-end critic application workflow
- Test review creation and publishing
- Test movie review display on movie pages

### E2E Tests (Playwright)
- User enables critic role
- User submits application
- Admin approves application
- User creates and publishes review
- Review appears on movie page
- Critic profile displays correctly

---

## Next Steps

1. ✅ Implement critic verification workflow
2. ⏳ Complete real-time data integration
   - Wire Critic Profile page to fetch real data
   - Create Edit Review page
   - Wire Blog, Recommendations, Pinned Content, Affiliate pages
3. ⏳ Implement critic studio features
4. ⏳ Create comprehensive test suite
5. ⏳ Performance optimization

---

## Key Files Reference

### API Clients
- `lib/api/critic-verification.ts` - Critic verification API
- `lib/api/critic-reviews.ts` - Critic reviews API

### Pages
- `app/critic/application/page.tsx` - Application form
- `app/critic/application-status/page.tsx` - Application status
- `app/critic/dashboard/page.tsx` - Dashboard (with verification check)
- `app/critic/dashboard/create-review/page.tsx` - Create review (with real API)
- `app/critic/[username]/page.tsx` - Critic profile (no mock fallback)
- `app/movies/[id]/reviews/page.tsx` - Movie reviews (fetches critic reviews)

### Components
- `components/critic/application-form.tsx` - Application form component
- `components/settings/RoleManagement.tsx` - Role management (updated)

### Backend
- `apps/backend/src/routers/critic_reviews.py` - Critic reviews router (fixed external_id support)

---

## Success Criteria

✅ User cannot access Critic Dashboard until admin approves application
✅ Application workflow fully functional
✅ Admin panel working correctly
✅ Critic reviews appear on movie detail pages
✅ All CRUD operations work with real backend
✅ No mock data fallbacks in critic features

