-- Performance Indexes for IWM Database
-- Run this script after running Alembic migrations
-- Usage: psql -U postgres -d iwm -f create_indexes.sql

\echo '========================================='
\echo 'Creating Performance Indexes'
\echo '========================================='
\echo ''

-- ============================================
-- MOVIES TABLE
-- ============================================
\echo 'Creating indexes for movies table...'

-- Trigram index for fuzzy title search
CREATE INDEX IF NOT EXISTS idx_movies_title_trgm 
ON movies USING gin (title gin_trgm_ops);

-- Composite index for genre + score queries
CREATE INDEX IF NOT EXISTS idx_movies_siddu_score_desc 
ON movies (siddu_score DESC NULLS LAST) 
WHERE siddu_score IS NOT NULL;

-- Year index for filtering
CREATE INDEX IF NOT EXISTS idx_movies_year 
ON movies (year) 
WHERE year IS NOT NULL;

-- Status index for filtering
CREATE INDEX IF NOT EXISTS idx_movies_status 
ON movies (status) 
WHERE status IS NOT NULL;

-- JSONB indexes for trivia and timeline
CREATE INDEX IF NOT EXISTS idx_movies_trivia_gin 
ON movies USING gin (trivia) 
WHERE trivia IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_movies_timeline_gin 
ON movies USING gin (timeline) 
WHERE timeline IS NOT NULL;

-- Release date index
CREATE INDEX IF NOT EXISTS idx_movies_release_date 
ON movies (release_date DESC NULLS LAST) 
WHERE release_date IS NOT NULL;

\echo '  ✓ Movies indexes created'
\echo ''

-- ============================================
-- PEOPLE TABLE
-- ============================================
\echo 'Creating indexes for people table...'

-- Trigram index for fuzzy name search
CREATE INDEX IF NOT EXISTS idx_people_name_trgm 
ON people USING gin (name gin_trgm_ops);

\echo '  ✓ People indexes created'
\echo ''

-- ============================================
-- REVIEWS TABLE
-- ============================================
\echo 'Creating indexes for reviews table...'

-- Composite index for movie reviews sorted by date
CREATE INDEX IF NOT EXISTS idx_reviews_movie_date 
ON reviews (movie_id, date DESC);

-- User reviews index
CREATE INDEX IF NOT EXISTS idx_reviews_user_date 
ON reviews (user_id, date DESC);

-- Rating index for filtering
CREATE INDEX IF NOT EXISTS idx_reviews_rating 
ON reviews (rating DESC);

-- Engagement score index for sorting
CREATE INDEX IF NOT EXISTS idx_reviews_engagement 
ON reviews (engagement_score DESC);

-- Verified reviews index
CREATE INDEX IF NOT EXISTS idx_reviews_verified 
ON reviews (is_verified) 
WHERE is_verified = TRUE;

\echo '  ✓ Reviews indexes created'
\echo ''

-- ============================================
-- USERS TABLE
-- ============================================
\echo 'Creating indexes for users table...'

-- Email index (already created by unique constraint, but ensure it exists)
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (email);

-- Created at index for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at 
ON users (created_at DESC);

\echo '  ✓ Users indexes created'
\echo ''

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
\echo 'Creating indexes for notifications table...'

-- Composite index for user's unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON notifications (user_id, is_read, created_at DESC);

-- Type index for filtering
CREATE INDEX IF NOT EXISTS idx_notifications_type 
ON notifications (type);

-- Created at index for cleanup jobs
CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
ON notifications (created_at DESC);

\echo '  ✓ Notifications indexes created'
\echo ''

-- ============================================
-- PULSES TABLE (Social Posts)
-- ============================================
\echo 'Creating indexes for pulses table...'

-- User pulses sorted by date
CREATE INDEX IF NOT EXISTS idx_pulses_user_created 
ON pulses (user_id, created_at DESC);

-- Created at index for feed
CREATE INDEX IF NOT EXISTS idx_pulses_created_at 
ON pulses (created_at DESC);

-- Linked movie index
CREATE INDEX IF NOT EXISTS idx_pulses_linked_movie 
ON pulses (linked_movie_id) 
WHERE linked_movie_id IS NOT NULL;

-- Reactions index for sorting
CREATE INDEX IF NOT EXISTS idx_pulses_reactions 
ON pulses (reactions_total DESC);

\echo '  ✓ Pulses indexes created'
\echo ''

-- ============================================
-- WATCHLIST TABLE
-- ============================================
\echo 'Creating indexes for watchlist table...'

-- User watchlist index
CREATE INDEX IF NOT EXISTS idx_watchlist_user 
ON watchlist (user_id, date_added DESC);

-- Status index for filtering
CREATE INDEX IF NOT EXISTS idx_watchlist_status 
ON watchlist (status);

-- Unique constraint for user + movie
CREATE UNIQUE INDEX IF NOT EXISTS idx_watchlist_user_movie 
ON watchlist (user_id, movie_id);

\echo '  ✓ Watchlist indexes created'
\echo ''

-- ============================================
-- FAVORITES TABLE
-- ============================================
\echo 'Creating indexes for favorites table...'

-- User favorites index
CREATE INDEX IF NOT EXISTS idx_favorites_user 
ON favorites (user_id, added_date DESC);

-- Type index for filtering
CREATE INDEX IF NOT EXISTS idx_favorites_type 
ON favorites (type);

-- Movie favorites index
CREATE INDEX IF NOT EXISTS idx_favorites_movie 
ON favorites (movie_id) 
WHERE movie_id IS NOT NULL;

-- Person favorites index
CREATE INDEX IF NOT EXISTS idx_favorites_person 
ON favorites (person_id) 
WHERE person_id IS NOT NULL;

\echo '  ✓ Favorites indexes created'
\echo ''

-- ============================================
-- SCENES TABLE
-- ============================================
\echo 'Creating indexes for scenes table...'

-- Movie scenes index
CREATE INDEX IF NOT EXISTS idx_scenes_movie 
ON scenes (movie_id);

-- Popular scenes index
CREATE INDEX IF NOT EXISTS idx_scenes_popular 
ON scenes (is_popular, view_count DESC) 
WHERE is_popular = TRUE;

-- Visual treats index
CREATE INDEX IF NOT EXISTS idx_scenes_visual_treat 
ON scenes (is_visual_treat, view_count DESC) 
WHERE is_visual_treat = TRUE;

-- Added at index for sorting
CREATE INDEX IF NOT EXISTS idx_scenes_added_at 
ON scenes (added_at DESC);

\echo '  ✓ Scenes indexes created'
\echo ''

-- ============================================
-- STREAMING OPTIONS TABLE
-- ============================================
\echo 'Creating indexes for movie_streaming_options table...'

-- Movie streaming options index
CREATE INDEX IF NOT EXISTS idx_streaming_movie 
ON movie_streaming_options (movie_id);

-- Platform index
CREATE INDEX IF NOT EXISTS idx_streaming_platform 
ON movie_streaming_options (platform_id);

-- Region index for filtering
CREATE INDEX IF NOT EXISTS idx_streaming_region 
ON movie_streaming_options (region);

-- Composite index for movie + region queries
CREATE INDEX IF NOT EXISTS idx_streaming_movie_region 
ON movie_streaming_options (movie_id, region);

\echo '  ✓ Streaming options indexes created'
\echo ''

-- ============================================
-- AWARDS & FESTIVALS
-- ============================================
\echo 'Creating indexes for awards and festivals...'

-- Award nominations indexes
CREATE INDEX IF NOT EXISTS idx_nominations_category 
ON award_nominations (category_id);

CREATE INDEX IF NOT EXISTS idx_nominations_winner 
ON award_nominations (is_winner) 
WHERE is_winner = TRUE;

CREATE INDEX IF NOT EXISTS idx_nominations_movie 
ON award_nominations (movie_id) 
WHERE movie_id IS NOT NULL;

-- Festival program entries
CREATE INDEX IF NOT EXISTS idx_festival_entries_section 
ON festival_program_entries (section_id);

CREATE INDEX IF NOT EXISTS idx_festival_entries_movie 
ON festival_program_entries (movie_id) 
WHERE movie_id IS NOT NULL;

\echo '  ✓ Awards and festivals indexes created'
\echo ''

-- ============================================
-- BOX OFFICE
-- ============================================
\echo 'Creating indexes for box office tables...'

-- Weekend entries
CREATE INDEX IF NOT EXISTS idx_box_office_weekend_region 
ON box_office_weekend_entries (region, period_start DESC);

CREATE INDEX IF NOT EXISTS idx_box_office_weekend_rank 
ON box_office_weekend_entries (rank);

-- Trends
CREATE INDEX IF NOT EXISTS idx_box_office_trends_region_date 
ON box_office_trends (region, date DESC);

-- YTD
CREATE INDEX IF NOT EXISTS idx_box_office_ytd_region_year 
ON box_office_ytd (region, year DESC);

\echo '  ✓ Box office indexes created'
\echo ''

-- ============================================
-- QUIZ SYSTEM
-- ============================================
\echo 'Creating indexes for quiz system...'

-- Quiz attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user 
ON quiz_attempts (user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz 
ON quiz_attempts (quiz_id, started_at DESC);

-- Leaderboard
CREATE INDEX IF NOT EXISTS idx_quiz_leaderboard_quiz_score 
ON quiz_leaderboard_entries (quiz_id, score_percent DESC, completion_time_seconds ASC);

\echo '  ✓ Quiz system indexes created'
\echo ''

-- ============================================
-- TALENT HUB
-- ============================================
\echo 'Creating indexes for talent hub...'

-- Active casting calls
CREATE INDEX IF NOT EXISTS idx_casting_calls_active 
ON casting_calls (posted_date DESC) 
WHERE status = 'active' AND submission_deadline > NOW();

-- Location index
CREATE INDEX IF NOT EXISTS idx_casting_calls_location 
ON casting_calls (location_country, location_city);

-- Project type index
CREATE INDEX IF NOT EXISTS idx_casting_calls_type 
ON casting_calls (project_type);

\echo '  ✓ Talent hub indexes created'
\echo ''

-- ============================================
-- ADMIN & MODERATION
-- ============================================
\echo 'Creating indexes for admin and moderation...'

-- Moderation items
CREATE INDEX IF NOT EXISTS idx_moderation_status 
ON moderation_items (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_moderation_type 
ON moderation_items (content_type);

-- Admin metric snapshots
CREATE INDEX IF NOT EXISTS idx_admin_metrics_time 
ON admin_metric_snapshots (snapshot_time DESC);

\echo '  ✓ Admin and moderation indexes created'
\echo ''

-- ============================================
-- USER SETTINGS
-- ============================================
\echo 'Creating indexes for user settings...'

-- JSONB indexes for user settings
CREATE INDEX IF NOT EXISTS idx_user_settings_preferences 
ON user_settings USING gin (preferences) 
WHERE preferences IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_settings_privacy 
ON user_settings USING gin (privacy) 
WHERE privacy IS NOT NULL;

\echo '  ✓ User settings indexes created'
\echo ''

-- ============================================
-- TRENDING TOPICS
-- ============================================
\echo 'Creating indexes for trending topics...'

CREATE INDEX IF NOT EXISTS idx_trending_topics_tag 
ON trending_topics (tag);

CREATE INDEX IF NOT EXISTS idx_trending_topics_category 
ON trending_topics (category);

CREATE INDEX IF NOT EXISTS idx_trending_topics_count 
ON trending_topics (count DESC);

CREATE INDEX IF NOT EXISTS idx_trending_topics_computed 
ON trending_topics (computed_at DESC);

\echo '  ✓ Trending topics indexes created'
\echo ''

-- ============================================
-- SUMMARY
-- ============================================
\echo '========================================='
\echo 'Index Creation Complete!'
\echo '========================================='
\echo ''
\echo 'Analyzing tables for query planner...'
ANALYZE;
\echo '  ✓ Analysis complete'
\echo ''

-- Display index statistics
\echo 'Index Statistics:'
SELECT 
    schemaname,
    tablename,
    COUNT(*) as index_count,
    pg_size_pretty(SUM(pg_relation_size(indexrelid))) as total_index_size
FROM pg_indexes
JOIN pg_class ON pg_class.relname = indexname
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

\echo ''
\echo 'All performance indexes created successfully!'
\echo ''

