# Database Schema Documentation (Part 2)

**Continuation from SCHEMA.md**

---

## Awards & Festivals

### `award_ceremonies`
Major award ceremonies (Oscars, Golden Globes, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier (e.g., "oscars") |
| name | VARCHAR(200) | NOT NULL | Ceremony name |
| short_name | VARCHAR(100) | NULL | Short name (e.g., "Oscars") |
| description | TEXT | NULL | Description |
| logo_url | VARCHAR(255) | NULL | Logo image URL |
| background_image_url | VARCHAR(255) | NULL | Background image URL |
| current_year | INTEGER | NULL | Current/latest year |
| next_ceremony_date | TIMESTAMP | NULL | Next ceremony date |

---

### `award_ceremony_years`
Specific year editions of ceremonies.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier (e.g., "oscars-2024") |
| year | INTEGER | NOT NULL | Year |
| date | TIMESTAMP | NULL | Ceremony date |
| location | VARCHAR(200) | NULL | Venue location |
| hosted_by | TEXT | NULL | JSON array of hosts |
| background_image_url | VARCHAR(255) | NULL | Background image |
| logo_url | VARCHAR(255) | NULL | Logo image |
| description | TEXT | NULL | Description |
| highlights | TEXT | NULL | JSON array of highlights |
| ceremony_id | INTEGER | FK → award_ceremonies.id | Parent ceremony |

---

### `award_categories`
Award categories (Best Picture, Best Director, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| name | VARCHAR(200) | NOT NULL | Category name |
| ceremony_year_id | INTEGER | FK → award_ceremony_years.id | Ceremony year |

---

### `award_nominations`
Individual nominations and winners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| nominee_type | VARCHAR(30) | NOT NULL | Type (movie, person, song, screenplay) |
| nominee_name | VARCHAR(200) | NOT NULL | Nominee name |
| image_url | VARCHAR(255) | NULL | Image URL |
| entity_url | VARCHAR(255) | NULL | Link to entity page |
| details | VARCHAR(255) | NULL | Additional details |
| is_winner | BOOLEAN | DEFAULT FALSE | Winner flag |
| category_id | INTEGER | FK → award_categories.id | Category |
| movie_id | INTEGER | FK → movies.id, NULL | Movie (if applicable) |
| person_id | INTEGER | FK → people.id, NULL | Person (if applicable) |

**Indexes:**
```sql
CREATE INDEX idx_nominations_category ON award_nominations (category_id);
CREATE INDEX idx_nominations_is_winner ON award_nominations (is_winner) WHERE is_winner = TRUE;
CREATE INDEX idx_nominations_movie ON award_nominations (movie_id) WHERE movie_id IS NOT NULL;
CREATE INDEX idx_nominations_person ON award_nominations (person_id) WHERE person_id IS NOT NULL;
```

---

### `festivals`
Film festivals (Cannes, Sundance, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(50) | UNIQUE, INDEX | External identifier (e.g., "cannes") |
| name | VARCHAR(200) | NOT NULL | Festival name |
| location | VARCHAR(200) | NULL | Location |
| description | TEXT | NULL | Description |
| website | VARCHAR(200) | NULL | Website URL |
| image_url | VARCHAR(255) | NULL | Image URL |
| logo_url | VARCHAR(255) | NULL | Logo URL |
| founding_year | INTEGER | NULL | Year founded |

---

### `festival_editions`
Specific year editions of festivals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier (e.g., "cannes-2024") |
| year | INTEGER | NOT NULL | Year |
| edition_label | VARCHAR(50) | NULL | Edition label (e.g., "77th") |
| dates | VARCHAR(100) | NULL | Date range string |
| status | VARCHAR(20) | NULL | Status (upcoming, live, past) |
| festival_id | INTEGER | FK → festivals.id | Parent festival |

---

### `festival_program_sections`
Festival program sections (Competition, Out of Competition, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| name | VARCHAR(80) | NOT NULL | Section name |
| edition_id | INTEGER | FK → festival_editions.id | Festival edition |

---

### `festival_program_entries`
Movies in festival programs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| title | VARCHAR(200) | NOT NULL | Movie title |
| director | VARCHAR(100) | NULL | Director name |
| country | VARCHAR(100) | NULL | Country |
| premiere | VARCHAR(50) | NULL | Premiere type |
| image_url | VARCHAR(255) | NULL | Image URL |
| movie_id | INTEGER | FK → movies.id, NULL | Movie (if linked) |
| section_id | INTEGER | FK → festival_program_sections.id | Program section |

---

### `festival_winner_categories`
Festival award categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier (e.g., "palme-dor") |
| name | VARCHAR(200) | NOT NULL | Category name |
| edition_id | INTEGER | FK → festival_editions.id | Festival edition |

---

### `festival_winners`
Festival award winners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| movie_title | VARCHAR(200) | NULL | Movie title |
| movie_poster_url | VARCHAR(255) | NULL | Poster URL |
| recipient | VARCHAR(100) | NULL | Recipient name |
| director | VARCHAR(100) | NULL | Director name |
| citation | TEXT | NULL | Award citation |
| rating | FLOAT | NULL | Rating |
| movie_id | INTEGER | FK → movies.id, NULL | Movie (if linked) |
| category_id | INTEGER | FK → festival_winner_categories.id | Category |

---

## Box Office

### `box_office_weekend_entries`
Weekend box office rankings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| region | VARCHAR(50) | INDEX, DEFAULT 'global' | Region |
| period_start | TIMESTAMP | NULL | Weekend start |
| period_end | TIMESTAMP | NULL | Weekend end |
| rank | INTEGER | NOT NULL | Ranking position |
| movie_id | INTEGER | FK → movies.id, NULL | Movie |
| weekend_gross_usd | FLOAT | NOT NULL | Weekend gross |
| total_gross_usd | FLOAT | NOT NULL | Total gross |
| change_percent | FLOAT | NULL | Change from previous week |
| is_positive | BOOLEAN | DEFAULT TRUE | Positive change flag |
| weeks_in_release | INTEGER | NULL | Weeks in release |
| poster_url | VARCHAR(255) | NULL | Poster URL |

**Indexes:**
```sql
CREATE INDEX idx_box_office_weekend_region ON box_office_weekend_entries (region);
CREATE INDEX idx_box_office_weekend_period ON box_office_weekend_entries (period_start DESC);
CREATE INDEX idx_box_office_weekend_rank ON box_office_weekend_entries (rank);
```

---

### `box_office_trends`
Box office trend data points.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| region | VARCHAR(50) | INDEX, DEFAULT 'global' | Region |
| date | TIMESTAMP | NOT NULL | Date |
| gross_millions_usd | FLOAT | NOT NULL | Gross in millions |

---

### `box_office_ytd`
Year-to-date box office statistics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| region | VARCHAR(50) | INDEX, DEFAULT 'global' | Region |
| year | INTEGER | INDEX | Year |
| total_gross_usd | FLOAT | NOT NULL | Total gross |
| change_percent | FLOAT | NOT NULL | Change from previous year |
| is_positive | BOOLEAN | DEFAULT TRUE | Positive change flag |
| previous_year | INTEGER | NOT NULL | Previous year |
| previous_total_gross_usd | FLOAT | NOT NULL | Previous year gross |

---

### `box_office_ytd_top_movies`
Top movies for YTD statistics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| ytd_id | INTEGER | FK → box_office_ytd.id | YTD record |
| title | VARCHAR(200) | NOT NULL | Movie title |
| gross_usd | FLOAT | NOT NULL | Gross amount |

---

### `box_office_records`
Box office records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| region | VARCHAR(50) | INDEX, DEFAULT 'global' | Region |
| category | VARCHAR(100) | NOT NULL | Record category |
| title | VARCHAR(200) | NOT NULL | Movie title |
| value_text | VARCHAR(50) | NOT NULL | Record value |
| year | VARCHAR(10) | NOT NULL | Year |
| poster_url | VARCHAR(255) | NULL | Poster URL |

---

### `box_office_perf_genre`
Box office performance by genre.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| region | VARCHAR(50) | INDEX, DEFAULT 'global' | Region |
| name | VARCHAR(100) | NOT NULL | Genre name |
| percent | INTEGER | NOT NULL | Percentage |
| color | VARCHAR(20) | NOT NULL | Chart color |

---

### `box_office_perf_studio`
Box office performance by studio.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| region | VARCHAR(50) | INDEX, DEFAULT 'global' | Region |
| studio | VARCHAR(100) | NOT NULL | Studio name |
| gross_millions_usd | FLOAT | NOT NULL | Gross in millions |

---

### `box_office_perf_monthly`
Monthly box office performance.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| region | VARCHAR(50) | INDEX, DEFAULT 'global' | Region |
| month | VARCHAR(10) | NOT NULL | Month |
| gross_millions_usd | FLOAT | NOT NULL | Gross in millions |

---

## Visual Treats

### `visual_treat_tag_lookup`
Tags for visual treats.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| name | VARCHAR(80) | UNIQUE, INDEX | Tag name |

---

### `visual_treats`
Visually stunning scenes/frames.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| title | VARCHAR(200) | NOT NULL | Title |
| description | TEXT | NULL | Description |
| image_url | VARCHAR(255) | NULL | Image URL |
| category | VARCHAR(80) | NOT NULL | Category |
| director | VARCHAR(100) | NULL | Director |
| cinematographer | VARCHAR(100) | NULL | Cinematographer |
| color_palette | TEXT | NULL | JSON array of hex colors |
| likes | INTEGER | DEFAULT 0 | Like count |
| views | INTEGER | DEFAULT 0 | View count |
| aspect_ratio | VARCHAR(20) | NULL | Aspect ratio |
| resolution | VARCHAR(50) | NULL | Resolution |
| submitted_by | VARCHAR(100) | NULL | Submitter |
| movie_id | INTEGER | FK → movies.id, NULL | Movie |
| scene_id | INTEGER | FK → scenes.id, NULL | Scene |

**Indexes:**
```sql
CREATE INDEX idx_visual_treats_category ON visual_treats (category);
CREATE INDEX idx_visual_treats_likes ON visual_treats (likes DESC);
CREATE INDEX idx_visual_treats_views ON visual_treats (views DESC);
```

---

## Quiz System

### `quizzes`
Quiz definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| title | VARCHAR(200) | NOT NULL | Quiz title |
| description | TEXT | NULL | Description |
| number_of_questions | INTEGER | DEFAULT 10 | Question count |
| time_limit_seconds | INTEGER | NULL | Time limit |
| pass_score | INTEGER | DEFAULT 70 | Passing score (%) |
| is_verification_required | BOOLEAN | DEFAULT TRUE | Verification required |
| is_randomized | BOOLEAN | DEFAULT FALSE | Randomize questions |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | NULL | Last update |
| movie_id | INTEGER | FK → movies.id, NULL | Associated movie |

---

### `quiz_questions`
Quiz questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| quiz_id | INTEGER | FK → quizzes.id | Quiz |
| text | TEXT | NOT NULL | Question text |
| media_url | VARCHAR(255) | NULL | Media URL |
| media_type | VARCHAR(20) | NULL | Media type (image, video, audio) |
| hint | TEXT | NULL | Hint text |
| explanation | TEXT | NULL | Explanation |
| points | INTEGER | DEFAULT 10 | Points value |
| order_index | INTEGER | DEFAULT 0 | Display order |
| type | VARCHAR(30) | DEFAULT 'multiple-choice' | Question type |

---

### `quiz_question_options`
Answer options for questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| question_id | INTEGER | FK → quiz_questions.id | Question |
| text | TEXT | NOT NULL | Option text |
| is_correct | BOOLEAN | DEFAULT FALSE | Correct answer flag |
| order_index | INTEGER | DEFAULT 0 | Display order |

---

### `quiz_attempts`
User quiz attempts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| external_id | VARCHAR(80) | UNIQUE, INDEX | External identifier |
| quiz_id | INTEGER | FK → quizzes.id | Quiz |
| user_id | INTEGER | FK → users.id | User |
| attempt_number | INTEGER | DEFAULT 1 | Attempt number |
| started_at | TIMESTAMP | DEFAULT NOW() | Start time |
| completed_at | TIMESTAMP | NULL | Completion time |
| time_spent_seconds | INTEGER | NULL | Time spent |
| score_percent | INTEGER | DEFAULT 0 | Score percentage |
| passed | BOOLEAN | DEFAULT FALSE | Passed flag |

---

### `quiz_answers`
User answers to questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| attempt_id | INTEGER | FK → quiz_attempts.id | Attempt |
| question_id | INTEGER | FK → quiz_questions.id | Question |
| selected_option_ids | TEXT | NOT NULL | JSON array of selected option IDs |
| is_correct | BOOLEAN | DEFAULT FALSE | Correct answer flag |
| time_spent_seconds | INTEGER | NULL | Time spent on question |

---

### `quiz_leaderboard_entries`
Quiz leaderboard.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Internal ID |
| quiz_id | INTEGER | FK → quizzes.id | Quiz |
| user_id | INTEGER | FK → users.id | User |
| score_percent | INTEGER | NOT NULL | Score percentage |
| completion_time_seconds | INTEGER | NULL | Completion time |
| created_at | TIMESTAMP | DEFAULT NOW() | Entry date |

**Indexes:**
```sql
CREATE INDEX idx_leaderboard_quiz ON quiz_leaderboard_entries (quiz_id);
CREATE INDEX idx_leaderboard_score ON quiz_leaderboard_entries (score_percent DESC, completion_time_seconds ASC);
```

---

**[Continued in SCHEMA_PART3.md]**

