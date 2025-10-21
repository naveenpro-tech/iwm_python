# Knowledge Base Insights - PostgreSQL 18 & FastAPI Best Practices

**Source:** YouTube video transcripts from `knowlge youube scripts/`  
**Date Compiled:** 2025-10-21  
**Purpose:** Extract actionable insights for IWM movie review platform

---

## 📊 Summary of Sources

1. **PostgreSQL 18 Release** - New features and improvements
2. **5 Secrets for PostgreSQL Performance** - Optimization techniques
3. **Replacing Tech Stack with Postgres** - PostgreSQL as all-in-one solution
4. **Python Performance Secrets** - Making Python blazing fast
5. **15 FastAPI Best Practices** - Production-ready FastAPI patterns

---

## 🚀 PostgreSQL 18 - Critical New Features

### 1. Asynchronous I/O (GAME CHANGER)
**What:** PostgreSQL 18 introduces async I/O for disk operations  
**Impact:** 2-3x performance improvement in read-heavy applications  
**Why It Matters:** Our movie review platform is read-heavy (browsing movies, reviews, collections)  
**Action:** Upgrade to PostgreSQL 18 immediately to leverage this

### 2. Smarter Query Optimization
**OR/IN Clause Optimization:** Automatically rewrites to ANY expressions for better performance  
**Hash Join Improvements:** Faster and more memory-efficient for large table joins  
**Action:** Review our complex queries (movie filtering, search) - they'll automatically run faster

### 3. Virtual Generated Columns (Default)
**What:** Computed values calculated on-the-fly instead of stored  
**Benefits:**
- Less storage space
- Faster INSERT/UPDATE operations
- No stale computed data
**Use Cases for IWM:**
- Movie rating averages (computed from reviews)
- User engagement scores
- Collection statistics
**Action:** Use virtual generated columns for all derived data

### 4. UUID Version 7 Support
**What:** UUIDs with timestamp component (naturally ordered)  
**Benefits:**
- B-tree index friendly (better performance)
- Can extract timestamp from UUID
- Better for distributed systems
**Use Cases for IWM:**
- User IDs
- Review IDs
- Pulse (social post) IDs
**Action:** Migrate from UUID v4 to UUID v7 for all new records

### 5. Enhanced RETURNING Clause
**What:** Access both OLD and NEW values in single statement  
**Benefits:**
- Simpler auditing
- Better logging
- Undo operations
**Use Cases for IWM:**
- Track review edits
- Audit user profile changes
- Log moderation actions
**Action:** Use RETURNING for all UPDATE operations that need audit trails

### 6. Temporal Constraints (WITHOUT OVERLAPS)
**What:** Prevent time range overlaps at database level  
**Benefits:**
- No complex app logic needed
- Database-enforced consistency
- Efficient validation
**Use Cases for IWM:**
- Festival date ranges
- Award ceremony schedules
- Casting call submission deadlines
**Action:** Add WITHOUT OVERLAPS constraints to time-based tables

### 7. Preserved Statistics During Upgrades
**What:** No need to re-run ANALYZE after major version upgrades  
**Benefits:**
- Faster upgrades
- Predictable performance
- Less downtime
**Action:** Document upgrade process - much simpler now

---

## ⚡ PostgreSQL Performance Secrets

### Secret 1: Prepared Statements
**What:** Pre-compile queries and reuse with different parameters  
**Performance Gain:** Significant reduction in parse/plan time  
**How It Works:**
```sql
PREPARE get_movie (text) AS 
  SELECT * FROM movies WHERE external_id = $1;
EXECUTE get_movie('inception');
```
**Action:** SQLAlchemy already uses prepared statements - verify it's enabled

### Secret 2: Strategic Indexing
**What:** Create indexes on frequently queried columns  
**Performance Gain:** Orders of magnitude faster for large tables  
**Critical Indexes for IWM:**
- `movies.title` (trigram for fuzzy search)
- `reviews.movie_id, reviews.date` (composite)
- `users.email` (unique)
- `pulses.created_at` (DESC for feed)
- `notifications.user_id, notifications.is_read` (composite)
**Action:** Already created 100+ indexes - verify they're being used

### Secret 3: Table Partitioning
**What:** Split large tables into smaller logical chunks  
**Performance Gain:** Faster queries on partitioned data  
**Tables to Partition in IWM:**
- `reviews` - by year (500K+ rows expected)
- `notifications` - by month (5M+ rows expected)
- `pulses` - by month (1M+ rows expected)
- `admin_metric_snapshots` - by month
**Action:** Implement partitioning using pg_partman extension

### Secret 4: COPY Command for Bulk Inserts
**What:** Bulk insert from CSV/file instead of individual INSERTs  
**Performance Gain:** Orders of magnitude faster  
**Use Cases for IWM:**
- Initial movie data import
- Bulk user imports
- Data migrations
**Action:** Use COPY for any bulk data operations

### Secret 5: Read Replicas
**What:** Separate read and write databases  
**Performance Gain:** Horizontal scaling for read-heavy workloads  
**When to Use:** When single database can't handle read load  
**Action:** Plan for future - not needed initially

---

## 🔧 PostgreSQL as All-in-One Solution

### Feature 1: JSONB for NoSQL-like Flexibility
**What:** Store unstructured JSON data in PostgreSQL  
**Use Cases for IWM:**
- Movie trivia (dynamic structure)
- Movie timeline (variable events)
- User settings (flexible preferences)
- Notification metadata
**Already Implemented:** ✅ We're using JSONB extensively
**Action:** Add GIN indexes on JSONB columns for better query performance

### Feature 2: pg_cron for Scheduled Jobs
**What:** Built-in cron scheduler in PostgreSQL  
**Use Cases for IWM:**
- Update trending topics (daily)
- Cleanup old notifications (daily)
- Update admin metrics (hourly)
- Cleanup old pulses (weekly)
- Vacuum and analyze (weekly)
**Already Implemented:** ✅ Created 10 scheduled jobs
**Action:** Verify pg_cron is installed and jobs are running

### Feature 3: pgvector for AI/ML
**What:** Vector similarity search in PostgreSQL  
**Use Cases for IWM:**
- Movie recommendations based on plot similarity
- Similar movies search
- User preference matching
**Action:** Implement vector embeddings for movie plots using OpenAI

### Feature 4: Full-Text Search (TS_VECTOR)
**What:** Built-in full-text search with ranking  
**Use Cases for IWM:**
- Movie title/description search
- People name search
- Review content search
**Action:** Add ts_vector columns and GIN indexes for search

### Feature 5: pg_crypto for Authentication
**What:** Built-in cryptographic functions  
**Use Cases for IWM:**
- Password hashing (already using Argon2)
- JWT token generation
- Secure session management
**Already Implemented:** ✅ Using Argon2 for passwords
**Action:** Consider using pg_crypto for additional security features

### Feature 6: Row-Level Security (RLS)
**What:** Database-enforced access control  
**Use Cases for IWM:**
- Users can only edit their own reviews
- Users can only see their own notifications
- Admins have full access
**Action:** Implement RLS policies for sensitive tables

### Feature 7: PostGIS for Geospatial
**What:** Geospatial data types and queries  
**Use Cases for IWM:**
- Filming locations
- Theater locations
- Casting call locations (nearby search)
**Action:** Add location columns and implement nearby search

---

## 🐍 Python Performance Secrets

### Secret 1: Use Built-in Functions
**What:** Python's built-in functions are written in C  
**Examples:** `sorted()`, `sum()`, `max()`, `min()`, `map()`, `filter()`  
**Action:** Prefer built-ins over custom implementations

### Secret 2: Generators for Large Datasets
**What:** Use `yield` to process data lazily  
**Benefits:** Reduced memory allocation  
**Use Cases for IWM:**
- Streaming large query results
- Processing bulk data imports
- Generating reports
**Action:** Use generators in repository methods that return large datasets

### Secret 3: Concurrency with Multiprocessing
**What:** Parallel processing for CPU-bound tasks  
**Use Cases for IWM:**
- Image processing (movie posters, thumbnails)
- Batch data enrichment
- Report generation
**Action:** Use multiprocessing for heavy batch operations

### Secret 4: Cython for Critical Paths
**What:** Compile Python to C for performance  
**When to Use:** Performance-critical code paths  
**Action:** Profile first, optimize later - not needed initially

### Secret 5: Use Compiled Libraries
**What:** Libraries like NumPy, Pandas, Pillow are C-based  
**Already Using:** ✅ Pillow for image processing  
**Action:** Continue using compiled libraries where appropriate

### Secret 6: PyPy for JIT Compilation
**What:** Alternative Python interpreter with JIT  
**When to Use:** Long-running processes  
**Action:** Benchmark with PyPy if performance becomes critical

---

## 🚀 FastAPI Best Practices (Production-Ready)

### Practice 1: NEVER Use async def for Blocking Operations ⚠️
**Rule:** If it blocks (time.sleep, requests, file I/O), use `def` not `async def`  
**Why:** Blocks the entire event loop  
**Examples of Blocking:**
- `time.sleep()` → Use `asyncio.sleep()`
- `requests.get()` → Use `httpx.AsyncClient()`
- `open()` for files → Use `aiofiles`
- Synchronous DB clients → Use async clients (AsyncPG ✅)
**Action:** Audit all endpoints - ensure blocking operations use `def`

### Practice 2: Use Async-Friendly Libraries
**Required Changes:**
- ✅ `asyncpg` instead of `psycopg2`
- ✅ `httpx.AsyncClient` instead of `requests`
- ✅ `aiofiles` for file operations
- ✅ `motor` for MongoDB (if used)
**Already Implemented:** ✅ Using AsyncPG and httpx
**Action:** Verify no blocking libraries are used

### Practice 3: Don't Do Heavy Computation in Endpoints
**Rule:** FastAPI is for I/O-bound workloads, not CPU-bound  
**Heavy Operations:**
- Image/video processing
- ML model inference
- Large data transformations
**Solutions:**
- Lightweight ML (<100ms): OK in endpoint
- Heavy ML: Use dedicated inference server (Triton, TorchServe)
- Long-running: Use queue + worker (Celery, RQ)
**Use Cases for IWM:**
- Movie poster processing → Background task or worker
- Gemini AI enrichment → Already async, but consider queue for bulk
**Action:** Move heavy operations to background tasks or workers

### Practice 4: Dependencies Follow Same Rules
**Rule:** Dependencies use `def` for blocking, `async def` for non-blocking  
**Action:** Audit all dependencies in `src/dependencies/`

### Practice 5: Use BackgroundTasks for Fire-and-Forget
**What:** FastAPI's built-in background task system  
**Use Cases for IWM:**
- Send email notifications
- Log events
- Update cache
**Limitations:**
- Not for guaranteed delivery
- Not for long-running tasks
- Lost if process crashes
**When to Use Queue Instead:**
- Needs retries
- Needs guaranteed delivery
- Long-running (>30 seconds)
**Action:** Use BackgroundTasks for simple tasks, queue for critical ones

### Practice 6: Hide Swagger/ReDoc in Production
**Rule:** Set `docs_url=None`, `redoc_url=None`, `openapi_url=None` in production  
**Why:** Security - don't expose incomplete/insecure endpoints  
**Action:** Add environment-based configuration

### Practice 7: Use Custom Base Model
**What:** Create a base Pydantic model for global config  
**Benefits:**
- Centralized configuration
- Alias generators (camelCase ↔ snake_case)
- Custom JSON encoders (datetime, Decimal, ObjectId)
**Action:** Create `BaseModel` with global settings

### Practice 8: Don't Manually Construct Response Models
**Rule:** Return dict/list, let FastAPI handle validation  
**Why:** FastAPI does it anyway - no performance benefit  
**Action:** Return plain dicts from endpoints

### Practice 9: Validate with Pydantic, Not Code
**Rule:** Push validation into Pydantic models, not endpoint logic  
**Benefits:**
- Consistent error responses
- Auto-generated OpenAPI docs
- Reusable validation
**Action:** Move all validation to Pydantic models

### Practice 10: Use Dependencies for DB Validation
**What:** Create dependencies for database-based validation  
**Benefits:**
- Reusable across endpoints
- Cached per request (no performance hit)
- Clean endpoint code
**Use Cases for IWM:**
- Verify user owns review before editing
- Check movie exists before adding to collection
- Validate admin permissions
**Action:** Create validation dependencies

### Practice 11: Use Connection Pool, Not Per-Request Connections
**Rule:** Create pool in lifespan, inject via dependency  
**Two Approaches:**
1. Store in `app.state` (recommended)
2. Global variable (legacy)
**Already Implemented:** ✅ Using lifespan with connection pool
**Action:** Verify pool is properly configured

### Practice 12: Use Lifespan for App Resources
**Rule:** Use `@asynccontextmanager` lifespan instead of `@app.on_event`  
**Benefits:**
- Unified setup/cleanup
- Guaranteed cleanup even if startup fails
- Better error handling
**Already Implemented:** ✅ Using lifespan in `main.py`
**Action:** Verify all resources are properly managed

### Practice 13: Never Hardcode Secrets
**Rule:** Use `.env` file + Pydantic `BaseSettings`  
**What to Store:**
- Database URLs
- API keys
- JWT secrets
- Port numbers
**What NOT to Store:**
- Business logic
- Complex behavior
**Already Implemented:** ✅ Using Pydantic Settings
**Action:** Verify no secrets in code, add `.env.example`

### Practice 14: Use Structured Logging
**Rule:** Use `logging`, `loguru`, or `structlog` - NOT `print()`  
**Benefits:**
- Log levels (DEBUG, INFO, ERROR)
- Contextual information (request_id, user_id)
- Centralized logging (Elasticsearch)
**Already Implemented:** ✅ Using structlog
**Action:** Add request_id middleware, configure log levels

### Practice 15: Production Deployment
**Requirements:**
- Run Uvicorn with Gunicorn + UvicornWorker
- Install `uvloop` for performance boost
- Tune workers: `(CPU cores * 2) + 1`
- Containerize with Docker
**Action:** Create production deployment configuration

---

## 🎯 Action Items for IWM Platform

### Immediate (High Priority)
1. ✅ Upgrade to PostgreSQL 18
2. ✅ Verify async/await patterns in all endpoints
3. ✅ Implement UUID v7 for new records
4. ✅ Add virtual generated columns for computed data
5. ✅ Implement table partitioning (reviews, notifications, pulses)
6. ✅ Add WITHOUT OVERLAPS constraints for time ranges
7. ✅ Verify connection pooling is optimal
8. ✅ Hide Swagger/ReDoc in production
9. ✅ Add structured logging with request_id
10. ✅ Create `.env.example` file

### Short-Term (Next Sprint)
11. ⏳ Implement pgvector for movie recommendations
12. ⏳ Add full-text search with ts_vector
13. ⏳ Implement Row-Level Security policies
14. ⏳ Add PostGIS for location-based features
15. ⏳ Move heavy operations to background tasks/workers
16. ⏳ Create custom Pydantic BaseModel
17. ⏳ Add validation dependencies
18. ⏳ Optimize JSONB queries with GIN indexes

### Long-Term (Future)
19. 🔮 Implement read replicas for scaling
20. 🔮 Add Celery for guaranteed task processing
21. 🔮 Centralize logs with Elasticsearch
22. 🔮 Performance monitoring and profiling
23. 🔮 Load testing and optimization

---

## 📚 Key Takeaways

1. **PostgreSQL 18 is a game-changer** - Async I/O alone justifies the upgrade
2. **PostgreSQL can replace many tools** - Cache, queue, vector DB, full-text search
3. **FastAPI async rules are critical** - Blocking operations will kill performance
4. **Validation belongs in Pydantic** - Not in endpoint code
5. **Connection pooling is mandatory** - Never create connections per request
6. **Structured logging is essential** - print() is not acceptable
7. **Background tasks have limits** - Use queues for critical/long-running tasks
8. **Security by default** - Hide docs, use RLS, never hardcode secrets

---

**Compiled By:** Autonomous AI Agent  
**Last Updated:** 2025-10-21  
**Status:** Ready for Implementation

