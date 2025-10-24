# USER PROFILE & WATCHLIST PAGE ENHANCEMENT - IMPLEMENTATION PLAN

## 📋 EXECUTIVE SUMMARY

**Objective:** Enhance the existing user profile page (`/app/profile/page.tsx`) by adding comprehensive Collections functionality and improving existing Watchlist and Favorites tabs.

**Current State:**
- ✅ Profile page exists at `/app/profile/page.tsx`
- ✅ ProfileHeader component with user stats
- ✅ ProfileNavigation with 6 tabs (Overview, Reviews, Watchlist, Favorites, History, Settings)
- ✅ ProfileWatchlist component with basic movie grid (310 lines)
- ✅ ProfileFavorites component with basic movie grid (328 lines)
- ✅ Separate Collections page at `/app/collections/page.tsx` (global collections)
- ✅ Existing user data structure with stats (reviews, watchlist, favorites, following, followers)

**Desired State:**
- ✅ Add "Collections" tab to profile navigation (7 tabs total)
- ✅ Enhance Watchlist tab with better filtering, sorting, and actions
- ✅ Enhance Favorites tab with rating display and better UX
- ✅ Create new ProfileCollections component for user's personal collections
- ✅ Integrate collection management (create, edit, delete, add movies)
- ✅ Maintain consistency with existing Siddu design system
- ✅ Preserve all existing functionality

---

## 🎯 SCOPE & CONSTRAINTS

### **What We're Enhancing:**
1. **Profile Navigation** - Add "Collections" tab
2. **Watchlist Tab** - Improve filtering, sorting, and add quick actions
3. **Favorites Tab** - Add rating display, improve layout
4. **Collections Tab** - NEW - User's personal collections with CRUD operations

### **What We're NOT Changing:**
- ❌ Profile Header (keep as-is)
- ❌ Overview tab (keep as-is)
- ❌ Reviews tab (keep as-is)
- ❌ History tab (keep as-is)
- ❌ Settings tab (keep as-is)
- ❌ Global collections page (`/app/collections/page.tsx`)
- ❌ User data structure (only extend stats to include `collections: number`)

---

## 📁 FILE STRUCTURE

### **Files to Modify (3 files):**
```
app/profile/page.tsx                                    (69 lines → ~85 lines)
  - Add collections count to userData.stats
  - Add "collections" case to renderSection()
  - Import ProfileCollections component

components/profile/profile-navigation.tsx               (67 lines → ~75 lines)
  - Add "Collections" tab to sections array
  - Add collections count badge

components/profile/sections/profile-watchlist.tsx       (310 lines → ~380 lines)
  - Add quick action buttons (remove, mark watched)
  - Improve filter UI
  - Add view mode toggle (grid/list)

components/profile/sections/profile-favorites.tsx       (328 lines → ~400 lines)
  - Add rating display on cards
  - Add quick action buttons (remove, add to collection)
  - Improve filter UI
```

### **Files to Create (8 files):**
```
components/profile/sections/profile-collections.tsx     (~450 lines)
  - Main collections tab component
  - Collection grid with create/edit/delete
  - Empty state with CTA

components/profile/collections/collection-card-profile.tsx  (~180 lines)
  - Reusable collection card for profile view
  - Different from global collection card
  - Edit/delete actions

components/profile/collections/create-collection-modal-profile.tsx  (~250 lines)
  - Modal for creating new collection
  - Form with title, description, privacy
  - Movie search and selection

components/profile/collections/edit-collection-modal-profile.tsx  (~280 lines)
  - Modal for editing existing collection
  - Pre-filled form
  - Add/remove movies

components/profile/collections/delete-collection-dialog.tsx  (~120 lines)
  - Confirmation dialog for deletion
  - Warning about permanent action

components/profile/collections/add-to-collection-modal.tsx  (~200 lines)
  - Modal for adding movie to collection
  - List of user's collections
  - Create new collection option

lib/profile/mock-user-collections.ts                    (~150 lines)
  - Mock data for user's personal collections
  - 5-8 collections with varied content

types/profile.ts                                        (~200 lines)
  - TypeScript interfaces for all profile types
  - UserData, WatchlistMovie, FavoriteMovie, UserCollection
```

**Total New Files:** 8  
**Total Modified Files:** 4  
**Total Lines of Code:** ~2,500 lines

---

## 🎨 COMPONENT HIERARCHY

```
ProfilePage (app/profile/page.tsx)
├── ProfileHeader (existing - no changes)
├── ProfileNavigation (modified - add Collections tab)
└── Active Section:
    ├── ProfileOverview (existing - no changes)
    ├── ProfileReviews (existing - no changes)
    ├── ProfileWatchlist (enhanced)
    │   ├── Search & Filters
    │   ├── Sort & View Mode Toggle
    │   └── Movie Grid/List
    │       └── MovieCard with Quick Actions
    ├── ProfileFavorites (enhanced)
    │   ├── Search & Filters
    │   ├── Sort & View Mode Toggle
    │   └── Movie Grid/List
    │       └── MovieCard with Rating & Quick Actions
    ├── ProfileCollections (NEW)
    │   ├── Collections Header with Create Button
    │   ├── Collections Grid
    │   │   └── CollectionCardProfile (with Edit/Delete)
    │   ├── CreateCollectionModalProfile
    │   ├── EditCollectionModalProfile
    │   ├── DeleteCollectionDialog
    │   └── Empty State
    ├── ProfileHistory (existing - no changes)
    └── ProfileSettings (existing - no changes)
```

---

## 📊 DATA STRUCTURES

### **Extended UserData Type:**
```typescript
interface UserData {
  id: string
  username: string
  displayName: string
  bio: string
  avatarUrl: string
  coverUrl: string
  location: string
  memberSince: string
  isVerified: boolean
  stats: {
    reviews: number
    watchlist: number
    favorites: number
    collections: number      // NEW
    following: number
    followers: number
  }
}
```

### **UserCollection Type:**
```typescript
interface UserCollection {
  id: string
  title: string
  description: string
  coverImage: string          // Single cover image or 4-poster collage
  movieCount: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
  movies: CollectionMovie[]   // Full movie objects
  tags?: string[]
}

interface CollectionMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  sidduScore?: number
}
```

### **Enhanced WatchlistMovie Type:**
```typescript
interface WatchlistMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  releaseStatus: "released" | "upcoming"
  sidduScore?: number
  priority?: "high" | "medium" | "low"  // NEW
  notes?: string                         // NEW
}
```

### **Enhanced FavoriteMovie Type:**
```typescript
interface FavoriteMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  sidduScore?: number
  userRating: number          // NEW - User's personal rating (1-5 stars)
  reviewId?: string           // NEW - Link to user's review if exists
}
```

---

## 🎯 FEATURE SPECIFICATIONS

### **1. Collections Tab (NEW)**

**Features:**
- Display user's personal collections in grid layout
- Create new collection button (prominent CTA)
- Each collection card shows:
  - 4-poster collage or single cover image
  - Collection title and description
  - Movie count
  - Privacy status (public/private icon)
  - Edit and Delete buttons
- Empty state with "Create Your First Collection" CTA
- Responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)

**Actions:**
- Create Collection → Opens CreateCollectionModalProfile
- Edit Collection → Opens EditCollectionModalProfile
- Delete Collection → Opens DeleteCollectionDialog
- Click Collection → Navigate to `/collections/[id]` (existing detail page)

**State Management:**
- Local state for collections array
- Optimistic UI updates for create/edit/delete
- Mock data initially, backend integration ready

---

### **2. Enhanced Watchlist Tab**

**New Features:**
- View mode toggle (Grid / List)
- Priority filter (All / High / Medium / Low)
- Quick actions on each movie card:
  - Remove from watchlist (X icon)
  - Mark as watched (Check icon) → Moves to History
  - Add to collection (Plus icon) → Opens AddToCollectionModal
- Hover state shows additional info (runtime, director)

**Existing Features (Keep):**
- Search by title
- Sort by (Recent, Title, Release Date, Score)
- Filter by status (All, Released, Upcoming)
- Genre filter

---

### **3. Enhanced Favorites Tab**

**New Features:**
- User rating display (1-5 stars) on each card
- Quick actions on each movie card:
  - Remove from favorites (Heart icon)
  - Add to collection (Plus icon)
  - View/Edit review (if exists)
- View mode toggle (Grid / List)
- Sort by user rating

**Existing Features (Keep):**
- Search by title
- Sort by (Recent, Title, Score)
- Genre filter

---

## 🎨 UI/UX SPECIFICATIONS

### **Design System Compliance:**
- **Colors:**
  - Background: `#1A1A1A`
  - Card Background: `#282828`
  - Primary (Cyan): `#00BFFF`
  - Secondary (Gold): `#FFD700`
  - Text: `#E0E0E0`
  - Muted Text: `#A0A0A0`
  - Borders: `#3A3A3A`
  - Success: `#10B981`
  - Error: `#EF4444`

- **Typography:**
  - Headings: `font-['Inter']`
  - Body: `font-['DM_Sans']`

- **Spacing:**
  - Section gaps: `gap-6` (1.5rem)
  - Card padding: `p-4` (1rem)
  - Grid gaps: `gap-4 md:gap-6`

- **Animations:**
  - Card hover: `scale-1.03`, `duration-200ms`
  - Stagger children: `0.05s` delay
  - Modal entrance: `opacity 0→1`, `scale 0.95→1`, `300ms`

### **Responsive Breakpoints:**
- Mobile: `< 768px` (1 column)
- Tablet: `768px - 1024px` (2 columns)
- Desktop: `> 1024px` (3-4 columns)

---

## 🔄 STATE MANAGEMENT STRATEGY

### **Profile Page State:**
```typescript
const [activeSection, setActiveSection] = useState<ProfileSection>("overview")
const [userData, setUserData] = useState<UserData>(mockUserData)
```

### **Collections Tab State:**
```typescript
const [collections, setCollections] = useState<UserCollection[]>([])
const [isLoading, setIsLoading] = useState(true)
const [showCreateModal, setShowCreateModal] = useState(false)
const [editingCollection, setEditingCollection] = useState<UserCollection | null>(null)
const [deletingCollectionId, setDeletingCollectionId] = useState<string | null>(null)
```

### **Watchlist Tab State:**
```typescript
const [movies, setMovies] = useState<WatchlistMovie[]>([])
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
const [priorityFilter, setPriorityFilter] = useState('all')
const [selectedMovie, setSelectedMovie] = useState<WatchlistMovie | null>(null)
```

### **Favorites Tab State:**
```typescript
const [movies, setMovies] = useState<FavoriteMovie[]>([])
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
const [sortBy, setSortBy] = useState('recent')
```

---

## ⚡ ANIMATION TIMELINE

### **Collections Grid Animation:**
```typescript
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}
```

### **Modal Animations:**
```typescript
modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
}
```

### **Quick Action Buttons:**
```typescript
// Remove button: Fade out + scale down (200ms)
// Mark watched: Check icon bounce (300ms)
// Add to collection: Plus icon rotate (200ms)
```

---

## 🧪 TESTING STRATEGY

### **Manual GUI Testing Checklist:**
- [ ] Collections tab appears in navigation
- [ ] Collections count badge displays correctly
- [ ] Create collection modal opens and closes
- [ ] Create collection form validation works
- [ ] New collection appears in grid immediately (optimistic UI)
- [ ] Edit collection modal pre-fills data correctly
- [ ] Edit collection updates grid immediately
- [ ] Delete confirmation dialog appears
- [ ] Delete removes collection from grid
- [ ] Empty state shows when no collections
- [ ] Watchlist view mode toggle works
- [ ] Watchlist quick actions work (remove, mark watched, add to collection)
- [ ] Favorites rating display shows correctly
- [ ] Favorites quick actions work
- [ ] All filters and sorts work correctly
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] All animations are smooth (60fps)
- [ ] No console errors
- [ ] No TypeScript errors

### **Playwright E2E Tests:**
```typescript
// tests/e2e/profile-collections.spec.ts
test('Create new collection', async ({ page }) => {
  // Navigate to profile
  // Click Collections tab
  // Click Create Collection button
  // Fill form
  // Submit
  // Verify collection appears in grid
})

test('Edit existing collection', async ({ page }) => {
  // Navigate to profile
  // Click Collections tab
  // Click Edit on a collection
  // Modify title
  // Submit
  // Verify changes reflected
})

test('Delete collection', async ({ page }) => {
  // Navigate to profile
  // Click Collections tab
  // Click Delete on a collection
  // Confirm deletion
  // Verify collection removed
})
```

---

## 📦 IMPLEMENTATION PHASES

### **Phase 1: Type Definitions (20 min)**
- Create `types/profile.ts`
- Define all interfaces (UserData, UserCollection, WatchlistMovie, FavoriteMovie)
- Export all types

### **Phase 2: Mock Data (30 min)**
- Create `lib/profile/mock-user-collections.ts`
- Generate 5-8 realistic collections
- Ensure variety (public/private, different sizes, different themes)

### **Phase 3: Profile Navigation Enhancement (15 min)**
- Modify `components/profile/profile-navigation.tsx`
- Add "Collections" tab to sections array
- Add collections count badge

### **Phase 4: Profile Page Enhancement (15 min)**
- Modify `app/profile/page.tsx`
- Add collections count to userData.stats
- Add "collections" case to renderSection()
- Import ProfileCollections component

### **Phase 5: Collections Tab Components (90 min)**
- Create `components/profile/sections/profile-collections.tsx`
- Create `components/profile/collections/collection-card-profile.tsx`
- Create `components/profile/collections/create-collection-modal-profile.tsx`
- Create `components/profile/collections/edit-collection-modal-profile.tsx`
- Create `components/profile/collections/delete-collection-dialog.tsx`
- Create `components/profile/collections/add-to-collection-modal.tsx`

### **Phase 6: Watchlist Enhancement (45 min)**
- Modify `components/profile/sections/profile-watchlist.tsx`
- Add view mode toggle
- Add priority filter
- Add quick action buttons
- Improve layout

### **Phase 7: Favorites Enhancement (45 min)**
- Modify `components/profile/sections/profile-favorites.tsx`
- Add rating display
- Add view mode toggle
- Add quick action buttons
- Improve layout

### **Phase 8: Integration & Testing (60 min)**
- Test all features manually in GUI
- Fix any bugs discovered
- Run Playwright tests
- Take screenshots (desktop, tablet, mobile)
- Verify zero TypeScript errors
- Verify zero runtime errors

**Total Estimated Time:** 5 hours

---

## ✅ SUCCESS CRITERIA

- ✅ Zero TypeScript errors
- ✅ Zero runtime errors
- ✅ All tabs functional (7 tabs total)
- ✅ Collections CRUD working (create, edit, delete)
- ✅ Watchlist quick actions working
- ✅ Favorites rating display working
- ✅ All filters and sorts working
- ✅ Fully responsive (mobile/tablet/desktop)
- ✅ 60fps animations
- ✅ 100% Siddu design system compliance
- ✅ WCAG 2.1 AA accessibility
- ✅ Production-ready code quality
- ✅ Existing functionality preserved

---

## 🚀 NEXT STEPS AFTER APPROVAL

1. Create all type definitions
2. Generate mock data
3. Implement Collections tab components
4. Enhance Watchlist and Favorites tabs
5. Integrate everything into profile page
6. Perform comprehensive GUI testing
7. Fix any bugs discovered
8. Provide final delivery report with screenshots

**Ready for approval! 🎉**

