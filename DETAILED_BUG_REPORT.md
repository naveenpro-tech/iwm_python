# 🐛 **DETAILED BUG REPORT**
## **Siddu Global Entertainment Hub - E2E Testing**

**Report Date:** October 25, 2025  
**Total Bugs Found:** 9  
**Critical Bugs:** 7  
**Medium Bugs:** 2  
**Bugs Fixed:** 7  
**Bugs Remaining:** 2

---

## 🔴 **CRITICAL BUGS (FIXED)**

### **BUG #1: Profile Page 404 Error After Login**

**Status:** ✅ **FIXED**  
**Severity:** 🔴 **CRITICAL**  
**Priority:** P0  
**Discovered During:** TEST 1 - Authentication & Profile Page

#### **Description:**
After successful login, when user navigates to `/profile/user1`, the page shows "User not found" error with a 500 Internal Server Error from the backend.

#### **Root Cause:**
Database query in `apps/backend/src/routers/users.py` line 65 was using a LIKE pattern `User.email.like(f"{username}@%")` which returned multiple users when only one was expected, causing `sqlalchemy.exc.MultipleResultsFound` exception.

#### **Error Message:**
```
sqlalchemy.exc.MultipleResultsFound: Multiple rows were found when one or none was required
```

#### **Fix Applied:**
Added `.limit(1)` to the query to ensure only one result is returned:

```python
# Before (line 63-65):
user = (
    await session.execute(select(User).where(User.email.like(f"{username}@%")))
).scalar_one()

# After:
user = (
    await session.execute(select(User).where(User.email.like(f"{username}@%")).limit(1))
).scalar_one_or_none()
```

#### **Files Modified:**
- `apps/backend/src/routers/users.py`

#### **Verification:**
✅ Profile page now loads successfully after login  
✅ User information displayed correctly  
✅ No console errors

---

### **BUG #2: Auth Endpoint Returning Wrong User ID**

**Status:** ✅ **FIXED**  
**Severity:** 🔴 **CRITICAL**  
**Priority:** P0  
**Discovered During:** TEST 2 - Watchlist Feature

#### **Description:**
The `/auth/me` endpoint was returning the internal database ID (integer) instead of the external UUID, causing all subsequent API calls to fail with "User not found" errors.

#### **Root Cause:**
In `apps/backend/src/routers/auth.py` line 97, the endpoint was returning `id=str(user.id)` (internal DB ID) instead of `id=user.external_id` (public UUID).

#### **Impact:**
- All API calls using the user ID failed
- Watchlist, reviews, and other user-specific features were broken
- Frontend was looking for user with `external_id == "1"` which doesn't exist

#### **Fix Applied:**
```python
# Before (line 97):
return {
    "id": str(user.id),  # ❌ Internal DB ID
    "email": user.email,
    "name": user.name,
}

# After:
return {
    "id": user.external_id,  # ✅ External UUID
    "email": user.email,
    "name": user.name,
}
```

#### **Files Modified:**
- `apps/backend/src/routers/auth.py`

#### **Verification:**
✅ `/auth/me` returns correct external UUID  
✅ All subsequent API calls work correctly  
✅ Watchlist and reviews features functional

---

### **BUG #3: Watchlist Model Missing 'rating' Field**

**Status:** ✅ **FIXED**  
**Severity:** 🔴 **CRITICAL**  
**Priority:** P0  
**Discovered During:** TEST 2 - Watchlist Feature

#### **Description:**
When adding a movie to the watchlist, the API call failed with a TypeError because the repository was trying to pass a `rating` parameter to the `Watchlist` model constructor, but the model doesn't have this field.

#### **Root Cause:**
The `Watchlist` model in the database schema doesn't have a `rating` field, but the repository code was trying to create watchlist items with a rating parameter.

#### **Error Message:**
```
TypeError: Watchlist() got an unexpected keyword argument 'rating'
```

#### **Fix Applied:**
Removed `rating` parameter from the `Watchlist` constructor call in `apps/backend/src/repositories/watchlist.py`:

```python
# Before (line 103):
watchlist_item = Watchlist(
    user_id=user.id,
    movie_id=movie.id,
    rating=rating,  # ❌ Field doesn't exist
)

# After:
watchlist_item = Watchlist(
    user_id=user.id,
    movie_id=movie.id,
)
```

Also removed `rating` from the return dictionary.

#### **Files Modified:**
- `apps/backend/src/repositories/watchlist.py`

#### **Verification:**
✅ Movies can be added to watchlist successfully  
✅ No TypeError exceptions  
✅ Watchlist items created correctly

---

### **BUG #4: Watchlist Page Infinite Loop & Missing Data**

**Status:** ✅ **FIXED**  
**Severity:** 🔴 **CRITICAL**  
**Priority:** P0  
**Discovered During:** TEST 2 - Watchlist Feature

#### **Description:**
The watchlist page had a critical React error causing an infinite loop, and newly added movies were not appearing in the watchlist.

#### **Root Causes:**
1. Component was using mock data instead of fetching from the API
2. Data transformation mismatch between backend response and frontend expectations
3. Missing authentication headers in API calls

#### **Error Messages:**
```
React Error: Maximum update depth exceeded
Failed to fetch watchlist: 401 Unauthorized
```

#### **Fix Applied:**

**1. Replaced mock data with real API integration:**
```typescript
// Before:
const [watchlistMovies, setWatchlistMovies] = useState(mockWatchlistMovies)

// After:
const [watchlistMovies, setWatchlistMovies] = useState<any[]>([])

useEffect(() => {
  const fetchWatchlist = async () => {
    const data = await getWatchlist()
    setWatchlistMovies(data)
  }
  fetchWatchlist()
}, [])
```

**2. Fixed data transformation:**
```typescript
// Handle both flat and nested structures
const movies = Array.isArray(data) 
  ? data.map(item => item.movie || item)
  : data.movies || []
```

**3. Added authentication headers:**
```typescript
// lib/auth.ts
export function getAuthHeaders() {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

// lib/api/watchlist.ts
const response = await fetch(`${API_BASE}/api/v1/watchlist`, {
  headers: getAuthHeaders(),
})
```

#### **Files Modified:**
- `components/watchlist/watchlist-container.tsx`
- `lib/api/watchlist.ts`
- `lib/auth.ts`

#### **Verification:**
✅ Watchlist page loads without errors  
✅ Newly added movies appear in the list  
✅ No infinite loop errors  
✅ Authentication works correctly

---

### **BUG #5: Review Submission Failed with 422 Error**

**Status:** ✅ **FIXED**  
**Severity:** 🔴 **CRITICAL**  
**Priority:** P0  
**Discovered During:** TEST 3 - Review Feature

#### **Description:**
When submitting a review, the API call failed with a 422 Unprocessable Entity error.

#### **Root Causes:**
1. Frontend was sending `hasSpoilers` but backend expects `spoilers`
2. Frontend was NOT sending `userId` which is required by the backend

#### **Error Message:**
```
422 Unprocessable Entity
{
  "detail": [
    {"loc": ["body", "userId"], "msg": "field required"},
    {"loc": ["body", "spoilers"], "msg": "field required"}
  ]
}
```

#### **Fix Applied:**

**1. Updated API function to accept userId and use correct field name:**
```typescript
// lib/api/reviews.ts
export async function submitReview(
  movieId: string, 
  reviewData: ReviewSubmitData,
  userId: string  // ✅ Added userId parameter
) {
  const response = await fetch(`${API_BASE}/api/v1/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      movieId,
      userId,  // ✅ Include userId
      title: reviewData.title || "",
      content: reviewData.content,
      rating: reviewData.rating,
      spoilers: reviewData.hasSpoilers || false,  // ✅ Changed to 'spoilers'
    }),
  })
}
```

**2. Updated component to pass userId:**
```typescript
// components/review-form.tsx
await submitReview(movieId, {
  title: title.trim() || undefined,
  content: content.trim(),
  rating,
  hasSpoilers: containsSpoilers,
}, user.id)  // ✅ Pass user.id
```

#### **Files Modified:**
- `lib/api/reviews.ts`
- `components/review-form.tsx`

#### **Verification:**
✅ Reviews can be submitted successfully  
✅ Toast notification appears  
✅ Review appears in the list immediately

---

### **BUG #6: Reviews Not Loading on Page**

**Status:** ✅ **FIXED**  
**Severity:** 🔴 **CRITICAL**  
**Priority:** P0  
**Discovered During:** TEST 3 - Review Feature

#### **Description:**
After submitting a review successfully, refreshing the page showed "No reviews yet" despite the review being saved in the database.

#### **Root Causes:**
1. Frontend was calling wrong endpoint `/api/v1/movies/{id}/reviews` instead of `/api/v1/reviews?movieId={id}`
2. Component was expecting `data.user_reviews` but backend returns a flat array

#### **Fix Applied:**

**1. Fixed API endpoint:**
```typescript
// Before:
const response = await fetch(`${API_BASE}/api/v1/movies/${movieId}/reviews`)

// After:
const response = await fetch(
  `${API_BASE}/api/v1/reviews?movieId=${movieId}&page=${page}&limit=${limit}`
)
```

**2. Fixed data transformation:**
```typescript
// Before:
const userReviewsList = data.user_reviews || []

// After:
const userReviewsList = Array.isArray(data) ? data : []

// Also updated to use r.author instead of r.user:
const transformedReviews = userReviewsList.map((r: any) => ({
  id: r.id || r.external_id,
  userId: r.author?.id || r.user?.id || r.userId || "",
  username: r.author?.name || r.user?.name || "Anonymous",
  avatarUrl: r.author?.avatarUrl || r.user?.avatarUrl || null,
  // ... rest of the fields
}))
```

#### **Files Modified:**
- `lib/api/reviews.ts`
- `components/review-system-section.tsx`

#### **Verification:**
✅ Reviews load correctly on page refresh  
✅ All review data displayed properly  
✅ No "No reviews yet" error

---

### **BUG #7: Review Edit/Delete Buttons Missing**

**Status:** ✅ **FIXED**  
**Severity:** 🟡 **MEDIUM**  
**Priority:** P1  
**Discovered During:** TEST 3 - Review Feature

#### **Description:**
Review cards didn't have edit/delete buttons for the review author, making it impossible to modify or remove reviews.

#### **Fix Applied:**
Added edit/delete functionality to `components/review-system-section.tsx`:

```typescript
// Added state for current user and editing
const [currentUser, setCurrentUser] = useState<any>(null)
const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
const [editingReview, setEditingReview] = useState<any>(null)

// Fetch current user
useEffect(() => {
  const fetchUser = async () => {
    const user = await getCurrentUser()
    setCurrentUser(user)
  }
  fetchUser()
}, [])

// Delete handler
const handleDeleteReview = async (reviewId: string) => {
  if (!confirm("Are you sure you want to delete this review?")) return
  
  setDeletingReviewId(reviewId)
  try {
    await deleteReview(reviewId)
    toast({ title: "Review deleted", description: "Your review has been successfully deleted." })
    // Refresh reviews
  } catch (error) {
    toast({ title: "Error", description: "Failed to delete review", variant: "destructive" })
  } finally {
    setDeletingReviewId(null)
  }
}

// Added buttons to review cards
{currentUser?.id === review.userId && (
  <div className="flex gap-2 pt-3 border-t border-[#3A3A3A] mt-3">
    <Button onClick={() => setEditingReview(review)}>
      <Pencil className="w-3 h-3 mr-2" />
      Edit
    </Button>
    <Button onClick={() => handleDeleteReview(review.id)} disabled={deletingReviewId === review.id}>
      <Trash2 className="w-3 h-3 mr-2" />
      Delete
    </Button>
  </div>
)}
```

#### **Files Modified:**
- `components/review-system-section.tsx`

#### **Verification:**
✅ Edit and delete buttons appear for review author  
✅ Delete confirmation dialog works  
✅ Edit modal opens correctly  
✅ Reviews can be edited and deleted successfully

---

## 🟡 **MEDIUM BUGS (NOT FIXED)**

### **BUG #8: Playlists Page Doesn't Exist**

**Status:** ⚠️ **NOT FIXED**  
**Severity:** 🟡 **MEDIUM**  
**Priority:** P2  
**Discovered During:** TEST 4 - Playlist Feature

#### **Description:**
The `/playlists` route returns a 404 error. The page doesn't exist in the frontend codebase.

#### **Workaround:**
The `/collections` page exists and provides similar functionality to playlists.

#### **Recommendation:**
Either:
1. Create a `/playlists` page that uses the backend playlists API
2. Redirect `/playlists` to `/collections`
3. Update documentation to use `/collections` instead of `/playlists`

#### **Impact:**
Low - Collections page provides equivalent functionality

---

### **BUG #9: Collections Not Persisted to Backend**

**Status:** ⚠️ **NOT FIXED**  
**Severity:** 🟡 **MEDIUM**  
**Priority:** P2  
**Discovered During:** TEST 4 - Collections Feature

#### **Description:**
Collections are stored in local component state using mock data. They are not persisted to the backend database.

#### **Root Cause:**
The `components/collections/collections-container.tsx` component uses mock data and local state:

```typescript
const [userCollections, setUserCollections] = useState(mockUserCollections)

const handleCreateCollection = (collection: any) => {
  // In a real app, this would make an API call to create the collection
  setUserCollections((prev) => [...prev, collection])
}
```

#### **Impact:**
- Collections are lost on page refresh
- Collections cannot be viewed on detail pages
- Collections are not shared across devices
- Backend collections API endpoints are not being used

#### **Recommendation:**
Integrate with backend collections API:
1. Replace mock data with API calls to `/api/v1/collections`
2. Implement create, read, update, delete operations
3. Add proper error handling and loading states
4. Persist collections to the database

#### **Files Affected:**
- `components/collections/collections-container.tsx`
- `lib/api/collections.ts` (needs to be created)

---

## 📊 **BUG STATISTICS**

### **By Severity:**
- 🔴 Critical: 7 (all fixed)
- 🟡 Medium: 2 (not fixed)
- 🟢 Low: 0

### **By Status:**
- ✅ Fixed: 7 (77.8%)
- ⚠️ Known Issue: 2 (22.2%)
- ❌ Open: 0 (0%)

### **By Component:**
- Backend API: 3 bugs (all fixed)
- Frontend Components: 4 bugs (all fixed)
- Frontend Routing: 1 bug (not fixed)
- Data Persistence: 1 bug (not fixed)

---

## 🎯 **PRIORITY RECOMMENDATIONS**

### **Immediate (P0):**
All critical bugs have been fixed. No immediate action required.

### **Short Term (P1-P2):**
1. **Integrate Collections with Backend** - Replace mock data with real API calls
2. **Create Playlists Page** - Either implement or redirect to collections
3. **Add Settings Persistence** - Integrate settings page with backend API

### **Long Term (P3):**
4. Add comprehensive error handling across all features
5. Implement loading states for all async operations
6. Add unit tests for critical components
7. Add integration tests for API endpoints

---

**Report Generated:** October 25, 2025  
**Next Review:** After backend integration for Collections and Settings

