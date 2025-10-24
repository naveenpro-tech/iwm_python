# 🚀 SIDDU PULSE FEED PAGE - COMPREHENSIVE IMPLEMENTATION PLAN

---

## **PROJECT OVERVIEW**

**Objective:** Design and implement a fully functional social media feed page (`/app/pulse/page.tsx`) that serves as the central hub for all user activity on the Siddu platform.

**Scope:** Complete social feed with composer, interactions, infinite scroll, trending sections, and responsive design.

**Estimated Effort:** 5 hours 50 minutes | 42 files | ~4,400 lines of code

---

## **COMPONENT HIERARCHY**

```
PulsePage (app/pulse/page.tsx)
├── PulsePageLayout (components/pulse/pulse-page-layout.tsx)
│   ├── PulseLeftSidebar (components/pulse/left-sidebar/pulse-left-sidebar.tsx)
│   │   ├── UserProfileCard (components/pulse/left-sidebar/user-profile-card.tsx)
│   │   ├── QuickNavigation (components/pulse/left-sidebar/quick-navigation.tsx)
│   │   └── QuickStats (components/pulse/left-sidebar/quick-stats.tsx)
│   │
│   ├── PulseMainFeed (components/pulse/main-feed/pulse-main-feed.tsx)
│   │   ├── PulseComposer (components/pulse/composer/pulse-composer.tsx)
│   │   │   ├── ComposerTextarea (components/pulse/composer/composer-textarea.tsx)
│   │   │   ├── CharacterCounter (components/pulse/composer/character-counter.tsx)
│   │   │   ├── MediaUploadButton (components/pulse/composer/media-upload-button.tsx)
│   │   │   ├── MediaPreviewGrid (components/pulse/composer/media-preview-grid.tsx)
│   │   │   ├── EmojiPickerButton (components/pulse/composer/emoji-picker-button.tsx)
│   │   │   ├── TagSearchButton (components/pulse/composer/tag-search-button.tsx)
│   │   │   ├── TagChip (components/pulse/composer/tag-chip.tsx)
│   │   │   └── PostButton (components/pulse/composer/post-button.tsx)
│   │   │
│   │   ├── FeedTabs (components/pulse/feed/feed-tabs.tsx)
│   │   │
│   │   └── PulseFeed (components/pulse/feed/pulse-feed.tsx)
│   │       ├── PulseCard (components/pulse/feed/pulse-card.tsx)
│   │       │   ├── PulseCardHeader (components/pulse/feed/pulse-card-header.tsx)
│   │       │   ├── PulseCardContent (components/pulse/feed/pulse-card-content.tsx)
│   │       │   ├── MediaGrid (components/pulse/feed/media-grid.tsx)
│   │       │   ├── TaggedItemCard (components/pulse/feed/tagged-item-card.tsx)
│   │       │   ├── PulseCardActions (components/pulse/feed/pulse-card-actions.tsx)
│   │       │   │   ├── LikeButton (components/pulse/feed/actions/like-button.tsx)
│   │       │   │   ├── CommentButton (components/pulse/feed/actions/comment-button.tsx)
│   │       │   │   ├── EchoButton (components/pulse/feed/actions/echo-button.tsx)
│   │       │   │   └── BookmarkButton (components/pulse/feed/actions/bookmark-button.tsx)
│   │       │   ├── CommentSection (components/pulse/feed/comment-section.tsx)
│   │       │   │   ├── CommentList (components/pulse/feed/comment-list.tsx)
│   │       │   │   ├── CommentCard (components/pulse/feed/comment-card.tsx)
│   │       │   │   └── CommentInput (components/pulse/feed/comment-input.tsx)
│   │       │   └── MoreMenu (components/pulse/feed/more-menu.tsx)
│   │       │
│   │       ├── InfiniteScrollTrigger (components/pulse/feed/infinite-scroll-trigger.tsx)
│   │       ├── LoadingSpinner (components/pulse/feed/loading-spinner.tsx)
│   │       └── EmptyState (components/pulse/feed/empty-state.tsx)
│   │
│   └── PulseRightSidebar (components/pulse/right-sidebar/pulse-right-sidebar.tsx)
│       ├── TrendingTopics (components/pulse/right-sidebar/trending-topics.tsx)
│       ├── WhoToFollow (components/pulse/right-sidebar/who-to-follow.tsx)
│       ├── TrendingMovies (components/pulse/right-sidebar/trending-movies.tsx)
│       └── TrendingCricket (components/pulse/right-sidebar/trending-cricket.tsx)
│
└── ComposerFAB (components/pulse/composer-fab.tsx) [Mobile only]
```

---

## **FILE STRUCTURE (42 FILES)**

### **1. Type Definitions (1 file)**
- `types/pulse.ts` - All TypeScript interfaces (~200 lines)

### **2. Mock Data (6 files)**
- `lib/pulse/mock-pulse-posts.ts` - 50+ varied posts (~300 lines)
- `lib/pulse/mock-trending-topics.ts` - 10 trending hashtags (~50 lines)
- `lib/pulse/mock-suggested-users.ts` - 10 suggested users (~100 lines)
- `lib/pulse/mock-trending-movies.ts` - 10 trending movies (~100 lines)
- `lib/pulse/mock-trending-cricket.ts` - 5 cricket matches (~100 lines)
- `lib/pulse/mock-comments.ts` - 100+ comments (~150 lines)

### **3. Main Page (1 file)**
- `app/pulse/page.tsx` - Main page with state management (~300 lines)

### **4. Layout Components (4 files)**
- `components/pulse/pulse-page-layout.tsx` - Three-column grid (~100 lines)
- `components/pulse/left-sidebar/pulse-left-sidebar.tsx` - Left sidebar container (~80 lines)
- `components/pulse/right-sidebar/pulse-right-sidebar.tsx` - Right sidebar container (~80 lines)
- `components/pulse/main-feed/pulse-main-feed.tsx` - Main feed container (~100 lines)

### **5. Composer Components (9 files)**
- `components/pulse/composer/pulse-composer.tsx` - Main composer (~150 lines)
- `components/pulse/composer/composer-textarea.tsx` - Auto-resize textarea (~80 lines)
- `components/pulse/composer/character-counter.tsx` - Character counter (~50 lines)
- `components/pulse/composer/media-upload-button.tsx` - Media upload (~70 lines)
- `components/pulse/composer/media-preview-grid.tsx` - Media previews (~100 lines)
- `components/pulse/composer/emoji-picker-button.tsx` - Emoji picker (~80 lines)
- `components/pulse/composer/tag-search-button.tsx` - Tag search modal (~120 lines)
- `components/pulse/composer/tag-chip.tsx` - Removable tag chip (~50 lines)
- `components/pulse/composer/post-button.tsx` - Post button with states (~70 lines)

### **6. Feed Components (17 files)**
- `components/pulse/feed/feed-tabs.tsx` - Sticky tabs (~100 lines)
- `components/pulse/feed/pulse-feed.tsx` - Feed container (~150 lines)
- `components/pulse/feed/pulse-card.tsx` - Main card component (~200 lines)
- `components/pulse/feed/pulse-card-header.tsx` - Card header (~100 lines)
- `components/pulse/feed/pulse-card-content.tsx` - Card content (~120 lines)
- `components/pulse/feed/media-grid.tsx` - Media grid 1-4 images (~150 lines)
- `components/pulse/feed/tagged-item-card.tsx` - Movie/cricket cards (~100 lines)
- `components/pulse/feed/pulse-card-actions.tsx` - Action buttons (~80 lines)
- `components/pulse/feed/actions/like-button.tsx` - Like with animation (~100 lines)
- `components/pulse/feed/actions/comment-button.tsx` - Comment button (~60 lines)
- `components/pulse/feed/actions/echo-button.tsx` - Echo with modal (~120 lines)
- `components/pulse/feed/actions/bookmark-button.tsx` - Bookmark button (~80 lines)
- `components/pulse/feed/comment-section.tsx` - Comment section (~120 lines)
- `components/pulse/feed/comment-list.tsx` - Comment list (~80 lines)
- `components/pulse/feed/comment-card.tsx` - Individual comment (~100 lines)
- `components/pulse/feed/comment-input.tsx` - Comment input (~80 lines)
- `components/pulse/feed/more-menu.tsx` - Dropdown menu (~100 lines)
- `components/pulse/feed/infinite-scroll-trigger.tsx` - Intersection observer (~60 lines)
- `components/pulse/feed/loading-spinner.tsx` - 3 dots spinner (~50 lines)
- `components/pulse/feed/empty-state.tsx` - No posts message (~50 lines)

### **7. Sidebar Components (7 files)**
- `components/pulse/left-sidebar/user-profile-card.tsx` - User profile (~100 lines)
- `components/pulse/left-sidebar/quick-navigation.tsx` - Nav links (~80 lines)
- `components/pulse/left-sidebar/quick-stats.tsx` - Daily stats (~70 lines)
- `components/pulse/right-sidebar/trending-topics.tsx` - Top 5 hashtags (~100 lines)
- `components/pulse/right-sidebar/who-to-follow.tsx` - Suggested users (~120 lines)
- `components/pulse/right-sidebar/trending-movies.tsx` - Trending movies (~100 lines)
- `components/pulse/right-sidebar/trending-cricket.tsx` - Live matches (~130 lines)

### **8. Mobile Components (1 file)**
- `components/pulse/composer-fab.tsx` - Floating action button (~80 lines)

---

## **TYPESCRIPT TYPE DEFINITIONS**

See detailed type definitions in next section of this document.

Key interfaces:
- `PulseUser` - User profile data
- `PulsePost` - Post with all metadata
- `PulseMedia` - Image/video media
- `TaggedItem` - Movie/cricket tags
- `PulseComment` - Comment data
- `TrendingTopic` - Hashtag trends
- `SuggestedUser` - Follow suggestions
- `TrendingMovie` - Movie trends
- `TrendingCricketMatch` - Cricket matches
- `FeedTab` - Tab types
- `ComposerState` - Composer state
- `PulsePagination` - Pagination state

---

## **MOCK DATA SPECIFICATIONS**

### **1. Pulse Posts (50+ posts)**
- 10 text-only posts (short, medium, long)
- 10 posts with single image
- 8 posts with multiple images (2, 3, 4 images)
- 5 posts with video
- 10 posts with movie tags
- 5 posts with cricket tags
- 5 echo/repost posts
- 5 quote echo posts

### **2. Trending Topics (10 hashtags)**
- #ShawshankRedemption (12.5K pulses)
- #IPL2024 (8.3K pulses)
- #ChristopherNolan (6.7K pulses)
- #Oppenheimer (5.2K pulses)
- #ViratKohli (4.1K pulses)
- ... (5 more)

### **3. Suggested Users (10 users)**
- Mix of verified and unverified
- Different follower counts
- Varied bios and specialties

### **4. Trending Movies (10 movies)**
- Recent releases and classics
- Varied ratings (7.0-9.5)
- Different genres

### **5. Trending Cricket (5 matches)**
- 2 live matches
- 2 upcoming matches
- 1 completed match

### **6. Comments (100+ comments)**
- Distributed across posts
- Varied lengths
- Different like counts

---

## **STATE MANAGEMENT STRATEGY**

### **Page-Level State (app/pulse/page.tsx)**
```typescript
const [activeTab, setActiveTab] = useState<FeedTab>("for_you")
const [posts, setPosts] = useState<PulsePost[]>([])
const [allPosts, setAllPosts] = useState<PulsePost[]>([])
const [comments, setComments] = useState<Record<string, PulseComment[]>>({})
const [pagination, setPagination] = useState<PulsePagination>({
  page: 1,
  has_more: true,
  is_loading_more: false,
})
const [isLoading, setIsLoading] = useState(true)
const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([])
const [trendingCricket, setTrendingCricket] = useState<TrendingCricketMatch[]>([])
const [userStats, setUserStats] = useState<UserDailyStats | null>(null)
```

### **Optimistic UI Patterns**
- Like: Immediately update UI, rollback on error
- Comment: Add to list immediately, remove on error
- Echo: Update count immediately, rollback on error
- Bookmark: Toggle immediately, rollback on error
- New post: Add to top of feed immediately

### **Data Fetching Pattern**
```typescript
useEffect(() => {
  const fetchData = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
    const useBackend = process.env.NEXT_PUBLIC_ENABLE_BACKEND === "true" && !!apiBase
    
    try {
      if (useBackend && apiBase) {
        const response = await fetch(`${apiBase}/api/v1/pulse/feed?tab=${activeTab}`)
        if (!response.ok) throw new Error(`Failed: ${response.statusText}`)
        const data = await response.json()
        setPosts(data.posts)
      } else {
        throw new Error("Backend not configured")
      }
    } catch (err) {
      console.warn("Backend fetch failed, using mock data:", err)
      setPosts(mockPulsePosts)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [activeTab])
```

---

## **ANIMATION TIMELINE (EXACT TIMINGS)**

### **Page Load Sequence (Total: 1.5s)**
```
0ms    → Page container: opacity 0 → 1 (400ms)
100ms  → Left sidebar: translateX(-100%) → 0 (400ms, ease-out)
200ms  → Feed tabs: translateY(-20px) → 0, opacity 0 → 1 (300ms)
300ms  → Composer: scale 0.95 → 1, opacity 0 → 1 (400ms)
500ms  → Pulse cards stagger: opacity 0 → 1, translateY(20px) → 0
         Card 1: 500ms | Card 2: 550ms | Card 3: 600ms | ... (50ms delay)
700ms  → Right sidebar: translateX(100%) → 0 (400ms, ease-out)
1100ms → Continuous animations start (trending pulse, live dot)
```

### **Interaction Animations**
- **Like:** scale 1 → 1.3 → 1 (300ms) + particle burst (600ms)
- **Comment:** rotate 360° (400ms) + section slide down (400ms)
- **Echo:** rotate 360° (500ms) + glow pulse (500ms)
- **Bookmark:** scale bounce 1 → 1.2 → 0.9 → 1 (300ms)
- **New Post:** translateY(-100%) → 0 (400ms)
- **Tab Switch:** indicator slide (300ms) + content fade (300ms)
- **Infinite Scroll:** stagger fade-in (50ms per post)

### **Continuous Animations**
- **Trending Badge:** pulse scale 1 → 1.05 → 1 (2s loop)
- **Live Dot:** pulse scale 1 → 1.3 → 1 (1.5s loop)
- **Composer Focus:** border glow (300ms)

---

## **RESPONSIVE BREAKPOINT STRATEGY**

### **Mobile (0-767px)**
- Single column layout
- Left sidebar → Hamburger menu (slide-in drawer)
- Right sidebar → Swipe-up bottom sheet
- Composer → Floating Action Button (opens modal)
- Feed tabs → Horizontal scroll
- Bottom navigation (5 icons)
- Font: 14px body, 18px headings
- Touch targets: 44px minimum

### **Tablet (768-1023px)**
- Two columns (main feed + right sidebar)
- Left sidebar → Icon-only bar (60px, expands on hover)
- Right sidebar → Visible (280px)
- Composer → Inline
- Font: 15px body, 20px headings

### **Desktop (1024px+)**
- Three columns (left 240px + main flex + right 320px)
- All sidebars visible
- Composer → Inline
- Font: 16px body, 24px headings
- Hover effects enabled

---

## **IMPLEMENTATION PHASES**

### **Phase 1: Planning (30 min) - CURRENT**
- ✅ Implementation plan
- ✅ Visual specification
- ✅ Component hierarchy
- ✅ Type definitions spec

### **Phase 2: Type Definitions (20 min)**
- Create types/pulse.ts
- All interfaces with JSDoc
- Run diagnostics

### **Phase 3: Mock Data (45 min)**
- 6 mock data files
- 50+ posts with variety
- All supporting data

### **Phase 4: Core Layout (40 min)**
- Page layout component
- Three-column grid
- Responsive breakpoints

### **Phase 5: Composer (60 min)**
- 9 composer components
- Character counter
- Media upload
- Emoji picker
- Tag search

### **Phase 6: Feed Components (90 min)**
- 17 feed components
- Pulse cards
- Interactions (like/comment/echo/bookmark)
- Comment section
- Infinite scroll

### **Phase 7: Sidebar Components (50 min)**
- 7 sidebar components
- User profile
- Trending sections
- Suggestions

### **Phase 8: Main Page Integration (30 min)**
- State management
- Data fetching
- Event handlers
- Zero errors

### **Phase 9: GUI Testing (45 min)**
- Comprehensive Playwright testing
- All interactions
- Responsive design
- Bug fixes
- Final report

**TOTAL: 5 hours 50 minutes**

---

## **CRITICAL SUCCESS CRITERIA**

Before delivery, verify:
- ✅ Zero TypeScript errors
- ✅ All interactions functional (like, comment, echo, bookmark)
- ✅ Composer fully functional (character count, media, emoji, tags)
- ✅ Infinite scroll working smoothly
- ✅ All tabs functional (For You, Following, Movies, Cricket)
- ✅ All animations 60fps
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ 100% Siddu design system compliance
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Production-ready code quality

---

**READY FOR APPROVAL AND AUTONOMOUS IMPLEMENTATION**

