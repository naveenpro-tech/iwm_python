# IWM Database Documentation

Complete database documentation, scripts, and utilities for the IWM (I Watch Movies) platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Database Schema](#database-schema)
4. [PostgreSQL Extensions](#postgresql-extensions)
5. [Performance Optimization](#performance-optimization)
6. [Scheduled Jobs](#scheduled-jobs)
7. [Backup & Restore](#backup--restore)
8. [Migration Guide](#migration-guide)
9. [Troubleshooting](#troubleshooting)

---

## Overview

**Database:** PostgreSQL 16  
**ORM:** SQLAlchemy 2.0 (Async)  
**Migration Tool:** Alembic  
**Connection Pool:** AsyncPG  

### Key Features

- ✅ **40+ Tables** covering movies, users, reviews, social features, awards, festivals, box office, quizzes, talent hub, and admin
- ✅ **PostgreSQL Extensions** for advanced features (vector search, full-text search, geospatial, scheduled jobs)
- ✅ **Performance Indexes** optimized for common query patterns
- ✅ **Scheduled Jobs** for automated maintenance and data processing
- ✅ **Partitioning Strategy** for large tables (reviews, notifications, pulses)
- ✅ **JSONB Fields** for flexible schema (trivia, timeline, settings, metadata)

---

## Quick Start

### 1. Install PostgreSQL 16

**Windows:**
```powershell
# Option 1: Official installer
# Download from https://www.postgresql.org/download/windows/

# Option 2: Chocolatey
choco install postgresql16

# Option 3: Scoop
scoop install postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16
```

**macOS:**
```bash
brew install postgresql@16
```

### 2. Run Setup Script

**Windows:**
```powershell
cd database/scripts
.\setup_local_postgres.ps1
```

**Linux/macOS:**
```bash
cd database/scripts
chmod +x setup_local_postgres.sh
./setup_local_postgres.sh
```

This script will:
- Create the `iwm` database
- Enable all required extensions
- Create performance indexes
- Display connection information

### 3. Run Migrations

```bash
cd apps/backend
alembic upgrade head
```

### 4. Seed Database (Optional)

```bash
cd apps/backend
python run_seed.py
```

---

## Database Schema

### Core Tables

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `movies` | Movie catalog | 10,000+ |
| `genres` | Genre taxonomy | ~50 |
| `people` | Actors, directors, writers | 50,000+ |
| `users` | User accounts | 100,000+ |
| `reviews` | User reviews | 500,000+ |
| `scenes` | Movie scenes | 50,000+ |

### Social Features

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `pulses` | Social posts | 1,000,000+ |
| `user_follows` | Follow relationships | 500,000+ |
| `trending_topics` | Trending hashtags | ~100 |
| `notifications` | User notifications | 5,000,000+ |

### Content Discovery

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `collections` | User collections | 50,000+ |
| `watchlist` | User watchlists | 500,000+ |
| `favorites` | User favorites | 1,000,000+ |
| `streaming_platforms` | Streaming services | ~50 |
| `movie_streaming_options` | Availability data | 100,000+ |

### Awards & Festivals

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `award_ceremonies` | Award shows | ~20 |
| `award_ceremony_years` | Yearly editions | ~200 |
| `award_categories` | Award categories | ~2,000 |
| `award_nominations` | Nominations | ~50,000 |
| `festivals` | Film festivals | ~100 |
| `festival_editions` | Festival years | ~1,000 |

### Box Office

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `box_office_weekend_entries` | Weekend rankings | ~50,000 |
| `box_office_trends` | Trend data | ~10,000 |
| `box_office_ytd` | Year-to-date stats | ~100 |
| `box_office_records` | Records | ~500 |

### Quiz System

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `quizzes` | Quiz definitions | ~1,000 |
| `quiz_questions` | Questions | ~10,000 |
| `quiz_question_options` | Answer options | ~40,000 |
| `quiz_attempts` | User attempts | ~100,000 |
| `quiz_answers` | User answers | ~1,000,000 |
| `quiz_leaderboard_entries` | Leaderboard | ~50,000 |

### Talent Hub

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `casting_calls` | Casting calls | ~10,000 |
| `casting_call_roles` | Roles | ~50,000 |
| `submission_guidelines` | Guidelines | ~10,000 |

### Admin & Moderation

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `admin_user_meta` | Admin metadata | ~1,000 |
| `moderation_items` | Moderation queue | ~10,000 |
| `moderation_actions` | Mod actions | ~50,000 |
| `system_settings` | System config | ~10 |
| `admin_metric_snapshots` | Metrics | ~100,000 |

### Settings

| Table | Description | Row Estimate |
|-------|-------------|--------------|
| `user_settings` | User preferences | 100,000+ |
| `notification_preferences` | Notification settings | 100,000+ |

**Total Tables:** 40+  
**Estimated Total Rows:** 10+ million

For detailed schema documentation, see:
- [docs/SCHEMA.md](docs/SCHEMA.md) - Core entities
- [docs/SCHEMA_PART2.md](docs/SCHEMA_PART2.md) - Awards, festivals, box office, quizzes
- [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md) - Entity relationships (visual)

---

## PostgreSQL Extensions

### Enabled Extensions

| Extension | Purpose | Status |
|-----------|---------|--------|
| **pg_trgm** | Fuzzy text search | ✅ Required |
| **pgcrypto** | Cryptographic functions | ✅ Required |
| **hstore** | Key-value storage | ✅ Required |
| **pg_stat_statements** | Query performance | ✅ Required |
| **pgvector** | Vector similarity search | ⚠️ Optional |
| **postgis** | Geospatial features | ⚠️ Optional |
| **pg_cron** | Scheduled jobs | ⚠️ Optional |
| **pg_partman** | Partition management | ⚠️ Optional |

### Extension Use Cases

#### pg_trgm (Trigram Search)
```sql
-- Fuzzy movie title search
SELECT * FROM movies 
WHERE title % 'Intersteller'  -- Finds "Interstellar"
ORDER BY similarity(title, 'Intersteller') DESC;

-- Autocomplete
SELECT name FROM people 
WHERE name ILIKE 'chris%'
ORDER BY name;
```

#### pgvector (Vector Search)
```sql
-- Similar movies based on plot embeddings
SELECT title, overview 
FROM movies 
ORDER BY plot_embedding <-> '[0.1, 0.2, ...]'::vector 
LIMIT 10;
```

#### pg_cron (Scheduled Jobs)
```sql
-- Update trending topics daily
SELECT cron.schedule('update-trending', '0 0 * * *', $$
  INSERT INTO trending_topics ...
$$);
```

#### PostGIS (Geospatial)
```sql
-- Find theaters near user location
SELECT name, ST_Distance(location, ST_MakePoint(-73.935242, 40.730610)) as distance
FROM theaters
ORDER BY distance
LIMIT 10;
```

For detailed extension documentation, see [docs/EXTENSIONS.md](docs/EXTENSIONS.md)

---

## Performance Optimization

### Indexes

**Total Indexes:** 100+

Key indexes include:
- Trigram indexes for fuzzy search (movies.title, people.name)
- JSONB GIN indexes (trivia, timeline, settings)
- Composite indexes for common queries
- Partial indexes for filtered queries
- Unique indexes for constraints

To create all indexes:
```bash
psql -U postgres -d iwm -f database/scripts/create_indexes.sql
```

### Query Performance

Monitor slow queries:
```sql
-- Top 10 slowest queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Partitioning

Large tables are partitioned for performance:

- **reviews** - Partitioned by year
- **notifications** - Partitioned by month
- **pulses** - Partitioned by month
- **admin_metric_snapshots** - Partitioned by month

To create partitions:
```bash
psql -U postgres -d iwm -f database/scripts/create_partitions.sql
```

For detailed performance documentation, see [docs/PERFORMANCE.md](docs/PERFORMANCE.md)

---

## Scheduled Jobs

Automated maintenance jobs using pg_cron:

| Job | Schedule | Purpose |
|-----|----------|---------|
| Update Trending Topics | Daily 00:00 | Calculate trending hashtags |
| Cleanup Notifications | Daily 02:00 | Delete old notifications |
| Update Admin Metrics | Hourly | Snapshot system metrics |
| Cleanup Pulses | Weekly Sun 03:00 | Delete low-engagement old posts |
| Update Engagement Scores | Daily 01:00 | Recalculate review engagement |
| Vacuum & Analyze | Weekly Mon 04:00 | Database maintenance |
| Update Movie Stats | Daily 05:00 | Refresh statistics |
| Cleanup Quiz Attempts | Daily 03:00 | Delete incomplete attempts |
| Update Casting Calls | Hourly | Auto-close expired calls |
| Generate Reports | Daily 06:00 | Daily summary reports |

To set up scheduled jobs:
```bash
psql -U postgres -d iwm -f database/scripts/create_scheduled_jobs.sql
```

View job history:
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

---

## Backup & Restore

### Backup

**Full backup:**
```bash
pg_dump -U postgres -d iwm -F c -f iwm_backup_$(date +%Y%m%d).dump
```

**Schema only:**
```bash
pg_dump -U postgres -d iwm --schema-only -f iwm_schema.sql
```

**Data only:**
```bash
pg_dump -U postgres -d iwm --data-only -f iwm_data.sql
```

**Specific tables:**
```bash
pg_dump -U postgres -d iwm -t movies -t reviews -F c -f iwm_movies_reviews.dump
```

### Restore

**Full restore:**
```bash
pg_restore -U postgres -d iwm_new -v iwm_backup_20251021.dump
```

**Schema only:**
```bash
psql -U postgres -d iwm_new -f iwm_schema.sql
```

### Automated Backups

Set up daily backups with pg_cron:
```sql
SELECT cron.schedule('daily-backup', '0 3 * * *', $$
  COPY (SELECT pg_dump('iwm')) TO '/backups/iwm_' || to_char(NOW(), 'YYYYMMDD') || '.sql';
$$);
```

---

## Migration Guide

### From Docker to Local PostgreSQL

1. **Export data from Docker:**
```bash
docker exec -t iwm-db-1 pg_dump -U postgres iwm > docker_backup.sql
```

2. **Create local database:**
```bash
psql -U postgres -c "CREATE DATABASE iwm;"
```

3. **Import data:**
```bash
psql -U postgres -d iwm < docker_backup.sql
```

4. **Update connection string:**
```env
# apps/backend/.env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/iwm
```

5. **Enable extensions:**
```bash
psql -U postgres -d iwm -f database/scripts/enable_extensions.sql
```

6. **Create indexes:**
```bash
psql -U postgres -d iwm -f database/scripts/create_indexes.sql
```

### From SQLite to PostgreSQL

Not applicable (project uses PostgreSQL from the start).

---

## Troubleshooting

### Common Issues

**Issue:** Extension not found
```
ERROR: could not open extension control file
```
**Solution:** Install the extension package for your OS
```bash
# Ubuntu/Debian
sudo apt install postgresql-16-pgvector postgresql-16-postgis

# macOS
brew install pgvector postgis
```

**Issue:** Permission denied
```
ERROR: permission denied to create extension
```
**Solution:** Connect as superuser
```bash
psql -U postgres -d iwm
```

**Issue:** Connection refused
```
could not connect to server: Connection refused
```
**Solution:** Check PostgreSQL service is running
```bash
# Windows
Get-Service postgresql*

# Linux
sudo systemctl status postgresql

# macOS
brew services list
```

**Issue:** Slow queries
**Solution:** Check indexes and analyze tables
```sql
EXPLAIN ANALYZE SELECT ...;
ANALYZE movies;
```

---

## Additional Resources

- [PostgreSQL 16 Documentation](https://www.postgresql.org/docs/16/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [pg_cron Documentation](https://github.com/citusdata/pg_cron)

---

**Last Updated:** 2025-10-21  
**Maintainer:** IWM Development Team

