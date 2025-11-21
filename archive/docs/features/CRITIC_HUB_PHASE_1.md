# 🔧 CRITIC HUB - PHASE 1: Database & Backend Foundation

**Duration:** 4 hours  
**Status:** 📋 READY FOR EXECUTION

---

## 🎯 OBJECTIVES

1. Create all database tables for Critic Hub
2. Implement SQLAlchemy models
3. Create database migration
4. Build repository layer for data access
5. Create basic API routers
6. Test all backend endpoints

---

## 📊 STEP 1: DATABASE MIGRATION (30 minutes)

### **File:** `apps/backend/src/migrations/versions/xxx_add_critic_hub_tables.py`

**Actions:**
1. Create Alembic migration file
2. Add all 9 tables:
   - `critic_profiles`
   - `critic_social_links`
   - `critic_reviews`
   - `critic_review_comments`
   - `critic_followers`
   - `critic_review_likes`
   - `critic_verification_applications`
   - `critic_analytics`
3. Add all indexes for performance
4. Add foreign key constraints
5. Run migration: `alembic upgrade head`
6. Verify tables created: `psql -d iwm -c "\dt"`

---

## 🗂️ STEP 2: SQLALCHEMY MODELS (45 minutes)

### **File:** `apps/backend/src/models.py`

**Add Models:**

```python
class CriticProfile(Base):
    __tablename__ = "critic_profiles"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    
    # Branding
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(200))
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    banner_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    banner_video_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # Verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    verification_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    verification_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Stats
    follower_count: Mapped[int] = mapped_column(Integer, default=0)
    total_reviews: Mapped[int] = mapped_column(Integer, default=0)
    avg_engagement: Mapped[float] = mapped_column(Float, default=0.0)
    total_views: Mapped[int] = mapped_column(Integer, default=0)
    
    # Settings
    review_philosophy: Mapped[str | None] = mapped_column(Text, nullable=True)
    equipment_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    background_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Metadata
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, onupdate=datetime.utcnow, nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="critic_profile")
    social_links: Mapped[List["CriticSocialLink"]] = relationship(back_populates="critic", cascade="all, delete-orphan")
    reviews: Mapped[List["CriticReview"]] = relationship(back_populates="critic", cascade="all, delete-orphan")
    followers: Mapped[List["CriticFollower"]] = relationship(back_populates="critic", cascade="all, delete-orphan")
    analytics: Mapped[List["CriticAnalytics"]] = relationship(back_populates="critic", cascade="all, delete-orphan")


class CriticSocialLink(Base):
    __tablename__ = "critic_social_links"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    critic_id: Mapped[int] = mapped_column(Integer, ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    platform: Mapped[str] = mapped_column(String(50))  # 'youtube', 'twitter', 'instagram', 'blog', 'tiktok'
    url: Mapped[str] = mapped_column(String(500))
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="social_links")


class CriticReview(Base):
    __tablename__ = "critic_reviews"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    critic_id: Mapped[int] = mapped_column(Integer, ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    movie_id: Mapped[int] = mapped_column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), index=True)
    
    # Content
    title: Mapped[str | None] = mapped_column(String(500), nullable=True)
    content: Mapped[str] = mapped_column(Text)
    rating_type: Mapped[str | None] = mapped_column(String(50), nullable=True)  # 'numeric', 'letter', 'custom'
    rating_value: Mapped[str | None] = mapped_column(String(20), nullable=True)  # '8.5', 'A-', 'Must Watch!'
    numeric_rating: Mapped[float | None] = mapped_column(Float, nullable=True)  # For sorting/filtering
    
    # Rich Media
    youtube_embed_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    image_gallery: Mapped[dict] = mapped_column(_JSONB, default=list)  # Array of image URLs
    
    # Where to Watch
    watch_links: Mapped[dict] = mapped_column(_JSONB, default=list)  # Array of {platform, url, isAffiliate}
    
    # Metadata
    published_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, onupdate=datetime.utcnow, nullable=True)
    is_draft: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Engagement
    like_count: Mapped[int] = mapped_column(Integer, default=0)
    comment_count: Mapped[int] = mapped_column(Integer, default=0)
    share_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # SEO
    slug: Mapped[str] = mapped_column(String(500), unique=True, index=True)
    meta_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="reviews")
    movie: Mapped["Movie"] = relationship()
    comments: Mapped[List["CriticReviewComment"]] = relationship(back_populates="review", cascade="all, delete-orphan")
    likes: Mapped[List["CriticReviewLike"]] = relationship(back_populates="review", cascade="all, delete-orphan")


class CriticReviewComment(Base):
    __tablename__ = "critic_review_comments"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    review_id: Mapped[int] = mapped_column(Integer, ForeignKey("critic_reviews.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    parent_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("critic_review_comments.id", ondelete="CASCADE"), nullable=True, index=True)
    
    content: Mapped[str] = mapped_column(Text)
    like_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, onupdate=datetime.utcnow, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    review: Mapped["CriticReview"] = relationship(back_populates="comments")
    user: Mapped["User"] = relationship()
    parent: Mapped["CriticReviewComment | None"] = relationship(remote_side=[id])


class CriticFollower(Base):
    __tablename__ = "critic_followers"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    critic_id: Mapped[int] = mapped_column(Integer, ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    followed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="followers")
    user: Mapped["User"] = relationship()
    
    __table_args__ = (UniqueConstraint('critic_id', 'user_id', name='uq_critic_follower'),)


class CriticReviewLike(Base):
    __tablename__ = "critic_review_likes"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    review_id: Mapped[int] = mapped_column(Integer, ForeignKey("critic_reviews.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    review: Mapped["CriticReview"] = relationship(back_populates="likes")
    user: Mapped["User"] = relationship()
    
    __table_args__ = (UniqueConstraint('review_id', 'user_id', name='uq_review_like'),)


class CriticVerificationApplication(Base):
    __tablename__ = "critic_verification_applications"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    
    # Application Data
    requested_username: Mapped[str] = mapped_column(String(100))
    display_name: Mapped[str] = mapped_column(String(200))
    bio: Mapped[str] = mapped_column(Text)
    
    # Platform Links
    youtube_channel: Mapped[str | None] = mapped_column(String(500), nullable=True)
    blog_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    twitter_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    instagram_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    other_platforms: Mapped[dict] = mapped_column(_JSONB, default=list)
    
    # Metrics
    youtube_subscribers: Mapped[int | None] = mapped_column(Integer, nullable=True)
    blog_monthly_visitors: Mapped[int | None] = mapped_column(Integer, nullable=True)
    social_followers: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sample_review_urls: Mapped[dict] = mapped_column(_JSONB, default=list)
    
    # Status
    status: Mapped[str] = mapped_column(String(50), default='pending', index=True)  # 'pending', 'under_review', 'approved', 'rejected'
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    reviewed_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship(foreign_keys=[user_id])
    reviewer: Mapped["User | None"] = relationship(foreign_keys=[reviewed_by])


class CriticAnalytics(Base):
    __tablename__ = "critic_analytics"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    critic_id: Mapped[int] = mapped_column(Integer, ForeignKey("critic_profiles.id", ondelete="CASCADE"), index=True)
    date: Mapped[date] = mapped_column(Date, index=True)
    
    # Daily Metrics
    views: Mapped[int] = mapped_column(Integer, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    comments: Mapped[int] = mapped_column(Integer, default=0)
    shares: Mapped[int] = mapped_column(Integer, default=0)
    new_followers: Mapped[int] = mapped_column(Integer, default=0)
    
    # Relationships
    critic: Mapped["CriticProfile"] = relationship(back_populates="analytics")
    
    __table_args__ = (UniqueConstraint('critic_id', 'date', name='uq_critic_analytics_date'),)
```

**Also Update User Model:**
```python
# Add to User model
critic_profile: Mapped["CriticProfile | None"] = relationship(back_populates="user", uselist=False)
```

---

## 📦 STEP 3: REPOSITORY LAYER (60 minutes)

### **File:** `apps/backend/src/repositories/critics.py`

**Create CriticRepository with methods:**
- `get_by_username(username: str)` - Get critic profile
- `get_by_user_id(user_id: int)` - Get critic by user
- `create(user_id, username, display_name, bio)` - Create profile
- `update(critic_id, **kwargs)` - Update profile
- `list_all(page, limit, verified_only)` - Browse critics
- `search(query, page, limit)` - Search critics
- `get_stats(critic_id)` - Get critic stats
- `follow(critic_id, user_id)` - Follow critic
- `unfollow(critic_id, user_id)` - Unfollow critic
- `is_following(critic_id, user_id)` - Check if following

### **File:** `apps/backend/src/repositories/critic_reviews.py`

**Create CriticReviewRepository with methods:**
- `get_by_id(external_id)` - Get single review
- `get_by_slug(slug)` - Get review by slug
- `list_by_critic(critic_id, page, limit, include_drafts)` - Critic's reviews
- `list_by_movie(movie_id, page, limit)` - Movie's critic reviews
- `create(critic_id, movie_id, **data)` - Create review
- `update(review_id, **data)` - Update review
- `delete(review_id)` - Delete review
- `publish(review_id)` - Publish draft
- `like(review_id, user_id)` - Like review
- `unlike(review_id, user_id)` - Unlike review
- `increment_view(review_id)` - Track view

### **File:** `apps/backend/src/repositories/critic_verification.py`

**Create CriticVerificationRepository with methods:**
- `create_application(user_id, **data)` - Submit application
- `get_application(external_id)` - Get application
- `list_pending(page, limit)` - Admin queue
- `approve(application_id, admin_id, notes)` - Approve
- `reject(application_id, admin_id, reason)` - Reject
- `get_by_user(user_id)` - User's applications

---

## 🌐 STEP 4: API ROUTERS (60 minutes)

### **File:** `apps/backend/src/routers/critics.py`

**Endpoints:**
- `GET /critics` - List/search critics
- `GET /critics/{username}` - Get critic profile
- `POST /critics/{username}/follow` - Follow critic
- `DELETE /critics/{username}/follow` - Unfollow critic
- `GET /critics/{username}/followers` - Get followers
- `GET /critics/{username}/stats` - Get stats

### **File:** `apps/backend/src/routers/critic_reviews.py`

**Endpoints:**
- `GET /critic-reviews` - List all critic reviews
- `GET /critic-reviews/{id}` - Get single review
- `GET /critics/{username}/reviews` - Critic's reviews
- `GET /movies/{movieId}/critic-reviews` - Movie's critic reviews
- `POST /critic-reviews` - Create review (auth required)
- `PUT /critic-reviews/{id}` - Update review (auth required)
- `DELETE /critic-reviews/{id}` - Delete review (auth required)
- `POST /critic-reviews/{id}/publish` - Publish draft
- `POST /critic-reviews/{id}/like` - Like review
- `DELETE /critic-reviews/{id}/like` - Unlike review
- `POST /critic-reviews/{id}/comments` - Add comment
- `GET /critic-reviews/{id}/comments` - Get comments

### **File:** `apps/backend/src/routers/critic_verification.py`

**Endpoints:**
- `POST /critic-verification/apply` - Submit application
- `GET /critic-verification/my-application` - Get user's application
- `GET /admin/critic-verification/queue` - Admin queue
- `POST /admin/critic-verification/{id}/approve` - Approve
- `POST /admin/critic-verification/{id}/reject` - Reject

---

## 🧪 STEP 5: TESTING (45 minutes)

### **Create Test Script:** `scripts/test_critic_hub_backend.py`

**Test All Endpoints:**
1. Create test user
2. Submit critic application
3. Admin approve application
4. Create critic profile
5. Create critic review
6. Like review
7. Comment on review
8. Follow critic
9. Get critic stats
10. List all critics
11. Search critics

---

## ✅ PHASE 1 COMPLETION CHECKLIST

- [ ] Database migration created and run
- [ ] All 9 tables created in database
- [ ] All SQLAlchemy models added to models.py
- [ ] User model updated with critic_profile relationship
- [ ] CriticRepository created with all methods
- [ ] CriticReviewRepository created with all methods
- [ ] CriticVerificationRepository created with all methods
- [ ] Critics router created with all endpoints
- [ ] Critic Reviews router created with all endpoints
- [ ] Critic Verification router created with all endpoints
- [ ] All routers registered in main.py
- [ ] Test script created and passing
- [ ] Backend server restarts without errors
- [ ] All endpoints return 200/201 responses

---

**Next:** Proceed to Phase 2 - Critic Profile Pages

