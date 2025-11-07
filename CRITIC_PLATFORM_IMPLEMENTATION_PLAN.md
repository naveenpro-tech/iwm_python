# Critic Platform Implementation Plan

## Overview
This document outlines the comprehensive implementation plan for transforming Movie Madders into THE platform for professional movie critics. The plan covers all critic-specific features, API endpoints, database schema, frontend components, and testing strategy.

## Phase 1: Critic Verification Workflow ✅ COMPLETED

### Objectives
- Add verification/approval step before granting full critic access
- Prevent unauthorized critic profile creation
- Enable admin review and approval of critic applications

### Implementation Details

#### Frontend Components Created
1. **CriticApplicationForm** (`components/critic/application-form.tsx`)
   - Collects: username, display name, bio (min 100 chars), platform links (min 1), sample review URLs (2-5)
   - Validation: All fields required, URLs validated
   - Submission: POST to `/api/v1/critic-verification`

2. **Application Status Page** (`app/critic/application-status/page.tsx`)
   - Displays: Application status (pending/approved/rejected)
   - Shows: Timeline, admin notes, rejection reason
   - Actions: Link to dashboard if approved, back to settings

3. **Critic Application Page** (`app/critic/application/page.tsx`)
   - Entry point after user enables critic role
   - Redirects to application status after submission

#### Backend Endpoints (Already Implemented)
- `POST /api/v1/critic-verification` - Submit application
- `GET /api/v1/critic-verification/my-application` - Get user's application
- `GET /api/v1/critic-verification/admin/applications` - List all (admin)
- `PUT /api/v1/critic-verification/admin/applications/{id}` - Approve/reject (admin)

#### Workflow
1. User enables Critic role in Settings
2. System redirects to `/critic/application`
3. User completes and submits application form
4. Application status: "pending"
5. Admin reviews via `/admin/critic-applications`
6. Admin approves/rejects with notes
7. User redirected to `/critic/application-status`
8. If approved: User can access `/critic/dashboard`
9. If rejected: User can reapply

#### Files Modified
- `components/settings/RoleManagement.tsx` - Redirect to application on critic role activation
- `app/admin/critic-applications/page.tsx` - Fixed search filter bug (requested_display_name, requested_username)
- `app/critic/dashboard/page.tsx` - Added verification status check before showing dashboard

---

## Phase 2: Real-Time Data Integration (IN PROGRESS)

### Objectives
- Replace all mock data with real backend data
- Wire all pages to backend APIs
- Remove mock data generators
- Ensure no fallbacks to mock data

### API Client Functions Created

#### `lib/api/critic-verification.ts`
- `submitCriticApplication()` - Submit application
- `getMyApplication()` - Get user's application
- `checkApplicationStatus()` - Check if user has pending/approved application
- `listApplications()` - List all applications (admin)
- `approveCriticApplication()` - Approve application (admin)
- `rejectCriticApplication()` - Reject application (admin)

#### `lib/api/critic-reviews.ts` (NEW)
- `createCriticReview()` - Create review (draft or published)
- `getCriticReview()` - Get specific review
- `updateCriticReview()` - Update review
- `deleteCriticReview()` - Delete review
- `listReviewsByCritic()` - List reviews by critic username
- `listReviewsByMovie()` - List reviews by movie
- `getCriticDashboardStats()` - Get dashboard stats
- `listMyReviews()` - List current user's reviews
- `publishReview()` - Publish draft review
- `unpublishReview()` - Move review back to draft

### Frontend Pages Updated

#### `app/critic/dashboard/page.tsx`
- Added verification status check
- Fetches real data from `getCriticDashboardStats()`
- Fetches real reviews from `listMyReviews()`
- Fallback to mock data if API fails (temporary)

#### `app/critic/dashboard/create-review/page.tsx`
- `handleSaveDraft()` - Calls `createCriticReview()` with `is_draft=true`
- `handlePublish()` - Calls `createCriticReview()` with `is_draft=false`
- Validates movie selection and required fields
- Redirects to dashboard on success

#### `app/critic/[username]/page.tsx`
- Removed mock data fallback
- Shows error state instead of mock data
- Fetches real critic profile from backend

### Backend Fixes

#### `apps/backend/src/routers/critic_reviews.py`
- Fixed `GET /api/v1/critic-reviews/movie/{movie_id}` endpoint
- Now supports both internal movie ID and external_id (e.g., "tmdb-1054867")
- Looks up movie by external_id if integer parsing fails

#### `app/movies/[id]/reviews/page.tsx`
- Fetches critic reviews from `/api/v1/critic-reviews/movie/{movieId}`
- Displays critic reviews in Critics tab
- Handles API errors gracefully

### Mock Data Files (To Be Deleted)
- `lib/critic/mock-critic-profiles.ts`
- `lib/critic/mock-recommendations.ts`
- `lib/critic/mock-blog-posts.ts`
- `lib/critic/mock-pinned-content.ts`
- `lib/critic/mock-critic-analytics.ts`
- `lib/critic/mock-drafts.ts`
- `lib/critic/mock-ama.ts`

---

## Phase 3: Critic Studio Features (PLANNED)

### Objectives
- Implement full review creation and management
- Add blog post management
- Add recommendations management
- Add pinned content management
- Add affiliate link management

### Pages to Create/Update
1. **Create Review** (`app/critic/dashboard/create-review/page.tsx`)
   - Movie search with autocomplete
   - Rich text editor for review content
   - Rating selector (1-10)
   - YouTube video embedding
   - Tags input
   - Save draft / Publish buttons
   - Image upload for cover

2. **Edit Review** (`app/critic/dashboard/edit-review/[id]/page.tsx`)
   - Load existing review data
   - Update and republish
   - Delete option

3. **Blog Management** (`app/critic/dashboard/blog/page.tsx`)
   - List blog posts (drafts and published)
   - Create new blog post
   - Edit existing blog post
   - Markdown editor
   - Cover image upload
   - Tags and categories

4. **Recommendations** (`app/critic/dashboard/recommendations/page.tsx`)
   - 8 types: Underrated, Overrated, Hidden Gem, Masterpiece, Guilty Pleasure, Cult Classic, Sleeper Hit, Timeless
   - Create/edit/delete recommendations
   - Display on critic profile

5. **Pinned Content** (`app/critic/dashboard/pinned/page.tsx`)
   - Pin/unpin reviews, blog posts, recommendations
   - Reorder pinned items
   - Max 5 pinned items

6. **Affiliate Links** (`app/critic/dashboard/affiliate/page.tsx`)
   - Manage affiliate links
   - Track clicks and conversions
   - Link to streaming platforms

### Backend Endpoints Needed
- `POST /api/v1/critic-blog` - Create blog post
- `GET /api/v1/critic-blog` - List blog posts
- `GET /api/v1/critic-blog/{id}` - Get blog post
- `PUT /api/v1/critic-blog/{id}` - Update blog post
- `DELETE /api/v1/critic-blog/{id}` - Delete blog post

- `POST /api/v1/critic-recommendations` - Create recommendation
- `GET /api/v1/critic-recommendations` - List recommendations
- `PUT /api/v1/critic-recommendations/{id}` - Update recommendation
- `DELETE /api/v1/critic-recommendations/{id}` - Delete recommendation

- `POST /api/v1/critic-pinned` - Pin content
- `GET /api/v1/critic-pinned` - List pinned content
- `DELETE /api/v1/critic-pinned/{id}` - Unpin content
- `PUT /api/v1/critic-pinned/{id}/reorder` - Reorder pinned items

- `POST /api/v1/critic-affiliate` - Create affiliate link
- `GET /api/v1/critic-affiliate` - List affiliate links
- `PUT /api/v1/critic-affiliate/{id}` - Update affiliate link
- `DELETE /api/v1/critic-affiliate/{id}` - Delete affiliate link

---

## Phase 4: Critic Profile Features (PLANNED)

### Objectives
- Display real critic profile data
- Show reviews, blog posts, recommendations
- Display analytics and statistics
- Show verified badge and social links

### Pages to Update
1. **Critic Profile** (`app/critic/[username]/page.tsx`)
   - Hero section with avatar, bio, verified badge
   - Tabbed layout: Reviews, Blog, Recommendations, Filmography
   - Sidebar: Followers, Following, Analytics
   - Pinned content section
   - AMA section

2. **Critics Directory** (`app/critics/page.tsx`)
   - List all verified critics
   - Search and filter
   - Sort by followers, reviews, newest
   - Follow/unfollow buttons

### Backend Endpoints Needed
- `GET /api/v1/critics/{username}` - Get critic profile (already exists)
- `GET /api/v1/critics/{username}/reviews` - Get critic's reviews
- `GET /api/v1/critics/{username}/blog` - Get critic's blog posts
- `GET /api/v1/critics/{username}/recommendations` - Get critic's recommendations
- `GET /api/v1/critics/{username}/stats` - Get critic's statistics
- `GET /api/v1/critics/{username}/followers` - Get followers
- `GET /api/v1/critics/{username}/following` - Get following

---

## Phase 5: Testing Strategy

### Unit Tests
- Critic verification workflow
- Review CRUD operations
- Blog post management
- Recommendation management
- Affiliate link tracking

### Integration Tests
- End-to-end critic application workflow
- Review creation and publishing
- Movie review display on movie pages
- Critic profile display

### E2E Tests (Playwright)
- User enables critic role
- User submits application
- Admin approves application
- User creates and publishes review
- Review appears on movie page
- Critic profile displays correctly

### Test Files to Create
- `tests/e2e/critic-verification.spec.ts`
- `tests/e2e/critic-review-creation.spec.ts`
- `tests/e2e/critic-profile.spec.ts`
- `tests/api/critic-reviews.test.ts`
- `tests/api/critic-verification.test.ts`

---

## Phase 6: Performance & Optimization

### Caching Strategy
- Cache critic profiles (5 min TTL)
- Cache critic reviews (1 min TTL)
- Cache critics directory (10 min TTL)
- Cache dashboard stats (1 min TTL)

### Database Indexes
- `critic_profiles(username)` - For profile lookups
- `critic_reviews(critic_id, published_at)` - For listing reviews
- `critic_reviews(movie_id, published_at)` - For movie reviews
- `critic_verification_applications(status, submitted_at)` - For admin listing

### Frontend Optimization
- Lazy load critic profile tabs
- Paginate reviews and blog posts
- Image optimization for avatars and covers
- Code splitting for critic studio pages

---

## Success Criteria

✅ **Phase 1 Complete:**
- User cannot access Critic Dashboard until admin approves application
- Application workflow fully functional
- Admin panel working correctly

⏳ **Phase 2 In Progress:**
- No mock data anywhere in critic features
- All pages fetch real backend data
- Critic reviews appear on movie detail pages
- All CRUD operations work with real backend

⏳ **Phase 3 Planned:**
- Critic studio fully functional
- Blog, recommendations, pinned content working
- Affiliate links tracking

⏳ **Phase 4 Planned:**
- Critic profiles display real data
- Critics directory fully functional
- Analytics and statistics working

⏳ **Phase 5 Planned:**
- All tests passing
- E2E tests covering all workflows
- Performance benchmarks met

---

## Timeline Estimate

- **Phase 1:** ✅ 2 days (COMPLETED)
- **Phase 2:** 3-4 days (IN PROGRESS)
- **Phase 3:** 5-7 days
- **Phase 4:** 3-4 days
- **Phase 5:** 3-4 days
- **Phase 6:** 2-3 days

**Total:** ~18-25 days for full implementation

---

## Next Steps

1. ✅ Implement critic verification workflow
2. ⏳ Complete real-time data integration (Phase 2)
3. ⏳ Implement critic studio features (Phase 3)
4. ⏳ Update critic profile features (Phase 4)
5. ⏳ Create comprehensive test suite (Phase 5)
6. ⏳ Performance optimization (Phase 6)

