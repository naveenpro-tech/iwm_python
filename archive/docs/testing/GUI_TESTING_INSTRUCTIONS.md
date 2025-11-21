# 🧪 GUI TESTING INSTRUCTIONS - CRITIC-CENTRIC HUB

**Status:** Automated server startup blocked by shell environment  
**Solution:** Manual testing required  
**Date:** 2025-10-23

---

## ⚠️ **ISSUE ENCOUNTERED**

The development environment has a shell configuration that intercepts all commands and runs Playwright tests instead of starting the Next.js dev server. This prevents automated GUI testing.

**Evidence:**
- Every command (`npm run dev`, `next dev`, `npx next dev`, `node node_modules/next/dist/bin/next dev`, etc.) is intercepted
- All commands execute: `bunx playwright test tests/e2e/critic-directory.spec.ts:22 --headed --reporter=list`
- This appears to be a `.bashrc`, `.bash_profile`, or similar shell alias/function

---

## ✅ **MANUAL TESTING INSTRUCTIONS**

Since automated testing is blocked, please follow these manual steps to test the Critic-Centric Hub:

### **Step 1: Start the Development Server**

Open a **NEW terminal window** (outside of this IDE/environment) and run:

```bash
cd c:\iwm\v142
npm run dev
```

**OR** if that's also intercepted, try:

```bash
cd c:\iwm\v142
.\node_modules\.bin\next dev
```

**OR** use the batch file I created:

```bash
cd c:\iwm\v142
.\start-frontend.bat
```

Wait for the server to start. You should see:

```
▲ Next.js 15.2.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Starting...
✓ Ready in 2.3s
```

---

### **Step 2: Test All Critic Profile Pages**

Open your browser and visit each critic profile page:

1. **http://localhost:3000/critic/arjun_movies**
2. **http://localhost:3000/critic/siddu_reviews**
3. **http://localhost:3000/critic/priya_cinema**
4. **http://localhost:3000/critic/raj_films**
5. **http://localhost:3000/critic/maya_movies**

---

### **Step 3: Visual Inspection Checklist**

For **EACH** critic profile page, verify the following:

#### **A. Hero Section** ✅
- [ ] Video banner loads (or image fallback if no video)
- [ ] Critic avatar displays correctly
- [ ] Critic name and bio visible
- [ ] Follow button visible and styled correctly
- [ ] Stats constellation displays 5 nodes
- [ ] All stats show numbers (not "undefined" or "null")

#### **B. Pinned Content Section** ✅
- [ ] Section heading "Pinned Content" visible
- [ ] 3 cards display in horizontal row (desktop)
- [ ] Cards are same height (200px)
- [ ] Gold "PINNED" badge visible on each card
- [ ] Hover effect works (border changes to cyan)
- [ ] Horizontal scroll works (desktop)
- [ ] On mobile: Cards display in carousel with navigation buttons

#### **C. Tabbed Navigation** ✅
- [ ] Tab bar displays with 5 tabs: Reviews, Recommendations, Critic's Log, Filmography, About
- [ ] Active tab has cyan underline indicator
- [ ] Tab counts display (e.g., "Reviews 24", "Recommendations 12")
- [ ] Clicking tabs switches content smoothly
- [ ] Tab bar becomes sticky when scrolling down (after ~600px)
- [ ] On mobile: Tabs scroll horizontally

#### **D. Recommendations Tab** ✅
- [ ] Grid displays 4 columns (desktop), 3 (tablet), 2 (mobile)
- [ ] Movie posters load correctly
- [ ] Badge displays on each card (colored by type)
- [ ] IMDB rating visible (star icon + number)
- [ ] Genre tags display below title
- [ ] Hover reveals critic's note with backdrop blur
- [ ] Genre filter dropdown works
- [ ] Filtering updates the grid correctly

#### **E. Critic's Log (Blog Tab)** ✅
- [ ] Blog posts display in vertical list
- [ ] Featured images load (16:9 ratio)
- [ ] Title, excerpt, metadata visible
- [ ] Date, read time, views display correctly
- [ ] Tag badges display below excerpt
- [ ] Tag filter buttons work
- [ ] Filtering updates the list correctly
- [ ] Hover effect works (border changes to cyan)

#### **F. Sidebar (Desktop)** ✅
- [ ] Sidebar visible on right side (desktop only)
- [ ] Social links section displays (YouTube, Twitter, Instagram, Website)
- [ ] Quick stats display (6 metrics with icons)
- [ ] Top genres chart displays (horizontal bars)
- [ ] Rating distribution chart displays (gradient bars)
- [ ] Review frequency card displays (number + trend)
- [ ] On mobile: Sidebar moves below tabs

#### **G. Filmography Tab** ✅
- [ ] Heatmap displays with movie tiles
- [ ] Tiles show movie posters
- [ ] Hover reveals movie title and rating
- [ ] Clicking tile navigates to movie page

#### **H. About Tab** ✅
- [ ] Bio section displays
- [ ] AMA section displays (if present)
- [ ] Badges section displays

---

### **Step 4: Test Blog Post Detail Pages**

Visit these blog post detail pages:

1. **http://localhost:3000/critic/arjun_movies/blog/dune-part-2-sci-fi-epic**
2. **http://localhost:3000/critic/arjun_movies/blog/top-10-horror-films-1970s**
3. **http://localhost:3000/critic/arjun_movies/blog/sundance-2025-anticipated-films**
4. **http://localhost:3000/critic/arjun_movies/blog/art-of-long-take**
5. **http://localhost:3000/critic/arjun_movies/blog/original-sci-fi-films**

#### **Blog Post Page Checklist** ✅
- [ ] Hero image displays (full width, 400px height)
- [ ] Article title displays
- [ ] Metadata displays (date, read time, views)
- [ ] Share buttons visible (Twitter, Facebook, Copy Link)
- [ ] Article content renders correctly (headings, paragraphs, bold text)
- [ ] Tag badges display
- [ ] Related posts section displays (3 posts)
- [ ] Back to profile button works
- [ ] Clicking share buttons works:
  - Twitter: Opens Twitter intent
  - Facebook: Opens Facebook sharer
  - Copy Link: Copies URL to clipboard (shows alert)

---

### **Step 5: Responsive Testing**

Test at different screen widths:

#### **Mobile (375px width)**
- [ ] Pinned content becomes carousel with navigation
- [ ] Tabs scroll horizontally
- [ ] Grid becomes 2 columns (recommendations)
- [ ] Blog cards stack vertically (image on top)
- [ ] Sidebar moves below tabs

#### **Tablet (768px width)**
- [ ] Grid becomes 3 columns (recommendations)
- [ ] Tabs still scroll horizontally
- [ ] Sidebar still below tabs

#### **Desktop (1440px width)**
- [ ] Grid is 4 columns (recommendations)
- [ ] Sidebar is sticky on right
- [ ] All layouts aligned perfectly

---

### **Step 6: Browser Console Check**

Open browser DevTools (F12) and check the Console tab:

- [ ] **Zero JavaScript errors** (no red messages)
- [ ] **Zero warnings** (or only minor warnings)
- [ ] **No failed network requests** (check Network tab)
- [ ] **No "undefined" or "null" errors**

---

### **Step 7: Interaction Testing**

Test all interactive elements:

#### **Pinned Content**
- [ ] Hover over cards (border changes to cyan)
- [ ] Click cards (navigates to detail page)
- [ ] Scroll horizontally (desktop)
- [ ] Use carousel navigation (mobile)

#### **Recommendations Tab**
- [ ] Hover over movie cards (reveals critic's note)
- [ ] Click genre filter dropdown
- [ ] Select different genres
- [ ] Verify grid updates correctly
- [ ] Click movie cards (navigates to movie page)

#### **Blog Tab**
- [ ] Click tag filter buttons
- [ ] Verify list updates correctly
- [ ] Hover over blog cards (border changes to cyan)
- [ ] Click blog cards (navigates to blog post page)

#### **Blog Post Page**
- [ ] Click Twitter share button (opens Twitter)
- [ ] Click Facebook share button (opens Facebook)
- [ ] Click Copy Link button (copies URL, shows alert)
- [ ] Click related post cards (navigates to other posts)
- [ ] Click back button (returns to profile)

#### **Tabbed Navigation**
- [ ] Click each tab (Reviews, Recommendations, Critic's Log, Filmography, About)
- [ ] Verify content switches smoothly
- [ ] Scroll down page (tab bar becomes sticky)
- [ ] Scroll back up (tab bar returns to normal)

---

## 📋 **BUG REPORT TEMPLATE**

If you find any issues, document them using this template:

### **Bug #1: [Short Description]**
- **Page:** http://localhost:3000/critic/arjun_movies
- **Component:** Pinned Content Section
- **Issue:** Cards not aligned properly
- **Expected:** All cards should be same height (200px)
- **Actual:** Cards have different heights
- **Screenshot:** [Attach screenshot]
- **Console Errors:** [Copy any errors from console]

---

## ✅ **EXPECTED RESULTS**

If everything is working correctly, you should see:

1. **Zero console errors**
2. **All images load correctly** (no broken image icons)
3. **All data displays properly** (no "undefined" or "null" text)
4. **All layouts aligned perfectly** (no misaligned elements)
5. **All interactions work smoothly** (tabs, filters, hovers, clicks)
6. **Responsive design works** (mobile, tablet, desktop)
7. **Smooth animations** (300-500ms transitions)
8. **Professional appearance** (matches Siddu design system)

---

## 🎯 **SUCCESS CRITERIA**

The Critic-Centric Hub is considered **READY FOR PRODUCTION** if:

- ✅ All 5 critic profiles load without errors
- ✅ All 6 major components display correctly
- ✅ All interactions work as expected
- ✅ Responsive design works at all breakpoints
- ✅ Zero console errors
- ✅ All blog post pages load correctly
- ✅ Share functionality works
- ✅ Navigation works smoothly

---

## 📞 **NEXT STEPS AFTER TESTING**

1. **If all tests pass:**
   - Document success in a new file: `GUI_TESTING_SUCCESS.md`
   - Proceed with backend integration
   - Update E2E tests to match new layout

2. **If bugs are found:**
   - Document all bugs in: `GUI_TESTING_BUG_REPORT.md`
   - Provide screenshots for each bug
   - I will fix all bugs immediately
   - Re-test after fixes

---

**Manual testing required due to shell environment issue. Please follow the instructions above and report results.**

