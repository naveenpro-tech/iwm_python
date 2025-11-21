-- Scheduled Jobs using pg_cron for IWM Database
-- Requires pg_cron extension to be installed and enabled
-- Usage: psql -U postgres -d iwm -f create_scheduled_jobs.sql

\echo '========================================='
\echo 'Setting up Scheduled Jobs (pg_cron)'
\echo '========================================='
\echo ''

-- Check if pg_cron is available
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        RAISE EXCEPTION 'pg_cron extension is not installed. Please install it first.';
    END IF;
END $$;

\echo 'pg_cron extension found. Creating scheduled jobs...'
\echo ''

-- ============================================
-- JOB 1: Update Trending Topics (Daily)
-- ============================================
\echo 'Creating job: Update Trending Topics (daily at midnight)...'

SELECT cron.schedule(
    'update-trending-topics',
    '0 0 * * *',  -- Daily at midnight
    $$
    -- Delete old trending topics
    DELETE FROM trending_topics WHERE computed_at < NOW() - INTERVAL '30 days';
    
    -- Calculate trending topics from last 7 days
    INSERT INTO trending_topics (tag, category, window_label, count, computed_at)
    SELECT 
        hashtag,
        'movie' as category,
        '7d' as window_label,
        COUNT(*) as count,
        NOW() as computed_at
    FROM pulses,
         jsonb_array_elements_text(COALESCE(hashtags::jsonb, '[]'::jsonb)) AS hashtag
    WHERE created_at > NOW() - INTERVAL '7 days'
      AND hashtags IS NOT NULL
    GROUP BY hashtag
    HAVING COUNT(*) >= 3
    ORDER BY COUNT(*) DESC
    LIMIT 50
    ON CONFLICT (tag, window_label) 
    DO UPDATE SET 
        count = EXCLUDED.count,
        computed_at = EXCLUDED.computed_at;
    $$
);

\echo '  ✓ Trending topics job created'
\echo ''

-- ============================================
-- JOB 2: Cleanup Old Notifications (Daily)
-- ============================================
\echo 'Creating job: Cleanup Old Notifications (daily at 2 AM)...'

SELECT cron.schedule(
    'cleanup-old-notifications',
    '0 2 * * *',  -- Daily at 2 AM
    $$
    -- Delete read notifications older than 90 days
    DELETE FROM notifications 
    WHERE is_read = TRUE 
      AND created_at < NOW() - INTERVAL '90 days';
    
    -- Delete unread notifications older than 180 days
    DELETE FROM notifications 
    WHERE is_read = FALSE 
      AND created_at < NOW() - INTERVAL '180 days';
    $$
);

\echo '  ✓ Notification cleanup job created'
\echo ''

-- ============================================
-- JOB 3: Update Admin Metric Snapshots (Hourly)
-- ============================================
\echo 'Creating job: Update Admin Metric Snapshots (hourly)...'

SELECT cron.schedule(
    'update-admin-metrics',
    '0 * * * *',  -- Every hour
    $$
    INSERT INTO admin_metric_snapshots (snapshot_time, metrics)
    VALUES (
        NOW(),
        jsonb_build_object(
            'total_users', (SELECT COUNT(*) FROM users),
            'total_movies', (SELECT COUNT(*) FROM movies),
            'total_reviews', (SELECT COUNT(*) FROM reviews),
            'total_pulses', (SELECT COUNT(*) FROM pulses),
            'active_users_24h', (
                SELECT COUNT(DISTINCT user_id) 
                FROM pulses 
                WHERE created_at > NOW() - INTERVAL '24 hours'
            ),
            'new_users_24h', (
                SELECT COUNT(*) 
                FROM users 
                WHERE created_at > NOW() - INTERVAL '24 hours'
            ),
            'new_reviews_24h', (
                SELECT COUNT(*) 
                FROM reviews 
                WHERE date > NOW() - INTERVAL '24 hours'
            ),
            'avg_rating', (
                SELECT ROUND(AVG(rating)::numeric, 2) 
                FROM reviews 
                WHERE date > NOW() - INTERVAL '30 days'
            ),
            'pending_moderation', (
                SELECT COUNT(*) 
                FROM moderation_items 
                WHERE status = 'pending'
            )
        )
    );
    
    -- Cleanup old snapshots (keep last 90 days)
    DELETE FROM admin_metric_snapshots 
    WHERE snapshot_time < NOW() - INTERVAL '90 days';
    $$
);

\echo '  ✓ Admin metrics job created'
\echo ''

-- ============================================
-- JOB 4: Cleanup Old Pulses (Weekly)
-- ============================================
\echo 'Creating job: Cleanup Old Pulses (weekly on Sunday at 3 AM)...'

SELECT cron.schedule(
    'cleanup-old-pulses',
    '0 3 * * 0',  -- Weekly on Sunday at 3 AM
    $$
    -- Delete pulses older than 1 year with low engagement
    DELETE FROM pulses 
    WHERE created_at < NOW() - INTERVAL '1 year'
      AND reactions_total < 5
      AND comments_count < 2
      AND shares_count < 1;
    $$
);

\echo '  ✓ Pulse cleanup job created'
\echo ''

-- ============================================
-- JOB 5: Update Engagement Scores (Daily)
-- ============================================
\echo 'Creating job: Update Engagement Scores (daily at 1 AM)...'

SELECT cron.schedule(
    'update-engagement-scores',
    '0 1 * * *',  -- Daily at 1 AM
    $$
    -- Update review engagement scores
    UPDATE reviews
    SET engagement_score = (
        (helpful_votes * 2) + 
        (comment_count * 3) + 
        (CASE WHEN is_verified THEN 10 ELSE 0 END)
    )
    WHERE date > NOW() - INTERVAL '30 days';
    $$
);

\echo '  ✓ Engagement score update job created'
\echo ''

-- ============================================
-- JOB 6: Vacuum and Analyze (Weekly)
-- ============================================
\echo 'Creating job: Vacuum and Analyze (weekly on Monday at 4 AM)...'

SELECT cron.schedule(
    'vacuum-analyze',
    '0 4 * * 1',  -- Weekly on Monday at 4 AM
    $$
    VACUUM ANALYZE movies;
    VACUUM ANALYZE reviews;
    VACUUM ANALYZE pulses;
    VACUUM ANALYZE notifications;
    VACUUM ANALYZE users;
    $$
);

\echo '  ✓ Vacuum and analyze job created'
\echo ''

-- ============================================
-- JOB 7: Update Movie Statistics (Daily)
-- ============================================
\echo 'Creating job: Update Movie Statistics (daily at 5 AM)...'

SELECT cron.schedule(
    'update-movie-stats',
    '0 5 * * *',  -- Daily at 5 AM
    $$
    -- This could update materialized views or cached statistics
    -- For now, just refresh any materialized views if they exist
    -- REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS mv_movie_stats;
    
    -- Placeholder for future statistics updates
    SELECT 1;
    $$
);

\echo '  ✓ Movie statistics job created'
\echo ''

-- ============================================
-- JOB 8: Cleanup Expired Quiz Attempts (Daily)
-- ============================================
\echo 'Creating job: Cleanup Expired Quiz Attempts (daily at 3 AM)...'

SELECT cron.schedule(
    'cleanup-quiz-attempts',
    '0 3 * * *',  -- Daily at 3 AM
    $$
    -- Delete incomplete quiz attempts older than 7 days
    DELETE FROM quiz_attempts 
    WHERE completed_at IS NULL 
      AND started_at < NOW() - INTERVAL '7 days';
    $$
);

\echo '  ✓ Quiz cleanup job created'
\echo ''

-- ============================================
-- JOB 9: Update Casting Call Status (Hourly)
-- ============================================
\echo 'Creating job: Update Casting Call Status (hourly)...'

SELECT cron.schedule(
    'update-casting-call-status',
    '0 * * * *',  -- Every hour
    $$
    -- Auto-close casting calls past submission deadline
    UPDATE casting_calls
    SET status = 'closed'
    WHERE status = 'active'
      AND submission_deadline < NOW();
    $$
);

\echo '  ✓ Casting call status job created'
\echo ''

-- ============================================
-- JOB 10: Generate Daily Reports (Daily)
-- ============================================
\echo 'Creating job: Generate Daily Reports (daily at 6 AM)...'

SELECT cron.schedule(
    'generate-daily-reports',
    '0 6 * * *',  -- Daily at 6 AM
    $$
    -- This could generate daily summary reports
    -- Store in a reports table or send notifications
    -- Placeholder for future implementation
    SELECT 1;
    $$
);

\echo '  ✓ Daily reports job created'
\echo ''

-- ============================================
-- List All Scheduled Jobs
-- ============================================
\echo '========================================='
\echo 'Scheduled Jobs Summary'
\echo '========================================='
\echo ''

SELECT 
    jobid,
    schedule,
    command,
    nodename,
    nodeport,
    database,
    username,
    active
FROM cron.job
ORDER BY jobid;

\echo ''
\echo '========================================='
\echo 'Scheduled Jobs Setup Complete!'
\echo '========================================='
\echo ''
\echo 'Jobs created:'
\echo '  1. Update Trending Topics (daily at midnight)'
\echo '  2. Cleanup Old Notifications (daily at 2 AM)'
\echo '  3. Update Admin Metrics (hourly)'
\echo '  4. Cleanup Old Pulses (weekly on Sunday at 3 AM)'
\echo '  5. Update Engagement Scores (daily at 1 AM)'
\echo '  6. Vacuum and Analyze (weekly on Monday at 4 AM)'
\echo '  7. Update Movie Statistics (daily at 5 AM)'
\echo '  8. Cleanup Expired Quiz Attempts (daily at 3 AM)'
\echo '  9. Update Casting Call Status (hourly)'
\echo ' 10. Generate Daily Reports (daily at 6 AM)'
\echo ''
\echo 'To view job execution history:'
\echo '  SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;'
\echo ''
\echo 'To unschedule a job:'
\echo '  SELECT cron.unschedule(jobid) FROM cron.job WHERE jobid = <job_id>;'
\echo ''

