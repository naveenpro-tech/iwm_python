# Critical Issues Implementation Plan

**Date:** 2025-11-02  
**Priority Order:** Issue 1 → Issue 2 → Issue 4

---

## Issue 1: Tab Availability Mismatch ⚠️ HIGH PRIORITY

### Problem 1A: Scenes Tab Missing from Admin
**Current State:**
- ✅ Public page exists: `app/movies/[id]/scenes/page.tsx`
- ❌ Admin tab missing: No Scenes tab in `app/admin/movies/[id]/page.tsx`
- ✅ Backend API exists: `/api/v1/scene-explorer/by-movie/{id}`

**Solution:**
1. Add Scenes tab to admin movie detail page
2. Create `MovieScenesForm` component for admin data entry
3. Add export/import buttons for scenes category
4. Implement backend import/export endpoints for scenes

**Files to Modify:**
- `app/admin/movies/[id]/page.tsx` - Add Scenes tab
- Create `components/admin/movies/forms/movie-scenes-form.tsx`
- `apps/backend/src/routers/movie_export_import.py` - Add scenes endpoints

### Problem 1B: Awards Tab Missing from Public
**Current State:**
- ✅ Admin tab exists: Awards tab in `app/admin/movies/[id]/page.tsx`
- ❌ Public page missing: No `app/movies/[id]/awards/page.tsx`
- ✅ Backend API exists: Awards data in `/api/v1/movies/{id}`

**Solution:**
1. Create public awards page: `app/movies/[id]/awards/page.tsx`
2. Add Awards tab to public navigation
3. Create awards display component

**Files to Create:**
- `app/movies/[id]/awards/page.tsx`
- `components/movie-awards-section.tsx` (display component)

**Files to Modify:**
- `components/movie-details-navigation.tsx` - Add Awards tab

---

## Issue 2: Public Pages Using Static Content ⚠️ MEDIUM PRIORITY

### Analysis Results:
After reviewing the code, I found that:

**✅ Trivia Page (`app/movies/[id]/trivia/page.tsx`):**
- **DOES** fetch from database (lines 134-175)
- Properly converts backend format to frontend format
- Falls back to mock data only if fetch fails
- **Status:** WORKING CORRECTLY

**✅ Timeline Page (`app/movies/[id]/timeline/page.tsx`):**
- **DOES** fetch from database (lines 235-272)
- Properly converts backend format to frontend format
- Falls back to mock data only if fetch fails
- **Status:** WORKING CORRECTLY

**✅ Scenes Page (`app/movies/[id]/scenes/page.tsx`):**
- **DOES** fetch from database (lines 42-75)
- Properly handles empty state
- **Status:** WORKING CORRECTLY

### Conclusion:
**Issue 2 is NOT a problem!** All public pages are properly connected to the database. The mock data is only used as a fallback when:
1. The API request fails
2. The database has no data for that movie

This is actually **good design** - it provides a better user experience than showing empty pages.

**Action Required:** NONE - This is working as intended.

---

## Issue 4: Missing Admin Navigation ⚠️ LOW PRIORITY

### Problem: TMDB Dashboard Not in Sidebar
**Current State:**
- ✅ Route exists: `app/admin/tmdb-dashboard/page.tsx`
- ❌ Not in sidebar: `components/admin/navigation/admin-sidebar.tsx`

**Solution:**
Add TMDB Dashboard to admin sidebar navigation

**Files to Modify:**
- `components/admin/navigation/admin-sidebar.tsx`

---

## Implementation Order

### Phase 1: Add Awards to Public (Priority 1B)
**Estimated Time:** 30 minutes

1. Create `app/movies/[id]/awards/page.tsx`
2. Create `components/movie-awards-section.tsx`
3. Update `components/movie-details-navigation.tsx`

### Phase 2: Add Scenes to Admin (Priority 1A)
**Estimated Time:** 45 minutes

1. Create `components/admin/movies/forms/movie-scenes-form.tsx`
2. Update `app/admin/movies/[id]/page.tsx`
3. Add scenes export/import endpoints to backend

### Phase 3: Add TMDB Dashboard to Navigation (Priority 4)
**Estimated Time:** 5 minutes

1. Update `components/admin/navigation/admin-sidebar.tsx`

---

## Expected Outcomes

### After Phase 1:
- ✅ Awards tab visible on public movie pages
- ✅ Users can view awards data
- ✅ Consistent with other public tabs (Timeline, Trivia, Cast)

### After Phase 2:
- ✅ Scenes tab visible in admin movie detail page
- ✅ Admins can add/edit scene data
- ✅ Scenes export/import functionality
- ✅ Consistent with other admin tabs

### After Phase 3:
- ✅ TMDB Dashboard accessible from sidebar
- ✅ All admin routes have navigation buttons
- ✅ Improved admin UX

---

## Files Summary

### Files to Create (3):
1. `app/movies/[id]/awards/page.tsx`
2. `components/movie-awards-section.tsx`
3. `components/admin/movies/forms/movie-scenes-form.tsx`

### Files to Modify (3):
1. `components/movie-details-navigation.tsx`
2. `app/admin/movies/[id]/page.tsx`
3. `components/admin/navigation/admin-sidebar.tsx`

### Backend Files to Modify (1):
1. `apps/backend/src/routers/movie_export_import.py`

---

**Total Estimated Time:** 1 hour 20 minutes

**Start Time:** Now  
**Expected Completion:** Within 2 hours

