# 🚀 CRITIC PLATFORM MVP - PHASE 0 (P0)

**Timeline:** 2-4 weeks  
**Status:** 📋 READY FOR DEVELOPMENT  
**Goal:** Launch Critic Studio MVP with core content management and verification workflow

---

## 🎯 PHASE 0 OBJECTIVES

Deliver a working MVP that enables critics to:
1. ✅ Manage their professional profile and content
2. ✅ Create and publish blog posts, recommendations, and pinned content
3. ✅ Apply for verification with transparent criteria
4. ✅ Track basic onsite analytics (views, likes, comments)
5. ✅ Manage affiliate links with click tracking
6. ✅ Display sponsor disclosures on reviews

**Success Criteria:**
- Critic can complete profile setup in <10 minutes
- Verification application submitted and reviewed within 7 days
- Blog post published and visible on public profile
- Affiliate link clicks tracked accurately
- Admin can approve/reject verification applications

---

## 📊 DATABASE SCHEMA CHANGES

### **New Models**

#### **1. CriticBlogPost**
```python
class CriticBlogPost(Base):
    __tablename__ = "critic_blog_posts"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    
    title: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(250), unique=True, index=True)
    content: Mapped[str] = mapped_column(Text)  # Markdown
    excerpt: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    cover_image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tags: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)  # draft, published, archived
    published_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, index=True)
    
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    like_count: Mapped[int] = mapped_column(Integer, default=0)
    comment_count: Mapped[int] = mapped_column(Integer, default=0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="blog_posts")
```

#### **2. CriticRecommendation**
```python
class CriticRecommendation(Base):
    __tablename__ = "critic_recommendations"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id", ondelete="CASCADE"), index=True)
    
    recommendation_type: Mapped[str] = mapped_column(String(50), index=True)  # must_watch, hidden_gem, guilty_pleasure, etc.
    reason: Mapped[str] = mapped_column(Text)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="recommendations")
    movie: Mapped["Movie"] = relationship()
```

#### **3. CriticPinnedContent**
```python
class CriticPinnedContent(Base):
    __tablename__ = "critic_pinned_content"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    
    content_type: Mapped[str] = mapped_column(String(50))  # review, blog_post, recommendation
    content_id: Mapped[int] = mapped_column(Integer)  # ID of the content item
    
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    pinned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="pinned_content")
```

#### **4. CriticAffiliateLink**
```python
class CriticAffiliateLink(Base):
    __tablename__ = "critic_affiliate_links"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    
    label: Mapped[str] = mapped_column(String(100))  # "Watch on Netflix", "Buy on Amazon"
    platform: Mapped[str] = mapped_column(String(50))  # netflix, amazon, apple_tv, etc.
    url: Mapped[str] = mapped_column(String(500))
    
    utm_source: Mapped[str | None] = mapped_column(String(100), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(100), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    click_count: Mapped[int] = mapped_column(Integer, default=0)
    conversion_count: Mapped[int] = mapped_column(Integer, default=0)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="affiliate_links")
```

#### **5. CriticBrandDeal**
```python
class CriticBrandDeal(Base):
    __tablename__ = "critic_brand_deals"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    
    brand_name: Mapped[str] = mapped_column(String(200))
    campaign_title: Mapped[str] = mapped_column(String(200))
    brief: Mapped[str] = mapped_column(Text)
    
    rate_card: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", index=True)  # pending, accepted, completed, cancelled
    
    deliverables: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array
    disclosure_required: Mapped[bool] = mapped_column(Boolean, default=True)
    
    start_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    end_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="brand_deals")
```

#### **6. CriticSponsorDisclosure**
```python
class CriticSponsorDisclosure(Base):
    __tablename__ = "critic_sponsor_disclosures"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    review_id: Mapped[int | None] = mapped_column(ForeignKey("critic_reviews.id", ondelete="CASCADE"), nullable=True, index=True)
    blog_post_id: Mapped[int | None] = mapped_column(ForeignKey("critic_blog_posts.id", ondelete="CASCADE"), nullable=True, index=True)
    brand_deal_id: Mapped[int | None] = mapped_column(ForeignKey("critic_brand_deals.id", ondelete="SET NULL"), nullable=True)
    
    disclosure_text: Mapped[str] = mapped_column(Text)
    disclosure_type: Mapped[str] = mapped_column(String(50))  # sponsored, affiliate, gifted, partnership
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    review: Mapped["CriticReview | None"] = relationship(back_populates="sponsor_disclosure")
    blog_post: Mapped["CriticBlogPost | None"] = relationship(back_populates="sponsor_disclosure")
    brand_deal: Mapped["CriticBrandDeal | None"] = relationship()
```

### **Model Updates**

Update existing models to add relationships:

```python
# CriticProfile - add relationships
blog_posts: Mapped[List["CriticBlogPost"]] = relationship(back_populates="critic", cascade="all, delete-orphan")
recommendations: Mapped[List["CriticRecommendation"]] = relationship(back_populates="critic", cascade="all, delete-orphan")
pinned_content: Mapped[List["CriticPinnedContent"]] = relationship(back_populates="critic", cascade="all, delete-orphan")
affiliate_links: Mapped[List["CriticAffiliateLink"]] = relationship(back_populates="critic", cascade="all, delete-orphan")
brand_deals: Mapped[List["CriticBrandDeal"]] = relationship(back_populates="critic", cascade="all, delete-orphan")

# CriticReview - add relationship
sponsor_disclosure: Mapped["CriticSponsorDisclosure | None"] = relationship(back_populates="review", uselist=False)

# CriticBlogPost - add relationship
sponsor_disclosure: Mapped["CriticSponsorDisclosure | None"] = relationship(back_populates="blog_post", uselist=False)
```

---

## 🔌 BACKEND API ENDPOINTS

### **Blog Posts API** (`/api/v1/critic-blog`)

#### **POST /critic-blog**
Create a new blog post (verified critics only)

**Request:**
```json
{
  "title": "My Top 10 Films of 2024",
  "content": "# Introduction\n\nHere are my favorite films...",
  "excerpt": "A curated list of the year's best cinema",
  "cover_image_url": "https://...",
  "tags": ["year-end", "top-10", "2024"],
  "status": "draft"
}
```

**Response:** `201 Created`
```json
{
  "id": 123,
  "external_id": "bp_abc123",
  "slug": "my-top-10-films-of-2024",
  "title": "My Top 10 Films of 2024",
  "created_at": "2025-01-15T10:00:00Z"
}
```

#### **GET /critic-blog/{post_id}**
Get blog post by ID or slug

**Response:** `200 OK`
```json
{
  "id": 123,
  "external_id": "bp_abc123",
  "critic": {
    "username": "siddu",
    "display_name": "Siddu Kumar"
  },
  "title": "My Top 10 Films of 2024",
  "slug": "my-top-10-films-of-2024",
  "content": "...",
  "excerpt": "...",
  "cover_image_url": "...",
  "tags": ["year-end", "top-10", "2024"],
  "status": "published",
  "published_at": "2025-01-15T12:00:00Z",
  "view_count": 1523,
  "like_count": 87,
  "comment_count": 12,
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T12:00:00Z"
}
```

#### **PUT /critic-blog/{post_id}**
Update blog post (author only)

#### **DELETE /critic-blog/{post_id}**
Delete blog post (author only)

#### **GET /critic-blog/critic/{username}**
List blog posts by critic

**Query Params:**
- `status` (optional): draft, published, archived
- `limit` (default: 20)
- `offset` (default: 0)

#### **POST /critic-blog/{post_id}/publish**
Publish a draft blog post

---

### **Recommendations API** (`/api/v1/critic-recommendations`)

#### **POST /critic-recommendations**
Create a recommendation

**Request:**
```json
{
  "movie_id": 456,
  "recommendation_type": "hidden_gem",
  "reason": "This overlooked indie film deserves more attention..."
}
```

#### **GET /critic-recommendations/critic/{username}**
List recommendations by critic

**Query Params:**
- `type` (optional): must_watch, hidden_gem, guilty_pleasure
- `limit` (default: 20)

#### **DELETE /critic-recommendations/{recommendation_id}**
Remove recommendation

---

### **Pinned Content API** (`/api/v1/critic-pinned`)

#### **POST /critic-pinned**
Pin content to profile

**Request:**
```json
{
  "content_type": "review",
  "content_id": 789,
  "display_order": 1
}
```

**Validation:**
- Max 5 pinned items per critic (Pro tier)
- Free tier: max 3 pinned items

#### **GET /critic-pinned/critic/{username}**
Get pinned content for critic

#### **PUT /critic-pinned/{pin_id}/reorder**
Update display order

#### **DELETE /critic-pinned/{pin_id}**
Unpin content

---

### **Affiliate Links API** (`/api/v1/critic-affiliate`)

#### **POST /critic-affiliate**
Create affiliate link

**Request:**
```json
{
  "label": "Watch on Netflix",
  "platform": "netflix",
  "url": "https://netflix.com/title/123?utm_source=...",
  "utm_source": "moviemadders",
  "utm_medium": "critic_profile",
  "utm_campaign": "siddu_jan2025"
}
```

#### **GET /critic-affiliate/critic/{username}**
List affiliate links

#### **POST /critic-affiliate/{link_id}/click**
Track affiliate link click (public endpoint)

**Request:**
```json
{
  "referrer": "https://moviemadders.com/critic/siddu",
  "user_agent": "Mozilla/5.0..."
}
```

**Response:** `200 OK`
```json
{
  "redirect_url": "https://netflix.com/title/123?utm_source=..."
}
```

#### **PUT /critic-affiliate/{link_id}**
Update affiliate link

#### **DELETE /critic-affiliate/{link_id}**
Delete affiliate link

---

### **Brand Deals API** (`/api/v1/critic-brand-deals`)

#### **POST /critic-brand-deals**
Create brand deal (critic or admin)

**Request:**
```json
{
  "brand_name": "Acme Studios",
  "campaign_title": "New Thriller Release",
  "brief": "Review our new thriller and mention...",
  "rate_card": 500.00,
  "disclosure_required": true
}
```

#### **GET /critic-brand-deals/critic/{username}**
List brand deals for critic

#### **PUT /critic-brand-deals/{deal_id}/status**
Update deal status

**Request:**
```json
{
  "status": "accepted",
  "deliverables": ["YouTube video", "Written review", "Social posts"]
}
```

---

### **Sponsor Disclosures API** (`/api/v1/critic-disclosures`)

#### **POST /critic-disclosures**
Add disclosure to content

**Request:**
```json
{
  "review_id": 123,
  "disclosure_type": "sponsored",
  "disclosure_text": "This review is sponsored by Acme Studios",
  "brand_deal_id": 456
}
```

#### **GET /critic-disclosures/review/{review_id}**
Get disclosure for review

---

### **Verification Admin API** (`/api/v1/critic-verification/admin`)

#### **GET /critic-verification/admin/applications**
List all verification applications (admin only)

**Query Params:**
- `status` (optional): pending, approved, rejected
- `limit` (default: 50)
- `offset` (default: 0)

**RBAC:** Requires `admin` or `moderator` role

#### **PUT /critic-verification/admin/applications/{application_id}**
Approve or reject application (admin only)

**Request:**
```json
{
  "status": "approved",
  "verification_level": "professional",
  "admin_notes": "Strong portfolio, 50K+ YouTube subscribers"
}
```

**RBAC:** Requires `admin` or `moderator` role

---

## 🎨 FRONTEND IMPLEMENTATION

### **New Pages**

#### **1. Critic Studio Dashboard** (`/studio`)

**Route:** `app/studio/page.tsx`

**Sections:**
- **Overview:** Quick stats (views, likes, followers this week)
- **Content Manager:** Tabs for Reviews, Blog Posts, Recommendations
- **Pinned Content:** Drag-and-drop reordering
- **Affiliate Links:** CRUD interface with click analytics
- **Brand Deals:** Active deals, proposals, completed campaigns
- **Analytics:** Charts for views, engagement, growth

**Access Control:** Requires authenticated user with critic profile

**Components:**
- `components/studio/studio-header.tsx`
- `components/studio/studio-sidebar.tsx`
- `components/studio/content-manager.tsx`
- `components/studio/pinned-content-manager.tsx`
- `components/studio/affiliate-link-manager.tsx`
- `components/studio/brand-deals-dashboard.tsx`
- `components/studio/analytics-overview.tsx`

#### **2. Blog Post Editor** (`/studio/blog/new`, `/studio/blog/[id]/edit`)

**Features:**
- Markdown editor with preview
- Cover image upload
- Tag management
- SEO metadata (title, excerpt)
- Draft/publish workflow
- Auto-save

**Components:**
- `components/studio/blog-editor.tsx`
- `components/studio/markdown-editor.tsx`
- `components/studio/image-uploader.tsx`

#### **3. Verification Admin Panel** (`/admin/verification`)

**Route:** `app/admin/verification/page.tsx`

**Features:**
- Application queue (pending, approved, rejected tabs)
- Application detail view with portfolio links
- Approve/reject actions with notes
- Verification level selection
- Bulk actions

**RBAC:** Requires `admin` or `moderator` role

**Components:**
- `components/admin/verification-queue.tsx`
- `components/admin/application-detail.tsx`
- `components/admin/verification-actions.tsx`

### **Updated Pages**

#### **Critic Profile** (`/critic/[username]`)

**New Sections:**
- Blog tab (list blog posts)
- Recommendations tab (already exists, connect to backend)
- Pinned content section (hero area)
- Sponsor disclosures (badge on sponsored content)

**Components to Update:**
- `components/critic/profile/critic-tabbed-layout.tsx` - Add blog tab
- `components/critic/profile/pinned-content-section.tsx` - Connect to backend
- `components/critic/profile/recommendations-tab.tsx` - Connect to backend
- `components/critic/profile/critic-review-card.tsx` - Add disclosure badge

---

## 🧪 TESTING REQUIREMENTS

### **Unit Tests**

**Backend:**
- `tests/unit/test_critic_blog_repository.py` - CRUD operations
- `tests/unit/test_critic_recommendations_repository.py`
- `tests/unit/test_critic_affiliate_repository.py`
- `tests/unit/test_verification_rbac.py` - Admin role checks

**Frontend:**
- `tests/unit/studio-content-manager.test.tsx`
- `tests/unit/blog-editor.test.tsx`
- `tests/unit/affiliate-link-manager.test.tsx`

### **Integration Tests**

- `tests/integration/test_blog_post_workflow.py` - Create → publish → view
- `tests/integration/test_affiliate_click_tracking.py` - Click → redirect → count
- `tests/integration/test_verification_approval.py` - Apply → admin approve → profile updated

### **E2E Tests (Playwright)**

- `tests/e2e/critic-studio.spec.ts` - Full studio workflow
- `tests/e2e/blog-post-creation.spec.ts` - Create and publish blog post
- `tests/e2e/verification-admin.spec.ts` - Admin approval workflow
- `tests/e2e/affiliate-link-tracking.spec.ts` - Click tracking

---

## 📁 FILE STRUCTURE

```
apps/backend/
├── src/
│   ├── models.py (add 6 new models)
│   ├── repositories/
│   │   ├── critic_blog.py (new)
│   │   ├── critic_recommendations.py (new)
│   │   ├── critic_pinned.py (new)
│   │   ├── critic_affiliate.py (new)
│   │   └── critic_brand_deals.py (new)
│   ├── routers/
│   │   ├── critic_blog.py (new)
│   │   ├── critic_recommendations.py (new)
│   │   ├── critic_pinned.py (new)
│   │   ├── critic_affiliate.py (new)
│   │   └── critic_brand_deals.py (new)
│   └── schemas/
│       ├── critic_blog.py (new - Pydantic models)
│       ├── critic_recommendations.py (new)
│       └── critic_affiliate.py (new)

apps/frontend/
├── app/
│   ├── studio/
│   │   ├── page.tsx (new - dashboard)
│   │   ├── blog/
│   │   │   ├── new/page.tsx (new)
│   │   │   └── [id]/edit/page.tsx (new)
│   │   └── layout.tsx (new - studio layout)
│   └── admin/
│       └── verification/
│           └── page.tsx (new)
├── components/
│   ├── studio/ (new directory)
│   │   ├── studio-header.tsx
│   │   ├── studio-sidebar.tsx
│   │   ├── content-manager.tsx
│   │   ├── blog-editor.tsx
│   │   ├── markdown-editor.tsx
│   │   ├── pinned-content-manager.tsx
│   │   ├── affiliate-link-manager.tsx
│   │   └── analytics-overview.tsx
│   └── admin/ (new directory)
│       ├── verification-queue.tsx
│       └── application-detail.tsx
└── types/
    ├── critic-blog.ts (new)
    ├── critic-affiliate.ts (new)
    └── critic-brand-deals.ts (new)

packages/shared/ (future - for monorepo)
└── types/
    └── critic.ts (shared TypeScript types)
```

---

## ⏱️ EFFORT BREAKDOWN

### **Week 1: Backend Foundation**
- **Days 1-2:** Database models and migrations (6 new models)
- **Days 3-4:** Repository layer (5 new repositories)
- **Day 5:** API routers (blog, recommendations, pinned content)

### **Week 2: Backend Completion + Frontend Start**
- **Days 1-2:** API routers (affiliate, brand deals, disclosures)
- **Days 3-4:** RBAC enforcement and rate limiting
- **Day 5:** Backend unit and integration tests

### **Week 3: Frontend Implementation**
- **Days 1-2:** Critic Studio dashboard and layout
- **Days 3-4:** Blog editor and content manager
- **Day 5:** Affiliate link manager and pinned content UI

### **Week 4: Polish and Testing**
- **Days 1-2:** Verification admin panel
- **Days 3-4:** E2E tests and bug fixes
- **Day 5:** Documentation and deployment

**Total Estimated Effort:** 15-20 developer days

---

## ✅ ACCEPTANCE CRITERIA

### **Critic Studio**
- [ ] Critic can access studio dashboard at `/studio`
- [ ] Dashboard shows overview stats (views, likes, followers)
- [ ] Content manager displays all reviews, blog posts, recommendations
- [ ] Pinned content can be added/removed/reordered (max 5 for Pro, 3 for Free)

### **Blog Posts**
- [ ] Critic can create blog post with markdown editor
- [ ] Blog post can be saved as draft
- [ ] Blog post can be published (status changes, published_at set)
- [ ] Published blog post appears on critic profile under "Blog" tab
- [ ] Blog post view count increments on page view

### **Recommendations**
- [ ] Critic can add movie recommendation with type and reason
- [ ] Recommendations appear on profile "Recommendations" tab
- [ ] Recommendations can be filtered by type

### **Affiliate Links**
- [ ] Critic can create affiliate link with label, platform, URL, UTM params
- [ ] Affiliate link click increments click_count
- [ ] Affiliate link redirects to target URL
- [ ] Affiliate link analytics show total clicks

### **Verification Admin**
- [ ] Admin can view all verification applications
- [ ] Admin can filter by status (pending, approved, rejected)
- [ ] Admin can approve application (sets is_verified=true, verification_level)
- [ ] Admin can reject application with notes
- [ ] Non-admin users cannot access admin endpoints (403 Forbidden)

### **Sponsor Disclosures**
- [ ] Disclosure badge appears on sponsored reviews
- [ ] Disclosure text is visible on review detail page
- [ ] Disclosure is FTC-compliant (clear and conspicuous)

---

**Next:** See `CRITIC_ROADMAP_P1_P2.md` for P1 and P2 features.

