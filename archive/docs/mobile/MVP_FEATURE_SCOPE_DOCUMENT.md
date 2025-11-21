# 🎯 MVP Feature Scope Document - IWM Mobile-First Launch

**Date**: 2025-11-03  
**Target**: Mobile-First MVP (Movies Only)  
**Status**: ✅ COMPLETE

---

## 📋 Executive Summary

This document defines the exact feature scope for the IWM MVP launch. The strategy is to **HIDE (not delete)** non-movie features while keeping all movie-related functionality fully operational. This allows for a clean, focused mobile experience while preserving the ability to re-enable features post-launch.

---

## ✅ FEATURES TO KEEP (Movie-Focused MVP)

### 1. **User Authentication** ✅
**Status**: KEEP - Essential  
**Components**:
- Login page (`app/login/page.tsx`)
- Signup page (`app/signup/page.tsx`)
- Login form (`components/login-form.tsx`)
- Signup form (`components/signup-form.tsx`)
- JWT authentication (`lib/auth.ts`)

**Mobile Optimization Needed**:
- Increase input field heights to 44px
- Larger submit buttons
- Better error message visibility

---

### 2. **Movie Browsing & Discovery** ✅
**Status**: KEEP - Core Feature  
**Components**:
- Movies page (`app/movies/page.tsx`)
- Explore page (`app/explore/page.tsx`)
- Movie grid (`components/movies/movie-grid.tsx`)
- Movie list (`components/movies/movie-list.tsx`)
- Content grid (`components/explore/content-grid.tsx`)

**Mobile Optimization Needed**:
- Responsive grid layouts (1-2 columns on mobile)
- Mobile filter modal (currently hidden)
- Touch-friendly sorting controls

---

### 3. **Movie Detail Pages** ✅
**Status**: KEEP - Core Feature  
**Components**:
- Movie detail page (`app/movies/[id]/page.tsx`)
- Movie hero section (`components/movie-hero-section-enhanced.tsx`)
- Cast page (`app/movies/[id]/cast/page.tsx`)
- Reviews page (`app/movies/[id]/reviews/page.tsx`)

**Mobile Optimization Needed**:
- Reduce hero height on mobile (60vh instead of 85vh)
- Stack poster and info vertically
- Optimize cast grid for mobile

---

### 4. **Search Functionality** ✅
**Status**: KEEP - Essential  
**Components**:
- Search overlay (`components/search/search-overlay.tsx`)
- Movie results (`components/search/results/movie-results.tsx`)
- Search API (`lib/api/search.ts`)

**Mobile Optimization Needed**:
- Full-screen search on mobile
- Larger search input
- Better results layout

---

### 5. **User Watchlist** ✅
**Status**: KEEP - Core Feature  
**Components**:
- Watchlist page (`app/watchlist/page.tsx`)
- Watchlist card (`components/watchlist/watchlist-card.tsx`)
- Watchlist API (`lib/api/watchlist.ts`)

**Mobile Optimization Needed**:
- Single column layout on small screens
- Larger touch targets for actions
- Swipe-to-delete (future enhancement)

---

### 6. **Movie Reviews & Ratings** ✅
**Status**: KEEP - Core Feature  
**Components**:
- Review form (`components/review-form.tsx`)
- Reviews page (`app/reviews/page.tsx`)
- Review API (`lib/api/reviews.ts`)

**Mobile Optimization Needed**:
- Larger star rating component (32px minimum)
- Full-screen review modal on mobile
- Better textarea sizing

---

### 7. **User Profiles (Movie-Related Only)** ✅
**Status**: KEEP - Essential  
**Components**:
- Profile page (`app/profile/[username]/page.tsx`)
- Profile header (`components/profile/profile-header.tsx`)
- Edit profile modal (`components/profile/edit-profile-modal.tsx`)

**Mobile Optimization Needed**:
- Stack profile elements vertically
- Larger avatar on mobile
- Better stats layout

**Note**: Only show movie-related activity (reviews, watchlist, favorites). Hide Pulse activity for MVP.

---

### 8. **Homepage (Movie Sections Only)** ✅
**Status**: KEEP - Modified  
**File**: `app/page.tsx`

**Sections to KEEP**:
1. ~~PersonalizedActivitySlider~~ → **HIDE for MVP** (contains Pulse data)
2. ~~CinematicVignetteSection~~ → **HIDE for MVP** (artistic, not essential)
3. **NewReleasesSection** → ✅ KEEP (Fresh Off the Lot)
4. **GlobalMasterpiecesSection** → ✅ KEEP
5. **SiddusPicksSection** → ✅ KEEP (Siddu's Personal Picks)
6. **BestScenesSection** → ✅ KEEP (Unforgettable Moments)
7. ~~TrendingPulseSection~~ → **HIDE for MVP** (Pulse-related)

**New Hero Section Needed**:
- Create mobile-first hero with new releases slider
- Clear value proposition
- Eye-catching visuals

---

### 9. **Navigation** ✅
**Status**: KEEP - Modified  
**Components**:
- Top navigation (`components/navigation/top-navigation.tsx`)
- Bottom navigation (`components/navigation/bottom-navigation.tsx`)
- Mobile menu overlay (`components/navigation/mobile-menu-overlay.tsx`)

**Links to KEEP**:
- Home
- Explore
- Movies
- Search
- Profile
- Watchlist
- Settings

**Links to HIDE**:
- Pulse
- Scene Explorer (hide for MVP, can re-enable later)
- Visual Treats (hide for MVP)
- Talent Hub (hide for MVP)
- Critic Hub (hide for MVP)
- Cricket (hide for MVP)

---

### 10. **Settings** ✅
**Status**: KEEP - Modified  
**File**: `app/settings/page.tsx`

**Tabs to KEEP**:
- Profile
- Account
- Privacy
- Display
- Preferences
- Notifications

**Tabs to HIDE**:
- Roles (hide role-specific settings for MVP)
- Critic settings
- Talent settings
- Industry Pro settings

---

## ❌ FEATURES TO HIDE (Not Delete)

### 1. **Pulse / Social Feed** ❌
**Status**: HIDE COMPLETELY for MVP  
**Reason**: Not movie-focused, adds complexity

**Files to Hide**:
- `app/pulse/page.tsx`
- `app/pulse/enhanced/page.tsx`
- All components in `components/pulse/`
- Pulse navigation links
- Pulse sections on homepage

**Implementation**:
```typescript
// Feature flag approach
const ENABLE_PULSE = false; // Set to true post-MVP

// In navigation
{ENABLE_PULSE && <Link href="/pulse">Pulse</Link>}

// In homepage
{ENABLE_PULSE && <TrendingPulseSection />}
```

**Database**: Keep all Pulse tables intact, just hide UI

---

### 2. **Sidhu Snaps** ❌
**Status**: HIDE for MVP  
**Reason**: Not essential for movie browsing

**Components to Hide**:
- Any Sidhu Snaps sections
- Sidhu Snaps navigation links

**Implementation**: Feature flag `ENABLE_SIDHU_SNAPS = false`

---

### 3. **Scene Explorer** ❌
**Status**: HIDE for MVP (Can Re-enable Later)  
**Reason**: Nice-to-have, not core movie browsing

**Files to Hide**:
- `app/scene-explorer/page.tsx`
- `components/scene-explorer/`
- Scene Explorer navigation link

**Implementation**: Feature flag `ENABLE_SCENE_EXPLORER = false`

**Note**: Keep BestScenesSection on homepage (different from full Scene Explorer)

---

### 4. **Visual Treats** ❌
**Status**: HIDE for MVP  
**Reason**: Supplementary content, not core

**Files to Hide**:
- `app/visual-treats/page.tsx`
- `components/visual-treats/`
- Visual Treats navigation link

**Implementation**: Feature flag `ENABLE_VISUAL_TREATS = false`

---

### 5. **Talent Hub** ❌
**Status**: HIDE for MVP  
**Reason**: Complex feature, not essential for movie browsing

**Files to Hide**:
- `app/talent-hub/`
- All talent hub components
- Talent Hub navigation link

**Implementation**: Feature flag `ENABLE_TALENT_HUB = false`

---

### 6. **Critic Hub** ❌
**Status**: HIDE for MVP  
**Reason**: Professional feature, not needed for general users

**Files to Hide**:
- `app/critic-hub/`
- All critic hub components
- Critic Hub navigation link
- Critic-specific settings

**Implementation**: Feature flag `ENABLE_CRITIC_HUB = false`

**Note**: Keep regular user reviews, hide professional critic features

---

### 7. **Cricket Content** ❌
**Status**: HIDE for MVP  
**Reason**: Not movie-related

**Files to Hide**:
- `app/cricket/`
- All cricket components
- Cricket navigation link

**Implementation**: Feature flag `ENABLE_CRICKET = false`

---

### 8. **Quizzes** ❌
**Status**: HIDE for MVP  
**Reason**: Gamification feature, not core

**Files to Hide**:
- `app/quizzes/`
- Quiz components
- Quiz navigation link

**Implementation**: Feature flag `ENABLE_QUIZZES = false`

---

### 9. **Festivals** ❌
**Status**: HIDE for MVP (Consider for Phase 2)  
**Reason**: Supplementary content

**Files to Hide**:
- `app/festivals/page.tsx`
- Festival components
- Festivals navigation link

**Implementation**: Feature flag `ENABLE_FESTIVALS = false`

---

### 10. **Box Office** ❌
**Status**: HIDE for MVP  
**Reason**: Nice-to-have data, not essential

**Files to Hide**:
- Box office sections
- Box office navigation link

**Implementation**: Feature flag `ENABLE_BOX_OFFICE = false`

---

### 11. **Admin Panel** ❌
**Status**: HIDE from Mobile (Desktop Only)  
**Reason**: Complex interface, not mobile-optimized

**Implementation**:
```typescript
// Show warning on mobile
{isMobile && <AdminMobileWarning />}
{!isMobile && <AdminDashboard />}
```

**Alternative**: Keep admin accessible on desktop only

---

## 🔧 Implementation Strategy

### 1. Create Feature Flags File
**File**: `lib/feature-flags.ts`

```typescript
export const FEATURE_FLAGS = {
  // MVP Features (Enabled)
  ENABLE_MOVIES: true,
  ENABLE_SEARCH: true,
  ENABLE_WATCHLIST: true,
  ENABLE_REVIEWS: true,
  ENABLE_USER_PROFILES: true,
  
  // Hidden for MVP (Disabled)
  ENABLE_PULSE: false,
  ENABLE_SIDHU_SNAPS: false,
  ENABLE_SCENE_EXPLORER: false,
  ENABLE_VISUAL_TREATS: false,
  ENABLE_TALENT_HUB: false,
  ENABLE_CRITIC_HUB: false,
  ENABLE_CRICKET: false,
  ENABLE_QUIZZES: false,
  ENABLE_FESTIVALS: false,
  ENABLE_BOX_OFFICE: false,
  
  // Admin (Desktop Only)
  ENABLE_ADMIN_ON_MOBILE: false,
} as const;

export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}
```

---

### 2. Update Navigation Components

**File**: `components/navigation/mobile-menu-items.ts`

```typescript
import { isFeatureEnabled } from '@/lib/feature-flags';

export const mobileMenuItems = [
  // Always visible
  { id: 'home', label: 'Home', href: '/', icon: Home },
  { id: 'explore', label: 'Explore', href: '/explore', icon: Compass },
  { id: 'movies', label: 'Movies', href: '/movies', icon: Film },
  { id: 'search', label: 'Search', href: '/search', icon: Search },
  
  // Conditional items
  ...(isFeatureEnabled('ENABLE_PULSE') ? [
    { id: 'pulse', label: 'Pulse', href: '/pulse', icon: Zap }
  ] : []),
  
  ...(isFeatureEnabled('ENABLE_SCENE_EXPLORER') ? [
    { id: 'scenes', label: 'Scenes', href: '/scene-explorer', icon: Eye }
  ] : []),
  
  // ... rest
];
```

---

### 3. Update Homepage

**File**: `app/page.tsx`

```typescript
import { isFeatureEnabled } from '@/lib/feature-flags';

export default function HomePage() {
  return (
    <div>
      {/* Always show */}
      <NewReleasesSection />
      <GlobalMasterpiecesSection />
      <SiddusPicksSection />
      <BestScenesSection />
      
      {/* Conditional sections */}
      {isFeatureEnabled('ENABLE_PULSE') && <TrendingPulseSection />}
      {isFeatureEnabled('ENABLE_SIDHU_SNAPS') && <SidhuSnapsSection />}
    </div>
  );
}
```

---

### 4. Update Settings Page

**File**: `app/settings/page.tsx`

```typescript
{isFeatureEnabled('ENABLE_CRITIC_HUB') && (
  <TabsTrigger value="critic">Critic</TabsTrigger>
)}
```

---

## 📊 Feature Comparison

| Feature | MVP Status | Post-MVP | Database | Backend API |
|---------|-----------|----------|----------|-------------|
| Movies | ✅ Keep | ✅ Keep | ✅ Keep | ✅ Keep |
| Search | ✅ Keep | ✅ Keep | ✅ Keep | ✅ Keep |
| Watchlist | ✅ Keep | ✅ Keep | ✅ Keep | ✅ Keep |
| Reviews | ✅ Keep | ✅ Keep | ✅ Keep | ✅ Keep |
| Profiles | ✅ Keep | ✅ Keep | ✅ Keep | ✅ Keep |
| Pulse | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Scene Explorer | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Visual Treats | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Talent Hub | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Critic Hub | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Cricket | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Quizzes | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Festivals | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |
| Box Office | ❌ Hide | ✅ Enable | ✅ Keep | ✅ Keep |

---

## ✅ Implementation Checklist

### Phase 1: Create Feature Flag System (2 hours)
- [ ] Create `lib/feature-flags.ts`
- [ ] Add feature flag helper functions
- [ ] Document feature flag usage

### Phase 2: Update Navigation (3 hours)
- [ ] Update `mobile-menu-items.ts` with conditional items
- [ ] Update `top-navigation.tsx` with conditional links
- [ ] Update `bottom-navigation.tsx` with conditional icons
- [ ] Test navigation on mobile

### Phase 3: Update Homepage (2 hours)
- [ ] Wrap conditional sections with feature flags
- [ ] Remove PersonalizedActivitySlider for MVP
- [ ] Remove CinematicVignetteSection for MVP
- [ ] Remove TrendingPulseSection for MVP
- [ ] Test homepage loads correctly

### Phase 4: Update Settings (1 hour)
- [ ] Hide role-specific tabs
- [ ] Keep core settings visible
- [ ] Test settings page

### Phase 5: Hide Feature Pages (2 hours)
- [ ] Add feature flag checks to all hidden pages
- [ ] Show "Coming Soon" message if accessed directly
- [ ] Update sitemap to exclude hidden pages

### Phase 6: Testing (4 hours)
- [ ] Test all MVP features work
- [ ] Verify hidden features are inaccessible
- [ ] Check database remains intact
- [ ] Verify backend APIs still work
- [ ] Test feature flag toggling

---

## 🎯 Post-MVP Re-enablement Plan

To re-enable features after MVP launch:

1. **Update Feature Flags**:
   ```typescript
   ENABLE_PULSE: true,  // Change from false to true
   ```

2. **Test Feature**:
   - Verify UI works on mobile
   - Check API integration
   - Test user flows

3. **Announce Feature**:
   - In-app notification
   - Social media announcement
   - Email to users

4. **Monitor**:
   - Track usage analytics
   - Gather user feedback
   - Fix any issues

---

## 📝 Notes

- **No Code Deletion**: All code remains in the codebase
- **Database Intact**: All tables and data preserved
- **Backend APIs**: All endpoints remain functional
- **Easy Re-enablement**: Change one flag to enable feature
- **Clean User Experience**: Users only see movie-focused features

---

**Document Status**: ✅ Complete  
**Next Step**: Review and approve feature scope  
**Estimated Implementation**: 14 hours (~2 days)


