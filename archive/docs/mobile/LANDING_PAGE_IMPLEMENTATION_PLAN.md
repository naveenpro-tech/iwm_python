# 🎬 Landing Page Implementation Plan - IWM Mobile-First MVP

**Date**: 2025-11-03  
**Target**: Mobile-First Landing Page (320px - 428px)  
**Status**: ✅ COMPLETE

---

## 📋 Executive Summary

This document provides a complete implementation plan for the IWM landing page, designed mobile-first for the MVP launch. The landing page will replace the current homepage with a streamlined, movie-focused experience optimized for mobile devices.

---

## 🎯 Landing Page Structure

### Current Homepage Issues:
- PersonalizedActivitySlider contains Pulse data (hide for MVP)
- CinematicVignetteSection is artistic but not essential
- TrendingPulseSection is Pulse-related (hide for MVP)
- No clear hero section with value proposition
- Not optimized for mobile viewports

### New Landing Page Structure (Mobile-First):

```
┌─────────────────────────────────────┐
│  1. HERO SECTION                    │
│  - New Releases Slider              │
│  - Value Proposition                │
│  - CTA Buttons                      │
├─────────────────────────────────────┤
│  2. FRESH OFF THE LOT               │
│  - Recently Released Movies         │
│  - Horizontal Scroll Carousel       │
├─────────────────────────────────────┤
│  3. CINEMATIC ARTS                  │
│  - Curated Artistic Films           │
│  - Grid Layout                      │
├─────────────────────────────────────┤
│  4. GLOBAL MASTERPIECES             │
│  - Classic International Films      │
│  - Horizontal Scroll Carousel       │
├─────────────────────────────────────┤
│  5. SIDDU'S PERSONAL PICKS          │
│  - Curated Selections               │
│  - Featured Cards                   │
├─────────────────────────────────────┤
│  6. UNFORGETTABLE MOMENTS           │
│  - Memorable Scenes                 │
│  - Grid Layout                      │
├─────────────────────────────────────┤
│  7. BEST SEEN                       │
│  - Recommended Viewing              │
│  - List/Grid Hybrid                 │
├─────────────────────────────────────┤
│  8. EXPLORER                        │
│  - Browse by Genre/Category         │
│  - Quick Links Grid                 │
├─────────────────────────────────────┤
│  9. WHAT'S BUZZING                  │
│  - Trending/Popular Movies          │
│  - Horizontal Scroll Carousel       │
└─────────────────────────────────────┘
```

---

## 🎨 Section 1: Hero Section

### Design Specifications:

**Mobile (320px - 767px)**:
- Height: `h-[70vh]` (70% of viewport)
- Full-width background image slider
- Overlay gradient: `bg-gradient-to-t from-black via-black/60 to-transparent`
- Content positioned at bottom

**Desktop (768px+)**:
- Height: `h-[85vh]`
- Split layout: Image left, content right

### Components:

```typescript
// components/landing/hero-section.tsx
interface HeroSlide {
  id: string;
  title: string;
  tagline: string;
  backdropUrl: string;
  posterUrl: string;
  releaseDate: string;
  genres: string[];
  rating: number;
  movieId: string;
}

export function HeroSection({ slides }: { slides: HeroSlide[] }) {
  // Auto-play slider (5 seconds per slide)
  // Touch swipe support
  // Pause on hover/touch
  // Smooth transitions
}
```

### Content:

**Slide Content**:
- Movie backdrop image (full-screen)
- Movie title (large, bold)
- Tagline/description (2 lines max on mobile)
- Release date badge
- Genre pills (max 3 on mobile)
- Star rating
- CTA buttons:
  - "Watch Trailer" (primary)
  - "Add to Watchlist" (secondary)

**Value Proposition** (Below slider):
- "Discover, Review, and Track Your Movie Journey"
- "Join thousands of movie lovers"
- "Browse 10,000+ movies"

### Mobile Optimizations:
- Lazy load images
- Preload next slide
- Touch-friendly swipe gestures
- Larger touch targets (56px minimum)
- Readable text with shadow/outline
- Auto-pause on scroll

### API Endpoint:
```typescript
GET /api/v1/movies/featured?limit=5&sort=newest
```

**Estimated Effort**: 8 hours

---

## 🎬 Section 2: Fresh Off The Lot (New Releases)

### Design Specifications:

**Mobile**:
- Horizontal scroll carousel
- Card size: `w-[140px] h-[210px]` (poster aspect ratio)
- Gap: `gap-3`
- Padding: `px-4`
- Snap scroll: `snap-x snap-mandatory`

**Desktop**:
- 5-6 cards visible
- Scroll buttons on hover

### Components:

```typescript
// components/landing/fresh-off-the-lot-section.tsx
export function FreshOffTheLotSection({ movies }: { movies: Movie[] }) {
  // Horizontal scroll with touch support
  // Lazy load images
  // Skeleton loading
}
```

### Content:
- Section title: "Fresh Off The Lot"
- Subtitle: "Recently Released Movies"
- "View All" link
- Movie cards:
  - Poster image
  - Title (truncated to 2 lines)
  - Release date
  - Star rating

### Mobile Optimizations:
- Smooth scroll with momentum
- Snap to card edges
- Show 2.5 cards on mobile (hint at more content)
- Lazy load images as user scrolls
- Skeleton placeholders

### API Endpoint:
```typescript
GET /api/v1/movies/new-releases?limit=20&sort=release_date
```

**Estimated Effort**: 4 hours

---

## 🎨 Section 3: Cinematic Arts

### Design Specifications:

**Mobile**:
- Grid layout: `grid-cols-2 gap-4`
- Card size: Full width of column
- Aspect ratio: `aspect-[2/3]`

**Desktop**:
- Grid layout: `grid-cols-4 lg:grid-cols-5`

### Components:

```typescript
// components/landing/cinematic-arts-section.tsx
export function CinematicArtsSection({ films }: { films: Movie[] }) {
  // Grid layout with lazy loading
  // Filter by artistic/acclaimed films
}
```

### Content:
- Section title: "Cinematic Arts"
- Subtitle: "Curated Artistic Films"
- "Explore More" link
- Film cards:
  - Poster image
  - Title
  - Director name
  - Awards badge (if applicable)

### Mobile Optimizations:
- 2 columns on mobile (comfortable viewing)
- Lazy load images (IntersectionObserver)
- Skeleton loading
- Touch-friendly cards

### API Endpoint:
```typescript
GET /api/v1/movies/curated?category=artistic&limit=12
```

**Estimated Effort**: 3 hours

---

## 🌍 Section 4: Global Masterpieces

### Design Specifications:

**Mobile**:
- Horizontal scroll carousel (same as Section 2)
- Card size: `w-[160px] h-[240px]` (slightly larger)
- Show country flag badge

**Desktop**:
- 5 cards visible

### Components:

```typescript
// Reuse MovieCarousel component
import { MovieCarousel } from '@/components/homepage/movie-carousel';
```

### Content:
- Section title: "Global Masterpieces"
- Subtitle: "Classic & Acclaimed International Films"
- "Discover More" link
- Movie cards:
  - Poster image
  - Title
  - Country flag
  - Year
  - Star rating

### Mobile Optimizations:
- Same as Section 2
- Country flag overlay on poster

### API Endpoint:
```typescript
GET /api/v1/movies/featured?limit=20&sort=rating
```

**Estimated Effort**: 2 hours (reuse existing component)

---

## ⭐ Section 5: Siddu's Personal Picks

### Design Specifications:

**Mobile**:
- Featured card layout (larger cards)
- Vertical stack: `flex flex-col gap-6`
- Card size: Full width, `h-[300px]`

**Desktop**:
- 3 columns grid

### Components:

```typescript
// components/landing/siddus-picks-section.tsx
export function SiddusPicksSection({ picks }: { picks: CuratedPick[] }) {
  // Featured card layout
  // Show curator notes
}
```

### Content:
- Section title: "Siddu's Personal Picks"
- Subtitle: "Handpicked by Our Curators"
- Featured cards:
  - Backdrop image (landscape)
  - Movie title
  - Curator note (2-3 lines)
  - "Why This Movie" badge
  - CTA: "Watch Now"

### Mobile Optimizations:
- Vertical stack on mobile
- Larger cards for emphasis
- Readable curator notes
- Touch-friendly CTAs

### API Endpoint:
```typescript
GET /api/v1/movies/curated/siddus-picks?limit=6
```

**Note**: This requires admin dashboard enhancement (Task 4)

**Estimated Effort**: 5 hours

---

## 🎞️ Section 6: Unforgettable Moments

### Design Specifications:

**Mobile**:
- Grid layout: `grid-cols-1 gap-4`
- Card size: Full width, `aspect-video`

**Desktop**:
- Grid layout: `grid-cols-3`

### Components:

```typescript
// Reuse BestScenesSection component
import { BestScenesSection } from '@/components/homepage/best-scenes-section';
```

### Content:
- Section title: "Unforgettable Moments"
- Subtitle: "Memorable Movie Scenes"
- Scene cards:
  - Scene thumbnail (video aspect)
  - Movie title
  - Scene description
  - Play icon overlay

### Mobile Optimizations:
- Single column on mobile (full-width scenes)
- Lazy load thumbnails
- Touch to play preview

### API Endpoint:
```typescript
// Use existing mock data or create API
GET /api/v1/scenes/featured?limit=6
```

**Estimated Effort**: 2 hours (reuse existing component)

---

## 👁️ Section 7: Best Seen

### Design Specifications:

**Mobile**:
- List/Grid hybrid
- Card size: `flex flex-row gap-3`
- Poster: `w-[80px] h-[120px]`
- Info: `flex-1`

**Desktop**:
- Grid layout: `grid-cols-2 lg:grid-cols-3`

### Components:

```typescript
// components/landing/best-seen-section.tsx
export function BestSeenSection({ recommendations }: { recommendations: Movie[] }) {
  // List/Grid hybrid layout
  // Show viewing recommendations
}
```

### Content:
- Section title: "Best Seen"
- Subtitle: "Recommended Viewing Experiences"
- Recommendation cards:
  - Small poster
  - Movie title
  - Recommendation reason (e.g., "Best on IMAX", "Perfect for Date Night")
  - Star rating
  - "Add to Watchlist" button

### Mobile Optimizations:
- Horizontal layout on mobile (poster + info)
- Compact design
- Touch-friendly buttons

### API Endpoint:
```typescript
GET /api/v1/movies/recommendations?limit=10
```

**Estimated Effort**: 4 hours

---

## 🧭 Section 8: Explorer

### Design Specifications:

**Mobile**:
- Grid layout: `grid-cols-2 gap-3`
- Card size: `aspect-square`
- Icon + Label layout

**Desktop**:
- Grid layout: `grid-cols-4 lg:grid-cols-6`

### Components:

```typescript
// components/landing/explorer-section.tsx
export function ExplorerSection() {
  // Quick links to browse categories
}
```

### Content:
- Section title: "Explorer"
- Subtitle: "Browse by Genre & Category"
- Category cards:
  - Icon (genre-specific)
  - Category name
  - Movie count
  - Background gradient

**Categories**:
- Action
- Drama
- Comedy
- Thriller
- Romance
- Sci-Fi
- Horror
- Documentary
- Animation
- International

### Mobile Optimizations:
- 2 columns on mobile
- Large touch targets
- Colorful gradients
- Icon-first design

### API Endpoint:
```typescript
GET /api/v1/genres
```

**Estimated Effort**: 3 hours

---

## 🔥 Section 9: What's Buzzing

### Design Specifications:

**Mobile**:
- Horizontal scroll carousel
- Card size: `w-[180px] h-[270px]`
- Show trending badge

**Desktop**:
- 5-6 cards visible

### Components:

```typescript
// Reuse MovieCarousel component
import { MovieCarousel } from '@/components/homepage/movie-carousel';
```

### Content:
- Section title: "What's Buzzing"
- Subtitle: "Trending & Popular Movies"
- "See All Trending" link
- Movie cards:
  - Poster image
  - Title
  - Trending badge (🔥 #1, #2, etc.)
  - Star rating
  - View count (optional)

### Mobile Optimizations:
- Same as Section 2
- Trending badge overlay

### API Endpoint:
```typescript
GET /api/v1/movies/trending?limit=20&period=week
```

**Estimated Effort**: 2 hours (reuse existing component)

---

## 🎨 Design System & Styling

### Color Palette:
- Background: `#0A0A0A`, `#1A1A1A`
- Text: `#E0E0E0`, `#A0A0A0`
- Accent: `#00BFFF` (cyan), `#FFD700` (gold)
- Borders: `#3A3A3A`

### Typography:
- Headings: Inter font, bold
- Body: DM Sans font, regular
- Section titles: `text-2xl md:text-3xl font-bold`
- Subtitles: `text-sm md:text-base text-gray-400`

### Spacing:
- Section padding: `py-8 md:py-12`
- Container padding: `px-4 md:px-6`
- Section gap: `space-y-8 md:space-y-12`

### Animations:
- Framer Motion for section reveals
- Smooth scroll behavior
- Skeleton loading states
- Hover effects (desktop only)

---

## 📱 Mobile-Specific Optimizations

### 1. Performance:
- Lazy load all images
- Preload critical images (hero)
- Code splitting per section
- Defer non-critical JavaScript
- Use WebP images
- Implement skeleton loading

### 2. Touch Interactions:
- Swipe gestures for carousels
- Pull-to-refresh (optional)
- Touch-friendly buttons (44px minimum)
- Smooth momentum scrolling
- Haptic feedback (optional)

### 3. Loading Strategy:
```typescript
// Progressive loading
1. Load hero section immediately
2. Load above-the-fold sections
3. Lazy load below-the-fold sections
4. Prefetch on scroll
```

### 4. Network Optimization:
- Compress images
- Use CDN for static assets
- Implement service worker caching
- Show offline message

---

## 🔧 Implementation Steps

### Phase 1: Setup (4 hours)
- [ ] Create `app/landing/page.tsx` (or update `app/page.tsx`)
- [ ] Create section components folder: `components/landing/`
- [ ] Set up API endpoints
- [ ] Create mock data for development

### Phase 2: Hero Section (8 hours)
- [ ] Build HeroSection component
- [ ] Implement auto-play slider
- [ ] Add touch swipe support
- [ ] Optimize images
- [ ] Add CTA buttons
- [ ] Test on mobile devices

### Phase 3: Content Sections (20 hours)
- [ ] Fresh Off The Lot (4 hours)
- [ ] Cinematic Arts (3 hours)
- [ ] Global Masterpieces (2 hours)
- [ ] Siddu's Personal Picks (5 hours)
- [ ] Unforgettable Moments (2 hours)
- [ ] Best Seen (4 hours)

### Phase 4: Navigation Sections (5 hours)
- [ ] Explorer (3 hours)
- [ ] What's Buzzing (2 hours)

### Phase 5: Polish & Optimization (8 hours)
- [ ] Add loading skeletons
- [ ] Implement lazy loading
- [ ] Optimize images
- [ ] Add error handling
- [ ] Test performance
- [ ] Fix mobile issues

### Phase 6: Testing (6 hours)
- [ ] Test on iPhone SE (320px)
- [ ] Test on iPhone 14 (390px)
- [ ] Test on iPhone 14 Pro Max (428px)
- [ ] Test on Android (360px)
- [ ] Test slow 3G network
- [ ] Fix bugs

---

## 📊 Component Breakdown

| Component | Reuse Existing | New Component | Effort |
|-----------|---------------|---------------|--------|
| Hero Section | ❌ | ✅ | 8h |
| Fresh Off The Lot | ✅ (MovieCarousel) | ❌ | 4h |
| Cinematic Arts | ❌ | ✅ | 3h |
| Global Masterpieces | ✅ (MasterpieceCarousel) | ❌ | 2h |
| Siddu's Picks | ✅ (SiddusPicksSection) | ❌ | 5h |
| Unforgettable Moments | ✅ (BestScenesSection) | ❌ | 2h |
| Best Seen | ❌ | ✅ | 4h |
| Explorer | ❌ | ✅ | 3h |
| What's Buzzing | ✅ (MovieCarousel) | ❌ | 2h |

**Total Effort**: 51 hours (~1.5 weeks)

---

## 📝 API Requirements

### New Endpoints Needed:
1. `GET /api/v1/movies/featured` - Hero slider movies
2. `GET /api/v1/movies/curated/siddus-picks` - Curated selections
3. `GET /api/v1/movies/recommendations` - Best Seen recommendations
4. `GET /api/v1/movies/trending` - What's Buzzing

### Existing Endpoints to Use:
1. `GET /api/v1/movies/new-releases` - Fresh Off The Lot
2. `GET /api/v1/movies/featured` - Global Masterpieces
3. `GET /api/v1/genres` - Explorer categories

---

## ✅ Success Criteria

- [ ] Page loads in < 3 seconds on 3G
- [ ] All images lazy loaded
- [ ] Smooth scrolling on mobile
- [ ] Touch gestures work perfectly
- [ ] No horizontal overflow
- [ ] All text readable (16px minimum)
- [ ] All buttons tappable (44px minimum)
- [ ] Works on 320px width
- [ ] Lighthouse score > 90
- [ ] No console errors

---

**Document Status**: ✅ Complete  
**Next Step**: Begin implementation  
**Estimated Timeline**: 1.5 weeks


