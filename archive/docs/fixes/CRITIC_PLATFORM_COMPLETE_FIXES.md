# Critic Platform Complete Fixes

## Date: 2025-11-07

## Issues Fixed

### Issue 1: Movie Search Not Fetching from Database ✅
**Location:** `app/critic/dashboard/create-review/page.tsx`

**Problem:** The movie search functionality was using hardcoded mock data instead of fetching real movies from the database.

**Solution:**
- Replaced mock data with real API call to `/api/v1/movies/search`
- Used the `searchMovies()` function from `lib/api/search.ts`
- Added loading state and error handling
- Transformed backend response to match expected format
- Added empty state messages

**Files Changed:**
- `app/critic/dashboard/create-review/page.tsx` (lines 335-433)

**Code Changes:**
```typescript
// Before: Mock data
const handleSearch = async () => {
  setSearchResults([
    { id: "tt0111161", title: "The Shawshank Redemption", year: 1994, poster: "/shawshank-poster.png" },
    { id: "tt0468569", title: "The Dark Knight", year: 2008, poster: "/dark-knight-poster.png" },
    { id: "tt1375666", title: "Inception", year: 2010, poster: "/inception-poster.png" },
  ])
}

// After: Real API call
const handleSearch = async () => {
  if (!searchQuery.trim()) return

  setIsSearching(true)
  try {
    const { searchMovies } = await import("@/lib/api/search")
    const response = await searchMovies(searchQuery, 20)
    
    const movies = response.results.map((movie: any) => ({
      id: movie.id,
      external_id: movie.external_id,
      title: movie.title,
      year: movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : null),
      poster: movie.poster_url || "/placeholder.svg",
    }))
    
    setSearchResults(movies)
  } catch (error) {
    console.error("Failed to search movies:", error)
    setSearchResults([])
  } finally {
    setIsSearching(false)
  }
}
```

---

### Issue 2: Publish Button Not Working ✅
**Location:** `app/critic/dashboard/create-review/page.tsx`

**Problem:** The publish button was failing with "Please select a movie" error because the form state structure was incorrect.

**Root Cause:**
- `selectedMovie` was stored as a separate state variable, not in `formData`
- The validation was checking `formData.selectedMovie` which didn't exist
- The API call was trying to access `formData.selectedMovie.id` which was undefined

**Solution:**
- Fixed all references to use `selectedMovie` state variable directly
- Fixed API call to use `selectedMovie.id` instead of `formData.selectedMovie.id`
- Fixed numeric rating to use `formData.ratingNumeric` instead of `formData.rating`
- Added YouTube ID extraction helper function
- Fixed title generation to use movie title

**Files Changed:**
- `app/critic/dashboard/create-review/page.tsx` (lines 47-120)

**Code Changes:**
```typescript
// Before: Incorrect references
if (!formData.selectedMovie) {
  toast({ title: "Error", description: "Please select a movie", variant: "destructive" })
  return
}

const review = await createCriticReview({
  movie_id: formData.selectedMovie.id,
  title: formData.title || "Untitled Review",
  content: formData.writtenContent,
  numeric_rating: formData.rating,
  tags: formData.tags,
  youtube_video_id: formData.youtubeVideoId,
  is_draft: false,
})

// After: Correct references
if (!selectedMovie) {
  toast({ title: "Error", description: "Please select a movie", variant: "destructive" })
  return
}

const review = await createCriticReview({
  movie_id: selectedMovie.id,
  title: `${selectedMovie.title} Review`,
  content: formData.writtenContent,
  numeric_rating: formData.ratingNumeric,
  tags: formData.tags,
  youtube_video_id: formData.youtubeUrl ? extractYouTubeId(formData.youtubeUrl) : undefined,
  is_draft: false,
})
```

---

### Issue 3: Missing `/api/v1/critic-reviews/me` Endpoint ✅
**Location:** `apps/backend/src/routers/critic_reviews.py`

**Problem:** The critic dashboard was failing with 404 errors because the `/api/v1/critic-reviews/me` endpoint didn't exist.

**Solution:**
- Added new `GET /api/v1/critic-reviews/me` endpoint
- Supports filtering by status (draft, published, or all)
- Returns current user's critic reviews
- Includes proper authentication and authorization checks

**Files Changed:**
- `apps/backend/src/routers/critic_reviews.py` (lines 315-360)

**Code Added:**
```python
@router.get("/me", response_model=List[CriticReviewResponse])
async def list_my_reviews(
    status: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """List current user's critic reviews (drafts and published)"""
    # Check if user has a critic profile
    critic_repo = CriticRepository(db)
    critic = await critic_repo.get_critic_by_user_id(current_user.id)

    if not critic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not have a critic profile"
        )

    review_repo = CriticReviewRepository(db)
    
    # Determine include_drafts based on status parameter
    if status == "draft":
        reviews = await review_repo.list_reviews_by_critic(
            critic.id, include_drafts=True, limit=limit, offset=offset
        )
        reviews = [r for r in reviews if r.is_draft]
    elif status == "published":
        reviews = await review_repo.list_reviews_by_critic(
            critic.id, include_drafts=False, limit=limit, offset=offset
        )
    else:
        reviews = await review_repo.list_reviews_by_critic(
            critic.id, include_drafts=True, limit=limit, offset=offset
        )

    return [_review_to_response(review) for review in reviews]
```

---

### Issue 4: Dashboard Navigation/Access ✅
**Location:** `components/critic/profile/critic-hero-section.tsx`

**Problem:** There was no clear way to navigate to the critic dashboard from the UI.

**Solution:**
- Added "Dashboard" button to the critic hero section
- Button is only visible when the logged-in user is viewing their own critic profile
- Replaces the "Follow" button when viewing own profile
- Uses authentication check to determine if current user owns the profile

**Files Changed:**
- `components/critic/profile/critic-hero-section.tsx` (lines 1-224)

**Code Changes:**
```typescript
// Added imports
import { useEffect } from "react"
import { LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Added state
const [currentUser, setCurrentUser] = useState<any>(null)
const [isOwnProfile, setIsOwnProfile] = useState(false)

// Added effect to check if viewing own profile
useEffect(() => {
  const checkUser = async () => {
    try {
      const { me, isAuthenticated } = await import("@/lib/auth")
      if (!isAuthenticated()) {
        setCurrentUser(null)
        setIsOwnProfile(false)
        return
      }
      const userData = await me()
      setCurrentUser(userData)
      setIsOwnProfile(userData?.username === profile?.username)
    } catch (error) {
      setCurrentUser(null)
      setIsOwnProfile(false)
    }
  }
  checkUser()
}, [profile?.username])

// Added conditional rendering
{isOwnProfile ? (
  <Link href="/critic/dashboard">
    <Button className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A] gap-2">
      <LayoutDashboard className="w-4 h-4" />
      Dashboard
    </Button>
  </Link>
) : (
  <FollowButton
    criticUsername={profile?.username || "critic"}
    initialFollowing={false}
    initialFollowerCount={profile?.total_followers ?? 0}
  />
)}
```

---

## Testing Instructions

### Test 1: Movie Search
1. Navigate to `http://localhost:3000/critic/dashboard/create-review`
2. Enter a movie name in the search box (e.g., "One Battle After Another")
3. Click "Search"
4. Verify that real movies from the database are displayed
5. Verify loading state appears during search
6. Verify empty state appears if no results found

### Test 2: Create and Publish Review
1. Search for a movie
2. Click on a movie to select it
3. Fill in the review form:
   - Select letter grade (e.g., "A")
   - Enter numeric rating (e.g., "9")
   - Write review content (minimum 100 characters)
   - Add tags (optional)
4. Click "Publish"
5. Verify review is created successfully
6. Verify redirect to dashboard

### Test 3: Dashboard Access
1. Navigate to your critic profile page (e.g., `http://localhost:3000/critic/c`)
2. Verify "Dashboard" button is visible (instead of "Follow" button)
3. Click "Dashboard" button
4. Verify redirect to `http://localhost:3000/critic/dashboard`
5. Verify dashboard loads without errors
6. Verify reviews are displayed

### Test 4: Dashboard Reviews List
1. Navigate to `http://localhost:3000/critic/dashboard`
2. Verify the page loads without 404 errors
3. Verify your reviews are displayed
4. Verify stats are shown correctly

---

## API Endpoints Added

### `GET /api/v1/critic-reviews/me`
**Description:** List current user's critic reviews

**Query Parameters:**
- `status` (optional): Filter by status ("draft", "published", or all)
- `limit` (optional): Maximum number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:** Array of `CriticReviewResponse` objects

**Authentication:** Required (JWT token)

**Example:**
```bash
GET /api/v1/critic-reviews/me?status=published&limit=10
```

---

## Summary

All 4 issues have been successfully fixed:

1. ✅ **Movie Search** - Now fetches real movies from database via `/api/v1/movies/search`
2. ✅ **Publish Button** - Fixed form state references and API call parameters
3. ✅ **Missing Endpoint** - Added `/api/v1/critic-reviews/me` endpoint to backend
4. ✅ **Dashboard Navigation** - Added "Dashboard" button to critic profile page

The critic platform is now fully functional with:
- Real movie search
- Working review creation and publishing
- Functional dashboard with reviews list
- Clear navigation to dashboard from profile page

