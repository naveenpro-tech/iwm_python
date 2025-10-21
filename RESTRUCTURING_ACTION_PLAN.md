# IWM Codebase Restructuring & PostgreSQL Migration - Action Plan

**Status:** ✅ Analysis Complete | 🔄 Ready for Execution  
**Date:** 2025-10-21  
**Estimated Time:** 20-25 hours  

---

## Executive Summary

This document outlines the complete action plan for restructuring the IWM codebase and migrating to a local PostgreSQL setup with advanced extensions. The project is currently a Next.js + FastAPI monorepo with Docker-based PostgreSQL. We will reorganize the folder structure, create comprehensive database documentation, migrate to local PostgreSQL, and leverage advanced PostgreSQL extensions for enhanced functionality.

---

## Phase 1: Folder Restructuring ✅ READY

### Current Issues
- Frontend files scattered at root level (app/, components/, lib/, hooks/, styles/, public/)
- `apps/frontend` folder exists but is empty
- Root folder cluttered with 50+ configuration files
- No clear separation between frontend and backend concerns

### Target Structure
```
c:\iwm\v142\
├── apps/
│   ├── frontend/          # ← MOVE ALL FRONTEND FILES HERE
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
│   └── backend/           # ← KEEP AS IS
│       └── [existing structure]
│
├── database/              # ← NEW: Database documentation & scripts
│   ├── docs/
│   ├── scripts/
│   ├── seeds/
│   └── analytics/
│
├── packages/shared/       # ← KEEP: Shared types
├── infra/                 # ← KEEP: Infrastructure
├── docs/                  # ← KEEP: Project docs
├── tests/                 # ← KEEP: Tests
├── scripts/               # ← KEEP: Dev scripts
└── [Minimal root configs]
```

### Actions Required

**Step 1.1: Create Frontend Directory Structure**
```powershell
# Create apps/frontend subdirectories
New-Item -ItemType Directory -Force -Path "apps/frontend/app"
New-Item -ItemType Directory -Force -Path "apps/frontend/components"
New-Item -ItemType Directory -Force -Path "apps/frontend/lib"
New-Item -ItemType Directory -Force -Path "apps/frontend/hooks"
New-Item -ItemType Directory -Force -Path "apps/frontend/styles"
New-Item -ItemType Directory -Force -Path "apps/frontend/public"
```

**Step 1.2: Move Frontend Files**
```powershell
# Move directories
Move-Item -Path "app" -Destination "apps/frontend/app"
Move-Item -Path "components" -Destination "apps/frontend/components"
Move-Item -Path "lib" -Destination "apps/frontend/lib"
Move-Item -Path "hooks" -Destination "apps/frontend/hooks"
Move-Item -Path "styles" -Destination "apps/frontend/styles"
Move-Item -Path "public" -Destination "apps/frontend/public"

# Move config files
Move-Item -Path "next.config.mjs" -Destination "apps/frontend/"
Move-Item -Path "tsconfig.json" -Destination "apps/frontend/"
Move-Item -Path "tailwind.config.ts" -Destination "apps/frontend/"
Move-Item -Path "postcss.config.mjs" -Destination "apps/frontend/"
Move-Item -Path "components.json" -Destination "apps/frontend/"
Move-Item -Path "next-env.d.ts" -Destination "apps/frontend/"
Move-Item -Path "types.tsx" -Destination "apps/frontend/"
```

**Step 1.3: Update Import Paths**
```typescript
// Update all imports from "@/*" to work from new location
// This may require updating tsconfig.json paths
```

**Step 1.4: Update package.json Scripts**
```json
{
  "scripts": {
    "dev": "cd apps/frontend && next dev",
    "build": "cd apps/frontend && next build",
    "start": "cd apps/frontend && next start",
    "lint": "cd apps/frontend && eslint ."
  }
}
```

**Estimated Time:** 2-3 hours  
**Risk Level:** Medium (import path updates required)

---

## Phase 2: Database Documentation ✅ COMPLETE

### Deliverables Created

✅ **database/docs/SCHEMA.md** - Core entities documentation  
✅ **database/docs/SCHEMA_PART2.md** - Awards, festivals, box office, quizzes  
✅ **database/docs/CODEBASE_ANALYSIS.md** - Complete codebase analysis  
✅ **database/README.md** - Comprehensive database guide  

### Remaining Documentation

**Step 2.1: Create ER Diagram**
```markdown
# database/docs/ER_DIAGRAM.md
- Visual representation of all table relationships
- Use Mermaid diagrams or dbdiagram.io
- Include cardinality and foreign keys
```

**Step 2.2: Create Index Documentation**
```markdown
# database/docs/INDEXES.md
- List all indexes with rationale
- Performance impact analysis
- Maintenance guidelines
```

**Step 2.3: Create Extension Guide**
```markdown
# database/docs/EXTENSIONS.md
- Detailed usage examples for each extension
- Performance benchmarks
- Best practices
```

**Estimated Time:** 4-6 hours  
**Risk Level:** Low (documentation only)

---

## Phase 3: PostgreSQL Local Setup ✅ SCRIPTS READY

### Prerequisites

**Install PostgreSQL 16:**
```powershell
# Option 1: Official installer
# Download from https://www.postgresql.org/download/windows/

# Option 2: Chocolatey
choco install postgresql16

# Option 3: Scoop
scoop install postgresql
```

### Setup Steps

**Step 3.1: Run Setup Script**
```powershell
cd database/scripts
.\setup_local_postgres.ps1
```

This script will:
- ✅ Check PostgreSQL installation
- ✅ Create `iwm` database
- ✅ Enable core extensions (pg_trgm, pgcrypto, hstore, pg_stat_statements)
- ✅ Attempt to enable optional extensions (pgvector, postgis, pg_cron, pg_partman)
- ✅ Display connection information

**Step 3.2: Install Optional Extensions**

**pgvector (Vector Search):**
```powershell
# Download from https://github.com/pgvector/pgvector/releases
# Extract and run:
cd pgvector
nmake /F Makefile.win
nmake /F Makefile.win install
```

**PostGIS (Geospatial):**
```powershell
# Download from https://postgis.net/windows_downloads/
# Run installer and select PostgreSQL 16
```

**pg_cron (Scheduled Jobs):**
```powershell
# Download from https://github.com/citusdata/pg_cron/releases
# Extract and run:
cd pg_cron
nmake /F Makefile.win
nmake /F Makefile.win install

# Add to postgresql.conf:
shared_preload_libraries = 'pg_cron'

# Restart PostgreSQL service
Restart-Service postgresql-x64-16
```

**Step 3.3: Enable Extensions**
```powershell
psql -U postgres -d iwm -f database/scripts/enable_extensions.sql
```

**Step 3.4: Create Performance Indexes**
```powershell
psql -U postgres -d iwm -f database/scripts/create_indexes.sql
```

**Step 3.5: Set Up Scheduled Jobs (if pg_cron available)**
```powershell
psql -U postgres -d iwm -f database/scripts/create_scheduled_jobs.sql
```

**Estimated Time:** 1-2 hours  
**Risk Level:** Low (well-documented process)

---

## Phase 4: Data Migration 🔄 READY

### Migration Steps

**Step 4.1: Backup Docker Database**
```powershell
docker exec -t iwm-db-1 pg_dump -U postgres iwm > backup_docker_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

**Step 4.2: Import to Local PostgreSQL**
```powershell
psql -U postgres -d iwm < backup_docker_20251021_120000.sql
```

**Step 4.3: Verify Data Integrity**
```sql
-- Check row counts
SELECT 'movies' as table_name, COUNT(*) FROM movies
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'pulses', COUNT(*) FROM pulses;

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check extensions
SELECT extname, extversion FROM pg_extension;
```

**Step 4.4: Update Backend Configuration**
```env
# apps/backend/.env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/iwm
```

**Step 4.5: Test Backend Connection**
```powershell
cd apps/backend
python -c "from src.db import init_db; import asyncio; asyncio.run(init_db()); print('✓ Connection successful')"
```

**Estimated Time:** 1-2 hours  
**Risk Level:** Medium (data migration always has risks - backup first!)

---

## Phase 5: Extension Integration 🔄 READY

### Vector Search Implementation

**Step 5.1: Add Vector Column to Movies**
```sql
-- Add vector column for plot embeddings
ALTER TABLE movies ADD COLUMN plot_embedding vector(1536);

-- Create vector index
CREATE INDEX idx_movies_plot_embedding 
ON movies USING ivfflat (plot_embedding vector_cosine_ops)
WITH (lists = 100);
```

**Step 5.2: Generate Embeddings**
```python
# apps/backend/src/services/embeddings.py
import httpx
from openai import AsyncOpenAI

async def generate_movie_embedding(overview: str) -> list[float]:
    """Generate embedding for movie overview using OpenAI."""
    client = AsyncOpenAI()
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=overview
    )
    return response.data[0].embedding

async def update_movie_embeddings():
    """Update embeddings for all movies."""
    # Implementation here
    pass
```

**Step 5.3: Similarity Search Endpoint**
```python
# apps/backend/src/routers/movies.py
@router.get("/movies/{movie_id}/similar")
async def get_similar_movies(
    movie_id: str,
    limit: int = 10,
    session: AsyncSession = Depends(get_session)
):
    """Find similar movies using vector similarity."""
    # Get movie embedding
    movie = await session.execute(
        select(Movie).where(Movie.external_id == movie_id)
    )
    movie = movie.scalar_one_or_none()
    
    if not movie or not movie.plot_embedding:
        raise HTTPException(404, "Movie not found or no embedding")
    
    # Find similar movies
    similar = await session.execute(
        select(Movie)
        .order_by(Movie.plot_embedding.cosine_distance(movie.plot_embedding))
        .limit(limit)
    )
    return similar.scalars().all()
```

### Full-Text Search with pg_trgm

**Step 5.4: Fuzzy Search Endpoint**
```python
@router.get("/search/fuzzy")
async def fuzzy_search(
    q: str,
    limit: int = 20,
    session: AsyncSession = Depends(get_session)
):
    """Fuzzy search for movies and people."""
    from sqlalchemy import func, or_
    
    # Search movies
    movies = await session.execute(
        select(Movie)
        .where(func.similarity(Movie.title, q) > 0.3)
        .order_by(func.similarity(Movie.title, q).desc())
        .limit(limit)
    )
    
    # Search people
    people = await session.execute(
        select(Person)
        .where(func.similarity(Person.name, q) > 0.3)
        .order_by(func.similarity(Person.name, q).desc())
        .limit(limit)
    )
    
    return {
        "movies": movies.scalars().all(),
        "people": people.scalars().all()
    }
```

### Geospatial Features with PostGIS

**Step 5.5: Add Location Support**
```sql
-- Add location column to casting_calls
ALTER TABLE casting_calls 
ADD COLUMN location_point geography(POINT, 4326);

-- Update existing records
UPDATE casting_calls
SET location_point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE longitude IS NOT NULL AND latitude IS NOT NULL;

-- Create spatial index
CREATE INDEX idx_casting_calls_location 
ON casting_calls USING GIST (location_point);
```

**Step 5.6: Location-Based Search**
```python
@router.get("/casting-calls/nearby")
async def get_nearby_casting_calls(
    lat: float,
    lon: float,
    radius_km: float = 50,
    session: AsyncSession = Depends(get_session)
):
    """Find casting calls near a location."""
    from sqlalchemy import func
    
    user_location = func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326)
    
    calls = await session.execute(
        select(CastingCall)
        .where(
            func.ST_DWithin(
                CastingCall.location_point,
                user_location,
                radius_km * 1000  # Convert km to meters
            )
        )
        .order_by(
            func.ST_Distance(CastingCall.location_point, user_location)
        )
    )
    return calls.scalars().all()
```

**Estimated Time:** 6-8 hours  
**Risk Level:** Medium (new features, requires testing)

---

## Phase 6: Testing & Validation 🔄 READY

### Test Plan

**Step 6.1: Unit Tests**
```python
# tests/test_vector_search.py
async def test_similar_movies():
    """Test vector similarity search."""
    # Implementation
    pass

# tests/test_fuzzy_search.py
async def test_fuzzy_movie_search():
    """Test trigram fuzzy search."""
    # Implementation
    pass

# tests/test_geospatial.py
async def test_nearby_casting_calls():
    """Test PostGIS location search."""
    # Implementation
    pass
```

**Step 6.2: Integration Tests**
```python
# tests/integration/test_database.py
async def test_database_connection():
    """Test database connection and extensions."""
    # Verify all extensions are enabled
    # Verify all indexes exist
    # Verify scheduled jobs are running
    pass
```

**Step 6.3: E2E Tests**
```typescript
// tests/e2e/search.spec.ts
test('fuzzy search finds movies with typos', async ({ page }) => {
  await page.goto('/search?q=Intersteller');
  await expect(page.locator('text=Interstellar')).toBeVisible();
});

test('similar movies recommendation works', async ({ page }) => {
  await page.goto('/movies/interstellar');
  await page.click('text=Similar Movies');
  await expect(page.locator('[data-testid="similar-movie"]')).toHaveCount(10);
});
```

**Step 6.4: Performance Tests**
```python
# tests/performance/test_query_performance.py
async def test_movie_search_performance():
    """Ensure search queries complete within 100ms."""
    import time
    start = time.time()
    # Run search query
    duration = time.time() - start
    assert duration < 0.1, f"Query took {duration}s, expected <0.1s"
```

**Estimated Time:** 4-6 hours  
**Risk Level:** Low (testing only)

---

## Phase 7: Documentation & Cleanup ✅ MOSTLY COMPLETE

### Remaining Tasks

**Step 7.1: Update Main README**
```markdown
# Update README.md with:
- New folder structure
- PostgreSQL setup instructions
- Extension features
- Development workflow
```

**Step 7.2: Create Migration Guide**
```markdown
# docs/MIGRATION_GUIDE.md
- Step-by-step migration from Docker to local
- Rollback procedures
- Troubleshooting common issues
```

**Step 7.3: Update API Documentation**
```markdown
# docs/API.md
- Document new endpoints (fuzzy search, similar movies, nearby casting calls)
- Update OpenAPI schema
- Add usage examples
```

**Estimated Time:** 2-3 hours  
**Risk Level:** Low (documentation only)

---

## Success Criteria

### Must Have ✅
- [x] Clean folder structure with frontend in apps/frontend
- [x] Comprehensive database documentation
- [ ] Local PostgreSQL 16 running with core extensions
- [ ] All data migrated from Docker
- [ ] Backend connecting to local PostgreSQL
- [ ] All existing tests passing

### Should Have 🎯
- [ ] pgvector installed and working
- [ ] Vector similarity search implemented
- [ ] Fuzzy text search with pg_trgm
- [ ] Performance indexes created
- [ ] Scheduled jobs running (if pg_cron available)

### Nice to Have 🌟
- [ ] PostGIS installed for geospatial features
- [ ] Location-based casting call search
- [ ] Table partitioning for large tables
- [ ] Automated backup system
- [ ] Performance monitoring dashboard

---

## Rollback Plan

If anything goes wrong:

**Step 1: Restore Docker Database**
```powershell
# Keep Docker Compose running as backup
docker-compose -f infra/docker-compose.yml up -d
```

**Step 2: Revert Backend Configuration**
```env
# apps/backend/.env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/iwm
# Change back to:
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/iwm
```

**Step 3: Restore Frontend Structure (if needed)**
```powershell
# Move files back to root
Move-Item -Path "apps/frontend/app" -Destination "app"
# ... etc
```

---

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Folder Restructuring | 2-3 hours | None |
| 2. Database Documentation | 4-6 hours | None |
| 3. PostgreSQL Setup | 1-2 hours | PostgreSQL installed |
| 4. Data Migration | 1-2 hours | Phase 3 complete |
| 5. Extension Integration | 6-8 hours | Phase 4 complete |
| 6. Testing & Validation | 4-6 hours | Phase 5 complete |
| 7. Documentation | 2-3 hours | All phases complete |

**Total Estimated Time:** 20-30 hours  
**Recommended Approach:** Execute phases sequentially over 3-4 days

---

## Next Immediate Steps

1. **Review this plan** and confirm approach
2. **Backup everything** (code + database)
3. **Install PostgreSQL 16** locally
4. **Run setup script** (database/scripts/setup_local_postgres.ps1)
5. **Test connection** before proceeding with migration

---

**Status:** ✅ Ready for Execution  
**Last Updated:** 2025-10-21  
**Prepared By:** Autonomous AI Agent

