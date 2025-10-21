# Complete Database Schema Documentation

**Database:** iwm (I Watch Movies)  
**PostgreSQL Version:** 16  
**ORM:** SQLAlchemy 2.0 (Async)  
**Migration Tool:** Alembic  

---

## Table of Contents

1. [Core Entities](#core-entities)
2. [User Management](#user-management)
3. [Social Features](#social-features)
4. [Awards & Festivals](#awards--festivals)
5. [Box Office](#box-office)
6. [Content Discovery](#content-discovery)
7. [Quiz System](#quiz-system)
8. [Talent Hub](#talent-hub)
9. [Admin & Moderation](#admin--moderation)
10. [Association Tables](#association-tables)

---

## Core Entities

### `movies`
Primary table for all movie data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier (e.g., tmdb_12345) |
| title | VARCHAR(200) | NOT NULL | Movie title |
| tagline | VARCHAR(500) | NULL | Movie tagline |
| year | VARCHAR(4) | NULL | Release year |
| release_date | TIMESTAMP | NULL | Exact release date |
| runtime | INTEGER | NULL | Runtime in minutes |
| siddu_score | FLOAT | NULL | Platform rating (0-10) |
| critics_score | FLOAT | NULL | Critics rating |
| imdb_rating | FLOAT | NULL | IMDB rating |
| rotten_tomatoes_score | INTEGER | NULL | RT score (0-100) |
| rating | VARCHAR(10) | NULL | Content rating (PG-13, R, etc.) |
| language | VARCHAR(50) | NULL | Primary language |
| country | VARCHAR(50) | NULL | Country of origin |
| overview | TEXT | NULL | Plot synopsis |
| poster_url | VARCHAR(255) | NULL | Poster image URL |
| backdrop_url | VARCHAR(255) | NULL | Backdrop image URL |
| budget | INTEGER | NULL | Production budget (USD) |
| revenue | INTEGER | NULL | Box office revenue (USD) |
| status | VARCHAR(20) | DEFAULT 'released' | Status (released, upcoming, in-production) |
| trivia | JSONB | NULL | Array of trivia objects |
| timeline | JSONB | NULL | Array of timeline events |

**Indexes:**
```sql
CREATE INDEX idx_movies_external_id ON movies (external_id);
CREATE INDEX idx_movies_title_trgm ON movies USING gin (title gin_trgm_ops);
CREATE INDEX idx_movies_year ON movies (year);
CREATE INDEX idx_movies_siddu_score ON movies (siddu_score DESC) WHERE siddu_score IS NOT NULL;
CREATE INDEX idx_movies_status ON movies (status);
CREATE INDEX idx_movies_trivia_gin ON movies USING gin (trivia);
CREATE INDEX idx_movies_timeline_gin ON movies USING gin (timeline);
```

**JSONB Structure:**

```json
// trivia field
[
  {
    "question": "What was the budget?",
    "category": "production",
    "answer": "$165 million",
    "explanation": "Additional context"
  }
]

// timeline field
[
  {
    "date": "2023-01-15",
    "title": "Principal Photography Begins",
    "description": "Filming started in Iceland",
    "type": "production"
  }
]
```

---

### `genres`
Movie genres taxonomy.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| slug | VARCHAR(50) | UNIQUE, INDEX | URL-friendly slug |
| name | VARCHAR(100) | NOT NULL | Genre name |

**Indexes:**
```sql
CREATE INDEX idx_genres_slug ON genres (slug);
```

**Sample Data:**
```sql
INSERT INTO genres (slug, name) VALUES
  ('sci-fi', 'Science Fiction'),
  ('drama', 'Drama'),
  ('action', 'Action'),
  ('comedy', 'Comedy'),
  ('horror', 'Horror'),
  ('thriller', 'Thriller'),
  ('romance', 'Romance'),
  ('documentary', 'Documentary');
```

---

### `people`
Actors, directors, writers, producers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| name | VARCHAR(100) | NOT NULL | Person's name |
| bio | TEXT | NULL | Biography |
| image_url | VARCHAR(255) | NULL | Profile image URL |

**Indexes:**
```sql
CREATE INDEX idx_people_external_id ON people (external_id);
CREATE INDEX idx_people_name_trgm ON people USING gin (name gin_trgm_ops);
```

---

### `scenes`
Individual movie scenes for Scene Explorer feature.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| title | VARCHAR(200) | NOT NULL | Scene title |
| description | TEXT | NULL | Scene description |
| thumbnail_url | VARCHAR(255) | NULL | Thumbnail image |
| duration_str | VARCHAR(20) | NULL | Duration string (e.g., "2:30") |
| duration_seconds | INTEGER | NULL | Duration in seconds |
| scene_type | VARCHAR(50) | NULL | Type of scene |
| director | VARCHAR(100) | NULL | Director name |
| cinematographer | VARCHAR(100) | NULL | Cinematographer name |
| view_count | INTEGER | DEFAULT 0 | Number of views |
| comment_count | INTEGER | DEFAULT 0 | Number of comments |
| is_popular | BOOLEAN | DEFAULT FALSE | Popular flag |
| is_visual_treat | BOOLEAN | DEFAULT FALSE | Visual treat flag |
| added_at | TIMESTAMP | DEFAULT NOW() | When added |
| movie_id | INTEGER | FK → movies.id | Associated movie |

**Indexes:**
```sql
CREATE INDEX idx_scenes_movie_id ON scenes (movie_id);
CREATE INDEX idx_scenes_is_popular ON scenes (is_popular) WHERE is_popular = TRUE;
CREATE INDEX idx_scenes_is_visual_treat ON scenes (is_visual_treat) WHERE is_visual_treat = TRUE;
CREATE INDEX idx_scenes_added_at ON scenes (added_at DESC);
```

---

## User Management

### `users`
User accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| email | VARCHAR(200) | UNIQUE, INDEX | Email address |
| hashed_password | VARCHAR(255) | NOT NULL | Argon2 hashed password |
| name | VARCHAR(100) | NOT NULL | Display name |
| avatar_url | VARCHAR(255) | NULL | Avatar image URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation |
| updated_at | TIMESTAMP | NULL | Last update |

**Indexes:**
```sql
CREATE INDEX idx_users_external_id ON users (external_id);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_created_at ON users (created_at DESC);
```

**Security:**
- Passwords hashed with Argon2-CFFI
- JWT tokens for authentication
- Email must be unique and validated

---

### `reviews`
User movie reviews.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| title | VARCHAR(200) | NOT NULL | Review title |
| content | TEXT | NOT NULL | Review content |
| rating | FLOAT | NOT NULL | User rating (0-10) |
| date | TIMESTAMP | DEFAULT NOW() | Review date |
| has_spoilers | BOOLEAN | DEFAULT FALSE | Contains spoilers |
| is_verified | BOOLEAN | DEFAULT FALSE | Verified purchase/viewing |
| helpful_votes | INTEGER | DEFAULT 0 | Helpful count |
| unhelpful_votes | INTEGER | DEFAULT 0 | Unhelpful count |
| comment_count | INTEGER | DEFAULT 0 | Number of comments |
| engagement_score | INTEGER | DEFAULT 0 | Engagement metric |
| media_urls | TEXT | NULL | JSON array of media URLs |
| user_id | INTEGER | FK → users.id | Review author |
| movie_id | INTEGER | FK → movies.id | Reviewed movie |

**Indexes:**
```sql
CREATE INDEX idx_reviews_user_id ON reviews (user_id);
CREATE INDEX idx_reviews_movie_id ON reviews (movie_id);
CREATE INDEX idx_reviews_date ON reviews (date DESC);
CREATE INDEX idx_reviews_rating ON reviews (rating DESC);
CREATE INDEX idx_reviews_engagement ON reviews (engagement_score DESC);
```

**Partitioning Strategy:**
```sql
-- Partition by year for performance
CREATE TABLE reviews_partitioned (LIKE reviews INCLUDING ALL)
PARTITION BY RANGE (date);

CREATE TABLE reviews_2024 PARTITION OF reviews_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

### `collections`
User-created movie collections.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| title | VARCHAR(200) | NOT NULL | Collection title |
| description | TEXT | NULL | Collection description |
| is_public | BOOLEAN | DEFAULT TRUE | Public visibility |
| followers | INTEGER | DEFAULT 0 | Follower count |
| tags | TEXT | NULL | JSON array of tags |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | NULL | Last update |
| user_id | INTEGER | FK → users.id | Collection owner |

**Indexes:**
```sql
CREATE INDEX idx_collections_user_id ON collections (user_id);
CREATE INDEX idx_collections_is_public ON collections (is_public) WHERE is_public = TRUE;
CREATE INDEX idx_collections_created_at ON collections (created_at DESC);
```

---

### `watchlist`
User watchlist entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| date_added | TIMESTAMP | DEFAULT NOW() | When added |
| status | VARCHAR(20) | DEFAULT 'want-to-watch' | Status |
| priority | VARCHAR(10) | DEFAULT 'medium' | Priority level |
| progress | INTEGER | DEFAULT 0 | Watch progress (%) |
| user_id | INTEGER | FK → users.id | User |
| movie_id | INTEGER | FK → movies.id | Movie |

**Indexes:**
```sql
CREATE INDEX idx_watchlist_user_id ON watchlist (user_id);
CREATE INDEX idx_watchlist_movie_id ON watchlist (movie_id);
CREATE INDEX idx_watchlist_status ON watchlist (status);
CREATE UNIQUE INDEX idx_watchlist_user_movie ON watchlist (user_id, movie_id);
```

---

### `favorites`
User favorites (movies, people, scenes).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| type | VARCHAR(20) | NOT NULL | Type (movie, person, scene, article) |
| added_date | TIMESTAMP | DEFAULT NOW() | When favorited |
| user_id | INTEGER | FK → users.id | User |
| movie_id | INTEGER | FK → movies.id, NULL | Movie (if type=movie) |
| person_id | INTEGER | FK → people.id, NULL | Person (if type=person) |

**Indexes:**
```sql
CREATE INDEX idx_favorites_user_id ON favorites (user_id);
CREATE INDEX idx_favorites_type ON favorites (type);
CREATE INDEX idx_favorites_movie_id ON favorites (movie_id) WHERE movie_id IS NOT NULL;
CREATE INDEX idx_favorites_person_id ON favorites (person_id) WHERE person_id IS NOT NULL;
```

---

## Social Features

### `pulses`
Social posts (like tweets) about movies/cricket.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| user_id | INTEGER | FK → users.id | Post author |
| content_text | TEXT | NOT NULL | Post content |
| content_media | TEXT | NULL | JSON array of media objects |
| linked_type | VARCHAR(20) | NULL | Linked content type (movie, cricket) |
| linked_external_id | VARCHAR(80) | NULL | Linked content ID |
| linked_title | VARCHAR(200) | NULL | Linked content title |
| linked_poster_url | VARCHAR(255) | NULL | Linked content poster |
| linked_movie_id | INTEGER | FK → movies.id, NULL | Linked movie |
| hashtags | TEXT | NULL | JSON array of hashtags |
| reactions_json | TEXT | NULL | JSON object with reaction counts |
| reactions_total | INTEGER | DEFAULT 0 | Total reactions |
| comments_count | INTEGER | DEFAULT 0 | Comment count |
| shares_count | INTEGER | DEFAULT 0 | Share count |
| created_at | TIMESTAMP | DEFAULT NOW(), INDEX | Creation time |
| edited_at | TIMESTAMP | NULL | Last edit time |

**Indexes:**
```sql
CREATE INDEX idx_pulses_user_id ON pulses (user_id);
CREATE INDEX idx_pulses_created_at ON pulses (created_at DESC);
CREATE INDEX idx_pulses_linked_movie_id ON pulses (linked_movie_id) WHERE linked_movie_id IS NOT NULL;
```

**Partitioning:**
```sql
-- Partition by month for performance
CREATE TABLE pulses_partitioned (LIKE pulses INCLUDING ALL)
PARTITION BY RANGE (created_at);
```

---

### `user_follows`
User follow relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| follower_id | INTEGER | FK → users.id | Follower user |
| following_id | INTEGER | FK → users.id | Following user |
| created_at | TIMESTAMP | DEFAULT NOW() | Follow date |

**Indexes:**
```sql
CREATE INDEX idx_user_follows_follower ON user_follows (follower_id);
CREATE INDEX idx_user_follows_following ON user_follows (following_id);
CREATE UNIQUE INDEX idx_user_follows_unique ON user_follows (follower_id, following_id);
```

---

### `trending_topics`
Trending hashtags and topics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| tag | VARCHAR(120) | INDEX | Hashtag or topic |
| category | VARCHAR(20) | NULL | Category (movie, cricket, event, general) |
| window_label | VARCHAR(10) | DEFAULT '7d' | Time window (7d, 30d) |
| count | INTEGER | DEFAULT 0 | Occurrence count |
| computed_at | TIMESTAMP | DEFAULT NOW() | Computation time |

**Indexes:**
```sql
CREATE INDEX idx_trending_topics_tag ON trending_topics (tag);
CREATE INDEX idx_trending_topics_category ON trending_topics (category);
CREATE INDEX idx_trending_topics_count ON trending_topics (count DESC);
```

**Scheduled Job (pg_cron):**
```sql
-- Update trending topics daily
SELECT cron.schedule('update-trending-topics', '0 0 * * *', $$
  INSERT INTO trending_topics (tag, category, count, computed_at)
  SELECT hashtag, 'movie', COUNT(*), NOW()
  FROM pulses, jsonb_array_elements_text(hashtags::jsonb) AS hashtag
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY hashtag
  ORDER BY COUNT(*) DESC
  LIMIT 50
  ON CONFLICT (tag, window_label) DO UPDATE SET count = EXCLUDED.count, computed_at = NOW();
$$);
```

---

## Streaming Platforms

### `streaming_platforms`
Streaming service providers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier |
| name | VARCHAR(100) | NOT NULL | Platform name |
| logo_url | VARCHAR(255) | NULL | Logo image URL |
| website_url | VARCHAR(255) | NULL | Website URL |

---

### `movie_streaming_options`
Where movies are available to stream.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| movie_id | INTEGER | FK → movies.id | Movie |
| platform_id | INTEGER | FK → streaming_platforms.id | Platform |
| region | VARCHAR(10) | INDEX | Region code (US, UK, IN, etc.) |
| type | VARCHAR(20) | NOT NULL | Type (subscription, rent, buy, free) |
| price | VARCHAR(20) | NULL | Price string |
| quality | VARCHAR(10) | NULL | Quality (HD, 4K, SD) |
| url | VARCHAR(500) | NULL | Direct URL |
| verified | BOOLEAN | DEFAULT FALSE | Verified availability |

**Indexes:**
```sql
CREATE INDEX idx_streaming_movie_id ON movie_streaming_options (movie_id);
CREATE INDEX idx_streaming_platform_id ON movie_streaming_options (platform_id);
CREATE INDEX idx_streaming_region ON movie_streaming_options (region);
```

---

**[Continued in next file due to 300-line limit]**

