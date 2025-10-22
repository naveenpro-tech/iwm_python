# 🚀 CRITIC HUB - PHASES 4-7: Creation Tools, Integration, Verification & Testing

**Combined Duration:** 20 hours  
**Status:** 📋 READY FOR EXECUTION

---

## 🎨 PHASE 4: CRITIC CREATION TOOLS (8 hours)

### **OBJECTIVES:**
1. Build critic dashboard (`/dashboard/critic`)
2. Create profile editor
3. Build review composer
4. Implement analytics dashboard
5. Add draft management

---

### **STEP 4.1: CRITIC DASHBOARD (90 minutes)**

**File:** `app/dashboard/critic/page.tsx`

**Features:**
- Overview stats (views, likes, followers, reviews)
- Recent reviews list
- Quick actions (New Review, Edit Profile, View Analytics)
- Follower growth chart
- Top performing reviews

**Components:**
- `CriticDashboardOverview` - Stats cards
- `RecentReviewsList` - Last 5 reviews with edit/delete
- `FollowerGrowthChart` - Line chart (last 30 days)
- `QuickActions` - Action buttons

---

### **STEP 4.2: PROFILE EDITOR (90 minutes)**

**File:** `app/dashboard/critic/profile/page.tsx`

**Features:**
- Edit display name, bio, philosophy
- Upload logo and banner (image or video)
- Manage social links (add/edit/delete/reorder)
- Preview changes
- Save/cancel

**Components:**
- `ProfileEditorForm` - Main form
- `ImageUploader` - Logo/banner upload with crop
- `SocialLinksManager` - Drag-to-reorder list
- `ProfilePreview` - Live preview

**Validation:**
- Username: 3-30 chars, alphanumeric + underscore
- Display name: 2-200 chars
- Bio: Max 1000 chars
- URLs: Valid format

---

### **STEP 4.3: REVIEW COMPOSER (240 minutes)**

**File:** `app/dashboard/critic/reviews/new/page.tsx`

**Features:**
- Movie selector (search Siddu database)
- Rating input (numeric, letter, or custom)
- YouTube embed URL input
- Rich text editor for written content
- Image gallery uploader (drag & drop)
- Where to Watch links manager
- Save as draft / Publish
- Preview mode

**Components:**

1. **MovieSelector** (`components/critic/composer/movie-selector.tsx`)
   - Search input with autocomplete
   - Movie card preview
   - Selected movie display

2. **RatingInput** (`components/critic/composer/rating-input.tsx`)
   - Toggle rating type (numeric/letter/custom)
   - Numeric: Slider 0-10 with 0.5 increments
   - Letter: Dropdown (A+, A, A-, B+, etc.)
   - Custom: Text input

3. **YouTubeEmbedInput** (`components/critic/composer/youtube-embed-input.tsx`)
   - URL input with validation
   - Extract video ID
   - Preview embed

4. **RichTextEditor** (`components/critic/composer/rich-text-editor.tsx`)
   - Markdown editor with toolbar
   - Bold, italic, headings, lists, links
   - Image insertion
   - Preview mode
   - Character count

5. **ImageGalleryUploader** (`components/critic/composer/image-gallery-uploader.tsx`)
   - Drag & drop zone
   - Multiple file upload
   - Image preview grid
   - Reorder images
   - Delete images
   - Max 10 images

6. **WatchLinksManager** (`components/critic/composer/watch-links-manager.tsx`)
   - Add link form (platform, URL, affiliate checkbox)
   - Platform dropdown (Netflix, Amazon, etc.)
   - Link list with edit/delete
   - Reorder links

**Workflow:**
1. Select movie
2. Choose rating type and enter rating
3. (Optional) Add YouTube URL
4. Write review content
5. (Optional) Upload images
6. (Optional) Add watch links
7. Preview
8. Save as draft OR Publish

**Validation:**
- Movie: Required
- Rating: Required
- Content: Min 100 chars
- YouTube URL: Valid format (if provided)
- Images: Max 10, each < 5MB
- Watch links: Valid URLs

---

### **STEP 4.4: REVIEW EDITOR (60 minutes)**

**File:** `app/dashboard/critic/reviews/[id]/edit/page.tsx`

**Features:**
- Load existing review
- Same composer interface
- Update review
- Publish draft
- Delete review (with confirmation)

---

### **STEP 4.5: ANALYTICS DASHBOARD (90 minutes)**

**File:** `app/dashboard/critic/analytics/page.tsx`

**Features:**
- Date range selector
- Key metrics cards (views, likes, comments, shares, followers)
- Charts:
  - Views over time (line chart)
  - Engagement rate (bar chart)
  - Top reviews (table)
  - Follower growth (area chart)
- Export data (CSV)

**Components:**
- `AnalyticsDatePicker` - Date range selector
- `MetricsCards` - KPI cards
- `ViewsChart` - Line chart using Recharts
- `EngagementChart` - Bar chart
- `TopReviewsTable` - Sortable table

---

## 🔗 PHASE 5: PLATFORM INTEGRATION (4 hours)

### **OBJECTIVES:**
1. Add "Verified Critic Reviews" section to movie pages
2. Integrate critic reviews into user feeds
3. Add "Browse Critics" to navigation
4. Create critics directory page

---

### **STEP 5.1: MOVIE PAGE INTEGRATION (90 minutes)**

**File:** `app/movies/[id]/page.tsx` (modify existing)

**Add Component:** `VerifiedCriticReviewsSection`

**Location:** After regular reviews section, before related movies

**Features:**
- Section title: "Verified Critic Reviews"
- Horizontal carousel of critic review cards
- Each card:
  - Critic logo + name + verified badge
  - Movie rating from critic
  - Review snippet (2 lines)
  - Link to full review
- "View All Critic Reviews" button
- Smooth scroll animation

**Component:** `components/movie-page/verified-critic-reviews-section.tsx`

```typescript
export function VerifiedCriticReviewsSection({ movieId }: { movieId: string }) {
  const [reviews, setReviews] = useState<CriticReviewCard[]>([])
  
  useEffect(() => {
    const fetchCriticReviews = async () => {
      const response = await fetch(`${apiBase}/api/v1/movies/${movieId}/critic-reviews?limit=6`)
      const data = await response.json()
      setReviews(data)
    }
    fetchCriticReviews()
  }, [movieId])
  
  if (reviews.length === 0) return null
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-[#E0E0E0] mb-6">
        Verified Critic Reviews
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {reviews.map((review) => (
          <CriticReviewCard key={review.id} review={review} />
        ))}
      </div>
      <Link href={`/movies/${movieId}/critic-reviews`}>
        <Button className="mt-4">View All Critic Reviews</Button>
      </Link>
    </section>
  )
}
```

---

### **STEP 5.2: USER FEED INTEGRATION (60 minutes)**

**File:** `app/pulse/page.tsx` (modify existing)

**Add:** Critic review posts to feed

**Feed Item Type:** `critic_review_published`

**Display:**
- Critic logo + name + "published a review"
- Movie poster + title
- Critic's rating
- Review snippet
- Link to full review
- Engagement stats

---

### **STEP 5.3: BROWSE CRITICS PAGE (90 minutes)**

**File:** `app/critic/browse/page.tsx`

**Features:**
- Grid of critic cards
- Search by name
- Filter by verification level
- Sort by followers, reviews, engagement
- Pagination

**Critic Card:**
- Logo (circular)
- Display name + verified badge
- Bio snippet (1 line)
- Stats (followers, reviews)
- "View Profile" button

---

### **STEP 5.4: NAVIGATION UPDATE (30 minutes)**

**File:** `components/navigation/main-nav.tsx` (modify)

**Add:** "Critics" link in main navigation

**Location:** Between "Movies" and "Pulse"

**Dropdown Menu:**
- Browse All Critics
- Top Critics
- Apply to Become a Critic

---

## 🛡️ PHASE 6: VERIFICATION SYSTEM (4 hours)

### **OBJECTIVES:**
1. Create critic application form
2. Build admin verification queue
3. Implement approval/rejection workflow
4. Add email notifications

---

### **STEP 6.1: APPLICATION FORM (90 minutes)**

**File:** `app/critic/apply/page.tsx`

**Features:**
- Multi-step form (3 steps)
- Step 1: Basic Info (username, display name, bio)
- Step 2: Platform Links (YouTube, blog, social media)
- Step 3: Metrics & Samples (subscribers, visitors, sample reviews)
- Progress indicator
- Form validation
- Submit application

**Validation:**
- Username: Unique, 3-30 chars
- Display name: 2-200 chars
- Bio: Min 100 chars, max 1000 chars
- At least one platform link required
- Valid URLs
- Sample review URLs: Min 2, max 5

**Component:** `components/critic/application/critic-application-form.tsx`

---

### **STEP 6.2: ADMIN VERIFICATION QUEUE (120 minutes)**

**File:** `app/admin/critics/verification/page.tsx`

**Features:**
- List of pending applications
- Filter by status (pending, under review, approved, rejected)
- Search by username or email
- Sort by submission date
- Application details modal
- Approve/reject actions
- Add admin notes

**Components:**
- `CriticVerificationQueue` - Main table
- `ApplicationReviewModal` - Detailed view
- `ApprovalForm` - Approve with notes
- `RejectionForm` - Reject with reason

**Application Review Modal:**
- Applicant info (name, email, joined date)
- Requested username and display name
- Bio
- Platform links (clickable)
- Metrics (subscribers, visitors, followers)
- Sample review links (clickable)
- Admin notes textarea
- Approve/Reject buttons

---

### **STEP 6.3: APPROVAL WORKFLOW (60 minutes)**

**Backend:** `apps/backend/src/routers/critic_verification.py`

**Approve Endpoint:** `POST /admin/critic-verification/{id}/approve`

**Actions:**
1. Update application status to 'approved'
2. Create critic_profile record
3. Set is_verified = True
4. Send approval email to user
5. Log admin action

**Reject Endpoint:** `POST /admin/critic-verification/{id}/reject`

**Actions:**
1. Update application status to 'rejected'
2. Save rejection reason
3. Send rejection email to user
4. Log admin action

---

### **STEP 6.4: EMAIL NOTIFICATIONS (30 minutes)**

**Templates:**
1. **Application Received** - Sent immediately after submission
2. **Application Approved** - Sent when approved
3. **Application Rejected** - Sent when rejected with reason

**Email Service:** Use existing notification system

---

## 🧪 PHASE 7: TESTING & POLISH (4 hours)

### **OBJECTIVES:**
1. End-to-end testing of all features
2. Performance optimization
3. SEO optimization
4. Accessibility audit
5. Bug fixes
6. Documentation

---

### **STEP 7.1: END-TO-END TESTING (120 minutes)**

**Test Scenarios:**

1. **Critic Application Flow:**
   - [ ] User submits application
   - [ ] Admin receives notification
   - [ ] Admin reviews application
   - [ ] Admin approves application
   - [ ] User receives approval email
   - [ ] Critic profile created
   - [ ] User can access critic dashboard

2. **Review Creation Flow:**
   - [ ] Critic logs in
   - [ ] Navigates to dashboard
   - [ ] Clicks "New Review"
   - [ ] Selects movie
   - [ ] Enters rating
   - [ ] Adds YouTube URL
   - [ ] Writes content
   - [ ] Uploads images
   - [ ] Adds watch links
   - [ ] Saves as draft
   - [ ] Previews review
   - [ ] Publishes review
   - [ ] Review appears on profile
   - [ ] Review appears on movie page

3. **User Engagement Flow:**
   - [ ] User browses critics
   - [ ] User views critic profile
   - [ ] User follows critic
   - [ ] User views critic review
   - [ ] User likes review
   - [ ] User comments on review
   - [ ] User shares review

4. **Admin Management Flow:**
   - [ ] Admin views verification queue
   - [ ] Admin reviews application
   - [ ] Admin approves/rejects
   - [ ] Admin manages critic profiles
   - [ ] Admin moderates critic reviews

---

### **STEP 7.2: PERFORMANCE OPTIMIZATION (60 minutes)**

**Actions:**
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Code splitting (dynamic imports)
- [ ] Database query optimization (indexes, eager loading)
- [ ] Caching (Redis for critic profiles, reviews)
- [ ] CDN for static assets
- [ ] Lighthouse audit (target: 90+ score)

---

### **STEP 7.3: SEO OPTIMIZATION (30 minutes)**

**Actions:**
- [ ] Meta tags for all pages
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap update
- [ ] Robots.txt update
- [ ] Canonical URLs

---

### **STEP 7.4: ACCESSIBILITY AUDIT (30 minutes)**

**Actions:**
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast (WCAG AA)
- [ ] Focus indicators
- [ ] Alt text for images

---

### **STEP 7.5: DOCUMENTATION (60 minutes)**

**Create:**
1. **User Guide:** How to apply, create reviews, manage profile
2. **Admin Guide:** How to verify critics, moderate content
3. **API Documentation:** All new endpoints
4. **Component Documentation:** Storybook for all components

---

## ✅ FINAL COMPLETION CHECKLIST

### **Backend:**
- [ ] All database tables created
- [ ] All models implemented
- [ ] All repositories implemented
- [ ] All API endpoints implemented
- [ ] All endpoints tested
- [ ] Database migrations run successfully

### **Frontend:**
- [ ] Critic profile pages complete
- [ ] Critic review pages complete
- [ ] Critic dashboard complete
- [ ] Review composer complete
- [ ] Analytics dashboard complete
- [ ] Application form complete
- [ ] Admin verification queue complete
- [ ] All components responsive
- [ ] All animations working

### **Integration:**
- [ ] Movie pages show critic reviews
- [ ] User feeds show critic activity
- [ ] Navigation updated
- [ ] Browse critics page complete

### **Testing:**
- [ ] All user flows tested
- [ ] All admin flows tested
- [ ] Performance optimized
- [ ] SEO optimized
- [ ] Accessibility compliant
- [ ] No console errors
- [ ] No broken links

### **Documentation:**
- [ ] User guide complete
- [ ] Admin guide complete
- [ ] API docs complete
- [ ] Component docs complete

---

## 🎉 CRITIC HUB LAUNCH READY!

**Total Implementation Time:** 38 hours  
**Total Files Created:** 50+  
**Total Components:** 30+  
**Total API Endpoints:** 20+  
**Total Database Tables:** 9

**Impact:**
- Attracts professional critics to Siddu
- Provides rich, multi-format reviews
- Increases user engagement
- Positions Siddu as premier movie criticism platform
- Creates new revenue opportunities (affiliate links)

---

**🚀 Ready for autonomous execution! Let's build the future of movie criticism!**

