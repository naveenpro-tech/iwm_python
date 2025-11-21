-- PostgreSQL Extensions Setup for IWM Database
-- Run this script after creating the database
-- Usage: psql -U postgres -d iwm -f enable_extensions.sql

\echo '========================================='
\echo 'Enabling PostgreSQL Extensions for IWM'
\echo '========================================='
\echo ''

-- 1. pg_trgm - Trigram text search for fuzzy matching
\echo 'Enabling pg_trgm (Trigram text search)...'
CREATE EXTENSION IF NOT EXISTS pg_trgm;
\echo '  ✓ pg_trgm enabled'
\echo ''

-- 2. pgcrypto - Cryptographic functions
\echo 'Enabling pgcrypto (Cryptographic functions)...'
CREATE EXTENSION IF NOT EXISTS pgcrypto;
\echo '  ✓ pgcrypto enabled'
\echo ''

-- 3. hstore - Key-value storage
\echo 'Enabling hstore (Key-value storage)...'
CREATE EXTENSION IF NOT EXISTS hstore;
\echo '  ✓ hstore enabled'
\echo ''

-- 4. pg_stat_statements - Query performance tracking
\echo 'Enabling pg_stat_statements (Query performance)...'
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
\echo '  ✓ pg_stat_statements enabled'
\echo ''
\echo 'NOTE: For pg_stat_statements to work fully, add to postgresql.conf:'
\echo '  shared_preload_libraries = ''pg_stat_statements'''
\echo '  pg_stat_statements.track = all'
\echo 'Then restart PostgreSQL'
\echo ''

-- 5. pgvector - Vector similarity search (optional, may not be available)
\echo 'Enabling vector (Vector similarity search)...'
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS vector;
    RAISE NOTICE '  ✓ vector enabled';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '  ⚠ vector extension not available (install pgvector separately)';
    RAISE NOTICE '    Install from: https://github.com/pgvector/pgvector';
END $$;
\echo ''

-- 6. PostGIS - Geospatial features (optional)
\echo 'Enabling postgis (Geospatial features)...'
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS postgis;
    RAISE NOTICE '  ✓ postgis enabled';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '  ⚠ postgis extension not available (install separately)';
    RAISE NOTICE '    Install from: https://postgis.net/install/';
END $$;
\echo ''

-- 7. pg_cron - Scheduled jobs (optional, requires superuser)
\echo 'Enabling pg_cron (Scheduled jobs)...'
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
    RAISE NOTICE '  ✓ pg_cron enabled';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '  ⚠ pg_cron extension not available (requires superuser and separate install)';
    RAISE NOTICE '    Install from: https://github.com/citusdata/pg_cron';
    RAISE NOTICE '    Add to postgresql.conf: shared_preload_libraries = ''pg_cron''';
END $$;
\echo ''

-- 8. pg_partman - Partition management (optional)
\echo 'Enabling pg_partman (Partition management)...'
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_partman;
    RAISE NOTICE '  ✓ pg_partman enabled';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '  ⚠ pg_partman extension not available (install separately)';
    RAISE NOTICE '    Install from: https://github.com/pgpartman/pg_partman';
END $$;
\echo ''

-- Verify installed extensions
\echo '========================================='
\echo 'Installed Extensions:'
\echo '========================================='
SELECT extname AS "Extension", extversion AS "Version"
FROM pg_extension
WHERE extname NOT IN ('plpgsql')
ORDER BY extname;

\echo ''
\echo '========================================='
\echo 'Extension Setup Complete!'
\echo '========================================='
\echo ''
\echo 'Next steps:'
\echo '  1. Run Alembic migrations to create tables'
\echo '  2. Run create_indexes.sql to add performance indexes'
\echo '  3. Run create_scheduled_jobs.sql to set up pg_cron jobs (if available)'
\echo ''

