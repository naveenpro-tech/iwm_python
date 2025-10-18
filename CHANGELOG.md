# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Gemini Flash enrichment pipeline (backend):
  - New minimal Gemini client (config via `GEMINI_API_KEY`, model via `GEMINI_MODEL`, default `gemini-2.5-flash`).
  - TMDB fallback when Gemini is not configured (uses `TMDB_API_KEY`).
  - Service `enrichment.py` to normalize data and upsert movies (genres, cast/crew, streaming) safely.
- Admin endpoints (FastAPI, prefixed with `/api/v1/admin`):
  - `POST /movies/import` — Import JSON array of movies (upsert by `external_id`).
  - `POST /movies/enrich` — Enrich or create a movie by query using Gemini → TMDB fallback.
  - `POST /movies/enrich/bulk` — Bulk version of the above.
  - `POST /movies/enrich-existing` — Fill missing details for an existing movie by `external_id`.
- Admin UI pages (Next.js):
  - `/admin/movies/import` — Paste/upload JSON, import and see result report.
  - `/admin/movies/enrich` — Query (single), enrich existing by `external_id`, and bulk queries.
- Scripts:
  - `scripts/enrich_once.py` — simple local POST helper for enrichment.
  - `scripts/import_once.py` — simple local POST helper for import.

### Fixed
- Next.js 15 param Promise error on movie detail page (`app/movies/[id]/page.tsx`): unwrap `params` with `React.use()`.
- `ReviewSystemSection` crashes when arrays were undefined: now uses safe defaults for distribution, sentiments and reviews.
- Async SQLAlchemy `MissingGreenlet` errors during enrichment/import by avoiding lazy relationship mutation:
  - Replace `movie.genres.clear()/append` with direct writes to association table `movie_genres`.
  - Replace people links with explicit deletes/inserts via `movie_people`.

### Changed
- FE import page now targets `/api/v1/admin/movies/import` (was `/admin/...`).
- Backend `.env` adds Gemini settings: `GEMINI_API_KEY`, `GEMINI_MODEL`.
- Default Gemini model updated to `gemini-2.5-flash`.

### Notes
- End-to-end verified locally:
  - Backend (FastAPI) on :8000 via venv; Frontend (Next.js) on :3001 via Bun.
  - Admin Enrich and Import flows both return 200 and update the movie list.
- No DB schema changes required for this iteration; existing model structure supports enriched fields.

