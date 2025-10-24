# 🎬 MOVIE REVIEWS PAGE - COMPREHENSIVE IMPLEMENTATION PLAN

**Date:** 2025-10-23  
**Objective:** Transform `/movies/[id]/reviews` into the ultimate review hub  
**Status:** 📋 **PLANNING PHASE**

---

## 📊 **1. COMPONENT HIERARCHY DIAGRAM**

```
app/movies/[id]/reviews/page.tsx (Main Container)
│
├── ReviewHeader (Sticky Header)
│   ├── Movie Poster (16:9 ratio, 200px height desktop)
│   ├── Movie Title + Year
│   └── Back to Movie Details Button
│
├── VoiceOfSidduSummary (Analytics Section)
│   ├── SidduScore Display (Circular Progress)
│   ├── Total Review Count Breakdown
│   ├── Rating Distribution Chart (Horizontal Bars)
│   ├── Sentiment Analysis (Pie Chart / Badges)
│   └── Top Keywords (Tag Cloud)
│
├── ReviewTabs (Tabbed Navigation - Sticky)
│   ├── TabsList (3 tabs with icons + counts)
│   │   ├── Tab: "Siddu Review" (Star icon)
│   │   ├── Tab: "Critic Reviews" (Award icon)
│   │   └── Tab: "User Reviews" (Users icon)
│   │
│   ├── TabContent: SidduReviewTab
│   │   ├── If exists: OfficialReviewCard
│   │   │   ├── Author Info (Avatar, Name, Title)
│   │   │   ├── Publication Date + Read Time
│   │   │   ├── Star Rating (Animated)
│   │   │   ├── Rich Text Content
│   │   │   └── Share Buttons
│   │   └── If not exists: EmptyState
│   │
│   ├── TabContent: CriticReviewsTab
│   │   ├── If exists: CriticReviewGrid (3 cols desktop)
│   │   │   └── CriticReviewCard[] (12 cards)
│   │   │       ├── Critic Avatar (64px)
│   │   │       ├── Critic Name + Verified Badge
│   │   │       ├── Star Rating
│   │   │       ├── Review Excerpt (3 lines)
│   │   │       ├── Publication Date
│   │   │       └── "Read Full Review" Button
│   │   └── If not exists: EmptyState
│   │
│   └── TabContent: UserReviewsTab
│       ├── ReviewFilterBar
│       │   ├── Filter: Rating Dropdown
│       │   ├── Filter: Verification Toggle
│       │   ├── Filter: Spoilers Toggle
│       │   ├── Sort: Dropdown (6 options)
│       │   └── Search: Input Field
│       │
│       ├── UserReviewsList (Infinite Scroll)
│       │   ├── UserReviewCard[] (20 per page)
│       │   │   ├── Reviewer Avatar (48px)
│       │   │   ├── Username + Verified Badge
│       │   │   ├── Star Rating
│       │   │   ├── Review Text (Expandable)
│       │   │   ├── Timestamp
│       │   │   ├── Helpful/Unhelpful Buttons
│       │   │   ├── Comment Count
│       │   │   └── Spoiler Overlay (if applicable)
│       │   │
│       │   ├── LoadingSpinner (while fetching)
│       │   └── EndOfReviewsMessage
│       │
│       └── UserOwnReviewHighlight (if logged in + reviewed)
│
└── WriteReviewFAB (Floating Action Button)
    ├── Context-Aware Label
    ├── Icon (Pencil)
    └── Click Handler (Login/Create/Edit/Quiz)
```

---

## 🗂️ **2. FILE STRUCTURE**

```
app/movies/[id]/reviews/
└── page.tsx (Main page component)

components/review-page/
├── review-header.tsx
├── voice-of-siddu-summary.tsx
├── review-tabs.tsx
├── siddu-review-tab.tsx
├── critic-reviews-tab.tsx
├── user-reviews-tab.tsx
├── review-filter-bar.tsx
├── user-review-card.tsx
├── critic-review-card.tsx
├── official-review-card.tsx
├── write-review-fab.tsx
├── rating-distribution-chart.tsx
├── sentiment-analysis-chart.tsx
├── keyword-tag-cloud.tsx
└── empty-state.tsx

lib/review-page/
├── mock-official-review.ts
├── mock-critic-reviews.ts
├── mock-user-reviews.ts
├── mock-review-stats.ts
└── review-helpers.ts

types/
└── review-page.ts (All type definitions)
```

---

## 🎨 **3. STATE MANAGEMENT PLAN**

### **Page-Level State (app/movies/[id]/reviews/page.tsx)**

```typescript
// Tab Navigation
const [activeTab, setActiveTab] = useState<'siddu' | 'critics' | 'users'>('siddu')

// Data Loading
const [isLoading, setIsLoading] = useState(true)
const [officialReview, setOfficialReview] = useState<OfficialReview | null>(null)
const [criticReviews, setCriticReviews] = useState<CriticReview[]>([])
const [userReviews, setUserReviews] = useState<UserReview[]>([])
const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)

// User Context
const [currentUser, setCurrentUser] = useState<User | null>(null)
const [userHasReviewed, setUserHasReviewed] = useState(false)
```

### **User Reviews Tab State (user-reviews-tab.tsx)**

```typescript
// Filtering & Sorting
const [filters, setFilters] = useState({
  rating: 'all', // 'all' | '5' | '4' | '3' | '2' | '1'
  verification: 'all', // 'all' | 'verified' | 'unverified'
  spoilers: 'show_all' // 'show_all' | 'hide_spoilers'
})
const [sortBy, setSortBy] = useState<SortOption>('newest')
const [searchQuery, setSearchQuery] = useState('')

// Pagination
const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)
const [isLoadingMore, setIsLoadingMore] = useState(false)

// Expanded Reviews (for "Read More")
const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set())

// Spoiler Reveals
const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set())
```

### **User Review Card State (user-review-card.tsx)**

```typescript
// Optimistic UI for Helpful/Unhelpful
const [helpfulCount, setHelpfulCount] = useState(review.helpful_count)
const [unhelpfulCount, setUnhelpfulCount] = useState(review.unhelpful_count)
const [userVote, setUserVote] = useState<'helpful' | 'unhelpful' | null>(review.user_vote)
const [isVoting, setIsVoting] = useState(false)
```

---

## ⏱️ **4. ANIMATION TIMELINE SPECIFICATION**

### **Page Load Sequence (Total: 1.2s)**

```
0ms    → Page container fade-in starts
100ms  → Header slides down from top (300ms duration)
200ms  → Summary section elements stagger fade-in:
         - SidduScore (200ms)
         - Review count (300ms)
         - Rating chart (400ms)
         - Sentiment chart (500ms)
         - Keywords (600ms)
400ms  → Tab bar slides up from bottom (300ms duration)
700ms  → Active tab content fade-in (400ms duration)
1200ms → FAB scales in from 0 to 1 (300ms duration)
```

### **Tab Switch Animation (Total: 300ms)**

```
0ms    → Current tab content fade-out (150ms)
150ms  → New tab content fade-in (150ms)
0ms    → Active indicator slide animation (300ms ease-out)
```

### **Filter Application (Total: 400ms)**

```
0ms    → Shimmer effect on all review cards (200ms)
200ms  → Filtered cards fade-out (100ms)
300ms  → New filtered cards stagger fade-in (100ms, 50ms delay between each)
```

### **Infinite Scroll Load (Total: 600ms)**

```
0ms    → Skeleton cards appear (pulse animation)
400ms  → Real cards fade-in, replacing skeletons (200ms)
```

### **Hover Effects (Instant)**

```
Hover Start → Scale 1.0 to 1.02 (200ms ease-out)
            → Border color #3A3A3A to #00BFFF (200ms)
            → Box shadow glow effect (200ms)
Hover End   → Reverse all effects (200ms ease-in)
```

### **Spoiler Reveal (Total: 400ms)**

```
Click → Blur filter 10px to 0px (400ms ease-out)
      → Opacity 0.3 to 1.0 (400ms ease-out)
      → Overlay fade-out (200ms)
```

---

## 📱 **5. RESPONSIVE BREAKPOINT STRATEGY**

### **Breakpoints**

```typescript
const breakpoints = {
  mobile: '0px - 767px',
  tablet: '768px - 1023px',
  desktop: '1024px+'
}
```

### **Mobile (<768px)**

```css
/* Header */
.review-header {
  padding: 1rem;
  poster-height: 100px;
  title-lines: 2; /* truncate */
}

/* Summary */
.voice-of-siddu-summary {
  grid-template-columns: 1fr; /* stack vertically */
  gap: 1rem;
}

/* Tabs */
.review-tabs {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

/* Filters */
.review-filter-bar {
  display: none; /* collapse into modal */
}
.filter-button {
  display: block; /* show "Filters" button */
}

/* Critic Reviews */
.critic-reviews-grid {
  grid-template-columns: 1fr; /* single column */
}

/* User Reviews */
.user-review-card {
  padding: 1rem;
}

/* FAB */
.write-review-fab {
  position: sticky;
  bottom: 0;
  width: 100%;
  border-radius: 0;
}
```

### **Tablet (768px - 1023px)**

```css
/* Header */
.review-header {
  poster-height: 150px;
}

/* Summary */
.voice-of-siddu-summary {
  grid-template-columns: repeat(2, 1fr);
}

/* Critic Reviews */
.critic-reviews-grid {
  grid-template-columns: repeat(2, 1fr);
}

/* FAB */
.write-review-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: auto;
}
```

### **Desktop (>1024px)**

```css
/* Header */
.review-header {
  poster-height: 200px;
}

/* Summary */
.voice-of-siddu-summary {
  grid-template-columns: repeat(4, 1fr);
}

/* Critic Reviews */
.critic-reviews-grid {
  grid-template-columns: repeat(3, 1fr);
}

/* User Reviews */
.user-reviews-list {
  max-width: 800px;
  margin: 0 auto;
}
```

---

## 📦 **6. MOCK DATA SCHEMA**

### **Official Review**

```typescript
interface OfficialReview {
  id: number
  movie_id: number
  author: {
    name: string
    title: string
    avatar_url: string
  }
  rating: number // 0-10
  content: string // Rich text (Markdown or HTML)
  published_at: string // ISO 8601
  read_time_minutes: number
  featured_image_url?: string
  embedded_media?: {
    type: 'image' | 'video'
    url: string
  }[]
}
```

### **Critic Review**

```typescript
interface CriticReview {
  id: number
  movie_id: number
  critic: {
    username: string
    display_name: string
    avatar_url: string
    is_verified: boolean
  }
  rating: number // 0-10
  excerpt: string // 150 chars max
  slug: string
  published_at: string
}
```

### **User Review**

```typescript
interface UserReview {
  id: number
  movie_id: number
  user: {
    username: string
    avatar_url: string
    is_verified: boolean
  }
  rating: number // 1-5 stars
  content: string
  contains_spoilers: boolean
  helpful_count: number
  unhelpful_count: number
  comment_count: number
  created_at: string
  user_vote?: 'helpful' | 'unhelpful' | null
}
```

### **Review Statistics**

```typescript
interface ReviewStats {
  siddu_score: number // 0-10 (weighted average)
  total_reviews: {
    official: number
    critics: number
    users: number
  }
  rating_distribution: {
    5: { count: number; percentage: number }
    4: { count: number; percentage: number }
    3: { count: number; percentage: number }
    2: { count: number; percentage: number }
    1: { count: number; percentage: number }
  }
  sentiment_analysis: {
    positive: number // percentage
    neutral: number
    negative: number
  }
  top_keywords: Array<{
    keyword: string
    count: number
    sentiment: 'positive' | 'neutral' | 'negative'
  }>
}
```

---

## 🎯 **7. IMPLEMENTATION PHASES**

### **Phase 1: Core Structure (30 mins)**
- Create all component files
- Set up type definitions
- Implement basic layout (header, tabs, FAB)
- No animations yet

### **Phase 2: Data Layer (20 mins)**
- Create mock data generators
- Implement data fetching logic
- Connect components to mock data

### **Phase 3: Tab Content (40 mins)**
- Implement Siddu Review Tab
- Implement Critic Reviews Tab
- Implement User Reviews Tab (basic)

### **Phase 4: Filtering & Sorting (30 mins)**
- Implement filter bar
- Implement sort logic
- Implement search functionality
- Implement infinite scroll

### **Phase 5: Interactions (20 mins)**
- Helpful/Unhelpful voting
- Spoiler reveal
- Read More expansion
- Share buttons

### **Phase 6: Animations (30 mins)**
- Page load stagger
- Tab transitions
- Hover effects
- Filter shimmer
- Infinite scroll skeletons

### **Phase 7: Responsive Design (20 mins)**
- Mobile layout
- Tablet layout
- Filter modal (mobile)

### **Phase 8: Polish & Testing (20 mins)**
- Accessibility (ARIA labels, keyboard nav)
- Edge cases (empty states, loading states)
- Final visual polish

**Total Estimated Time: 3.5 hours**

---

## ✅ **8. PRE-IMPLEMENTATION CHECKLIST**

Before generating code, confirm:

- [ ] Component hierarchy approved
- [ ] State management plan approved
- [ ] Animation timeline approved
- [ ] Responsive strategy approved
- [ ] Mock data schema approved
- [ ] File structure approved
- [ ] Implementation phases approved

---

**Awaiting approval to proceed with code generation.**

