# 🎬 IWM Feature Development Roadmap

**Last Updated:** 2025-10-21  
**Status:** Ready for Development  
**Approach:** Build features incrementally, test each module, then move to next

---

## 🎯 **DEVELOPMENT STRATEGY**

### **Why Build Other Features Before Profile?**

1. **Profile Depends on Other Features**
   - Profile shows user's reviews → Need Reviews feature first
   - Profile shows watchlist → Need Watchlist feature first
   - Profile shows favorites → Need Favorites feature first
   - Profile shows activity → Need all features first

2. **Test Authentication Early**
   - Build login/signup flow
   - Test with real backend
   - Fix auth issues before building complex features

3. **Build Momentum**
   - See features come alive one by one
   - Each feature is a complete win
   - Easier to debug and test

4. **Data First**
   - Import movies into database
   - Enrich with AI
   - Then build features that use this data

---

## 📋 **PHASE 1: DATA POPULATION** (CRITICAL - DO THIS FIRST!)

### **Module 1.1: Movie Data Import**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 30 minutes  
**Dependencies:** None

**Tasks:**
- [ ] Run `scripts/import_once.py` to import movies
- [ ] Verify movies in database (check count)
- [ ] Test movie queries in backend
- [ ] Fix any import errors

**Success Criteria:**
- ✅ 100+ movies imported successfully
- ✅ All relationships (genres, people) working
- ✅ Can query movies via API

**Testing:**
```bash
# Test movie import
curl http://localhost:8000/api/v1/movies?limit=10

# Test movie detail
curl http://localhost:8000/api/v1/movies/1
```

---

### **Module 1.2: AI Enrichment**
**Priority:** 🟡 HIGH  
**Estimated Time:** 1 hour  
**Dependencies:** Module 1.1

**Tasks:**
- [ ] Configure Gemini API key in `.env`
- [ ] Run `scripts/enrich_once.py`
- [ ] Verify enriched data (trivia, timeline, etc.)
- [ ] Test enriched movie details

**Success Criteria:**
- ✅ Movies have trivia, timeline, fun facts
- ✅ AI-generated content is high quality
- ✅ No API errors or rate limits

**Testing:**
```bash
# Test enriched movie
curl http://localhost:8000/api/v1/movies/1 | jq '.trivia'
```

---

## 📋 **PHASE 2: AUTHENTICATION & CORE SETUP**

### **Module 2.1: Login/Signup Flow**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 2 hours  
**Dependencies:** None

**Frontend Tasks:**
- [ ] Connect login form to backend API
- [ ] Connect signup form to backend API
- [ ] Store JWT tokens in localStorage
- [ ] Add token to API requests (Authorization header)
- [ ] Handle auth errors (401, 403)
- [ ] Redirect after login/signup

**Backend Tasks:**
- [ ] Test `/api/v1/auth/signup` endpoint
- [ ] Test `/api/v1/auth/login` endpoint
- [ ] Test `/api/v1/auth/me` endpoint
- [ ] Verify JWT token generation

**Success Criteria:**
- ✅ User can sign up with email/password
- ✅ User can log in with credentials
- ✅ JWT token is stored and used
- ✅ Protected routes require authentication
- ✅ User can log out

**Testing:**
```bash
# Test signup
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

### **Module 2.2: API Client Setup**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 1 hour  
**Dependencies:** Module 2.1

**Tasks:**
- [ ] Create `lib/api-client.ts` with axios/fetch
- [ ] Add authentication interceptor
- [ ] Add error handling
- [ ] Add loading states
- [ ] Create API hooks (useMovies, useAuth, etc.)

**Success Criteria:**
- ✅ All API calls go through centralized client
- ✅ Auth token automatically added to requests
- ✅ Errors handled gracefully
- ✅ Loading states work

**Files to Create:**
```typescript
// lib/api-client.ts
// lib/hooks/useMovies.ts
// lib/hooks/useAuth.ts
// lib/hooks/useReviews.ts
```

---

## 📋 **PHASE 3: CORE FEATURES (Foundation)**

### **Module 3.1: Movies List Page**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 3 hours  
**Dependencies:** Module 1.1, 2.2

**Tasks:**
- [ ] Fetch movies from `/api/v1/movies`
- [ ] Display movies in grid layout
- [ ] Add pagination
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add filters (genre, year, rating)
- [ ] Add sorting (title, rating, year)

**Success Criteria:**
- ✅ Movies load from real database
- ✅ Pagination works (20 movies per page)
- ✅ Filters work correctly
- ✅ Sorting works correctly
- ✅ Loading states show
- ✅ Errors handled gracefully

**Page:** `app/movies/page.tsx`

---

### **Module 3.2: Movie Detail Page**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 4 hours  
**Dependencies:** Module 1.1, 1.2, 2.2

**Tasks:**
- [ ] Fetch movie by ID from `/api/v1/movies/{id}`
- [ ] Display movie details (title, plot, cast, etc.)
- [ ] Display trivia and timeline (AI-enriched)
- [ ] Display streaming options
- [ ] Add "Add to Watchlist" button
- [ ] Add "Add to Favorites" button
- [ ] Display user reviews
- [ ] Add "Write Review" button

**Success Criteria:**
- ✅ Movie details load correctly
- ✅ All data displayed properly
- ✅ Images load correctly
- ✅ Buttons work (watchlist, favorites)
- ✅ Reviews section works

**Page:** `app/movies/[id]/page.tsx`

---

### **Module 3.3: Search Functionality**
**Priority:** 🟡 HIGH  
**Estimated Time:** 3 hours  
**Dependencies:** Module 2.2

**Tasks:**
- [ ] Connect search to `/api/v1/search`
- [ ] Add search input with debounce
- [ ] Display search results
- [ ] Add filters (movies, people, genres)
- [ ] Add search history
- [ ] Add autocomplete suggestions

**Success Criteria:**
- ✅ Search works in real-time
- ✅ Results load quickly
- ✅ Filters work correctly
- ✅ Search history saved
- ✅ Autocomplete works

**Page:** `app/search/page.tsx`

---

### **Module 3.4: People (Actors/Directors)**
**Priority:** 🟡 HIGH  
**Estimated Time:** 3 hours  
**Dependencies:** Module 2.2

**Tasks:**
- [ ] Fetch people from `/api/v1/people`
- [ ] Display people list
- [ ] Create person detail page
- [ ] Display filmography
- [ ] Display biography
- [ ] Add filters (actors, directors, writers)

**Success Criteria:**
- ✅ People list loads
- ✅ Person detail page works
- ✅ Filmography displays correctly
- ✅ Filters work

**Pages:**
- `app/people/page.tsx`
- `app/people/[id]/page.tsx`

---

### **Module 3.5: Genres**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 2 hours  
**Dependencies:** Module 2.2

**Tasks:**
- [ ] Fetch genres from `/api/v1/genres`
- [ ] Display genre list
- [ ] Create genre detail page (movies in genre)
- [ ] Add genre filters

**Success Criteria:**
- ✅ Genres load correctly
- ✅ Genre detail page shows movies
- ✅ Filters work

**Pages:**
- `app/genres/page.tsx`
- `app/genres/[genre]/page.tsx`

---

## 📋 **PHASE 4: USER FEATURES (Interactive)**

### **Module 4.1: Reviews System**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 4 hours  
**Dependencies:** Module 2.1, 3.2

**Tasks:**
- [ ] Create review form component
- [ ] Connect to `/api/v1/reviews` POST endpoint
- [ ] Display user reviews on movie page
- [ ] Add rating system (1-10 stars)
- [ ] Add edit/delete review
- [ ] Add review moderation

**Success Criteria:**
- ✅ User can write review
- ✅ Review saves to database
- ✅ Reviews display on movie page
- ✅ User can edit/delete own reviews
- ✅ Rating system works

**Components:**
- `components/reviews/review-form.tsx`
- `components/reviews/review-list.tsx`
- `components/reviews/review-card.tsx`

---

### **Module 4.2: Watchlist**
**Priority:** 🟡 HIGH  
**Estimated Time:** 3 hours  
**Dependencies:** Module 2.1, 3.2

**Tasks:**
- [ ] Connect to `/api/v1/watchlist` endpoints
- [ ] Add "Add to Watchlist" button on movie page
- [ ] Create watchlist page
- [ ] Display user's watchlist
- [ ] Add remove from watchlist
- [ ] Add watchlist filters/sorting

**Success Criteria:**
- ✅ User can add movies to watchlist
- ✅ Watchlist page displays correctly
- ✅ User can remove movies
- ✅ Filters/sorting work

**Page:** `app/watchlist/page.tsx`

---

### **Module 4.3: Favorites**
**Priority:** 🟡 HIGH  
**Estimated Time:** 3 hours  
**Dependencies:** Module 2.1, 3.2

**Tasks:**
- [ ] Connect to `/api/v1/favorites` endpoints
- [ ] Add "Add to Favorites" button
- [ ] Create favorites page
- [ ] Display user's favorites
- [ ] Add remove from favorites

**Success Criteria:**
- ✅ User can add movies to favorites
- ✅ Favorites page displays correctly
- ✅ User can remove movies

**Page:** `app/favorites/page.tsx`

---

### **Module 4.4: Collections**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** Module 2.1, 3.2

**Tasks:**
- [ ] Connect to `/api/v1/collections` endpoints
- [ ] Create collection form
- [ ] Display user's collections
- [ ] Add movies to collection
- [ ] Remove movies from collection
- [ ] Share collections

**Success Criteria:**
- ✅ User can create collections
- ✅ User can add movies to collections
- ✅ Collections display correctly
- ✅ Sharing works

**Pages:**
- `app/collections/page.tsx`
- `app/collections/[id]/page.tsx`

---

## 📋 **PHASE 5: SOCIAL FEATURES**

### **Module 5.1: Pulse (Social Feed)**
**Priority:** 🟡 HIGH  
**Estimated Time:** 5 hours  
**Dependencies:** Module 2.1

**Tasks:**
- [ ] Connect to `/api/v1/pulse` endpoints
- [ ] Create post form
- [ ] Display pulse feed
- [ ] Add like/comment functionality
- [ ] Add hashtags
- [ ] Add user mentions

**Success Criteria:**
- ✅ User can create posts
- ✅ Feed displays correctly
- ✅ Like/comment works
- ✅ Hashtags work

**Page:** `app/pulse/page.tsx`

---

### **Module 5.2: Notifications**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 3 hours  
**Dependencies:** Module 2.1

**Tasks:**
- [ ] Connect to `/api/v1/notifications` endpoints
- [ ] Display notifications
- [ ] Mark as read
- [ ] Add notification preferences

**Success Criteria:**
- ✅ Notifications display
- ✅ Mark as read works
- ✅ Preferences work

**Page:** `app/notifications/page.tsx`

---

## 📋 **PHASE 6: PROFILE & DASHBOARD (BUILD LAST!)**

### **Module 6.1: User Profile**
**Priority:** 🟡 HIGH  
**Estimated Time:** 5 hours  
**Dependencies:** ALL previous modules

**Tasks:**
- [ ] Fetch user data from `/api/v1/auth/me`
- [ ] Display user info (name, email, avatar)
- [ ] Display user stats (reviews, watchlist, favorites)
- [ ] Display recent activity
- [ ] Add edit profile
- [ ] Add change password
- [ ] Add upload avatar

**Success Criteria:**
- ✅ Profile displays all user data
- ✅ Stats are accurate
- ✅ Edit profile works
- ✅ Avatar upload works

**Page:** `app/profile/page.tsx`

---

### **Module 6.2: Dashboard**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** ALL previous modules

**Tasks:**
- [ ] Create personalized dashboard
- [ ] Display recommendations
- [ ] Display continue watching
- [ ] Display trending movies
- [ ] Display friend activity

**Success Criteria:**
- ✅ Dashboard is personalized
- ✅ Recommendations work
- ✅ All sections display correctly

**Page:** `app/dashboard/page.tsx`

---

### **Module 6.3: Settings**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 3 hours  
**Dependencies:** Module 2.1

**Tasks:**
- [ ] Connect to `/api/v1/settings` endpoints
- [ ] Display settings form
- [ ] Save settings
- [ ] Add privacy settings
- [ ] Add notification settings

**Success Criteria:**
- ✅ Settings load correctly
- ✅ Settings save correctly
- ✅ All options work

**Page:** `app/settings/page.tsx`

---

## 📋 **PHASE 7: ADVANCED FEATURES**

### **Module 7.1: Awards**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 3 hours

### **Module 7.2: Festivals**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 3 hours

### **Module 7.3: Box Office**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 3 hours

### **Module 7.4: Scene Explorer**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 4 hours

### **Module 7.5: Visual Treats**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 3 hours

### **Module 7.6: Quiz System**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 5 hours

### **Module 7.7: Talent Hub**
**Priority:** 🟢 MEDIUM  
**Estimated Time:** 4 hours

### **Module 7.8: Admin Panel**
**Priority:** 🟡 HIGH  
**Estimated Time:** 8 hours

---

## 📊 **SUMMARY**

**Total Modules:** 25+  
**Estimated Total Time:** 80-100 hours  
**Recommended Approach:** Build incrementally, test each module

**Priority Breakdown:**
- 🔴 CRITICAL: 6 modules (must do first)
- 🟡 HIGH: 8 modules (do next)
- 🟢 MEDIUM: 11 modules (do last)

---

**Next Step:** Start with Phase 1 (Data Population) - Import movies and enrich with AI!

