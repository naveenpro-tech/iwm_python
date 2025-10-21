# Comprehensive Codebase Analysis & Restructuring Plan

**Generated:** 2025-10-21  
**Status:** Deep Analysis Complete  
**Next Phase:** PostgreSQL Migration & Extension Integration

---

## Executive Summary

This is a **Next.js 15 + FastAPI monorepo** for a comprehensive movie platform with social features, reviews, awards tracking, talent hub, quizzes, and admin capabilities. The codebase follows clean architecture principles with repository pattern, but requires restructuring for better organization and PostgreSQL optimization.

---

## Current Architecture

### Technology Stack

**Frontend:**
- Next.js 15.2.4 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui components
- Framer Motion for animations
- Playwright for E2E testing

**Backend:**
- FastAPI (Python 3.12)
- SQLAlchemy 2.0 (async)
- Alembic for migrations
- Hypercorn (HTTP/2 support)
- Pydantic for validation
- Argon2 for password hashing
- JWT authentication

**Database:**
- PostgreSQL 16 (via Docker Compose)
- AsyncPG driver
- Connection pooling enabled

**External Integrations:**
- Gemini AI (movie enrichment)
- TMDB API (fallback data source)
- Cricket API

---

## Domain Models (Database Schema)

### Core Entities

1. **Movies** (972 lines in models.py)
   - Movies, Genres, People (actors/directors/writers)
   - Many-to-many relationships
   - JSONB fields for trivia, timeline
   - Streaming options

2. **User Management**
   - Users, Reviews, Collections
   - Watchlist, Favorites
   - User settings (JSONB)
   - Admin metadata

3. **Social Features**
   - Pulse (social posts with media)
   - User follows
   - Trending topics
   - Notifications with preferences

4. **Awards & Festivals**
   - Award ceremonies, categories, nominations
   - Festival editions, programs, winners

5. **Box Office**
   - Weekend entries, trends, YTD stats
   - Records, genre/studio performance

6. **Scene Explorer**
   - Scenes with genres
   - Visual treats with tags
   - Color palettes (JSONB)

7. **Quiz System**
   - Quizzes, questions, options
   - Attempts, answers, leaderboard

8. **Talent Hub**
   - Casting calls, roles
   - Submission guidelines (JSONB)

9. **Admin & Moderation**
   - User metadata, roles
   - Moderation items, actions
   - System settings (JSONB)
   - Metric snapshots

---

## Current Folder Structure Issues

### ❌ Problems

```
c:\iwm\v142\
├── app/                    # Frontend pages (Next.js App Router)
├── components/             # React components
├── lib/                    # Frontend utilities
├── hooks/                  # React hooks
├── styles/                 # CSS files
├── public/                 # Static assets
├── apps/
│   ├── backend/           # FastAPI backend
│   └── frontend/          # EMPTY (should contain frontend)
├── packages/shared/       # OpenAPI contracts
├── infra/                 # Docker Compose
├── docs/                  # Documentation
├── scripts/               # Python scripts
├── tests/                 # E2E tests
└── [Many root-level config files]
```

**Issues:**
1. Frontend files scattered at root level
2. `apps/frontend` exists but is empty
3. No clear separation between frontend and backend
4. Root folder cluttered with 50+ files
5. No database documentation
6. No ER diagrams or schema visualization

---

## Proposed Clean Structure

```
c:\iwm\v142\
├── apps/
│   ├── frontend/          # Next.js application (MOVE FROM ROOT)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.mjs
│   │   ├── tsconfig.json
│   │   └── tailwind.config.ts
│   │
│   └── backend/           # FastAPI application (KEEP)
│       ├── src/
│       ├── alembic/
│       ├── requirements.txt
│       └── .env
│
├── packages/
│   └── shared/            # Shared types, OpenAPI contracts
│
├── database/              # NEW: Database documentation & scripts
│   ├── docs/
│   │   ├── SCHEMA.md                    # Complete schema documentation
│   │   ├── ER_DIAGRAM.md                # Entity-relationship diagrams
│   │   ├── INDEXES.md                   # Index strategy
│   │   ├── EXTENSIONS.md                # PostgreSQL extensions guide
│   │   └── PERFORMANCE.md               # Query optimization
│   ├── migrations/                      # Alembic migrations (symlink)
│   ├── seeds/                           # Seed data scripts
│   ├── scripts/
│   │   ├── setup_local_postgres.sh      # Local PostgreSQL setup
│   │   ├── enable_extensions.sql        # Enable all extensions
│   │   ├── create_indexes.sql           # Performance indexes
│   │   ├── create_partitions.sql        # Table partitioning
│   │   └── backup_restore.sh            # Backup/restore utilities
│   └── analytics/                       # Analytics queries
│
├── infra/                 # Infrastructure
│   ├── docker-compose.yml
│   ├── postgres/
│   │   └── postgresql.conf              # PostgreSQL configuration
│   └── k8s/                             # Kubernetes manifests (future)
│
├── docs/                  # Project documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── FEATURES.md
│
├── tests/                 # Testing
│   ├── e2e/              # Playwright tests
│   ├── integration/      # API integration tests
│   ├── contract/         # Contract tests
│   └── performance/      # Load tests
│
├── scripts/              # Development scripts
│   ├── dev/             # Development utilities
│   ├── ci/              # CI/CD scripts
│   └── migrate/         # Migration utilities
│
└── [Root config files]   # Keep minimal: package.json, README.md, .gitignore
```

---

## PostgreSQL Extensions Strategy

### Extensions to Enable

#### 1. **pg_cron** - Scheduled Jobs
```sql
CREATE EXTENSION pg_cron;

-- Use cases:
-- - Daily metric snapshots
-- - Cleanup old notifications
-- - Update trending topics
-- - Refresh materialized views
-- - Send batch notifications
```

#### 2. **pgvector** - Vector Similarity Search
```sql
CREATE EXTENSION vector;

-- Use cases:
-- - Movie recommendations based on plot embeddings
-- - Similar movie search
-- - Semantic search across reviews
-- - User taste profiling
-- - Content-based filtering
```

#### 3. **pg_stat_statements** - Query Performance
```sql
CREATE EXTENSION pg_stat_statements;

-- Use cases:
-- - Identify slow queries
-- - Track query execution stats
-- - Optimize database performance
-- - Monitor query patterns
```

#### 4. **PostGIS** - Geospatial Features
```sql
CREATE EXTENSION postgis;

-- Use cases:
-- - Filming locations
-- - Theater locations
-- - Festival venue mapping
-- - Location-based casting calls
-- - Regional content filtering
```

#### 5. **pg_trgm** - Fuzzy Text Search
```sql
CREATE EXTENSION pg_trgm;

-- Use cases:
-- - Typo-tolerant movie search
-- - People name search with variations
-- - Autocomplete suggestions
-- - Similar title detection
```

#### 6. **pg_partman** - Table Partitioning
```sql
CREATE EXTENSION pg_partman;

-- Use cases:
-- - Partition reviews by year
-- - Partition notifications by month
-- - Partition pulses by date
-- - Partition metric snapshots
```

#### 7. **pgcrypto** - Cryptography
```sql
CREATE EXTENSION pgcrypto;

-- Use cases:
-- - Secure password hashing (already using Argon2 in Python)
-- - Encrypt sensitive user data
-- - Generate secure tokens
-- - Hash email addresses for privacy
```

#### 8. **hstore** - Key-Value Storage
```sql
CREATE EXTENSION hstore;

-- Use cases:
-- - Flexible metadata storage
-- - User preferences
-- - Feature flags
-- - A/B test configurations
```

---

## Database Optimization Plan

### Indexes to Create

```sql
-- Full-text search indexes
CREATE INDEX idx_movies_title_trgm ON movies USING gin (title gin_trgm_ops);
CREATE INDEX idx_people_name_trgm ON people USING gin (name gin_trgm_ops);

-- JSONB indexes
CREATE INDEX idx_movies_trivia_gin ON movies USING gin (trivia);
CREATE INDEX idx_movies_timeline_gin ON movies USING gin (timeline);
CREATE INDEX idx_user_settings_preferences ON user_settings USING gin (preferences);

-- Composite indexes for common queries
CREATE INDEX idx_movies_genre_score ON movies (siddu_score DESC) WHERE siddu_score IS NOT NULL;
CREATE INDEX idx_reviews_movie_date ON reviews (movie_id, date DESC);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read, created_at DESC);

-- Partial indexes
CREATE INDEX idx_active_casting_calls ON casting_calls (posted_date DESC) 
  WHERE status = 'active' AND submission_deadline > NOW();
```

### Partitioning Strategy

```sql
-- Partition notifications by month
CREATE TABLE notifications_partitioned (LIKE notifications INCLUDING ALL)
PARTITION BY RANGE (created_at);

-- Partition reviews by year
CREATE TABLE reviews_partitioned (LIKE reviews INCLUDING ALL)
PARTITION BY RANGE (date);
```

---

## Migration from Docker to Local PostgreSQL

### Step 1: Install PostgreSQL 16 Locally

**Windows:**
```powershell
# Download from postgresql.org
# Or use Chocolatey
choco install postgresql16

# Or use Scoop
scoop install postgresql
```

### Step 2: Enable Extensions

```sql
-- Connect to iwm database
psql -U postgres -d iwm

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pg_partman;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS hstore;
```

### Step 3: Update Configuration

**apps/backend/.env:**
```env
# Change from Docker to local
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/iwm
```

### Step 4: Migrate Data

```bash
# Export from Docker
docker exec -t iwm-db-1 pg_dump -U postgres iwm > backup.sql

# Import to local
psql -U postgres -d iwm < backup.sql
```

---

## Next Steps

1. ✅ **Phase 1: Analysis Complete**
2. 🔄 **Phase 2: Restructure Folders** (In Progress)
3. ⏳ **Phase 3: Database Documentation**
4. ⏳ **Phase 4: PostgreSQL Migration**
5. ⏳ **Phase 5: Extension Integration**
6. ⏳ **Phase 6: Performance Optimization**
7. ⏳ **Phase 7: Testing & Validation**

---

## Files to Create

### Database Documentation
- `database/docs/SCHEMA.md` - Complete schema with all tables
- `database/docs/ER_DIAGRAM.md` - Visual entity relationships
- `database/docs/INDEXES.md` - Index strategy and rationale
- `database/docs/EXTENSIONS.md` - Extension usage guide
- `database/docs/PERFORMANCE.md` - Query optimization guide

### Scripts
- `database/scripts/setup_local_postgres.sh` - Automated setup
- `database/scripts/enable_extensions.sql` - Extension enablement
- `database/scripts/create_indexes.sql` - Performance indexes
- `database/scripts/create_partitions.sql` - Table partitioning
- `database/scripts/backup_restore.sh` - Backup utilities

### Configuration
- `infra/postgres/postgresql.conf` - Optimized PostgreSQL config
- `apps/backend/.env.local.example` - Local development template

---

## Estimated Timeline

- **Folder Restructuring:** 2-3 hours
- **Database Documentation:** 4-6 hours
- **PostgreSQL Setup:** 1-2 hours
- **Extension Integration:** 6-8 hours
- **Testing & Validation:** 4-6 hours

**Total:** ~20-25 hours of focused work

---

## Success Criteria

✅ Clean folder structure with clear separation  
✅ Comprehensive database documentation  
✅ Local PostgreSQL with all extensions enabled  
✅ Performance indexes created  
✅ Partitioning implemented for large tables  
✅ Vector search for recommendations  
✅ Scheduled jobs for maintenance  
✅ Full-text search with fuzzy matching  
✅ All tests passing  
✅ Documentation complete  

---

**Status:** Ready to proceed with restructuring

