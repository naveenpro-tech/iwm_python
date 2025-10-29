# OVERVIEW TAB - STEP 1: DEEP CODE ANALYSIS

**Date:** 2025-10-29  
**Tab:** Overview Tab (Activity Feed)  
**Status:** Analysis Complete

---

## ROOT CAUSE IDENTIFICATION

### Current Implementation (Broken)

**File:** `components/profile/activity-feed.tsx` (lines 31-101)

```typescript
useEffect(() => {
  const fetchActivities = async () => {
    setIsLoading(true)
    
    // Mock data - in a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const mockActivities: ActivityItem[] = [
      { id: "a1", type: "review", timestamp: "2 hours ago", ... },
      { id: "a2", type: "watchlist", timestamp: "Yesterday", ... },
      // ... 3 more hardcoded items
    ]
    
    setActivities(mockActivities)
    setIsLoading(false)
  }
  
  fetchActivities()
}, [userId])
```

**Problems:**
1. ❌ Uses `setTimeout(1000)` to simulate API call
2. ❌ Hardcoded 5 mock activities
3. ❌ `userId` parameter passed but NOT USED
4. ❌ Never calls real API endpoint
5. ❌ No error handling

---

## EXISTING API INFRASTRUCTURE

### Frontend API Client

**File:** `lib/api/profile.ts` (lines 171-203)

**Function:** `getUserActivity(userId, page, limit)`

```typescript
export async function getUserActivity(userId: string, page: number = 1, limit: number = 20) {
  try {
    // Combines recent reviews and watchlist additions
    const [reviews, watchlist] = await Promise.all([
      getUserReviews(userId, 1, 10),
      getUserWatchlist(userId, 1, 10),
    ])
    
    // Transforms into activity feed format
    const activities = [
      ...reviews.map((review: any) => ({
        id: `review-${review.id}`,
        type: "review",
        timestamp: review.createdAt || review.date,
        data: review,
      })),
      ...watchlist.map((item: any) => ({
        id: `watchlist-${item.id}`,
        type: "watchlist",
        timestamp: item.dateAdded,
        data: item,
      })),
    ]
    
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return activities.slice(0, limit)
  } catch (error) {
    console.error("Error fetching user activity:", error)
    return []
  }
}
```

**Status:** ✅ Function EXISTS but component doesn't use it!

### Backend Endpoints

**Reviews Endpoint:** `GET /api/v1/reviews?userId={userId}`
- ✅ Exists in `apps/backend/src/routers/reviews.py`
- ✅ Returns reviews with movie data
- ✅ Supports pagination

**Watchlist Endpoint:** `GET /api/v1/watchlist?userId={userId}`
- ✅ Exists in `apps/backend/src/routers/watchlist.py`
- ✅ Returns watchlist items with movie data
- ✅ Supports pagination

**Status:** ✅ Both endpoints exist and work!

---

## DATA STRUCTURE ANALYSIS

### Review Data Format (from backend)

```typescript
{
  id: string                    // external_id
  title: string
  content: string
  rating: number               // 0-10
  date: string                 // ISO timestamp
  hasSpoilers: boolean
  isVerified: boolean
  helpfulVotes: number
  unhelpfulVotes: number
  commentCount: number
  engagementScore: number
  mediaUrls: string[]
  author: {
    id: string
    name: string
    avatarUrl: string
  }
  movie: {
    id: string
    title: string
    posterUrl: string
    year: number
    genres: string[]
    country: string
    language: string
  }
}
```

### Watchlist Data Format (from backend)

```typescript
{
  id: string                    // external_id
  movieId: string
  userId: string
  status: "want-to-watch" | "watching" | "watched"
  priority: "low" | "medium" | "high"
  rating: number               // 0-10 (optional)
  dateAdded: string            // ISO timestamp
  movie: {
    id: string
    title: string
    posterUrl: string
    year: number
    genres: string[]
  }
}
```

### Expected Activity Feed Format

```typescript
interface ActivityItem {
  id: string
  type: "review" | "watchlist" | "watched" | "favorite" | "pulse"
  timestamp: string            // ISO or relative time
  movie?: {
    id: string
    title: string
    posterUrl: string
    year: string
  }
  rating?: number
  content?: string
}
```

---

## TRANSFORMATION REQUIREMENTS

### Review → Activity Item

```typescript
{
  id: `review-${review.id}`,
  type: "review",
  timestamp: review.date,
  movie: {
    id: review.movie.id,
    title: review.movie.title,
    posterUrl: review.movie.posterUrl,
    year: String(review.movie.year),
  },
  rating: review.rating,
  content: review.content,
}
```

### Watchlist → Activity Item

```typescript
{
  id: `watchlist-${watchlist.id}`,
  type: watchlist.status === "watched" ? "watched" : "watchlist",
  timestamp: watchlist.dateAdded,
  movie: {
    id: watchlist.movie.id,
    title: watchlist.movie.title,
    posterUrl: watchlist.movie.posterUrl,
    year: String(watchlist.movie.year),
  },
}
```

---

## IMPLEMENTATION PLAN

### What Needs to Change

1. **Remove Mock Data** (lines 36-97)
   - Delete `setTimeout` simulation
   - Delete hardcoded `mockActivities` array

2. **Add Real API Call** (lines 31-101)
   - Import `getUserActivity` from `lib/api/profile`
   - Call `getUserActivity(userId)` instead of mock data
   - Handle error state

3. **Update Error Handling**
   - Add error state management
   - Display error message if API fails
   - Add retry button

4. **Keep Existing UI**
   - Loading state ✅ (already correct)
   - Empty state ✅ (already correct)
   - Activity rendering ✅ (already correct)

---

## FILES TO MODIFY

### Frontend

**File:** `components/profile/activity-feed.tsx`
- **Lines to change:** 31-101 (useEffect hook)
- **Changes:** Replace mock data with real API call
- **Imports to add:** `import { getUserActivity } from "@/lib/api/profile"`

---

## SUMMARY

**Root Cause:** Component uses hardcoded mock data instead of calling existing API function

**Solution:** Replace mock data with real API call to `getUserActivity(userId)`

**Complexity:** LOW - API function already exists, just need to use it

**Risk:** LOW - No backend changes needed, only frontend component update

**Estimated Time:** 15 minutes (implementation + testing)

---

## NEXT STEP

Proceed to **Step 2: Implement Complete End-to-End Fix**

