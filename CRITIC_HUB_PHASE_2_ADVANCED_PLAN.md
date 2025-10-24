# 🎨 CRITIC HUB PHASE 2 - ADVANCED DESIGN PLAN

**Date:** October 22, 2025  
**Phase:** Phase 2 - Advanced Critic Profile Pages (Frontend)  
**Status:** 📋 DESIGN PLAN - AWAITING APPROVAL  
**Estimated Duration:** 7 hours

---

## 📊 EXECUTIVE SUMMARY

This document outlines a comprehensive, visionary implementation plan for the Critic Profile page (`/critic/[username]`) that elevates it to a "best-in-class" experience. The design incorporates advanced features beyond the original specification, including:

- **Immersive Video Hero** with stats constellation visualization
- **Interactive Filmography Heatmap** for visual review exploration
- **Comprehensive Analytics Dashboard** with 4 interactive charts
- **Gamification System** with achievement badges
- **AMA (Ask Me Anything)** feature for follower engagement
- **Advanced Animations** with parallax, glow effects, and staggered reveals
- **Full Responsive Design** across all breakpoints
- **Accessibility Compliance** (WCAG AA standards)

**Key Innovation:** This profile page will be the most visually stunning and interactive component in the entire IWM platform, setting a new standard for professional profiles.

---

## 🎯 FEATURE OVERVIEW

### **Core Features (Original Plan):**
1. ✅ Hero section with banner and avatar
2. ✅ Bio section with social links
3. ✅ Stats card with metrics
4. ✅ Review showcase with filters
5. ✅ Follow button with optimistic UI

### **Enhanced Features (Proactive Additions):**
6. 🆕 **Video Banner** - Auto-playing showreel with image fallback
7. 🆕 **Stats Constellation** - Interactive glowing nodes with trend graphs
8. 🆕 **Filmography Heatmap** - Visual grid of all reviewed movies
9. 🆕 **Analytics Dashboard** - 4 interactive charts (genre affinity, rating distribution, keyword cloud, sentiment timeline)
10. 🆕 **AMA Section** - Q&A feature with upvoting and answers
11. 🆕 **Badges System** - Gamification with achievement badges

---

## 🏗️ COMPONENT ARCHITECTURE

### **File Structure:**

```
app/
└── critic/
    └── [username]/
        └── page.tsx                          # Main profile page (NEW)

components/
└── critic/
    └── profile/
        ├── critic-hero-section.tsx           # Video banner + Stats constellation (NEW)
        ├── critic-bio-section.tsx            # Bio + Social links (NEW)
        ├── critic-stats-card.tsx             # Detailed metrics (NEW)
        ├── critic-filmography-heatmap.tsx    # Interactive heatmap (NEW)
        ├── critic-review-showcase.tsx        # Review grid with filters (NEW)
        ├── critic-review-card.tsx            # Individual review card (NEW)
        ├── critic-analytics-section.tsx      # Charts & visualizations (NEW)
        ├── critic-ama-section.tsx            # Q&A feature (NEW)
        ├── critic-badges-section.tsx         # Gamification badges (NEW)
        └── follow-button.tsx                 # Interactive follow/unfollow (NEW)

lib/
└── critic/
    ├── mock-analytics.ts                     # Mock data for analytics (NEW)
    ├── mock-badges.ts                        # Mock data for badges (NEW)
    └── mock-ama.ts                           # Mock data for AMA (NEW)
```

### **Component Hierarchy:**

```
CriticProfilePage
├── CriticHeroSection
│   ├── Video/Image Banner (Parallax)
│   ├── Avatar with Glow
│   ├── Display Name + Verified Badge
│   └── Stats Constellation (5 nodes)
├── CriticBioSection
│   ├── Bio Text
│   └── Social Links (with icons)
├── CriticStatsCard
│   ├── Total Reviews
│   ├── Followers
│   ├── Avg Rating
│   └── Total Likes
├── CriticFilmographyHeatmap
│   ├── Grid View (10x N)
│   └── Timeline View (mobile)
├── CriticAnalyticsSection
│   ├── Genre Affinity Chart (Radar)
│   ├── Rating Distribution (Bar)
│   ├── Keyword Cloud (Word Cloud)
│   └── Sentiment Timeline (Line)
├── CriticReviewShowcase
│   ├── Search Bar
│   ├── Filter Dropdown
│   ├── Sort Dropdown
│   └── Review Grid (CriticReviewCard[])
├── CriticAMASection
│   ├── Question Submission Form
│   ├── Top Questions List
│   └── Upvote Buttons
└── CriticBadgesSection
    └── Badge Grid (4 columns)
```

---

## 🎨 DETAILED FEATURE SPECIFICATIONS

### **1. IMMERSIVE VIDEO HERO SECTION**

**Component:** `CriticHeroSection.tsx`

**Features:**
- **Video Banner:**
  - Auto-play, muted, loop, no controls
  - Fallback to `banner_image_url` if video unavailable
  - Lazy load with poster image
  - Parallax scroll effect (0.5x speed)
  - Accessibility: "Pause Video" button for motion-sensitive users

- **Stats Constellation:**
  - 5 glowing circular nodes:
    1. Followers (cyan glow)
    2. Total Reviews (gold glow)
    3. Avg Rating (purple glow)
    4. Total Likes (pink glow)
    5. Total Views (green glow)
  - Nodes connected by animated SVG lines
  - Hover interaction: Node expands, shows mini trend graph (last 30 days)
  - Breathing pulse animation (scale 1.0 → 1.05 → 1.0, 2s loop)
  - Lines shimmer with gradient animation

**Data Source:**
- `GET /api/v1/critics/{username}` - Fetch critic profile
- Mock trend data for hover graphs

**Responsive:**
- Desktop: Full-width banner (600px height), constellation below
- Tablet: Reduced height (400px), constellation grid (2x3)
- Mobile: Reduced height (300px), constellation vertical list

**Animation Timeline:**
```
0.0s: Hero section fades in (opacity 0 → 1)
0.3s: Video starts playing (or image fades in)
0.5s: Avatar slides in from bottom with glow
0.7s: Display name + badge fade in
0.9s: Constellation nodes appear with stagger (0.1s delay each)
1.2s: Constellation lines draw in (stroke-dashoffset animation)
```

---

### **2. INTERACTIVE FILMOGRAPHY HEATMAP**

**Component:** `CriticFilmographyHeatmap.tsx`

**Features:**
- **Grid View (Desktop):**
  - 10 columns × N rows
  - Each tile represents one reviewed movie
  - Color intensity: Dark purple (low rating) → Bright cyan (high rating)
  - Gradient scale: 1-10 rating mapped to color
  - Hover: Tile scales 1.1x, shows tooltip (movie title + rating + poster thumbnail)
  - Click: Filters review showcase to that movie

- **Timeline View (Mobile):**
  - Horizontal scrollable timeline
  - Movies ordered by review date
  - Same color coding and interactions

**Data Source:**
- `GET /api/v1/critic-reviews/critic/{username}` - Fetch all reviews
- Extract: `movie_id`, `title`, `rating`, `published_at`

**Color Scale:**
```typescript
const getHeatmapColor = (rating: number) => {
  const colors = [
    '#1A0033', // 1-2: Very dark purple
    '#2D0052', // 3-4: Dark purple
    '#4A0080', // 5-6: Purple
    '#0066CC', // 7-8: Blue
    '#00BFFF', // 9-10: Bright cyan
  ]
  const index = Math.floor((rating - 1) / 2)
  return colors[Math.min(index, 4)]
}
```

**Animation:**
- Tiles reveal with wave effect (left-to-right, top-to-bottom)
- Delay: `index * 0.02s` (max 2s total)
- Hover: Scale + glow effect

---

### **3. CRITIC'S VOICE ANALYTICS SECTION**

**Component:** `CriticAnalyticsSection.tsx`

**Features:**

#### **3.1 Genre Affinity Chart (Radar Chart)**
- **Library:** Recharts `<RadarChart>`
- **Data:** Review count per genre
- **Axes:** 8-12 genres (Action, Drama, Comedy, Horror, Sci-Fi, etc.)
- **Styling:** Cyan fill with 30% opacity, cyan stroke
- **Interaction:** Hover shows exact count

#### **3.2 Rating Distribution (Bar Chart)**
- **Library:** Recharts `<BarChart>`
- **Data:** Frequency of each rating (1-10)
- **X-Axis:** Rating (1-10)
- **Y-Axis:** Count
- **Styling:** Gradient bars (purple → cyan)
- **Interaction:** Hover shows percentage

#### **3.3 Keyword Cloud (Word Cloud)**
- **Implementation:** Custom SVG-based word cloud
- **Data:** Top 50 words from review content (excluding stop words)
- **Sizing:** Font size proportional to frequency
- **Styling:** Random rotation (-15° to +15°), cyan/gold colors
- **Interaction:** Click word to filter reviews containing it

#### **3.4 Sentiment Timeline (Line Chart)**
- **Library:** Recharts `<LineChart>`
- **Data:** Average rating per month (last 12 months)
- **X-Axis:** Month (Jan, Feb, Mar, ...)
- **Y-Axis:** Avg Rating (0-10)
- **Styling:** Smooth curve, cyan line with gradient fill
- **Interaction:** Hover shows exact avg rating + review count

**Data Source:**
- `GET /api/v1/critics/{username}/analytics` (NEW ENDPOINT - use mock data)
- Mock data structure:
```typescript
{
  genreAffinity: { genre: string, count: number }[],
  ratingDistribution: { rating: number, count: number, percentage: number }[],
  keywords: { word: string, frequency: number }[],
  sentimentTimeline: { month: string, avgRating: number, reviewCount: number }[]
}
```

**Responsive:**
- Desktop: 2x2 grid
- Tablet: 2x2 grid (smaller)
- Mobile: Vertical stack

**Animation:**
- Charts animate in with staggered reveal (0.2s delay each)
- Data points pulse on hover
- Smooth transitions on data changes

---

### **4. AMA (ASK ME ANYTHING) FEATURE**

**Component:** `CriticAMASection.tsx`

**Features:**

#### **4.1 Question Submission Form**
- **Fields:**
  - Question text (textarea, 500 char limit)
  - Character counter
  - Submit button (disabled if not authenticated)
- **Validation:**
  - Min 10 characters
  - Max 500 characters
  - No profanity (basic filter)
- **Behavior:**
  - On submit: POST to backend, optimistic UI update
  - Show success toast
  - Clear form

#### **4.2 Questions Display**
- **Layout:** List of question cards
- **Sorting:** By upvotes (descending)
- **Pagination:** Show top 10, "Load More" button
- **Each Question Card:**
  - Question text
  - Upvote button + count
  - Timestamp ("2 days ago")
  - Answer (if answered)
  - "Answer" button (critic-only, if viewing own profile)

#### **4.3 Upvote System**
- **Behavior:**
  - Click upvote: Toggle upvote state
  - Optimistic UI update (count +1 or -1)
  - POST to backend
  - Each user can upvote once per question
  - Upvoted questions highlighted (cyan border)

#### **4.4 Answer Interface (Critic-Only)**
- **Trigger:** Click "Answer" button
- **UI:** Inline textarea appears below question
- **Fields:**
  - Answer text (markdown supported)
  - Submit/Cancel buttons
- **Behavior:**
  - On submit: POST to backend
  - Answer appears below question
  - Timestamp shown

**Data Source:**
- `GET /api/v1/critics/{username}/ama` (NEW ENDPOINT - use mock data)
- `POST /api/v1/critics/{username}/ama/questions` (NEW ENDPOINT - mock)
- `POST /api/v1/critics/{username}/ama/questions/{id}/upvote` (NEW ENDPOINT - mock)

**Mock Data:**
```typescript
{
  questions: [
    {
      id: "q1",
      text: "What's your favorite movie of all time?",
      upvotes: 42,
      isUpvoted: false,
      askedBy: "user123",
      askedAt: "2025-10-20T10:00:00Z",
      answer: {
        text: "Inception - it changed how I think about storytelling.",
        answeredAt: "2025-10-21T14:30:00Z"
      }
    }
  ]
}
```

**Responsive:**
- Desktop: Full-width cards
- Mobile: Stacked cards, smaller text

**Animation:**
- Questions fade in with stagger
- Upvote button: Ripple effect on click
- Answer form: Slide down animation

---

### **5. GAMIFICATION - BADGES SYSTEM**

**Component:** `CriticBadgesSection.tsx`

**Features:**

#### **5.1 Badge Categories:**

**Genre Specialist Badges:**
- Horror Aficionado (50+ horror reviews)
- Sci-Fi Specialist (50+ sci-fi reviews)
- Drama Expert (50+ drama reviews)
- Action Junkie (50+ action reviews)
- Comedy Connoisseur (50+ comedy reviews)

**Milestone Badges:**
- First 100 Reviews
- 500 Reviews Milestone
- 1,000 Reviews Milestone
- 1K Followers
- 10K Followers
- 100K Views

**Engagement Badges:**
- Top Engaged Critic (Top 10% engagement rate)
- Community Favorite (Top 10% follower growth)
- Consistent Contributor (30+ days streak)

**Quality Badges:**
- Verified Critic (official verification)
- Trusted Voice (90%+ helpful votes)
- Detailed Reviewer (Avg review length >500 words)

#### **5.2 Badge Display:**
- **Layout:** Grid (4 columns desktop, 2 mobile)
- **Each Badge:**
  - Icon (custom SVG or Lucide icon)
  - Name
  - Unlock criteria (on hover/click)
  - Earned date (if earned)
  - Progress bar (if not earned)
  - Glow effect (if earned)

#### **5.3 Badge States:**
- **Earned:** Full color, glow effect, clickable
- **Locked:** Grayscale, no glow, shows progress
- **In Progress:** Partial color, progress bar

**Data Source:**
- `GET /api/v1/critics/{username}/badges` (NEW ENDPOINT - use mock data)

**Mock Data:**
```typescript
{
  badges: [
    {
      id: "horror-aficionado",
      name: "Horror Aficionado",
      description: "Reviewed 50+ horror movies",
      icon: "ghost",
      category: "genre",
      isEarned: true,
      earnedAt: "2025-09-15T00:00:00Z",
      progress: 100,
      total: 50
    },
    {
      id: "first-100",
      name: "First 100 Reviews",
      description: "Published 100 reviews",
      icon: "trophy",
      category: "milestone",
      isEarned: false,
      progress: 73,
      total: 100
    }
  ]
}
```

**Responsive:**
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile: 2 columns

**Animation:**
- Badges fade in with stagger (0.05s delay each)
- Earned badges: Glow pulse animation
- Hover: Flip animation to show details on back
- Click: Modal with full badge details

---

## 🎬 ANIMATION CHOREOGRAPHY

### **Page Load Sequence (Total: 2.5 seconds):**

```
0.0s  → Hero section container fades in (opacity 0 → 1, duration 0.5s)
0.3s  → Video starts loading/playing (or image fades in)
0.5s  → Avatar slides up from bottom with glow (y: 50 → 0, duration 0.4s)
0.7s  → Display name + verified badge fade in (opacity 0 → 1, duration 0.3s)
0.9s  → Stats constellation nodes appear with stagger:
        - Node 1 (Followers): 0.9s
        - Node 2 (Reviews): 1.0s
        - Node 3 (Avg Rating): 1.1s
        - Node 4 (Likes): 1.2s
        - Node 5 (Views): 1.3s
1.4s  → Constellation lines draw in (stroke-dashoffset 100% → 0%, duration 0.5s)
1.6s  → Bio section slides in from left (x: -50 → 0, duration 0.4s)
1.8s  → Filmography heatmap tiles reveal with wave effect:
        - Each tile: delay = index * 0.02s (max 2s total)
        - Tiles fade in + scale (opacity 0 → 1, scale 0.9 → 1.0)
2.0s  → Review showcase cards stagger in:
        - Each card: delay = index * 0.05s
        - Cards slide up (y: 30 → 0, duration 0.3s)
2.2s  → Analytics charts animate in with stagger (0.2s delay each)
2.4s  → AMA section fades in (opacity 0 → 1, duration 0.3s)
2.5s  → Badges section reveals with glow effect (opacity 0 → 1, duration 0.3s)
```

### **Scroll Animations:**

**Hero Parallax:**
- Video/image moves at 0.5x scroll speed
- Avatar stays fixed (no parallax)
- Stats constellation rotates slightly on scroll (rotate: 0° → 10°)

**Heatmap Tiles:**
- Tiles brighten as they enter viewport (filter: brightness(0.7) → brightness(1.0))
- Stagger effect based on scroll position

**Review Cards:**
- Cards lift and glow as they enter viewport
- Transform: translateY(20px) → translateY(0), scale(0.98) → scale(1.0)
- Box-shadow: none → 0 10px 30px rgba(0, 191, 255, 0.2)

**Charts:**
- Data points pulse when in viewport
- Lines/bars animate in with draw effect

### **Interaction Animations:**

**Follow Button:**
- Click: Ripple effect (expanding circle, opacity 1 → 0, scale 0 → 2)
- State change: Smooth color transition (cyan → gray or gray → cyan, duration 0.3s)
- Text change: Fade out/in (opacity 1 → 0 → 1, duration 0.2s each)

**Heatmap Tiles:**
- Hover: Scale 1.0 → 1.1, duration 0.2s
- Hover: Glow effect (box-shadow: 0 0 20px currentColor)
- Tooltip: Slide in from top (y: -10 → 0, opacity 0 → 1, duration 0.2s)

**Chart Data Points:**
- Hover: Pulse animation (scale 1.0 → 1.2 → 1.0, duration 0.4s)
- Hover: Tooltip appears with slide-in (y: 10 → 0, opacity 0 → 1)

**Badge Cards:**
- Hover: Flip animation (rotateY: 0° → 180°, duration 0.6s)
- Front: Badge icon + name
- Back: Unlock criteria + progress

**AMA Upvote Button:**
- Click: Scale 0.9 → 1.1 → 1.0 (duration 0.3s)
- Click: Color change (gray → cyan if upvoting, cyan → gray if removing)
- Count: Number animates (count up/down with spring animation)

---

## 📱 RESPONSIVE DESIGN STRATEGY

### **Breakpoints:**

```typescript
const breakpoints = {
  mobile: '320px - 767px',
  tablet: '768px - 1023px',
  desktop: '1024px - 1439px',
  largeDesktop: '1440px+'
}
```

### **Component Adaptations:**

#### **Hero Section:**
- **Desktop (1024px+):**
  - Banner height: 600px
  - Avatar: 200px diameter
  - Stats constellation: 5 nodes in pentagon shape
  - Font sizes: Display name 48px, stats 24px

- **Tablet (768px-1023px):**
  - Banner height: 400px
  - Avatar: 150px diameter
  - Stats constellation: 2x3 grid
  - Font sizes: Display name 36px, stats 20px

- **Mobile (320px-767px):**
  - Banner height: 300px
  - Avatar: 120px diameter
  - Stats constellation: Vertical list (5 items)
  - Font sizes: Display name 28px, stats 16px

#### **Filmography Heatmap:**
- **Desktop:** 10 columns grid
- **Tablet:** 6 columns grid
- **Mobile:** Horizontal scrollable timeline

#### **Analytics Charts:**
- **Desktop:** 2x2 grid (4 charts)
- **Tablet:** 2x2 grid (smaller charts)
- **Mobile:** Vertical stack (4 charts)

#### **Review Showcase:**
- **Desktop:** 3 columns grid
- **Tablet:** 2 columns grid
- **Mobile:** 1 column list

#### **AMA Section:**
- **Desktop:** Full-width cards, sidebar for filters
- **Tablet:** Full-width cards, filters above
- **Mobile:** Stacked cards, compact filters

#### **Badges Section:**
- **Desktop:** 4 columns grid
- **Tablet:** 3 columns grid
- **Mobile:** 2 columns grid

---

## 🔄 DATA FLOW & API INTEGRATION

### **API Endpoints Required:**

#### **Existing Endpoints (Phase 1):**
1. `GET /api/v1/critics/{username}` - Fetch critic profile
2. `GET /api/v1/critic-reviews/critic/{username}` - Fetch all reviews
3. `POST /api/v1/critics/{username}/follow` - Follow critic
4. `DELETE /api/v1/critics/{username}/follow` - Unfollow critic

#### **New Endpoints (Mock Data for Phase 2):**
5. `GET /api/v1/critics/{username}/analytics` - Fetch analytics data
6. `GET /api/v1/critics/{username}/badges` - Fetch earned badges
7. `GET /api/v1/critics/{username}/ama` - Fetch AMA questions
8. `POST /api/v1/critics/{username}/ama/questions` - Submit question
9. `POST /api/v1/critics/{username}/ama/questions/{id}/upvote` - Upvote question

### **Data Flow Diagram:**

```
User navigates to /critic/[username]
        ↓
Page component loads
        ↓
Parallel API calls:
├── GET /critics/{username} → CriticHeroSection, CriticBioSection
├── GET /critic-reviews/critic/{username} → CriticReviewShowcase, CriticFilmographyHeatmap
├── GET /critics/{username}/analytics (MOCK) → CriticAnalyticsSection
├── GET /critics/{username}/badges (MOCK) → CriticBadgesSection
└── GET /critics/{username}/ama (MOCK) → CriticAMASection
        ↓
Components render with loading states
        ↓
Data arrives → Components update
        ↓
Animations trigger (staggered reveals)
        ↓
User interactions:
├── Follow button → POST /critics/{username}/follow → Optimistic UI update
├── Heatmap tile click → Filter reviews in showcase
├── Chart interaction → Show tooltip
├── AMA upvote → POST /ama/questions/{id}/upvote → Optimistic UI update
└── Badge click → Show modal with details
```

### **Mock Data Strategy:**

Create mock data generators in `lib/critic/`:

**`mock-analytics.ts`:**
```typescript
export const generateMockAnalytics = (criticUsername: string) => ({
  genreAffinity: [
    { genre: 'Action', count: 45 },
    { genre: 'Drama', count: 38 },
    { genre: 'Sci-Fi', count: 32 },
    // ... 8-12 genres
  ],
  ratingDistribution: [
    { rating: 1, count: 2, percentage: 1.5 },
    { rating: 2, count: 5, percentage: 3.8 },
    // ... ratings 1-10
  ],
  keywords: [
    { word: 'cinematography', frequency: 45 },
    { word: 'performance', frequency: 38 },
    // ... top 50 words
  ],
  sentimentTimeline: [
    { month: 'Jan', avgRating: 7.2, reviewCount: 12 },
    // ... last 12 months
  ]
})
```

**`mock-badges.ts`:**
```typescript
export const generateMockBadges = (criticStats: any) => ({
  badges: [
    {
      id: 'horror-aficionado',
      name: 'Horror Aficionado',
      description: 'Reviewed 50+ horror movies',
      icon: 'ghost',
      category: 'genre',
      isEarned: criticStats.horrorReviews >= 50,
      earnedAt: criticStats.horrorReviews >= 50 ? '2025-09-15T00:00:00Z' : null,
      progress: Math.min(criticStats.horrorReviews, 50),
      total: 50
    },
    // ... all badges
  ]
})
```

**`mock-ama.ts`:**
```typescript
export const generateMockAMA = (criticUsername: string) => ({
  questions: [
    {
      id: 'q1',
      text: "What's your favorite movie of all time?",
      upvotes: 42,
      isUpvoted: false,
      askedBy: 'user123',
      askedAt: '2025-10-20T10:00:00Z',
      answer: {
        text: 'Inception - it changed how I think about storytelling.',
        answeredAt: '2025-10-21T14:30:00Z'
      }
    },
    // ... 20+ questions
  ]
})
```

---

## 📋 IMPLEMENTATION SEQUENCE

### **Phase 2A: Core Profile (2 hours)**

**Step 1: Page Setup (30 min)**
- Create `app/critic/[username]/page.tsx`
- Set up routing and params
- Implement data fetching (parallel API calls)
- Add loading and error states

**Step 2: Hero Section (60 min)**
- Create `CriticHeroSection.tsx`
- Implement video banner with fallback
- Add parallax scroll effect
- Create stats constellation (5 nodes + SVG lines)
- Add breathing pulse animation
- Implement hover interactions (trend graphs)

**Step 3: Bio & Follow (30 min)**
- Create `CriticBioSection.tsx`
- Display bio text with "Read More" expansion
- Add social links with icons
- Create `FollowButton.tsx` with optimistic UI
- Add ripple effect animation

---

### **Phase 2B: Review Showcase (1.5 hours)**

**Step 4: Review Cards (45 min)**
- Create `CriticReviewCard.tsx`
- Display movie poster, title, rating
- Add review excerpt with "Read More"
- Implement hover glow effect
- Add click navigation to full review

**Step 5: Review Showcase (45 min)**
- Create `CriticReviewShowcase.tsx`
- Implement search functionality
- Add filter dropdown (genre, rating, date)
- Add sort dropdown (latest, highest rated, most liked)
- Implement pagination or infinite scroll
- Add staggered reveal animation

---

### **Phase 2C: Advanced Features (2.5 hours)**

**Step 6: Stats Constellation (30 min)**
- Enhance hero section with interactive nodes
- Implement SVG constellation lines
- Add hover trend graphs (mini line charts)
- Add shimmer animation on lines

**Step 7: Filmography Heatmap (45 min)**
- Create `CriticFilmographyHeatmap.tsx`
- Generate grid from all reviews
- Implement color scale (rating → color)
- Add hover tooltip (movie poster + title + rating)
- Add click filter integration
- Implement wave reveal animation

**Step 8: Analytics Section (60 min)**
- Create `CriticAnalyticsSection.tsx`
- Implement Genre Affinity Chart (Recharts Radar)
- Implement Rating Distribution (Recharts Bar)
- Implement Keyword Cloud (Custom SVG)
- Implement Sentiment Timeline (Recharts Line)
- Add staggered chart animations
- Create mock data generator

**Step 9: Badges Section (30 min)**
- Create `CriticBadgesSection.tsx`
- Display badge grid (4 columns)
- Implement earned/locked states
- Add progress bars for locked badges
- Add flip animation on hover
- Create mock data generator

**Step 10: AMA Section (45 min)**
- Create `CriticAMASection.tsx`
- Implement question submission form
- Display questions list with upvotes
- Add upvote button with optimistic UI
- Implement answer display
- Add critic-only answer interface
- Create mock data generator

---

### **Phase 2D: Polish & Testing (1 hour)**

**Step 11: Animations (20 min)**
- Add page load sequence (2.5s choreography)
- Implement scroll-based animations
- Add interaction animations (hover, click)
- Test animation performance

**Step 12: Responsive Design (20 min)**
- Test all breakpoints (mobile, tablet, desktop)
- Adjust layouts for each breakpoint
- Test touch interactions on mobile
- Verify text readability at all sizes

**Step 13: Accessibility (10 min)**
- Add ARIA labels to all interactive elements
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast (WCAG AA)
- Add "Pause Video" button for motion sensitivity

**Step 14: Playwright E2E Tests (10 min)**
- Create test file: `tests/critic-profile.spec.ts`
- Test page load and data fetching
- Test follow/unfollow functionality
- Test heatmap click filtering
- Test AMA upvote
- Test responsive design

---

## ✅ TESTING STRATEGY

### **Unit Tests (Component Level):**

```typescript
// Example: CriticHeroSection.test.tsx
describe('CriticHeroSection', () => {
  it('renders video banner when video URL provided', () => {})
  it('falls back to image when video unavailable', () => {})
  it('displays stats constellation with 5 nodes', () => {})
  it('shows trend graph on node hover', () => {})
  it('applies parallax effect on scroll', () => {})
})
```

### **Integration Tests (Data Flow):**

```typescript
// Example: CriticProfilePage.test.tsx
describe('CriticProfilePage', () => {
  it('fetches critic data on mount', () => {})
  it('displays loading state while fetching', () => {})
  it('displays error state on fetch failure', () => {})
  it('renders all sections with fetched data', () => {})
  it('updates UI optimistically on follow click', () => {})
})
```

### **E2E Tests (Playwright):**

```typescript
// tests/critic-profile.spec.ts
test.describe('Critic Profile Page', () => {
  test('loads profile successfully', async ({ page }) => {
    await page.goto('/critic/testcritic')
    await expect(page.locator('h1')).toContainText('testcritic')
  })

  test('video banner plays automatically', async ({ page }) => {
    await page.goto('/critic/testcritic')
    const video = page.locator('video')
    await expect(video).toHaveAttribute('autoplay')
    await expect(video).toHaveAttribute('muted')
  })

  test('follow button toggles state', async ({ page }) => {
    await page.goto('/critic/testcritic')
    const followBtn = page.locator('button:has-text("Follow")')
    await followBtn.click()
    await expect(followBtn).toContainText('Following')
  })

  test('heatmap tile filters reviews', async ({ page }) => {
    await page.goto('/critic/testcritic')
    const tile = page.locator('[data-testid="heatmap-tile"]').first()
    await tile.click()
    // Verify reviews are filtered
  })

  test('AMA upvote updates count', async ({ page }) => {
    await page.goto('/critic/testcritic')
    const upvoteBtn = page.locator('[data-testid="upvote-btn"]').first()
    const initialCount = await upvoteBtn.locator('.count').textContent()
    await upvoteBtn.click()
    const newCount = await upvoteBtn.locator('.count').textContent()
    expect(parseInt(newCount!)).toBe(parseInt(initialCount!) + 1)
  })

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/critic/testcritic')
    // Verify mobile layout
  })
})
```

### **Accessibility Tests:**

```typescript
// Example: Accessibility checks
test('keyboard navigation works', async ({ page }) => {
  await page.goto('/critic/testcritic')
  await page.keyboard.press('Tab') // Focus follow button
  await page.keyboard.press('Enter') // Activate follow
  // Verify state change
})

test('screen reader announces content', async ({ page }) => {
  await page.goto('/critic/testcritic')
  const hero = page.locator('[role="banner"]')
  await expect(hero).toHaveAttribute('aria-label')
})

test('color contrast meets WCAG AA', async ({ page }) => {
  // Use axe-core or similar tool
})
```

---

## 🎨 DESIGN SYSTEM COMPLIANCE

### **Colors (Siddu Dark Mode):**

```typescript
const colors = {
  background: '#1A1A1A',
  backgroundCard: '#282828',
  primary: '#00BFFF',      // Cyan
  secondary: '#FFD700',    // Gold
  accent: '#8B5CF6',       // Purple
  text: '#E0E0E0',         // Light Gray
  textMuted: '#A0A0A0',    // Muted Gray
  border: '#3A3A3A',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
}
```

### **Typography:**

```typescript
const typography = {
  headings: 'font-inter',  // Inter font family
  body: 'font-dmsans',     // DM Sans font family
  code: 'font-mono',
  sizes: {
    h1: '48px',  // Desktop
    h2: '36px',
    h3: '28px',
    h4: '24px',
    body: '16px',
    small: '14px',
  }
}
```

### **Spacing:**

```typescript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
}
```

### **Animations:**

```typescript
const animations = {
  duration: {
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  stagger: {
    fast: '50ms',
    normal: '100ms',
    slow: '200ms',
  }
}
```

### **Glow Effects:**

```typescript
const glowEffects = {
  cyan: 'box-shadow: 0 0 20px rgba(0, 191, 255, 0.5)',
  gold: 'box-shadow: 0 0 20px rgba(255, 215, 0, 0.5)',
  purple: 'box-shadow: 0 0 20px rgba(139, 92, 246, 0.5)',
}
```

---

## ⚠️ RISK ASSESSMENT

### **Potential Challenges:**

1. **Performance:**
   - **Risk:** Too many animations causing jank
   - **Mitigation:** Use `will-change` CSS property, optimize animations with `transform` and `opacity` only, lazy load heavy components

2. **Data Volume:**
   - **Risk:** Heatmap with 1000+ reviews causing slow render
   - **Mitigation:** Virtualize heatmap grid, paginate reviews, use React.memo for cards

3. **Browser Compatibility:**
   - **Risk:** Video autoplay blocked in some browsers
   - **Mitigation:** Graceful fallback to image, detect autoplay support

4. **Accessibility:**
   - **Risk:** Complex animations causing motion sickness
   - **Mitigation:** Respect `prefers-reduced-motion`, provide "Pause Animations" toggle

5. **Mobile Performance:**
   - **Risk:** Heavy charts causing lag on mobile
   - **Mitigation:** Simplify charts on mobile, reduce data points, use CSS animations instead of JS

### **Mitigation Strategies:**

```typescript
// Performance optimization
const CriticReviewCard = React.memo(({ review }) => {
  // Component implementation
})

// Lazy loading
const CriticAnalyticsSection = dynamic(
  () => import('@/components/critic/profile/critic-analytics-section'),
  { ssr: false, loading: () => <AnalyticsSkeleton /> }
)

// Reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const animationDuration = prefersReducedMotion ? 0 : 0.5

// Virtualization
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

## ✅ SUCCESS CRITERIA

### **Functional Requirements:**

- ✅ All components render without errors
- ✅ All API calls fetch and display data correctly
- ✅ Follow/unfollow updates UI optimistically
- ✅ Heatmap filters reviews on click
- ✅ Charts display correct data
- ✅ AMA upvote works with optimistic UI
- ✅ Badges display earned/locked states correctly
- ✅ Search/filter/sort work in review showcase
- ✅ Responsive design works at all breakpoints
- ✅ Loading and error states display correctly

### **Performance Requirements:**

- ✅ Page load time < 3 seconds (on 3G)
- ✅ Time to Interactive (TTI) < 5 seconds
- ✅ Lighthouse Performance score > 90
- ✅ No layout shifts (CLS < 0.1)
- ✅ Smooth 60fps animations

### **Accessibility Requirements:**

- ✅ WCAG AA color contrast compliance
- ✅ Keyboard navigation works for all interactive elements
- ✅ Screen reader announces all content correctly
- ✅ Focus indicators visible
- ✅ Motion can be reduced via system preference

### **Testing Requirements:**

- ✅ 100% component unit test coverage
- ✅ All E2E tests passing (10+ scenarios)
- ✅ Responsive design tested on 5+ devices
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ Accessibility audit passing (axe-core)

### **Code Quality Requirements:**

- ✅ No TypeScript errors
- ✅ No console errors or warnings
- ✅ ESLint passing
- ✅ Code follows existing patterns
- ✅ Components are reusable and composable
- ✅ Proper error handling throughout

---

## 📊 DELIVERABLES CHECKLIST

### **Components (10):**
- [ ] `app/critic/[username]/page.tsx`
- [ ] `components/critic/profile/critic-hero-section.tsx`
- [ ] `components/critic/profile/critic-bio-section.tsx`
- [ ] `components/critic/profile/critic-stats-card.tsx`
- [ ] `components/critic/profile/critic-filmography-heatmap.tsx`
- [ ] `components/critic/profile/critic-review-showcase.tsx`
- [ ] `components/critic/profile/critic-review-card.tsx`
- [ ] `components/critic/profile/critic-analytics-section.tsx`
- [ ] `components/critic/profile/critic-ama-section.tsx`
- [ ] `components/critic/profile/critic-badges-section.tsx`
- [ ] `components/critic/profile/follow-button.tsx`

### **Mock Data (3):**
- [ ] `lib/critic/mock-analytics.ts`
- [ ] `lib/critic/mock-badges.ts`
- [ ] `lib/critic/mock-ama.ts`

### **Tests (1):**
- [ ] `tests/critic-profile.spec.ts` (Playwright E2E)

### **Documentation (1):**
- [ ] `CRITIC_HUB_PHASE_2_COMPLETE.md` (Completion report)

---

## 🚀 NEXT STEPS

**After Approval:**
1. Begin Phase 2A implementation (Core Profile)
2. Implement components in sequence
3. Test each component before moving to next
4. Create Playwright tests after all components complete
5. Perform final QA and accessibility audit
6. Create completion report

**Estimated Total Time:** 7 hours

---

**STATUS:** 📋 **AWAITING APPROVAL TO BEGIN IMPLEMENTATION**

**Approval Required From:** User

**Once Approved:** Implementation will begin immediately with Phase 2A (Core Profile)

---

**Compiled By:** Autonomous AI Agent
**Design Duration:** 45 minutes
**Analysis Depth:** Comprehensive
**Innovation Level:** Best-in-Class
**Ready to Build:** ✅ YES

---

## 📐 DESIGN SYSTEM COMPLIANCE CHECKLIST

### **Color Usage:**
- [ ] All backgrounds use `#1A1A1A` or `#282828`
- [ ] Primary actions use `#00BFFF` (cyan)
- [ ] Secondary highlights use `#FFD700` (gold)
- [ ] Text uses `#E0E0E0` (light gray) or `#A0A0A0` (muted)
- [ ] Borders use `#3A3A3A`
- [ ] Glow effects use `rgba(0, 191, 255, 0.5)` or similar
- [ ] Error states use `#EF4444`
- [ ] Success states use `#10B981`

### **Typography:**
- [ ] Headings use `font-inter`
- [ ] Body text uses `font-dmsans`
- [ ] Font sizes follow design system scale
- [ ] Line heights are 1.5x for body, 1.2x for headings
- [ ] Letter spacing is -0.02em for headings

### **Spacing:**
- [ ] Consistent spacing using Tailwind scale (4, 8, 16, 24, 32, 48, 64)
- [ ] Padding follows 8px grid system
- [ ] Margins follow 8px grid system
- [ ] Component gaps use `gap-4`, `gap-6`, or `gap-8`

### **Animations:**
- [ ] All animations use `duration-300` or `duration-500`
- [ ] Easing uses `ease-out` for entrances, `ease-in-out` for interactions
- [ ] Stagger delays are 50-100ms between items
- [ ] Parallax speed is 0.3-0.5x scroll speed
- [ ] Hover effects use `scale-105` or similar
- [ ] Glow effects use `shadow-glow` utility

### **Components:**
- [ ] All buttons use shadcn/ui `Button` component
- [ ] All cards use shadcn/ui `Card` component
- [ ] All badges use shadcn/ui `Badge` component
- [ ] All tooltips use shadcn/ui `Tooltip` component
- [ ] All dialogs use shadcn/ui `Dialog` component

### **Accessibility:**
- [ ] All interactive elements have `aria-label` or `aria-labelledby`
- [ ] All images have `alt` text
- [ ] All forms have proper labels
- [ ] Focus indicators are visible (ring-2 ring-cyan-500)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Motion respects `prefers-reduced-motion`

---

## 🎯 FINAL IMPLEMENTATION NOTES

### **Code Organization:**

```
components/critic/profile/
├── index.ts                          # Export all components
├── critic-hero-section.tsx           # 200 lines
├── critic-bio-section.tsx            # 100 lines
├── critic-stats-card.tsx             # 80 lines
├── critic-filmography-heatmap.tsx    # 250 lines
├── critic-review-showcase.tsx        # 300 lines
├── critic-review-card.tsx            # 150 lines
├── critic-analytics-section.tsx      # 400 lines
├── critic-ama-section.tsx            # 350 lines
├── critic-badges-section.tsx         # 200 lines
└── follow-button.tsx                 # 100 lines

Total: ~2,130 lines of component code
```

### **Dependencies to Install:**

```bash
# Already installed (verified in package.json):
- recharts (for charts)
- framer-motion (for animations)
- lucide-react (for icons)
- @radix-ui/* (for UI primitives)

# No new dependencies needed! ✅
```

### **Environment Variables:**

```bash
# .env.local (frontend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_BACKEND=true
```

### **TypeScript Interfaces:**

```typescript
// types/critic.ts
export interface CriticProfile {
  id: number
  external_id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  banner_image_url: string | null
  banner_video_url: string | null
  is_verified: boolean
  verification_level: 'basic' | 'professional' | 'celebrity'
  total_reviews: number
  total_followers: number
  total_following: number
  avg_rating: number
  total_likes: number
  total_views: number
  joined_at: string
  social_links: SocialLink[]
}

export interface SocialLink {
  id: number
  platform: string
  url: string
  display_text: string | null
}

export interface CriticReview {
  id: number
  external_id: string
  title: string
  content: string
  rating: number
  slug: string
  published_at: string
  likes_count: number
  comments_count: number
  views_count: number
  movie: {
    id: number
    external_id: string
    title: string
    poster_url: string | null
    year: string | null
  }
}

export interface AnalyticsData {
  genreAffinity: { genre: string; count: number }[]
  ratingDistribution: { rating: number; count: number; percentage: number }[]
  keywords: { word: string; frequency: number }[]
  sentimentTimeline: { month: string; avgRating: number; reviewCount: number }[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'genre' | 'milestone' | 'engagement' | 'quality'
  isEarned: boolean
  earnedAt: string | null
  progress: number
  total: number
}

export interface AMAQuestion {
  id: string
  text: string
  upvotes: number
  isUpvoted: boolean
  askedBy: string
  askedAt: string
  answer: {
    text: string
    answeredAt: string
  } | null
}
```

---

## 🎊 CONCLUSION

This comprehensive design plan provides a complete blueprint for implementing the most advanced and visually stunning Critic Profile page in the IWM platform. The plan includes:

✅ **11 Components** - All fully specified with features, animations, and interactions
✅ **6 Enhanced Features** - Beyond original specification
✅ **Complete Animation Choreography** - 2.5-second page load sequence
✅ **Full Responsive Design** - Mobile, tablet, desktop, large desktop
✅ **Comprehensive Testing Strategy** - Unit, integration, E2E, accessibility
✅ **Mock Data Generators** - For all new features
✅ **Risk Mitigation** - Performance, compatibility, accessibility
✅ **Success Criteria** - Measurable outcomes

**Total Estimated Implementation Time:** 7 hours

**Innovation Highlights:**
- 🎬 Video banner with parallax
- ✨ Stats constellation with interactive nodes
- 🎨 Filmography heatmap with color-coded ratings
- 📊 4 interactive analytics charts
- 🎮 Gamification with achievement badges
- 💬 AMA feature for community engagement

**This design plan is ready for immediate implementation upon approval.**

---

**STATUS:** 📋 **AWAITING USER APPROVAL**

**Next Action:** User reviews plan and approves to begin Phase 2A implementation

---

**Document Version:** 1.0
**Last Updated:** October 22, 2025
**Approval Status:** Pending
**Implementation Ready:** ✅ YES

