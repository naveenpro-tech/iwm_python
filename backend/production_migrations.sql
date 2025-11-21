BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 453f540df1cd

CREATE TABLE genres (
    id SERIAL NOT NULL, 
    slug VARCHAR(50) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_genres_slug ON genres (slug);

CREATE TABLE movies (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_movies_external_id ON movies (external_id);

CREATE TABLE movie_genres (
    movie_id INTEGER NOT NULL, 
    genre_id INTEGER NOT NULL, 
    PRIMARY KEY (movie_id, genre_id), 
    FOREIGN KEY(genre_id) REFERENCES genres (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id)
);

INSERT INTO alembic_version (version_num) VALUES ('453f540df1cd') RETURNING alembic_version.version_num;

-- Running upgrade 453f540df1cd -> b9da3f589139

CREATE TABLE people (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    bio TEXT, 
    image_url VARCHAR(255), 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_people_external_id ON people (external_id);

CREATE TABLE movie_people (
    movie_id INTEGER NOT NULL, 
    person_id INTEGER NOT NULL, 
    role VARCHAR(20) NOT NULL, 
    character_name VARCHAR(100), 
    PRIMARY KEY (movie_id, person_id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(person_id) REFERENCES people (id)
);

ALTER TABLE movies ADD COLUMN year VARCHAR(4);

ALTER TABLE movies ADD COLUMN runtime INTEGER;

ALTER TABLE movies ADD COLUMN siddu_score FLOAT;

ALTER TABLE movies ADD COLUMN language VARCHAR(50);

ALTER TABLE movies ADD COLUMN country VARCHAR(50);

ALTER TABLE movies ADD COLUMN overview TEXT;

ALTER TABLE movies ADD COLUMN poster_url VARCHAR(255);

UPDATE alembic_version SET version_num='b9da3f589139' WHERE alembic_version.version_num = '453f540df1cd';

-- Running upgrade b9da3f589139 -> 453d293fec3e

CREATE TABLE users (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    avatar_url VARCHAR(255), 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_users_external_id ON users (external_id);

CREATE TABLE reviews (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    content TEXT NOT NULL, 
    rating FLOAT NOT NULL, 
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    has_spoilers BOOLEAN NOT NULL, 
    is_verified BOOLEAN NOT NULL, 
    helpful_votes INTEGER NOT NULL, 
    unhelpful_votes INTEGER NOT NULL, 
    comment_count INTEGER NOT NULL, 
    engagement_score INTEGER NOT NULL, 
    media_urls TEXT, 
    user_id INTEGER NOT NULL, 
    movie_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE UNIQUE INDEX ix_reviews_external_id ON reviews (external_id);

UPDATE alembic_version SET version_num='453d293fec3e' WHERE alembic_version.version_num = 'b9da3f589139';

-- Running upgrade 453d293fec3e -> 55da4432a2fb

CREATE TABLE collections (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    description TEXT, 
    is_public BOOLEAN NOT NULL, 
    followers INTEGER NOT NULL, 
    tags TEXT, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE, 
    user_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE UNIQUE INDEX ix_collections_external_id ON collections (external_id);

CREATE TABLE collection_movies (
    collection_id INTEGER NOT NULL, 
    movie_id INTEGER NOT NULL, 
    PRIMARY KEY (collection_id, movie_id), 
    FOREIGN KEY(collection_id) REFERENCES collections (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id)
);

UPDATE alembic_version SET version_num='55da4432a2fb' WHERE alembic_version.version_num = '453d293fec3e';

-- Running upgrade 55da4432a2fb -> 53572f1cd932

CREATE TABLE favorites (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    type VARCHAR(20) NOT NULL, 
    added_date TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    user_id INTEGER NOT NULL, 
    movie_id INTEGER, 
    person_id INTEGER, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(person_id) REFERENCES people (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE UNIQUE INDEX ix_favorites_external_id ON favorites (external_id);

CREATE TABLE watchlist (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    date_added TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    status VARCHAR(20) NOT NULL, 
    priority VARCHAR(10) NOT NULL, 
    progress INTEGER, 
    user_id INTEGER NOT NULL, 
    movie_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE UNIQUE INDEX ix_watchlist_external_id ON watchlist (external_id);

UPDATE alembic_version SET version_num='53572f1cd932' WHERE alembic_version.version_num = '55da4432a2fb';

-- Running upgrade 53572f1cd932 -> aa9093843641

CREATE TABLE award_ceremonies (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    short_name VARCHAR(100), 
    description TEXT, 
    logo_url VARCHAR(255), 
    background_image_url VARCHAR(255), 
    current_year INTEGER, 
    next_ceremony_date TIMESTAMP WITHOUT TIME ZONE, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_award_ceremonies_external_id ON award_ceremonies (external_id);

CREATE TABLE award_ceremony_years (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    year INTEGER NOT NULL, 
    date TIMESTAMP WITHOUT TIME ZONE, 
    location VARCHAR(200), 
    hosted_by TEXT, 
    background_image_url VARCHAR(255), 
    logo_url VARCHAR(255), 
    description TEXT, 
    highlights TEXT, 
    ceremony_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(ceremony_id) REFERENCES award_ceremonies (id)
);

CREATE UNIQUE INDEX ix_award_ceremony_years_external_id ON award_ceremony_years (external_id);

CREATE TABLE award_categories (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    ceremony_year_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(ceremony_year_id) REFERENCES award_ceremony_years (id)
);

CREATE UNIQUE INDEX ix_award_categories_external_id ON award_categories (external_id);

CREATE TABLE award_nominations (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    nominee_type VARCHAR(30) NOT NULL, 
    nominee_name VARCHAR(200) NOT NULL, 
    image_url VARCHAR(255), 
    entity_url VARCHAR(255), 
    details VARCHAR(255), 
    is_winner BOOLEAN NOT NULL, 
    category_id INTEGER NOT NULL, 
    movie_id INTEGER, 
    person_id INTEGER, 
    PRIMARY KEY (id), 
    FOREIGN KEY(category_id) REFERENCES award_categories (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(person_id) REFERENCES people (id)
);

CREATE UNIQUE INDEX ix_award_nominations_external_id ON award_nominations (external_id);

UPDATE alembic_version SET version_num='aa9093843641' WHERE alembic_version.version_num = '53572f1cd932';

-- Running upgrade aa9093843641 -> 4f6f1d334794

CREATE TABLE box_office_perf_genre (
    id SERIAL NOT NULL, 
    region VARCHAR(50) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    percent INTEGER NOT NULL, 
    color VARCHAR(20) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_box_office_perf_genre_region ON box_office_perf_genre (region);

CREATE TABLE box_office_perf_monthly (
    id SERIAL NOT NULL, 
    region VARCHAR(50) NOT NULL, 
    month VARCHAR(10) NOT NULL, 
    gross_millions_usd FLOAT NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_box_office_perf_monthly_region ON box_office_perf_monthly (region);

CREATE TABLE box_office_perf_studio (
    id SERIAL NOT NULL, 
    region VARCHAR(50) NOT NULL, 
    studio VARCHAR(100) NOT NULL, 
    gross_millions_usd FLOAT NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_box_office_perf_studio_region ON box_office_perf_studio (region);

CREATE TABLE box_office_records (
    id SERIAL NOT NULL, 
    region VARCHAR(50) NOT NULL, 
    category VARCHAR(100) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    value_text VARCHAR(50) NOT NULL, 
    year VARCHAR(10) NOT NULL, 
    poster_url VARCHAR(255), 
    PRIMARY KEY (id)
);

CREATE INDEX ix_box_office_records_region ON box_office_records (region);

CREATE TABLE box_office_trends (
    id SERIAL NOT NULL, 
    region VARCHAR(50) NOT NULL, 
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    gross_millions_usd FLOAT NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_box_office_trends_region ON box_office_trends (region);

CREATE TABLE box_office_ytd (
    id SERIAL NOT NULL, 
    region VARCHAR(50) NOT NULL, 
    year INTEGER NOT NULL, 
    total_gross_usd FLOAT NOT NULL, 
    change_percent FLOAT NOT NULL, 
    is_positive BOOLEAN NOT NULL, 
    previous_year INTEGER NOT NULL, 
    previous_total_gross_usd FLOAT NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_box_office_ytd_region ON box_office_ytd (region);

CREATE INDEX ix_box_office_ytd_year ON box_office_ytd (year);

CREATE TABLE box_office_weekend_entries (
    id SERIAL NOT NULL, 
    region VARCHAR(50) NOT NULL, 
    period_start TIMESTAMP WITHOUT TIME ZONE, 
    period_end TIMESTAMP WITHOUT TIME ZONE, 
    rank INTEGER NOT NULL, 
    movie_id INTEGER, 
    weekend_gross_usd FLOAT NOT NULL, 
    total_gross_usd FLOAT NOT NULL, 
    change_percent FLOAT, 
    is_positive BOOLEAN NOT NULL, 
    weeks_in_release INTEGER, 
    poster_url VARCHAR(255), 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id)
);

CREATE INDEX ix_box_office_weekend_entries_region ON box_office_weekend_entries (region);

CREATE TABLE box_office_ytd_top_movies (
    id SERIAL NOT NULL, 
    ytd_id INTEGER NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    gross_usd FLOAT NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(ytd_id) REFERENCES box_office_ytd (id)
);

UPDATE alembic_version SET version_num='4f6f1d334794' WHERE alembic_version.version_num = 'aa9093843641';

-- Running upgrade 4f6f1d334794 -> 36c9dd3161ab

CREATE TABLE festivals (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    location VARCHAR(200), 
    description TEXT, 
    website VARCHAR(200), 
    image_url VARCHAR(255), 
    logo_url VARCHAR(255), 
    founding_year INTEGER, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_festivals_external_id ON festivals (external_id);

CREATE TABLE festival_editions (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    year INTEGER NOT NULL, 
    edition_label VARCHAR(50), 
    dates VARCHAR(100), 
    status VARCHAR(20), 
    festival_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(festival_id) REFERENCES festivals (id)
);

CREATE UNIQUE INDEX ix_festival_editions_external_id ON festival_editions (external_id);

CREATE TABLE festival_program_sections (
    id SERIAL NOT NULL, 
    name VARCHAR(80) NOT NULL, 
    edition_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(edition_id) REFERENCES festival_editions (id)
);

CREATE TABLE festival_winner_categories (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    edition_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(edition_id) REFERENCES festival_editions (id)
);

CREATE UNIQUE INDEX ix_festival_winner_categories_external_id ON festival_winner_categories (external_id);

CREATE TABLE festival_program_entries (
    id SERIAL NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    director VARCHAR(100), 
    country VARCHAR(100), 
    premiere VARCHAR(50), 
    image_url VARCHAR(255), 
    movie_id INTEGER, 
    section_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(section_id) REFERENCES festival_program_sections (id)
);

CREATE TABLE festival_winners (
    id SERIAL NOT NULL, 
    movie_title VARCHAR(200), 
    movie_poster_url VARCHAR(255), 
    recipient VARCHAR(100), 
    director VARCHAR(100), 
    citation TEXT, 
    rating FLOAT, 
    movie_id INTEGER, 
    category_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(category_id) REFERENCES festival_winner_categories (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id)
);

UPDATE alembic_version SET version_num='36c9dd3161ab' WHERE alembic_version.version_num = '4f6f1d334794';

-- Running upgrade 36c9dd3161ab -> 348d9cc4848f

CREATE TABLE scenes (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    description TEXT, 
    thumbnail_url VARCHAR(255), 
    duration_str VARCHAR(20), 
    duration_seconds INTEGER, 
    scene_type VARCHAR(50), 
    director VARCHAR(100), 
    cinematographer VARCHAR(100), 
    view_count INTEGER NOT NULL, 
    comment_count INTEGER NOT NULL, 
    is_popular BOOLEAN NOT NULL, 
    is_visual_treat BOOLEAN NOT NULL, 
    added_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    movie_id INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id)
);

CREATE UNIQUE INDEX ix_scenes_external_id ON scenes (external_id);

CREATE TABLE scene_genres (
    scene_id INTEGER NOT NULL, 
    genre_id INTEGER NOT NULL, 
    PRIMARY KEY (scene_id, genre_id), 
    FOREIGN KEY(genre_id) REFERENCES genres (id), 
    FOREIGN KEY(scene_id) REFERENCES scenes (id)
);

UPDATE alembic_version SET version_num='348d9cc4848f' WHERE alembic_version.version_num = '36c9dd3161ab';

-- Running upgrade 348d9cc4848f -> cc3e96904d6f

CREATE TABLE visual_treat_tag_lookup (
    id SERIAL NOT NULL, 
    name VARCHAR(80) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_visual_treat_tag_lookup_name ON visual_treat_tag_lookup (name);

CREATE TABLE visual_treats (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    description TEXT, 
    image_url VARCHAR(255), 
    category VARCHAR(80) NOT NULL, 
    director VARCHAR(100), 
    cinematographer VARCHAR(100), 
    color_palette TEXT, 
    likes INTEGER NOT NULL, 
    views INTEGER NOT NULL, 
    aspect_ratio VARCHAR(20), 
    resolution VARCHAR(50), 
    submitted_by VARCHAR(100), 
    movie_id INTEGER, 
    scene_id INTEGER, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(scene_id) REFERENCES scenes (id)
);

CREATE UNIQUE INDEX ix_visual_treats_external_id ON visual_treats (external_id);

CREATE TABLE visual_treat_tags (
    treat_id INTEGER NOT NULL, 
    tag_id INTEGER NOT NULL, 
    PRIMARY KEY (treat_id, tag_id), 
    FOREIGN KEY(tag_id) REFERENCES visual_treat_tag_lookup (id), 
    FOREIGN KEY(treat_id) REFERENCES visual_treats (id)
);

UPDATE alembic_version SET version_num='cc3e96904d6f' WHERE alembic_version.version_num = '348d9cc4848f';

-- Running upgrade cc3e96904d6f -> d2ca5accbc79

CREATE TABLE trending_topics (
    id SERIAL NOT NULL, 
    tag VARCHAR(120) NOT NULL, 
    category VARCHAR(20), 
    window_label VARCHAR(10) NOT NULL, 
    count INTEGER NOT NULL, 
    computed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_trending_topics_tag ON trending_topics (tag);

CREATE TABLE pulses (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    user_id INTEGER NOT NULL, 
    content_text TEXT NOT NULL, 
    content_media TEXT, 
    linked_type VARCHAR(20), 
    linked_external_id VARCHAR(80), 
    linked_title VARCHAR(200), 
    linked_poster_url VARCHAR(255), 
    linked_movie_id INTEGER, 
    hashtags TEXT, 
    reactions_json TEXT, 
    reactions_total INTEGER NOT NULL, 
    comments_count INTEGER NOT NULL, 
    shares_count INTEGER NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    edited_at TIMESTAMP WITHOUT TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(linked_movie_id) REFERENCES movies (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_pulses_created_at ON pulses (created_at);

CREATE UNIQUE INDEX ix_pulses_external_id ON pulses (external_id);

CREATE TABLE user_follows (
    id SERIAL NOT NULL, 
    follower_id INTEGER NOT NULL, 
    following_id INTEGER NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(follower_id) REFERENCES users (id), 
    FOREIGN KEY(following_id) REFERENCES users (id)
);

UPDATE alembic_version SET version_num='d2ca5accbc79' WHERE alembic_version.version_num = 'cc3e96904d6f';

-- Running upgrade d2ca5accbc79 -> 123eb5dcd8f9

CREATE TABLE quizzes (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    description TEXT, 
    number_of_questions INTEGER NOT NULL, 
    time_limit_seconds INTEGER, 
    pass_score INTEGER NOT NULL, 
    is_verification_required BOOLEAN NOT NULL, 
    is_randomized BOOLEAN NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE, 
    movie_id INTEGER, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id)
);

CREATE UNIQUE INDEX ix_quizzes_external_id ON quizzes (external_id);

CREATE TABLE quiz_attempts (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    quiz_id INTEGER NOT NULL, 
    user_id INTEGER NOT NULL, 
    attempt_number INTEGER NOT NULL, 
    started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    completed_at TIMESTAMP WITHOUT TIME ZONE, 
    time_spent_seconds INTEGER, 
    score_percent INTEGER NOT NULL, 
    passed BOOLEAN NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(quiz_id) REFERENCES quizzes (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE UNIQUE INDEX ix_quiz_attempts_external_id ON quiz_attempts (external_id);

CREATE TABLE quiz_leaderboard_entries (
    id SERIAL NOT NULL, 
    quiz_id INTEGER NOT NULL, 
    user_id INTEGER NOT NULL, 
    score_percent INTEGER NOT NULL, 
    completion_time_seconds INTEGER, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(quiz_id) REFERENCES quizzes (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE quiz_questions (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    quiz_id INTEGER NOT NULL, 
    text TEXT NOT NULL, 
    media_url VARCHAR(255), 
    media_type VARCHAR(20), 
    hint TEXT, 
    explanation TEXT, 
    points INTEGER NOT NULL, 
    order_index INTEGER NOT NULL, 
    type VARCHAR(30) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(quiz_id) REFERENCES quizzes (id)
);

CREATE UNIQUE INDEX ix_quiz_questions_external_id ON quiz_questions (external_id);

CREATE TABLE quiz_answers (
    id SERIAL NOT NULL, 
    attempt_id INTEGER NOT NULL, 
    question_id INTEGER NOT NULL, 
    selected_option_ids TEXT NOT NULL, 
    is_correct BOOLEAN NOT NULL, 
    time_spent_seconds INTEGER, 
    PRIMARY KEY (id), 
    FOREIGN KEY(attempt_id) REFERENCES quiz_attempts (id), 
    FOREIGN KEY(question_id) REFERENCES quiz_questions (id)
);

CREATE TABLE quiz_question_options (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    question_id INTEGER NOT NULL, 
    text TEXT NOT NULL, 
    is_correct BOOLEAN NOT NULL, 
    order_index INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(question_id) REFERENCES quiz_questions (id)
);

CREATE UNIQUE INDEX ix_quiz_question_options_external_id ON quiz_question_options (external_id);

UPDATE alembic_version SET version_num='123eb5dcd8f9' WHERE alembic_version.version_num = 'd2ca5accbc79';

-- Running upgrade 123eb5dcd8f9 -> f313c39a8c93

CREATE TABLE casting_calls (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    project_title VARCHAR(200) NOT NULL, 
    project_type VARCHAR(30) NOT NULL, 
    production_company VARCHAR(200) NOT NULL, 
    description TEXT NOT NULL, 
    production_start TIMESTAMP WITHOUT TIME ZONE, 
    production_end TIMESTAMP WITHOUT TIME ZONE, 
    location_city VARCHAR(120) NOT NULL, 
    location_state VARCHAR(120), 
    location_country VARCHAR(120) NOT NULL, 
    budget_range VARCHAR(20), 
    visibility VARCHAR(20) NOT NULL, 
    submission_deadline TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    posted_date TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    poster_image VARCHAR(255), 
    is_verified BOOLEAN NOT NULL, 
    status VARCHAR(20) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_casting_calls_external_id ON casting_calls (external_id);

CREATE INDEX ix_casting_calls_location_country ON casting_calls (location_country);

CREATE INDEX ix_casting_calls_posted_date ON casting_calls (posted_date);

CREATE INDEX ix_casting_calls_project_type ON casting_calls (project_type);

CREATE INDEX ix_casting_calls_status ON casting_calls (status);

CREATE INDEX ix_casting_calls_visibility ON casting_calls (visibility);

CREATE TABLE casting_call_roles (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    call_id INTEGER NOT NULL, 
    type VARCHAR(20) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    description TEXT NOT NULL, 
    category VARCHAR(50) NOT NULL, 
    department VARCHAR(80), 
    compensation VARCHAR(20) NOT NULL, 
    payment_details TEXT, 
    requirements JSONB, 
    audition_type VARCHAR(20) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(call_id) REFERENCES casting_calls (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX ix_casting_call_roles_external_id ON casting_call_roles (external_id);

CREATE INDEX ix_casting_call_roles_type ON casting_call_roles (type);

CREATE TABLE submission_guidelines (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    call_id INTEGER NOT NULL, 
    required_materials JSONB, 
    submission_method VARCHAR(20) NOT NULL, 
    contact_email VARCHAR(200), 
    contact_website VARCHAR(200), 
    special_instructions TEXT, 
    PRIMARY KEY (id), 
    FOREIGN KEY(call_id) REFERENCES casting_calls (id) ON DELETE CASCADE, 
    UNIQUE (call_id)
);

CREATE UNIQUE INDEX ix_submission_guidelines_external_id ON submission_guidelines (external_id);

UPDATE alembic_version SET version_num='f313c39a8c93' WHERE alembic_version.version_num = '123eb5dcd8f9';

-- Running upgrade f313c39a8c93 -> f3cc9a6f162c

CREATE TABLE admin_metric_snapshots (
    id SERIAL NOT NULL, 
    snapshot_time TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    metrics JSONB NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_admin_metric_snapshots_snapshot_time ON admin_metric_snapshots (snapshot_time);

CREATE TABLE system_settings (
    id SERIAL NOT NULL, 
    external_id VARCHAR(40) NOT NULL, 
    data JSONB NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_system_settings_external_id ON system_settings (external_id);

CREATE TABLE admin_user_meta (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    email VARCHAR(200) NOT NULL, 
    roles JSONB NOT NULL, 
    status VARCHAR(20) NOT NULL, 
    joined_date TIMESTAMP WITHOUT TIME ZONE, 
    last_login TIMESTAMP WITHOUT TIME ZONE, 
    profile_type VARCHAR(40), 
    verification_status VARCHAR(20), 
    account_type VARCHAR(40), 
    phone_number VARCHAR(40), 
    location VARCHAR(120), 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX ix_admin_user_meta_email ON admin_user_meta (email);

CREATE INDEX ix_admin_user_meta_status ON admin_user_meta (status);

CREATE UNIQUE INDEX ix_admin_user_meta_user_id ON admin_user_meta (user_id);

CREATE TABLE moderation_items (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    content_type VARCHAR(20) NOT NULL, 
    content_title VARCHAR(255) NOT NULL, 
    report_reason VARCHAR(120), 
    status VARCHAR(20) NOT NULL, 
    reporter_count INTEGER NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    user_id INTEGER, 
    content_ref VARCHAR(80), 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_moderation_items_content_type ON moderation_items (content_type);

CREATE INDEX ix_moderation_items_created_at ON moderation_items (created_at);

CREATE UNIQUE INDEX ix_moderation_items_external_id ON moderation_items (external_id);

CREATE INDEX ix_moderation_items_status ON moderation_items (status);

CREATE TABLE moderation_actions (
    id SERIAL NOT NULL, 
    item_id INTEGER NOT NULL, 
    moderator_user_id INTEGER, 
    action VARCHAR(20) NOT NULL, 
    reason TEXT, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(item_id) REFERENCES moderation_items (id) ON DELETE CASCADE, 
    FOREIGN KEY(moderator_user_id) REFERENCES users (id)
);

CREATE INDEX ix_moderation_actions_item_id ON moderation_actions (item_id);

CREATE INDEX ix_moderation_actions_moderator_user_id ON moderation_actions (moderator_user_id);

UPDATE alembic_version SET version_num='f3cc9a6f162c' WHERE alembic_version.version_num = 'f313c39a8c93';

-- Running upgrade f3cc9a6f162c -> 9c07efdc8648

CREATE TABLE notification_preferences (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    channels JSONB NOT NULL, 
    global_settings JSONB NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX ix_notification_preferences_user_id ON notification_preferences (user_id);

CREATE TABLE notifications (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    user_id INTEGER NOT NULL, 
    type VARCHAR(20) NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    message TEXT NOT NULL, 
    action_url VARCHAR(255), 
    metadata JSONB, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    is_read BOOLEAN NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX ix_notifications_created_at ON notifications (created_at);

CREATE UNIQUE INDEX ix_notifications_external_id ON notifications (external_id);

CREATE INDEX ix_notifications_is_read ON notifications (is_read);

CREATE INDEX ix_notifications_type ON notifications (type);

CREATE INDEX ix_notifications_user_id ON notifications (user_id);

UPDATE alembic_version SET version_num='9c07efdc8648' WHERE alembic_version.version_num = 'f3cc9a6f162c';

-- Running upgrade 9c07efdc8648 -> 965837e1ff41

CREATE TABLE user_settings (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    account JSONB NOT NULL, 
    profile JSONB NOT NULL, 
    privacy JSONB NOT NULL, 
    display JSONB NOT NULL, 
    preferences JSONB NOT NULL, 
    security JSONB NOT NULL, 
    integrations JSONB NOT NULL, 
    data JSONB NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX ix_user_settings_user_id ON user_settings (user_id);

UPDATE alembic_version SET version_num='965837e1ff41' WHERE alembic_version.version_num = '9c07efdc8648';

-- Running upgrade 965837e1ff41 -> 1a9c23c1eb8e

ALTER TABLE users ADD COLUMN email VARCHAR(200);

ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255);

ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE;

UPDATE users
        SET
            email = COALESCE(email, external_id || '@local'),
            hashed_password = COALESCE(hashed_password, ''),
            created_at = COALESCE(created_at, NOW());

ALTER TABLE users ALTER COLUMN email SET NOT NULL;

ALTER TABLE users ALTER COLUMN hashed_password SET NOT NULL;

ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;

CREATE UNIQUE INDEX ix_users_email ON users (email);

UPDATE alembic_version SET version_num='1a9c23c1eb8e' WHERE alembic_version.version_num = '965837e1ff41';

-- Running upgrade 1a9c23c1eb8e -> b3bb728ade7b

CREATE TABLE streaming_platforms (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    logo_url VARCHAR(255), 
    website_url VARCHAR(255), 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_streaming_platforms_external_id ON streaming_platforms (external_id);

CREATE TABLE movie_streaming_options (
    id SERIAL NOT NULL, 
    external_id VARCHAR(80) NOT NULL, 
    movie_id INTEGER NOT NULL, 
    platform_id INTEGER NOT NULL, 
    region VARCHAR(10) NOT NULL, 
    type VARCHAR(20) NOT NULL, 
    price VARCHAR(20), 
    quality VARCHAR(10), 
    url VARCHAR(500), 
    verified BOOLEAN NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(movie_id) REFERENCES movies (id), 
    FOREIGN KEY(platform_id) REFERENCES streaming_platforms (id)
);

CREATE UNIQUE INDEX ix_movie_streaming_options_external_id ON movie_streaming_options (external_id);

CREATE INDEX ix_movie_streaming_options_region ON movie_streaming_options (region);

ALTER TABLE movies ADD COLUMN tagline VARCHAR(500);

ALTER TABLE movies ADD COLUMN release_date TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE movies ADD COLUMN critics_score FLOAT;

ALTER TABLE movies ADD COLUMN imdb_rating FLOAT;

ALTER TABLE movies ADD COLUMN rotten_tomatoes_score INTEGER;

ALTER TABLE movies ADD COLUMN rating VARCHAR(10);

ALTER TABLE movies ADD COLUMN backdrop_url VARCHAR(255);

ALTER TABLE movies ADD COLUMN budget INTEGER;

ALTER TABLE movies ADD COLUMN revenue INTEGER;

ALTER TABLE movies ADD COLUMN status VARCHAR(20);

UPDATE alembic_version SET version_num='b3bb728ade7b' WHERE alembic_version.version_num = '1a9c23c1eb8e';

-- Running upgrade b3bb728ade7b -> df12a3b9a6c1

ALTER TABLE movies ADD COLUMN trivia JSONB;

ALTER TABLE movies ADD COLUMN timeline JSONB;

UPDATE alembic_version SET version_num='df12a3b9a6c1' WHERE alembic_version.version_num = 'b3bb728ade7b';

-- Running upgrade df12a3b9a6c1 -> e8688c242c92

CREATE TABLE critic_profiles (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    user_id INTEGER NOT NULL, 
    username VARCHAR(100) NOT NULL, 
    display_name VARCHAR(200) NOT NULL, 
    bio TEXT, 
    logo_url VARCHAR(255), 
    banner_url VARCHAR(255), 
    banner_video_url VARCHAR(255), 
    is_verified BOOLEAN DEFAULT 'false' NOT NULL, 
    verification_level VARCHAR(50), 
    verified_at TIMESTAMP WITHOUT TIME ZONE, 
    verification_notes TEXT, 
    follower_count INTEGER DEFAULT '0' NOT NULL, 
    total_reviews INTEGER DEFAULT '0' NOT NULL, 
    avg_engagement FLOAT DEFAULT '0.0' NOT NULL, 
    total_views INTEGER DEFAULT '0' NOT NULL, 
    review_philosophy TEXT, 
    equipment_info TEXT, 
    background_info TEXT, 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    UNIQUE (external_id), 
    UNIQUE (username)
);

CREATE INDEX ix_critic_profiles_external_id ON critic_profiles (external_id);

CREATE INDEX ix_critic_profiles_username ON critic_profiles (username);

CREATE INDEX ix_critic_profiles_user_id ON critic_profiles (user_id);

CREATE INDEX ix_critic_profiles_is_verified ON critic_profiles (is_verified);

CREATE TABLE critic_social_links (
    id SERIAL NOT NULL, 
    critic_id INTEGER NOT NULL, 
    platform VARCHAR(50) NOT NULL, 
    url VARCHAR(500) NOT NULL, 
    display_order INTEGER DEFAULT '0' NOT NULL, 
    is_primary BOOLEAN DEFAULT 'false' NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE
);

CREATE INDEX ix_critic_social_links_critic_id ON critic_social_links (critic_id);

CREATE TABLE critic_reviews (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    critic_id INTEGER NOT NULL, 
    movie_id INTEGER NOT NULL, 
    title VARCHAR(500), 
    content TEXT NOT NULL, 
    rating_type VARCHAR(50), 
    rating_value VARCHAR(20), 
    numeric_rating FLOAT, 
    youtube_embed_url VARCHAR(500), 
    image_gallery JSONB DEFAULT '[]' NOT NULL, 
    watch_links JSONB DEFAULT '[]' NOT NULL, 
    published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE, 
    is_draft BOOLEAN DEFAULT 'false' NOT NULL, 
    view_count INTEGER DEFAULT '0' NOT NULL, 
    like_count INTEGER DEFAULT '0' NOT NULL, 
    comment_count INTEGER DEFAULT '0' NOT NULL, 
    share_count INTEGER DEFAULT '0' NOT NULL, 
    slug VARCHAR(500) NOT NULL, 
    meta_description TEXT, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE, 
    FOREIGN KEY(movie_id) REFERENCES movies (id) ON DELETE CASCADE, 
    UNIQUE (external_id), 
    UNIQUE (slug)
);

CREATE INDEX ix_critic_reviews_external_id ON critic_reviews (external_id);

CREATE INDEX ix_critic_reviews_critic_id ON critic_reviews (critic_id);

CREATE INDEX ix_critic_reviews_movie_id ON critic_reviews (movie_id);

CREATE INDEX ix_critic_reviews_published_at ON critic_reviews (published_at);

CREATE INDEX ix_critic_reviews_slug ON critic_reviews (slug);

CREATE INDEX ix_critic_reviews_is_draft ON critic_reviews (is_draft);

CREATE TABLE critic_review_comments (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    review_id INTEGER NOT NULL, 
    user_id INTEGER NOT NULL, 
    parent_id INTEGER, 
    content TEXT NOT NULL, 
    like_count INTEGER DEFAULT '0' NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE, 
    is_deleted BOOLEAN DEFAULT 'false' NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(review_id) REFERENCES critic_reviews (id) ON DELETE CASCADE, 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(parent_id) REFERENCES critic_review_comments (id) ON DELETE CASCADE, 
    UNIQUE (external_id)
);

CREATE INDEX ix_critic_review_comments_external_id ON critic_review_comments (external_id);

CREATE INDEX ix_critic_review_comments_review_id ON critic_review_comments (review_id);

CREATE INDEX ix_critic_review_comments_user_id ON critic_review_comments (user_id);

CREATE INDEX ix_critic_review_comments_parent_id ON critic_review_comments (parent_id);

CREATE TABLE critic_followers (
    id SERIAL NOT NULL, 
    critic_id INTEGER NOT NULL, 
    user_id INTEGER NOT NULL, 
    followed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE, 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    CONSTRAINT uq_critic_follower UNIQUE (critic_id, user_id)
);

CREATE INDEX ix_critic_followers_critic_id ON critic_followers (critic_id);

CREATE INDEX ix_critic_followers_user_id ON critic_followers (user_id);

CREATE TABLE critic_review_likes (
    id SERIAL NOT NULL, 
    review_id INTEGER NOT NULL, 
    user_id INTEGER NOT NULL, 
    liked_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(review_id) REFERENCES critic_reviews (id) ON DELETE CASCADE, 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    CONSTRAINT uq_review_like UNIQUE (review_id, user_id)
);

CREATE INDEX ix_critic_review_likes_review_id ON critic_review_likes (review_id);

CREATE INDEX ix_critic_review_likes_user_id ON critic_review_likes (user_id);

CREATE TABLE critic_verification_applications (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    user_id INTEGER NOT NULL, 
    requested_username VARCHAR(100) NOT NULL, 
    requested_display_name VARCHAR(200) NOT NULL, 
    bio TEXT NOT NULL, 
    platform_links JSONB DEFAULT '[]' NOT NULL, 
    metrics JSONB, 
    sample_review_urls JSONB DEFAULT '[]' NOT NULL, 
    other_platforms JSONB, 
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, 
    admin_notes TEXT, 
    rejection_reason TEXT, 
    reviewed_by INTEGER, 
    reviewed_at TIMESTAMP WITHOUT TIME ZONE, 
    submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(reviewed_by) REFERENCES users (id) ON DELETE SET NULL, 
    UNIQUE (external_id)
);

CREATE INDEX ix_critic_verification_applications_external_id ON critic_verification_applications (external_id);

CREATE INDEX ix_critic_verification_applications_user_id ON critic_verification_applications (user_id);

CREATE INDEX ix_critic_verification_applications_status ON critic_verification_applications (status);

CREATE INDEX ix_critic_verification_applications_submitted_at ON critic_verification_applications (submitted_at);

CREATE TABLE critic_analytics (
    id SERIAL NOT NULL, 
    critic_id INTEGER NOT NULL, 
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    total_views INTEGER DEFAULT '0' NOT NULL, 
    total_likes INTEGER DEFAULT '0' NOT NULL, 
    total_comments INTEGER DEFAULT '0' NOT NULL, 
    total_shares INTEGER DEFAULT '0' NOT NULL, 
    new_followers INTEGER DEFAULT '0' NOT NULL, 
    engagement_rate FLOAT DEFAULT '0.0' NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE, 
    CONSTRAINT uq_critic_analytics_date UNIQUE (critic_id, date)
);

CREATE INDEX ix_critic_analytics_critic_id ON critic_analytics (critic_id);

CREATE INDEX ix_critic_analytics_date ON critic_analytics (date);

UPDATE alembic_version SET version_num='e8688c242c92' WHERE alembic_version.version_num = 'df12a3b9a6c1';

-- Running upgrade df12a3b9a6c1 -> a1b2c3d4e5f7

CREATE TYPE curation_status_enum AS ENUM (
            'draft',
            'pending_review',
            'approved',
            'rejected'
        );

ALTER TABLE movies ADD COLUMN curation_status VARCHAR(20);

COMMENT ON COLUMN movies.curation_status IS 'Status of movie curation: draft, pending_review, approved, rejected';

ALTER TABLE movies ADD COLUMN quality_score INTEGER;

COMMENT ON COLUMN movies.quality_score IS 'Quality score for the movie (0-100)';

ALTER TABLE movies ADD COLUMN curator_notes TEXT;

COMMENT ON COLUMN movies.curator_notes IS 'Notes from the curator about the movie';

ALTER TABLE movies ADD COLUMN curated_by_id INTEGER;

COMMENT ON COLUMN movies.curated_by_id IS 'ID of the user who curated this movie';

ALTER TABLE movies ADD COLUMN curated_at TIMESTAMP WITHOUT TIME ZONE;

COMMENT ON COLUMN movies.curated_at IS 'Timestamp when the movie was curated';

ALTER TABLE movies ADD COLUMN last_reviewed_at TIMESTAMP WITHOUT TIME ZONE;

COMMENT ON COLUMN movies.last_reviewed_at IS 'Timestamp of the last review';

ALTER TABLE movies ADD CONSTRAINT fk_movies_curated_by_id FOREIGN KEY(curated_by_id) REFERENCES users (id) ON DELETE SET NULL;

CREATE INDEX ix_movies_curation_status ON movies (curation_status);

CREATE INDEX ix_movies_quality_score ON movies (quality_score);

CREATE INDEX ix_movies_curated_by_id ON movies (curated_by_id);

CREATE INDEX ix_movies_curated_at ON movies (curated_at);

INSERT INTO alembic_version (version_num) VALUES ('a1b2c3d4e5f7') RETURNING alembic_version.version_num;

-- Running upgrade df12a3b9a6c1 -> a2c3d4e5f6g7

ALTER TABLE movies ADD COLUMN trivia_draft JSONB;

ALTER TABLE movies ADD COLUMN trivia_status VARCHAR(20) DEFAULT 'draft';

ALTER TABLE movies ADD COLUMN timeline_draft JSONB;

ALTER TABLE movies ADD COLUMN timeline_status VARCHAR(20) DEFAULT 'draft';

ALTER TABLE movies ADD COLUMN awards_draft JSONB;

ALTER TABLE movies ADD COLUMN awards_status VARCHAR(20) DEFAULT 'draft';

ALTER TABLE movies ADD COLUMN cast_crew_draft JSONB;

ALTER TABLE movies ADD COLUMN cast_crew_status VARCHAR(20) DEFAULT 'draft';

ALTER TABLE movies ADD COLUMN media_draft JSONB;

ALTER TABLE movies ADD COLUMN media_status VARCHAR(20) DEFAULT 'draft';

ALTER TABLE movies ADD COLUMN streaming_draft JSONB;

ALTER TABLE movies ADD COLUMN streaming_status VARCHAR(20) DEFAULT 'draft';

ALTER TABLE movies ADD COLUMN basic_info_draft JSONB;

ALTER TABLE movies ADD COLUMN basic_info_status VARCHAR(20) DEFAULT 'draft';

CREATE INDEX ix_movies_trivia_status ON movies (trivia_status);

CREATE INDEX ix_movies_timeline_status ON movies (timeline_status);

CREATE INDEX ix_movies_awards_status ON movies (awards_status);

CREATE INDEX ix_movies_cast_crew_status ON movies (cast_crew_status);

CREATE INDEX ix_movies_media_status ON movies (media_status);

CREATE INDEX ix_movies_streaming_status ON movies (streaming_status);

CREATE INDEX ix_movies_basic_info_status ON movies (basic_info_status);

INSERT INTO alembic_version (version_num) VALUES ('a2c3d4e5f6g7') RETURNING alembic_version.version_num;

-- Running upgrade a2c3d4e5f6g7 -> a2c3d4e5f6g8

ALTER TABLE movies ADD COLUMN awards JSONB;

UPDATE alembic_version SET version_num='a2c3d4e5f6g8' WHERE alembic_version.version_num = 'a2c3d4e5f6g7';

-- Running upgrade 53572f1cd932 -> a1b2c3d4e5f6

DELETE FROM watchlist w
        USING watchlist w2
        WHERE w.user_id = w2.user_id
          AND w.movie_id = w2.movie_id
          AND w.id < w2.id;;

ALTER TABLE watchlist ADD CONSTRAINT uq_watchlist_user_movie UNIQUE (user_id, movie_id);

INSERT INTO alembic_version (version_num) VALUES ('a1b2c3d4e5f6') RETURNING alembic_version.version_num;

-- Running upgrade a1b2c3d4e5f6, e8688c242c92 -> bcad9138a49a

DELETE FROM alembic_version WHERE alembic_version.version_num = 'e8688c242c92';

UPDATE alembic_version SET version_num='bcad9138a49a' WHERE alembic_version.version_num = 'a1b2c3d4e5f6';

-- Running upgrade bcad9138a49a -> f5211e5441a9

CREATE TABLE user_role_profiles (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    role_type VARCHAR(20) NOT NULL, 
    enabled BOOLEAN DEFAULT 'true' NOT NULL, 
    visibility VARCHAR(20) DEFAULT 'public' NOT NULL, 
    is_default BOOLEAN DEFAULT 'false' NOT NULL, 
    handle VARCHAR(100), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_user_role_type UNIQUE (user_id, role_type), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    CONSTRAINT ck_role_type CHECK (role_type IN ('lover', 'critic', 'talent', 'industry', 'moderator', 'admin')), 
    CONSTRAINT ck_visibility CHECK (visibility IN ('public', 'private', 'followers_only'))
);

CREATE INDEX ix_user_role_profiles_user_id ON user_role_profiles (user_id);

CREATE INDEX idx_user_role_type ON user_role_profiles (user_id, role_type);

CREATE INDEX idx_visibility ON user_role_profiles (visibility);

CREATE INDEX idx_user_default_role ON user_role_profiles (user_id) WHERE is_default = true AND enabled = true;

INSERT INTO user_role_profiles (user_id, role_type, enabled, visibility, is_default, created_at, updated_at)
        SELECT id, 'lover', true, 'public', true, NOW(), NOW()
        FROM users;

UPDATE alembic_version SET version_num='f5211e5441a9' WHERE alembic_version.version_num = 'bcad9138a49a';

-- Running upgrade f5211e5441a9 -> 2a761137faa8

CREATE TABLE talent_profiles (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    role_profile_id INTEGER, 
    stage_name VARCHAR(200), 
    bio TEXT, 
    headshot_url VARCHAR(500), 
    demo_reel_url VARCHAR(500), 
    imdb_url VARCHAR(500), 
    agent_name VARCHAR(200), 
    agent_contact VARCHAR(200), 
    skills JSONB, 
    experience_years INTEGER, 
    availability_status VARCHAR(20) DEFAULT 'available' NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_talent_profile_user_id UNIQUE (user_id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(role_profile_id) REFERENCES user_role_profiles (id) ON DELETE SET NULL, 
    CONSTRAINT ck_talent_availability_status CHECK (availability_status IN ('available', 'busy', 'not_available'))
);

CREATE UNIQUE INDEX ix_talent_profiles_user_id ON talent_profiles (user_id);

CREATE INDEX ix_talent_profiles_role_profile_id ON talent_profiles (role_profile_id);

CREATE INDEX idx_talent_profile_user_id ON talent_profiles (user_id);

CREATE INDEX idx_talent_profile_role_profile_id ON talent_profiles (role_profile_id);

CREATE INDEX idx_talent_availability_status ON talent_profiles (availability_status);

UPDATE alembic_version SET version_num='2a761137faa8' WHERE alembic_version.version_num = 'f5211e5441a9';

-- Running upgrade 2a761137faa8 -> 5d86b289ec9c

CREATE TABLE industry_profiles (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    role_profile_id INTEGER, 
    company_name VARCHAR(200), 
    job_title VARCHAR(200), 
    bio TEXT, 
    profile_image_url VARCHAR(500), 
    website_url VARCHAR(500), 
    imdb_url VARCHAR(500), 
    linkedin_url VARCHAR(500), 
    notable_works JSONB, 
    specializations JSONB, 
    experience_years INTEGER, 
    accepting_projects BOOLEAN DEFAULT 'true' NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_industry_profile_user_id UNIQUE (user_id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(role_profile_id) REFERENCES user_role_profiles (id) ON DELETE SET NULL
);

CREATE INDEX ix_industry_profiles_role_profile_id ON industry_profiles (role_profile_id);

CREATE UNIQUE INDEX ix_industry_profiles_user_id ON industry_profiles (user_id);

CREATE INDEX idx_industry_profile_user_id ON industry_profiles (user_id);

CREATE INDEX idx_industry_profile_role_profile_id ON industry_profiles (role_profile_id);

CREATE INDEX idx_industry_accepting_projects ON industry_profiles (accepting_projects);

UPDATE alembic_version SET version_num='5d86b289ec9c' WHERE alembic_version.version_num = '2a761137faa8';

-- Running upgrade 5d86b289ec9c -> 6e013abec488

ALTER TABLE critic_profiles ADD COLUMN role_profile_id INTEGER;

ALTER TABLE critic_profiles ADD CONSTRAINT fk_critic_profile_role_profile_id FOREIGN KEY(role_profile_id) REFERENCES user_role_profiles (id) ON DELETE SET NULL;

CREATE INDEX idx_critic_profile_role_profile_id ON critic_profiles (role_profile_id);

UPDATE alembic_version SET version_num='6e013abec488' WHERE alembic_version.version_num = '5d86b289ec9c';

-- Running upgrade 6e013abec488 -> f62516a11780

ALTER TABLE users ADD COLUMN bio TEXT;

ALTER TABLE users ADD COLUMN location VARCHAR(200);

ALTER TABLE users ADD COLUMN website VARCHAR(500);

UPDATE alembic_version SET version_num='f62516a11780' WHERE alembic_version.version_num = '6e013abec488';

-- Running upgrade f62516a11780 -> 1131c429e4be

ALTER TABLE critic_analytics DROP CONSTRAINT uq_critic_analytics_date;

ALTER TABLE critic_followers DROP CONSTRAINT uq_critic_follower;

ALTER TABLE critic_profiles DROP CONSTRAINT critic_profiles_external_id_key;

ALTER TABLE critic_profiles DROP CONSTRAINT critic_profiles_username_key;

DROP INDEX idx_critic_profile_role_profile_id;

DROP INDEX ix_critic_profiles_external_id;

CREATE UNIQUE INDEX ix_critic_profiles_external_id ON critic_profiles (external_id);

DROP INDEX ix_critic_profiles_user_id;

CREATE UNIQUE INDEX ix_critic_profiles_user_id ON critic_profiles (user_id);

DROP INDEX ix_critic_profiles_username;

CREATE UNIQUE INDEX ix_critic_profiles_username ON critic_profiles (username);

CREATE INDEX ix_critic_profiles_role_profile_id ON critic_profiles (role_profile_id);

ALTER TABLE critic_review_comments DROP CONSTRAINT critic_review_comments_external_id_key;

DROP INDEX ix_critic_review_comments_external_id;

CREATE UNIQUE INDEX ix_critic_review_comments_external_id ON critic_review_comments (external_id);

ALTER TABLE critic_review_likes DROP CONSTRAINT uq_review_like;

ALTER TABLE critic_reviews DROP CONSTRAINT critic_reviews_external_id_key;

ALTER TABLE critic_reviews DROP CONSTRAINT critic_reviews_slug_key;

DROP INDEX ix_critic_reviews_external_id;

CREATE UNIQUE INDEX ix_critic_reviews_external_id ON critic_reviews (external_id);

DROP INDEX ix_critic_reviews_slug;

CREATE UNIQUE INDEX ix_critic_reviews_slug ON critic_reviews (slug);

ALTER TABLE critic_verification_applications DROP CONSTRAINT critic_verification_applications_external_id_key;

DROP INDEX ix_critic_verification_applications_external_id;

CREATE UNIQUE INDEX ix_critic_verification_applications_external_id ON critic_verification_applications (external_id);

DROP INDEX idx_industry_accepting_projects;

DROP INDEX idx_industry_profile_role_profile_id;

DROP INDEX idx_industry_profile_user_id;

ALTER TABLE industry_profiles DROP CONSTRAINT uq_industry_profile_user_id;

DROP INDEX idx_talent_availability_status;

DROP INDEX idx_talent_profile_role_profile_id;

DROP INDEX idx_talent_profile_user_id;

ALTER TABLE talent_profiles DROP CONSTRAINT uq_talent_profile_user_id;

DROP INDEX idx_user_default_role;

DROP INDEX idx_user_role_type;

DROP INDEX idx_visibility;

ALTER TABLE user_role_profiles DROP CONSTRAINT uq_user_role_type;

ALTER TABLE users ADD COLUMN active_role VARCHAR(50);

UPDATE alembic_version SET version_num='1131c429e4be' WHERE alembic_version.version_num = 'f62516a11780';

-- Running upgrade 1131c429e4be, a1b2c3d4e5f7 -> 6c92333a3e37

DELETE FROM alembic_version WHERE alembic_version.version_num = 'a1b2c3d4e5f7';

UPDATE alembic_version SET version_num='6c92333a3e37' WHERE alembic_version.version_num = '1131c429e4be';

-- Running upgrade 6c92333a3e37 -> 58c375e0c9ff

ALTER TABLE movies ADD COLUMN tmdb_id INTEGER;

COMMENT ON COLUMN movies.curation_status IS NULL;

COMMENT ON COLUMN movies.quality_score IS NULL;

COMMENT ON COLUMN movies.curator_notes IS NULL;

COMMENT ON COLUMN movies.curated_by_id IS NULL;

COMMENT ON COLUMN movies.curated_at IS NULL;

COMMENT ON COLUMN movies.last_reviewed_at IS NULL;

DROP INDEX ix_movies_curated_at;

DROP INDEX ix_movies_curated_by_id;

DROP INDEX ix_movies_curation_status;

DROP INDEX ix_movies_quality_score;

CREATE UNIQUE INDEX ix_movies_tmdb_id ON movies (tmdb_id);

ALTER TABLE movies DROP CONSTRAINT fk_movies_curated_by_id;

ALTER TABLE movies ADD FOREIGN KEY(curated_by_id) REFERENCES users (id);

UPDATE alembic_version SET version_num='58c375e0c9ff' WHERE alembic_version.version_num = '6c92333a3e37';

-- Running upgrade 58c375e0c9ff, a2c3d4e5f6g8 -> ebd7593a9a5e

DELETE FROM alembic_version WHERE alembic_version.version_num = '58c375e0c9ff';

UPDATE alembic_version SET version_num='ebd7593a9a5e' WHERE alembic_version.version_num = 'a2c3d4e5f6g8';

-- Running upgrade ebd7593a9a5e -> 71be9198b431

ALTER TABLE award_ceremonies ADD COLUMN country VARCHAR(100);

ALTER TABLE award_ceremonies ADD COLUMN language VARCHAR(100);

ALTER TABLE award_ceremonies ADD COLUMN category_type VARCHAR(100);

ALTER TABLE award_ceremonies ADD COLUMN prestige_level VARCHAR(50);

ALTER TABLE award_ceremonies ADD COLUMN established_year INTEGER;

ALTER TABLE award_ceremonies ADD COLUMN is_active BOOLEAN DEFAULT 'true';

ALTER TABLE award_ceremonies ADD COLUMN display_order INTEGER;

CREATE INDEX ix_award_ceremonies_country ON award_ceremonies (country);

CREATE INDEX ix_award_ceremonies_language ON award_ceremonies (language);

CREATE INDEX ix_award_ceremonies_category_type ON award_ceremonies (category_type);

CREATE INDEX ix_award_ceremonies_is_active ON award_ceremonies (is_active);

UPDATE award_ceremonies SET country = 'USA', prestige_level = 'high', is_active = true WHERE country IS NULL;

UPDATE alembic_version SET version_num='71be9198b431' WHERE alembic_version.version_num = 'ebd7593a9a5e';

-- Running upgrade 71be9198b431 -> 001_feature_flags

CREATE TABLE feature_flags (
    id SERIAL NOT NULL, 
    feature_key VARCHAR(100) NOT NULL, 
    feature_name VARCHAR(200) NOT NULL, 
    is_enabled BOOLEAN DEFAULT 'false' NOT NULL, 
    category VARCHAR(50) NOT NULL, 
    description TEXT, 
    display_order INTEGER DEFAULT '0' NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL, 
    updated_by INTEGER, 
    PRIMARY KEY (id), 
    UNIQUE (feature_key), 
    FOREIGN KEY(updated_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX idx_feature_flags_enabled ON feature_flags (is_enabled);

CREATE INDEX idx_feature_flags_category ON feature_flags (category);

CREATE INDEX idx_feature_flags_display_order ON feature_flags (display_order);

INSERT INTO feature_flags (feature_key, feature_name, is_enabled, category, description, display_order) VALUES
        -- Core Navigation (4 features)
        ('home', 'Home', true, 'core_navigation', 'Homepage with movie sections', 1),
        ('explore', 'Explore', true, 'core_navigation', 'Browse movies by categories', 2),
        ('movies', 'Movies', true, 'core_navigation', 'Movie listing and search', 3),
        ('search', 'Search', true, 'core_navigation', 'Global search functionality', 4),
        
        -- Content Features (10 features)
        ('visual_treats', 'Visual Treats', false, 'content', 'Cinematic moments and visual treats', 10),
        ('cricket', 'Cricket', false, 'content', 'Cricket content and updates', 11),
        ('scene_explorer', 'Scene Explorer', false, 'content', 'Explore memorable movie scenes', 12),
        ('awards', 'Awards', false, 'content', 'Movie awards and nominations', 13),
        ('festivals', 'Festivals', false, 'content', 'Film festivals and events', 14),
        ('box_office', 'Box Office', false, 'content', 'Box office data and statistics', 15),
        ('movie_calendar', 'Movie Calendar', false, 'content', 'Movie release calendar', 16),
        ('quiz_system', 'Quiz System', false, 'content', 'Movie quizzes and trivia', 17),
        ('people', 'People Directory', true, 'content', 'Cast and crew directory', 18),
        ('tv_shows', 'TV Shows', false, 'content', 'TV shows and series', 19),
        
        -- Community Features (3 features)
        ('pulse', 'Pulse', false, 'community', 'Social feed and community posts', 20),
        ('talent_hub', 'Talent Hub', false, 'community', 'Talent profiles and portfolios', 21),
        ('industry_hub', 'Industry Hub', false, 'community', 'Industry professionals network', 22),
        
        -- Personal Features (5 features)
        ('profile', 'My Profile', true, 'personal', 'User profile and activity', 30),
        ('watchlist', 'Watchlist', true, 'personal', 'Movies to watch later', 31),
        ('favorites', 'Favorites', true, 'personal', 'Favorite movies collection', 32),
        ('collections', 'Collections', true, 'personal', 'Custom movie collections', 33),
        ('notifications', 'Notifications', true, 'personal', 'User notifications', 34),
        
        -- Critic Features (4 features)
        ('critics_directory', 'Critics Directory', false, 'critic', 'Browse verified critics', 40),
        ('critic_applications', 'Apply as Critic', false, 'critic', 'Critic application form', 41),
        ('critic_dashboard', 'Critic Dashboard', false, 'critic', 'Critic management dashboard', 42),
        ('critic_profile', 'Critic Profile', false, 'critic', 'Individual critic profiles', 43),
        
        -- Discovery Features (4 features)
        ('compare_movies', 'Compare Movies', false, 'discovery', 'Compare multiple movies', 50),
        ('recent_views', 'Recent Views', false, 'discovery', 'Recently viewed movies', 51),
        ('search_demo', 'Search Demo', false, 'discovery', 'Search demo page', 52),
        ('dashboard', 'User Dashboard', false, 'discovery', 'User activity dashboard', 53),
        
        -- Settings Features (10 features)
        ('settings_profile', 'Profile Settings', true, 'settings', 'Edit profile information', 60),
        ('settings_account', 'Account Settings', true, 'settings', 'Account security settings', 61),
        ('settings_privacy', 'Privacy Settings', true, 'settings', 'Privacy and data controls', 62),
        ('settings_display', 'Display Settings', true, 'settings', 'Display preferences', 63),
        ('settings_preferences', 'Preferences', true, 'settings', 'User preferences', 64),
        ('settings_notifications', 'Notification Preferences', true, 'settings', 'Notification settings', 65),
        ('settings_roles', 'Roles Management', false, 'settings', 'User role selection', 66),
        ('settings_critic', 'Critic Settings', false, 'settings', 'Critic-specific settings', 67),
        ('settings_talent', 'Talent Settings', false, 'settings', 'Talent-specific settings', 68),
        ('settings_industry', 'Industry Settings', false, 'settings', 'Industry professional settings', 69),
        
        -- Support Features (2 features)
        ('help_center', 'Help Center', true, 'support', 'Help and support resources', 70),
        ('landing_page', 'Landing Page', false, 'support', 'Public landing page', 71),
        
        -- Review Features (2 features)
        ('reviews', 'Reviews', true, 'reviews', 'User reviews and ratings', 80),
        ('movie_reviews', 'Movie Reviews', true, 'reviews', 'Movie-specific reviews', 81);

UPDATE alembic_version SET version_num='001_feature_flags' WHERE alembic_version.version_num = '71be9198b431';

-- Running upgrade 001_feature_flags -> add_collection_likes

CREATE TABLE collection_likes (
    collection_id INTEGER NOT NULL, 
    user_id INTEGER NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE, 
    PRIMARY KEY (collection_id, user_id), 
    FOREIGN KEY(collection_id) REFERENCES collections (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

UPDATE alembic_version SET version_num='add_collection_likes' WHERE alembic_version.version_num = '001_feature_flags';

-- Running upgrade add_collection_likes -> 5d063dcaa8ab

CREATE TABLE critic_affiliate_links (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    critic_id INTEGER NOT NULL, 
    label VARCHAR(100) NOT NULL, 
    platform VARCHAR(50) NOT NULL, 
    url VARCHAR(500) NOT NULL, 
    utm_source VARCHAR(100), 
    utm_medium VARCHAR(100), 
    utm_campaign VARCHAR(100), 
    click_count INTEGER NOT NULL, 
    conversion_count INTEGER NOT NULL, 
    is_active BOOLEAN NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE
);

CREATE INDEX ix_critic_affiliate_links_critic_id ON critic_affiliate_links (critic_id);

CREATE UNIQUE INDEX ix_critic_affiliate_links_external_id ON critic_affiliate_links (external_id);

CREATE TABLE critic_blog_posts (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    critic_id INTEGER NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    slug VARCHAR(250) NOT NULL, 
    content TEXT NOT NULL, 
    excerpt VARCHAR(500), 
    cover_image_url VARCHAR(255), 
    tags VARCHAR[] NOT NULL, 
    status VARCHAR(20) NOT NULL, 
    published_at TIMESTAMP WITHOUT TIME ZONE, 
    view_count INTEGER NOT NULL, 
    like_count INTEGER NOT NULL, 
    comment_count INTEGER NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE
);

CREATE INDEX ix_critic_blog_posts_critic_id ON critic_blog_posts (critic_id);

CREATE UNIQUE INDEX ix_critic_blog_posts_external_id ON critic_blog_posts (external_id);

CREATE INDEX ix_critic_blog_posts_published_at ON critic_blog_posts (published_at);

CREATE UNIQUE INDEX ix_critic_blog_posts_slug ON critic_blog_posts (slug);

CREATE INDEX ix_critic_blog_posts_status ON critic_blog_posts (status);

CREATE TABLE critic_brand_deals (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    critic_id INTEGER NOT NULL, 
    brand_name VARCHAR(200) NOT NULL, 
    campaign_title VARCHAR(200) NOT NULL, 
    brief TEXT NOT NULL, 
    rate_card FLOAT, 
    status VARCHAR(50) NOT NULL, 
    deliverables TEXT, 
    disclosure_required BOOLEAN NOT NULL, 
    start_date TIMESTAMP WITHOUT TIME ZONE, 
    end_date TIMESTAMP WITHOUT TIME ZONE, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE
);

CREATE INDEX ix_critic_brand_deals_critic_id ON critic_brand_deals (critic_id);

CREATE UNIQUE INDEX ix_critic_brand_deals_external_id ON critic_brand_deals (external_id);

CREATE INDEX ix_critic_brand_deals_status ON critic_brand_deals (status);

CREATE TABLE critic_pinned_content (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    critic_id INTEGER NOT NULL, 
    content_type VARCHAR(50) NOT NULL, 
    content_id INTEGER NOT NULL, 
    display_order INTEGER NOT NULL, 
    pinned_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE
);

CREATE INDEX ix_critic_pinned_content_critic_id ON critic_pinned_content (critic_id);

CREATE UNIQUE INDEX ix_critic_pinned_content_external_id ON critic_pinned_content (external_id);

CREATE TABLE critic_recommendations (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    critic_id INTEGER NOT NULL, 
    movie_id INTEGER NOT NULL, 
    recommendation_type VARCHAR(50) NOT NULL, 
    reason TEXT NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(critic_id) REFERENCES critic_profiles (id) ON DELETE CASCADE, 
    FOREIGN KEY(movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

CREATE INDEX ix_critic_recommendations_created_at ON critic_recommendations (created_at);

CREATE INDEX ix_critic_recommendations_critic_id ON critic_recommendations (critic_id);

CREATE UNIQUE INDEX ix_critic_recommendations_external_id ON critic_recommendations (external_id);

CREATE INDEX ix_critic_recommendations_movie_id ON critic_recommendations (movie_id);

CREATE INDEX ix_critic_recommendations_recommendation_type ON critic_recommendations (recommendation_type);

CREATE TABLE critic_sponsor_disclosures (
    id SERIAL NOT NULL, 
    external_id VARCHAR(50) NOT NULL, 
    review_id INTEGER, 
    blog_post_id INTEGER, 
    brand_deal_id INTEGER, 
    disclosure_text TEXT NOT NULL, 
    disclosure_type VARCHAR(50) NOT NULL, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(blog_post_id) REFERENCES critic_blog_posts (id) ON DELETE CASCADE, 
    FOREIGN KEY(brand_deal_id) REFERENCES critic_brand_deals (id) ON DELETE SET NULL, 
    FOREIGN KEY(review_id) REFERENCES critic_reviews (id) ON DELETE CASCADE
);

CREATE INDEX ix_critic_sponsor_disclosures_blog_post_id ON critic_sponsor_disclosures (blog_post_id);

CREATE UNIQUE INDEX ix_critic_sponsor_disclosures_external_id ON critic_sponsor_disclosures (external_id);

CREATE INDEX ix_critic_sponsor_disclosures_review_id ON critic_sponsor_disclosures (review_id);

ALTER TABLE feature_flags DROP CONSTRAINT feature_flags_feature_key_key;

DROP INDEX idx_feature_flags_category;

DROP INDEX idx_feature_flags_display_order;

DROP INDEX idx_feature_flags_enabled;

CREATE INDEX ix_feature_flags_category ON feature_flags (category);

CREATE INDEX ix_feature_flags_display_order ON feature_flags (display_order);

CREATE UNIQUE INDEX ix_feature_flags_feature_key ON feature_flags (feature_key);

CREATE INDEX ix_feature_flags_id ON feature_flags (id);

CREATE INDEX ix_feature_flags_is_enabled ON feature_flags (is_enabled);

DROP INDEX ix_movies_awards_status;

DROP INDEX ix_movies_basic_info_status;

DROP INDEX ix_movies_cast_crew_status;

DROP INDEX ix_movies_media_status;

DROP INDEX ix_movies_streaming_status;

DROP INDEX ix_movies_timeline_status;

DROP INDEX ix_movies_trivia_status;

UPDATE alembic_version SET version_num='5d063dcaa8ab' WHERE alembic_version.version_num = 'add_collection_likes';

-- Running upgrade 5d063dcaa8ab -> 25598acb4f30

ALTER TABLE critic_profiles ADD COLUMN is_active BOOLEAN DEFAULT 'true' NOT NULL;

ALTER TABLE critic_profiles ADD COLUMN suspended_at TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE critic_profiles ADD COLUMN suspension_reason TEXT;

CREATE INDEX ix_critic_profiles_is_active ON critic_profiles (is_active);

UPDATE alembic_version SET version_num='25598acb4f30' WHERE alembic_version.version_num = '5d063dcaa8ab';

COMMIT;

