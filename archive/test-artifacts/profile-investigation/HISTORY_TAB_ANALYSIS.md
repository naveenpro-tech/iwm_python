# HISTORY TAB - STEP 1: DEEP CODE ANALYSIS

**Date:** 2025-10-29  
**Tab:** History Tab (Watch History)  
**Status:** Analysis Complete

---

## ROOT CAUSE IDENTIFICATION

### Current Implementation (Broken)

**File:** `components/profile/sections/profile-history.tsx` (lines 35-137)

```typescript
useEffect(() => {
  const fetchHistory = async () => {
    setIsLoading(true)
    
    // Mock data - in a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    const mockHistory: HistoryItem[] = [
      { id: "h1", movieId: "m1", movieTitle: "Dune: Part Two", ... },
      { id: "h2", movieId: "m3", movieTitle: "Oppenheimer", ... },
      // ... 6 more hardcoded items
    ]
    
    setHistory(mockHistory)
    setIsLoading(false)
  }
  
  fetchHistory()
}, [userId])
```

**Problems:**
1. ❌ Uses `setTimeout(1200)` to simulate API call
2. ❌ Hardcoded 8 mock history items
3. ❌ `userId` parameter passed but NOT USED
4. ❌ Never calls real API endpoint
5. ❌ No error handling

---

## EXISTING API INFRASTRUCTURE

### Frontend API Client

**File:** `lib/api/profile.ts` (lines 145-165)

**Function:** `getUserHistory(userId, page, limit)`

```typescript
export async function getUserHistory(userId: string, page: number = 1, limit: number = 100) {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/watchlist?userId=${userId}&status=watched&page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching user history:", error)
    return []
  }
}
```

**Status:** ✅ Function EXISTS but component doesn't use it!

### Backend Endpoint

**Endpoint:** `GET /api/v1/watchlist?userId={userId}&status=watched`
- ✅ Exists in `apps/backend/src/routers/watchlist.py`
- ✅ Supports filtering by status (watched)
- ✅ Supports pagination
- ✅ Returns watchlist items with movie data

**Status:** ✅ Endpoint exists and works!

---

## DATA STRUCTURE ANALYSIS

### Watchlist Item Format (from backend)

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

### Expected History Item Format

```typescript
interface HistoryItem {
  id: string
  movieId: string
  movieTitle: string
  moviePosterUrl: string
  movieYear: string
  watchedDate: string          // ISO date
  formattedDate: string        // User-friendly date
  userRating?: number
  genres: string[]
}
```

---

## TRANSFORMATION REQUIREMENTS

### Watchlist (status=watched) → HistoryItem

```typescript
{
  id: watchlist.id,
  movieId: watchlist.movieId,
  movieTitle: watchlist.movie.title,
  moviePosterUrl: watchlist.movie.posterUrl,
  movieYear: String(watchlist.movie.year),
  watchedDate: watchlist.dateAdded,
  formattedDate: new Date(watchlist.dateAdded).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }),
  userRating: watchlist.rating,
  genres: watchlist.movie.genres,
}
```

---

## IMPLEMENTATION PLAN

### What Needs to Change

1. **Remove Mock Data** (lines 40-134)
   - Delete `setTimeout` simulation
   - Delete hardcoded `mockHistory` array (8 items)

2. **Add Real API Call** (lines 35-137)
   - Import `getUserHistory` from `lib/api/profile`
   - Call `getUserHistory(userId)` instead of mock data
   - Handle error state

3. **Update Error Handling**
   - Add error state management
   - Display error message if API fails
   - Add retry button

4. **Keep Existing UI**
   - Loading state ✅ (already correct)
   - Empty state ✅ (already correct)
   - Search/filter/sort ✅ (already correct)
   - History rendering ✅ (already correct)

---

## FILES TO MODIFY

### Frontend

**File:** `components/profile/sections/profile-history.tsx`
- **Lines to change:** 35-137 (useEffect hook)
- **Changes:** Replace mock data with real API call
- **Imports to add:** `import { getUserHistory } from "@/lib/api/profile"`
- **Add error state:** `const [error, setError] = useState<string | null>(null)`

---

## SUMMARY

**Root Cause:** Component uses hardcoded mock data instead of calling existing API function

**Solution:** Replace mock data with real API call to `getUserHistory(userId)`

**Complexity:** LOW - API function already exists, just need to use it

**Risk:** LOW - No backend changes needed, only frontend component update

**Estimated Time:** 15 minutes (implementation + testing)

---

## NEXT STEP

Proceed to **Step 2: Implement Complete End-to-End Fix**

