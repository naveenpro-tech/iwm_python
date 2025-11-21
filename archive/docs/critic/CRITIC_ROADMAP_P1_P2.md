# 🗺️ CRITIC PLATFORM ROADMAP - P1 & P2

**Timeline:** P1 (Weeks 5-8), P2 (Weeks 9-12)  
**Status:** 📋 PLANNED  
**Dependencies:** P0 MVP must be complete

---

## 🎯 PHASE 1 (P1) - WEEKS 5-8

**Goal:** YouTube Integration, Link-in-Bio, and Sponsor Pipeline

### **P1.1: YouTube Channel Integration**

**Objective:** Auto-import YouTube videos and sync channel metrics

#### **Features**

**1. YouTube OAuth Connection**
- OAuth 2.0 flow for YouTube Data API v3
- Store refresh token securely
- Channel verification (must be movie/film content)

**2. Video Import**
- Fetch all videos from channel (paginated)
- Map video → draft review:
  - Title → review title
  - Description → review content (first paragraph)
  - Thumbnail → cover image
  - Published date → review date
  - Video ID → youtube_embed_url
- Bulk import UI (select videos to import)
- Incremental sync (new videos only)

**3. Scheduled Sync**
- Background job runs every 6 hours
- Checks for new videos
- Creates draft reviews automatically
- Sends notification to critic

**4. Metrics Sync**
- Pull video metrics (views, likes, comments)
- Store in CriticAnalytics table
- Update daily

#### **Database Schema**

```python
class CriticYouTubeChannel(Base):
    __tablename__ = "critic_youtube_channels"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id"), unique=True)
    
    channel_id: Mapped[str] = mapped_column(String(100), unique=True)
    channel_title: Mapped[str] = mapped_column(String(200))
    channel_url: Mapped[str] = mapped_column(String(255))
    
    access_token: Mapped[str] = mapped_column(Text)  # Encrypted
    refresh_token: Mapped[str] = mapped_column(Text)  # Encrypted
    token_expires_at: Mapped[datetime] = mapped_column(DateTime)
    
    subscriber_count: Mapped[int] = mapped_column(Integer, default=0)
    video_count: Mapped[int] = mapped_column(Integer, default=0)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    
    last_sync_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    sync_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

#### **API Endpoints**

- `POST /api/v1/integrations/youtube/connect` - Initiate OAuth flow
- `GET /api/v1/integrations/youtube/callback` - OAuth callback
- `GET /api/v1/integrations/youtube/channel` - Get connected channel
- `POST /api/v1/integrations/youtube/sync` - Trigger manual sync
- `POST /api/v1/integrations/youtube/import` - Import selected videos
- `DELETE /api/v1/integrations/youtube/disconnect` - Disconnect channel

#### **Frontend Components**

- `app/studio/integrations/youtube/page.tsx` - YouTube connection page
- `components/studio/youtube-connect-button.tsx`
- `components/studio/youtube-video-selector.tsx` - Bulk import UI
- `components/studio/youtube-sync-status.tsx`

#### **Background Jobs**

- `jobs/youtube_sync.py` - Scheduled sync job (Celery/RQ)
- `jobs/youtube_metrics.py` - Daily metrics update

#### **Acceptance Criteria**

- [ ] Critic can connect YouTube channel via OAuth
- [ ] All channel videos appear in import selector
- [ ] Selected videos create draft reviews with correct data
- [ ] New videos auto-sync every 6 hours
- [ ] Channel metrics update daily
- [ ] Critic can disconnect channel (revokes tokens)

---

### **P1.2: Link-in-Bio Page**

**Objective:** Create a shareable, SEO-optimized landing page for critics

#### **Features**

**1. Microsite Page**
- Route: `/c/{username}` (short URL)
- Displays:
  - Profile photo and bio
  - Top 5 links (affiliate, social, latest review)
  - Latest review preview
  - Follow button
- Mobile-optimized (vertical layout)
- QR code generator

**2. Link Management**
- CRUD for custom links
- Drag-and-drop reordering
- Link analytics (clicks, sources)
- Link scheduling (active date range)

**3. Analytics**
- Track page views
- Track link clicks
- Source breakdown (Twitter, Instagram, YouTube description)
- Geographic data

**4. Customization**
- Theme selection (light, dark, custom colors)
- Background image/gradient
- Font selection
- Custom domain (Pro+ tier)

#### **Database Schema**

```python
class CriticLinkInBio(Base):
    __tablename__ = "critic_link_in_bio"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id"), unique=True)
    
    title: Mapped[str] = mapped_column(String(100))
    bio: Mapped[str] = mapped_column(String(500))
    
    theme: Mapped[str] = mapped_column(String(50), default="dark")
    background_type: Mapped[str] = mapped_column(String(50), default="gradient")  # solid, gradient, image
    background_value: Mapped[str] = mapped_column(String(255))
    
    custom_domain: Mapped[str | None] = mapped_column(String(255), nullable=True, unique=True)
    
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CriticCustomLink(Base):
    __tablename__ = "critic_custom_links"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    link_in_bio_id: Mapped[int] = mapped_column(ForeignKey("critic_link_in_bio.id", ondelete="CASCADE"))
    
    title: Mapped[str] = mapped_column(String(100))
    url: Mapped[str] = mapped_column(String(500))
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    click_count: Mapped[int] = mapped_column(Integer, default=0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

#### **API Endpoints**

- `GET /api/v1/link-in-bio/{username}` - Get link-in-bio page (public)
- `PUT /api/v1/link-in-bio` - Update link-in-bio settings
- `POST /api/v1/link-in-bio/links` - Add custom link
- `PUT /api/v1/link-in-bio/links/{link_id}` - Update link
- `DELETE /api/v1/link-in-bio/links/{link_id}` - Delete link
- `POST /api/v1/link-in-bio/links/reorder` - Reorder links
- `POST /api/v1/link-in-bio/track-view` - Track page view
- `POST /api/v1/link-in-bio/track-click/{link_id}` - Track link click

#### **Frontend Pages**

- `app/c/[username]/page.tsx` - Public link-in-bio page
- `app/studio/link-in-bio/page.tsx` - Link-in-bio editor

#### **Acceptance Criteria**

- [ ] Link-in-bio page loads at `/c/{username}`
- [ ] Page is mobile-optimized and responsive
- [ ] Critic can add/edit/delete custom links
- [ ] Links can be reordered via drag-and-drop
- [ ] Page views and link clicks are tracked
- [ ] QR code can be generated and downloaded

---

### **P1.3: Sponsor Pipeline**

**Objective:** End-to-end brand deal workflow with FTC compliance

#### **Features**

**1. Brand Brief Intake**
- Brands submit campaign briefs
- Critic receives notification
- Critic can accept/decline/counter

**2. Proposal System**
- Critic submits proposal (rate, deliverables, timeline)
- Brand approves/rejects
- Contract generation (PDF)

**3. Deliverables Tracking**
- Checklist of deliverables
- Upload proof (links, screenshots)
- Brand approval workflow

**4. Disclosure Enforcement**
- Auto-add disclosure to sponsored content
- FTC-compliant templates
- Disclosure badge on profile

**5. Payment Tracking**
- Invoice generation
- Payment status (pending, paid)
- Payout history

#### **Database Schema**

```python
class BrandCampaignBrief(Base):
    __tablename__ = "brand_campaign_briefs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    brand_name: Mapped[str] = mapped_column(String(200))
    brand_email: Mapped[str] = mapped_column(String(255))
    
    campaign_title: Mapped[str] = mapped_column(String(200))
    campaign_description: Mapped[str] = mapped_column(Text)
    
    target_critics: Mapped[List[str]] = mapped_column(ARRAY(String))  # Usernames or "all_verified"
    budget_range: Mapped[str] = mapped_column(String(100))
    
    deliverables: Mapped[str] = mapped_column(Text)  # JSON
    deadline: Mapped[datetime] = mapped_column(DateTime)
    
    status: Mapped[str] = mapped_column(String(50), default="open")  # open, closed, cancelled
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class CriticProposal(Base):
    __tablename__ = "critic_proposals"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    brief_id: Mapped[int] = mapped_column(ForeignKey("brand_campaign_briefs.id"))
    critic_id: Mapped[int] = mapped_column(ForeignKey("critic_profiles.id"))
    
    proposed_rate: Mapped[float] = mapped_column(Float)
    proposed_deliverables: Mapped[str] = mapped_column(Text)  # JSON
    proposed_timeline: Mapped[str] = mapped_column(Text)
    
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, accepted, rejected
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

#### **API Endpoints**

- `POST /api/v1/brand-briefs` - Submit brand brief (public or authenticated)
- `GET /api/v1/brand-briefs` - List available briefs (verified critics)
- `POST /api/v1/brand-briefs/{brief_id}/proposals` - Submit proposal
- `GET /api/v1/critic-brand-deals/{deal_id}/deliverables` - Get deliverables checklist
- `POST /api/v1/critic-brand-deals/{deal_id}/deliverables/{item_id}/complete` - Mark deliverable complete
- `POST /api/v1/critic-brand-deals/{deal_id}/invoice` - Generate invoice

#### **Frontend Pages**

- `app/studio/brand-deals/page.tsx` - Brand deals dashboard
- `app/studio/brand-deals/briefs/page.tsx` - Available briefs
- `app/studio/brand-deals/[deal_id]/page.tsx` - Deal detail and deliverables

#### **Acceptance Criteria**

- [ ] Brand can submit campaign brief
- [ ] Verified critics see available briefs
- [ ] Critic can submit proposal with rate and deliverables
- [ ] Accepted proposal creates CriticBrandDeal
- [ ] Deliverables checklist is generated
- [ ] Disclosure is auto-added to sponsored content
- [ ] Invoice can be generated as PDF

---

## 🎯 PHASE 2 (P2) - WEEKS 9-12

**Goal:** Memberships, Advanced Analytics, and Discovery

### **P2.1: Memberships & Tips Integration**

**Objective:** Enable critics to monetize through memberships and tips

#### **Features**

**1. Patreon Integration**
- OAuth connection to Patreon
- Sync membership tiers
- Display "Support on Patreon" button
- Sync patron count

**2. Ko-fi Integration**
- Connect Ko-fi account
- Display "Buy Me a Coffee" button
- Track donations

**3. Native Tips (Future)**
- Stripe integration
- One-time tips
- Tip jar on profile

**4. Gated Content**
- Mark blog posts as "members-only"
- Verify membership via Patreon API
- Show preview for non-members

#### **Acceptance Criteria**

- [ ] Critic can connect Patreon account
- [ ] Membership tiers display on profile
- [ ] "Support on Patreon" button redirects correctly
- [ ] Members-only blog posts require authentication

---

### **P2.2: Advanced Analytics Dashboard**

**Objective:** Comprehensive cross-platform analytics

#### **Features**

**1. Unified Dashboard**
- YouTube metrics (views, watch time, subscribers)
- Onsite metrics (review views, likes, comments)
- Affiliate metrics (clicks, conversions, revenue)
- Social metrics (followers, engagement)

**2. Visualizations**
- Time-series charts (growth over time)
- Genre distribution (pie chart)
- Rating distribution (histogram)
- Top-performing content (table)

**3. Insights**
- Best posting times
- Trending topics
- Audience demographics (from YouTube)
- Engagement rate trends

**4. Export**
- CSV export
- PDF report generation
- Scheduled email reports

#### **Acceptance Criteria**

- [ ] Dashboard shows unified metrics from all sources
- [ ] Charts are interactive and responsive
- [ ] Data can be filtered by date range
- [ ] Reports can be exported as CSV or PDF

---

### **P2.3: Critics Directory v2**

**Objective:** Enhanced discovery and search

#### **Features**

**1. Advanced Filters**
- Verification tier (basic, professional, celebrity)
- Genre specialization
- Follower count range
- Review count range
- Location

**2. Sorting**
- Trending (engagement rate)
- Most followers
- Most reviews
- Recently joined
- Alphabetical

**3. Featured Critics**
- Admin-curated featured section
- Rotating spotlight
- "Critic of the Week"

**4. Search**
- Full-text search (name, bio, genres)
- Autocomplete suggestions
- Search history

#### **Acceptance Criteria**

- [ ] Directory supports all filter combinations
- [ ] Search returns relevant results
- [ ] Featured critics section displays correctly
- [ ] Directory is SEO-optimized (server-side rendering)

---

## 📊 DEPENDENCIES & SEQUENCING

### **P0 → P1 Dependencies**

- P1.1 (YouTube) requires P0 blog/review models
- P1.2 (Link-in-Bio) requires P0 affiliate links
- P1.3 (Sponsor Pipeline) requires P0 brand deals and disclosures

### **P1 → P2 Dependencies**

- P2.1 (Memberships) requires P1.2 (Link-in-Bio) for display
- P2.2 (Analytics) requires P1.1 (YouTube metrics)
- P2.3 (Directory v2) requires P0 verification system

### **Critical Path**

```
P0 (MVP) → P1.1 (YouTube) → P2.2 (Analytics)
         → P1.2 (Link-in-Bio) → P2.1 (Memberships)
         → P1.3 (Sponsor Pipeline)
         → P2.3 (Directory v2)
```

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Background Jobs (Celery/RQ)**

- YouTube sync (every 6 hours)
- YouTube metrics (daily)
- Analytics aggregation (daily)
- Email notifications (real-time)

### **Caching Strategy**

- Link-in-bio pages (edge cache, 5 min TTL)
- Critic profiles (Redis, 1 min TTL)
- Analytics data (Redis, 1 hour TTL)

### **Rate Limiting**

- YouTube API: 10,000 quota units/day per project
- Affiliate click tracking: 1000 req/min per IP
- Link-in-bio views: No limit (cached)

### **Security**

- YouTube tokens encrypted at rest (Fernet)
- RBAC for admin endpoints
- CORS for public APIs
- Rate limiting on all endpoints

---

## ⏱️ EFFORT BREAKDOWN

### **P1 (Weeks 5-8)**

- **Week 5:** YouTube OAuth and video import
- **Week 6:** YouTube sync jobs and metrics
- **Week 7:** Link-in-bio page and analytics
- **Week 8:** Sponsor pipeline and disclosure enforcement

**Total:** 20 developer days

### **P2 (Weeks 9-12)**

- **Week 9:** Patreon/Ko-fi integrations
- **Week 10:** Advanced analytics dashboard
- **Week 11:** Critics directory v2
- **Week 12:** Testing, bug fixes, documentation

**Total:** 20 developer days

---

## 🎯 SUCCESS METRICS

### **P1 Success**

- 50+ critics connect YouTube channels
- 500+ videos imported
- 100+ link-in-bio pages created
- 10+ brand deals initiated

### **P2 Success**

- 20+ critics connect Patreon/Ko-fi
- 1000+ analytics dashboard views
- 5000+ directory searches
- 80% critic retention rate

---

**Next:** Begin P0 implementation (see `CRITIC_MVP_PHASE_0.md`)

