# 🔧 EXACT CODE CHANGES

## File 1: `apps/backend/src/routers/favorites.py`

### Change: Add Authentication to Favorites Endpoint

**Location:** Lines 22-40

**Before:**
```python
@router.get("")
async def list_favorites(
    page: int = 1,
    limit: int = 20,
    userId: str | None = None,
    type: str | None = None,
    session: AsyncSession = Depends(get_session),
) -> Any:
    """
    List favorite items with optional filters.
    
    - page: page number (1-based)
    - limit: results per page
    - userId: filter by user external_id
    - type: filter by type (movie, person, scene, article, all)
    """
    repo = FavoriteRepository(session)
    return await repo.list(page=page, limit=limit, user_id=userId, type_filter=type)
```

**After:**
```python
@router.get("")
async def list_favorites(
    page: int = 1,
    limit: int = 20,
    type: str | None = None,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    List favorite items for the current user with optional filters.
    
    - page: page number (1-based)
    - limit: results per page
    - type: filter by type (movie, person, scene, article, all)
    
    Note: Always filters by current user for security
    """
    repo = FavoriteRepository(session)
    return await repo.list(page=page, limit=limit, user_id=current_user.external_id, type_filter=type)
```

**Key Changes:**
1. Removed `userId: str | None = None` parameter
2. Added `current_user: User = Depends(get_current_user)` parameter
3. Changed `user_id=userId` to `user_id=current_user.external_id`
4. Updated docstring to reflect security change

---

## File 2: `middleware.ts`

### Change: Add Public Routes Exception

**Location:** Lines 4-36

**Before:**
```typescript
// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/watchlist",
  "/favorites",
  "/collections",
  "/reviews/new",
  "/pulse",
  "/notifications",
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("access_token")?.value

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
```

**After:**
```typescript
// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/watchlist",
  "/favorites",
  "/collections",
  "/reviews/new",
  "/pulse",
  "/notifications",
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"]

// Routes that are public (don't require authentication)
const publicRoutes = [
  /^\/collections\/[^/]+\/public$/,  // Public collection view: /collections/{id}/public
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("access_token")?.value

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => route.test(pathname))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
```

**Key Changes:**
1. Added `publicRoutes` array with regex pattern
2. Added public route check before protected route check
3. Return early if route is public (bypass auth check)

---

## File 3: `components/collections/collection-detail.tsx`

### Change: Update Share URL Generation

**Location:** Lines 79-102

**Before:**
```typescript
const handleShare = async () => {
  try {
    const shareUrl = window.location.href
    if (navigator.share) {
      await navigator.share({ title: collection?.title || "Collection", url: shareUrl })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: "Link copied!", description: "Collection link copied to clipboard" })
    }
  } catch (err) {
    // Fallback to clipboard on error
    try {
      const shareUrl = window.location.href
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: "Link copied!", description: "Collection link copied to clipboard" })
    } catch {
      toast({ title: "Share failed", description: "Unable to share right now", variant: "destructive" })
    }
  }
}
```

**After:**
```typescript
const handleShare = async () => {
  try {
    // Generate public share URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const shareUrl = `${baseUrl}/collections/${id}/public`
    
    if (navigator.share) {
      await navigator.share({ title: collection?.title || "Collection", url: shareUrl })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: "Link copied!", description: "Collection link copied to clipboard" })
    }
  } catch (err) {
    // Fallback to clipboard on error
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      const shareUrl = `${baseUrl}/collections/${id}/public`
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: "Link copied!", description: "Collection link copied to clipboard" })
    } catch {
      toast({ title: "Share failed", description: "Unable to share right now", variant: "destructive" })
    }
  }
}
```

**Key Changes:**
1. Changed from `window.location.href` to constructed URL
2. Added `baseUrl` calculation
3. Changed URL from `/collections/{id}` to `/collections/{id}/public`
4. Applied change in both try and catch blocks

---

## File 4: `app/collections/[id]/public/page.tsx` (NEW)

### New File: Public Collection View Page

**Location:** New file

**Key Features:**
- Displays collection without authentication
- Validates collection is public
- Shows error if collection is private
- Supports grid and list view modes
- Responsive design

**Key Code Sections:**

```typescript
// Check if collection is public
if (!data.isPublic) {
  setError("This collection is private and cannot be shared")
  setIsLoading(false)
  return
}

// Transform data
const transformedCollection: Collection = {
  id: data.id,
  title: data.title,
  description: data.description || "",
  creator: data.creator,
  movieCount: data.movieCount || 0,
  followers: data.followers || 0,
  posterImages: data.posterImages || [],
  isPublic: data.isPublic,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  tags: data.tags || [],
  movies: data.movies || [],
  curator: data.creator,
  moviesCount: data.movieCount || 0,
  likesCount: data.followers || 0,
  lastUpdated: data.updatedAt || data.createdAt,
}
```

---

## Summary of Changes

| File | Type | Lines | Impact |
|------|------|-------|--------|
| `apps/backend/src/routers/favorites.py` | Modified | ~15 | Fixes BUG #1 |
| `middleware.ts` | Modified | ~12 | Fixes BUG #2 |
| `components/collections/collection-detail.tsx` | Modified | ~20 | Fixes BUG #2 |
| `app/collections/[id]/public/page.tsx` | Created | ~200 | Fixes BUG #2 |

**Total Lines Changed:** ~247

---

## Verification

All changes have been:
- ✅ Implemented
- ✅ Tested
- ✅ Verified
- ✅ Documented

**Status:** Ready for Production

