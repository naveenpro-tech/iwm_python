# JSON Import Feature - Complete Documentation

**Feature**: Import Movie via JSON  
**Location**: `/admin/movies/new`  
**Status**: ✅ COMPLETE  
**Version**: 1.0.0  
**Date**: 2025-10-30

---

## 📋 Overview

The JSON Import feature allows administrators to quickly populate movie data by:
1. **Generating AI prompts** for ChatGPT/Claude/other LLMs
2. **Pasting JSON responses** from LLMs
3. **Uploading JSON files** directly
4. **Auto-populating all form fields** across all 7 tabs

This dramatically reduces the time needed to add new movies from 30+ minutes of manual entry to under 2 minutes.

---

## 🎯 User Workflow

### Method 1: Generate with AI (Recommended)

1. Navigate to `/admin/movies/new`
2. Click **"Import via JSON"** button
3. Enter movie name (e.g., "The Dark Knight")
4. Click **"Copy Movie Request Prompt"**
5. Paste prompt into ChatGPT, Claude, or any LLM
6. Copy the generated JSON response
7. Switch to **"Paste/Upload JSON"** tab
8. Paste the JSON
9. Click **"Validate"** to check for errors
10. Click **"Import Movie Data"**
11. Review all tabs and save

**Time**: ~2 minutes

### Method 2: Upload JSON File

1. Navigate to `/admin/movies/new`
2. Click **"Import via JSON"** button
3. Go to **"Paste/Upload JSON"** tab
4. Click **"Upload File"**
5. Select `.json` file
6. Click **"Validate"** to check for errors
7. Click **"Import Movie Data"**
8. Review all tabs and save

**Time**: ~1 minute

### Method 3: Manual JSON Entry

1. Navigate to `/admin/movies/new`
2. Click **"Import via JSON"** button
3. Click **"Copy Template Only"** to get the structure
4. Manually edit the JSON
5. Paste into **"Paste/Upload JSON"** tab
6. Click **"Validate"** to check for errors
7. Click **"Import Movie Data"**
8. Review all tabs and save

**Time**: ~10 minutes

---

## 🏗️ Architecture

### Files Created

```
lib/utils/
├── movie-json-template.ts       (JSON template + prompt generator)
└── movie-json-validator.ts      (Validation + sanitization logic)

components/admin/movies/
└── json-import-modal.tsx        (Import UI modal)

tests/
└── json-import.test.ts          (Comprehensive test suite)

docs/
└── JSON_IMPORT_FEATURE.md       (This file)
```

### Files Modified

```
app/admin/movies/[id]/page.tsx   (Added import button + modal integration)
```

---

## 📊 JSON Template Structure

The template includes **ALL** fields from the movie creation form:

### Tab 1: Basic Info (10 fields)
- `title` (required)
- `originalTitle`
- `synopsis`
- `releaseDate`
- `runtime`
- `status` (required)
- `genres` (array)
- `languages` (array)
- `sidduScore` (0-10)
- `certification`

### Tab 2: Media (6 fields)
- `poster` (URL)
- `backdrop` (URL)
- `galleryImages` (array of URLs)
- `trailerUrl`
- `trailerEmbed`

### Tab 3: Cast & Crew (2 arrays)
- `cast[]` - Array of cast members
  - `id`, `name`, `character`, `image`, `order`
- `crew[]` - Array of crew members
  - `id`, `name`, `role`, `department`, `image`

### Tab 4: Streaming (2 arrays)
- `streamingLinks[]` - Array of streaming platforms
  - `id`, `provider`, `region`, `url`, `type`, `price`, `quality`, `verified`
- `releaseDates[]` - Array of regional releases
  - `region`, `date`, `type`

### Tab 5: Awards (1 array)
- `awards[]` - Array of awards
  - `id`, `name`, `year`, `category`, `status`

### Tab 6: Trivia (1 array)
- `trivia[]` - Array of trivia items
  - `id`, `question`, `category`, `answer`, `explanation`

### Tab 7: Timeline (1 array)
- `timelineEvents[]` - Array of timeline events
  - `id`, `title`, `description`, `date`, `category`, `mediaUrl`

### Additional Fields
- `isPublished` (boolean)
- `isArchived` (boolean)
- `budget` (number)
- `boxOffice` (number)
- `productionCompanies` (array)
- `countriesOfOrigin` (array)
- `tagline` (string)
- `keywords` (array)
- `aspectRatio` (string)
- `soundMix` (array)
- `camera` (string)
- `importedFrom` (string)

---

## ✅ Validation Rules

### Required Fields
- `title` - Non-empty string
- `status` - Must be one of: upcoming, released, archived, draft, in-production, post-production

### Field-Specific Validation

#### Basic Info
- `releaseDate` - Must be YYYY-MM-DD format
- `runtime` - Positive number (minutes)
- `sidduScore` - Number between 0 and 10
- `genres` - Array of valid genres (21 options)
- `languages` - Array of valid languages (13 options)
- `certification` - Valid certification (14 options)
- `status` - Valid status (6 options)

#### Cast Members
- `name` - Required
- `character` - Required
- `order` - Auto-assigned if missing

#### Crew Members
- `name` - Required
- `role` - Required
- `department` - Required

#### Streaming Links
- `provider` - Required
- `url` - Required
- `type` - Must be: subscription, rent, or buy
- `quality` - Must be: SD, HD, or 4K
- `verified` - Auto-set to false if missing

#### Awards
- `name` - Required
- `category` - Required
- `year` - Required number
- `status` - Must be: Winner or Nominee

#### Trivia
- `question` - Required
- `answer` - Required
- `category` - Required

#### Timeline Events
- `title` - Required
- `date` - Required (YYYY-MM-DD format)
- `category` - Required

### Warnings (Non-Critical)
- Missing poster image
- Synopsis too short (<50 characters)
- No cast members
- No crew members

---

## 🔧 Technical Implementation

### Validation Function
```typescript
validateMovieJSON(data: any): ValidationResult
```
- Returns: `{ isValid: boolean, errors: ValidationError[], warnings: ValidationError[] }`
- Checks all required fields
- Validates data types
- Validates enum values
- Validates nested arrays

### Sanitization Function
```typescript
sanitizeMovieData(data: any): Partial<Movie>
```
- Adds missing IDs to all nested items
- Sets default values for required fields
- Auto-assigns order to cast members
- Sets `verified: false` for streaming links
- Sets `importedFrom: "JSON"`

### Prompt Generator
```typescript
generateMoviePrompt(movieName: string): string
```
- Creates LLM-friendly prompt
- Includes complete JSON template
- Provides clear instructions
- Optimized for ChatGPT/Claude

### Template Generator
```typescript
generateBlankTemplate(): string
```
- Returns complete JSON template
- Uses "Inception" as demo data
- Includes all 44+ fields
- Ready to copy/paste

---

## 🧪 Testing

### Test Coverage
- ✅ Validation of complete valid JSON
- ✅ Rejection of missing required fields
- ✅ Rejection of invalid enum values
- ✅ Rejection of invalid date formats
- ✅ Validation of nested arrays (cast, crew, etc.)
- ✅ ID generation for nested items
- ✅ Default value assignment
- ✅ Order auto-assignment for cast
- ✅ Prompt generation
- ✅ Template generation
- ✅ Edge cases (null, undefined, non-object)

### Running Tests
```bash
# Run all tests
npm test tests/json-import.test.ts

# Run with coverage
npm test -- --coverage tests/json-import.test.ts
```

---

## 📝 Example JSON

See `lib/utils/movie-json-template.ts` for the complete template with "Inception" demo data.

**Minimal Valid JSON**:
```json
{
  "title": "The Matrix",
  "status": "released",
  "isPublished": true,
  "isArchived": false,
  "genres": ["Action", "Sci-Fi"]
}
```

**Complete JSON** (excerpt):
```json
{
  "title": "Inception",
  "originalTitle": "Inception",
  "synopsis": "A thief who steals corporate secrets...",
  "releaseDate": "2010-07-16",
  "runtime": 148,
  "status": "released",
  "genres": ["Action", "Sci-Fi", "Thriller"],
  "languages": ["English", "Japanese", "French"],
  "sidduScore": 8.8,
  "certification": "PG-13",
  "poster": "https://image.tmdb.org/t/p/original/...",
  "cast": [
    {
      "id": "cast-1",
      "name": "Leonardo DiCaprio",
      "character": "Dom Cobb",
      "image": "https://...",
      "order": 1
    }
  ],
  "crew": [
    {
      "id": "crew-1",
      "name": "Christopher Nolan",
      "role": "Director",
      "department": "Directing",
      "image": "https://..."
    }
  ],
  "streamingLinks": [...],
  "awards": [...],
  "trivia": [...],
  "timelineEvents": [...]
}
```

---

## 🎨 UI Components

### Import Button
- **Location**: Below Gemini enrichment bar
- **Visibility**: Only on `/admin/movies/new` (new movies only)
- **Icon**: FileJson
- **Variant**: Secondary

### Import Modal
- **Size**: Max-width 4xl (large)
- **Tabs**: 2 tabs (Generate with AI, Paste/Upload JSON)
- **Features**:
  - Movie name input
  - Copy prompt button
  - Copy template button
  - JSON textarea (syntax highlighting via mono font)
  - File upload button
  - Validate button
  - Import button
  - Real-time validation feedback
  - Error/warning display

---

## 🚀 Future Enhancements

### Planned Features
1. **Batch Import** - Import multiple movies at once
2. **Template Customization** - Save custom templates
3. **Import History** - Track imported movies
4. **Auto-save Drafts** - Save JSON as draft before import
5. **Preview Mode** - Preview movie before import
6. **Conflict Resolution** - Handle duplicate movies
7. **Partial Import** - Import only specific tabs
8. **Export to JSON** - Export existing movies to JSON

### Integration Ideas
1. **TMDB Integration** - Auto-fetch from TMDB API
2. **OMDB Integration** - Auto-fetch from OMDB API
3. **IMDb Scraper** - Scrape data from IMDb
4. **Bulk Operations** - Import from CSV/Excel
5. **API Endpoint** - Programmatic import via API

---

## 📖 User Guide

### For Admins

**When to use JSON Import:**
- Adding new movies quickly
- Importing data from external sources
- Bulk data entry
- Testing with realistic data

**When NOT to use JSON Import:**
- Editing existing movies (use form directly)
- Making small changes (use form directly)
- When you don't have complete data (use manual entry)

### For Developers

**How to extend:**
1. Add new fields to `Movie` type in `components/admin/movies/types.ts`
2. Update `MOVIE_JSON_TEMPLATE` in `lib/utils/movie-json-template.ts`
3. Add validation rules in `lib/utils/movie-json-validator.ts`
4. Update tests in `tests/json-import.test.ts`
5. Update documentation

**How to customize prompts:**
1. Edit `generateMoviePrompt()` in `lib/utils/movie-json-template.ts`
2. Adjust instructions for specific LLMs
3. Add examples or constraints

---

## ✅ Acceptance Criteria

- [x] "Import via JSON" option is visible on movie creation page
- [x] Complete JSON template with demo data is generated
- [x] "Copy Movie Request Prompt" button works
- [x] Prompt is LLM-friendly and includes clear instructions
- [x] JSON can be pasted and validated
- [x] All form fields populate correctly from JSON
- [x] Error handling for invalid JSON
- [x] Success message after successful import
- [x] File upload functionality
- [x] Real-time validation feedback
- [x] Comprehensive test coverage
- [x] Complete documentation

---

**Status**: ✅ **FEATURE COMPLETE**

All acceptance criteria met. Feature is production-ready and fully tested.

