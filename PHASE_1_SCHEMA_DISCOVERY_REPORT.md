# 📋 Phase 1: Schema Discovery & Field Mapping - COMPLETE

**Date:** 2025-11-02  
**Status:** ✅ **ANALYSIS COMPLETE - READY FOR REVIEW**

---

## 🎯 Executive Summary

Completed comprehensive analysis of Movie model schema, form components, and backend import endpoints. Identified all fields for each of the 7 export/import categories. **Key Finding:** Database schema and frontend forms are MISALIGNED - frontend uses different field names than database.

---

## 📊 Database Schema Analysis

### **Movie Model Fields (apps/backend/src/models.py)**

**Basic Info Fields:**
- `title` (String, required)
- `year` (String, nullable)
- `tagline` (String, nullable)
- `release_date` (DateTime, nullable)
- `runtime` (Integer, nullable)
- `overview` (Text, nullable)
- `rating` (String, nullable) - PG-13, R, etc.
- `language` (String, nullable)
- `country` (String, nullable)
- `status` (String, nullable) - released, upcoming, in-production

**Ratings/Scores:**
- `siddu_score` (Float, nullable)
- `critics_score` (Float, nullable)
- `imdb_rating` (Float, nullable)
- `rotten_tomatoes_score` (Integer, nullable)

**Media Fields:**
- `poster_url` (String, nullable)
- `backdrop_url` (String, nullable)
- ⚠️ **MISSING:** `trailer_url`, `gallery_images` (TODO in backend)

**Financial:**
- `budget` (Integer, nullable)
- `revenue` (Integer, nullable)

**Rich Content (Admin-only):**
- `trivia` (JSONB array, nullable)
- `timeline` (JSONB array, nullable)

**Relationships:**
- `genres` (Many-to-many via movie_genres table)
- `people` (Many-to-many via movie_people table with role: director, writer, producer, actor)

**Awards:** (Separate AwardNomination table)
- Linked via `movie_id` foreign key

**Streaming:** (Separate MovieStreamingOption table)
- Linked via `movie_id` foreign key

---

## 🎨 Frontend Form Components Analysis

### **Field Mapping: Frontend vs Database**

| Category | Frontend Field | Database Field | Type | Status |
|----------|---|---|---|---|
| **basic-info** | title | title | string | ✅ Match |
| | originalTitle | ❌ NOT IN DB | string | ⚠️ Mismatch |
| | synopsis | overview | Text | ✅ Match (renamed) |
| | releaseDate | release_date | DateTime | ✅ Match |
| | runtime | runtime | Integer | ✅ Match |
| | year | year | String | ✅ Match |
| | sidduScore | siddu_score | Float | ✅ Match |
| | genres | genres (relationship) | Array | ✅ Match |
| | languages | language | String | ⚠️ Mismatch (array vs string) |
| | certification | rating | String | ✅ Match (renamed) |
| **media** | poster | poster_url | String | ✅ Match |
| | backdrop | backdrop_url | String | ✅ Match |
| | galleryImages | ❌ NOT IN DB | Array | ⚠️ Missing |
| | trailerUrl | ❌ NOT IN DB | String | ⚠️ Missing |
| | trailerEmbed | ❌ NOT IN DB | String | ⚠️ Missing |
| **cast-crew** | cast | people (role=actor) | Array | ✅ Match |
| | crew | people (role=director/writer/producer) | Array | ✅ Match |
| **streaming** | streamingLinks | MovieStreamingOption | Array | ✅ Match |
| **awards** | awards | AwardNomination | Array | ✅ Match |
| **trivia** | trivia | trivia (JSONB) | Array | ✅ Match |
| **timeline** | timelineEvents | timeline (JSONB) | Array | ✅ Match |

---

## 🔍 Category-Specific Field Mapping

### **1. BASIC-INFO Category**

**Database Fields:**
```
title, year, tagline, release_date, runtime, overview, rating, language, 
country, status, siddu_score, critics_score, imdb_rating, rotten_tomatoes_score
```

**Frontend Fields:**
```
title, originalTitle, synopsis, releaseDate, runtime, year, sidduScore, 
genres, languages, certification, budget, boxOffice, productionCompanies, 
countriesOfOrigin, tagline, keywords
```

**Template Structure:**
```json
{
  "title": "string",
  "year": "number (YYYY)",
  "tagline": "string",
  "release_date": "string (ISO date)",
  "runtime": "number (minutes)",
  "overview": "string (synopsis)",
  "rating": "string (PG-13, R, etc)",
  "language": "string",
  "country": "string",
  "status": "string (released|upcoming|in-production)",
  "siddu_score": "number (0-100)",
  "critics_score": "number (0-100)",
  "imdb_rating": "number (0-10)",
  "rotten_tomatoes_score": "number (0-100)"
}
```

### **2. CAST-CREW Category**

**Database Structure:**
- `people` table with `movie_people` junction table
- Junction table has: `role` (director|writer|producer|actor), `character_name`

**Export Format:**
```json
{
  "directors": [{"id": "string", "name": "string", "image": "url"}],
  "writers": [{"id": "string", "name": "string", "image": "url"}],
  "producers": [{"id": "string", "name": "string", "image": "url"}],
  "cast": [{"id": "string", "name": "string", "character": "string", "image": "url"}]
}
```

### **3. TIMELINE Category**

**Database Field:** `timeline` (JSONB array)

**Item Structure:**
```json
{
  "date": "string (YYYY-MM-DD)",
  "title": "string",
  "description": "string",
  "category": "string",
  "mediaUrl": "string (optional)"
}
```

### **4. TRIVIA Category**

**Database Field:** `trivia` (JSONB array)

**Item Structure:**
```json
{
  "question": "string",
  "category": "string",
  "answer": "string",
  "explanation": "string (optional)"
}
```

### **5. AWARDS Category**

**Database Table:** `award_nominations`

**Fields:**
```
id, ceremony, year, category, nominee, result, notes
```

**Export Format:**
```json
{
  "awards": [
    {
      "id": "string",
      "ceremony": "string",
      "year": "number",
      "category": "string",
      "nominee": "string",
      "result": "string (Winner|Nominee)",
      "notes": "string"
    }
  ]
}
```

### **6. MEDIA Category**

**Database Fields:** `poster_url`, `backdrop_url`

**⚠️ CRITICAL ISSUE:** Backend TODO comments indicate `trailer_url` and `gallery_images` are NOT in database yet.

**Current Export Format:**
```json
{
  "poster_url": "string",
  "backdrop_url": "string",
  "trailer_url": null,
  "gallery_images": []
}
```

### **7. STREAMING Category**

**Database Table:** `movie_streaming_options` (linked via `movie_id`)

**Fields:**
```
id, platform_id, movie_id, url, type (subscription|rent|buy), 
quality (SD|HD|4K), verified
```

**Export Format:**
```json
{
  "streaming": [
    {
      "id": "string",
      "provider": "string",
      "region": "string",
      "url": "string",
      "type": "string (subscription|rent|buy)",
      "quality": "string (SD|HD|4K)",
      "verified": "boolean"
    }
  ]
}
```

---

## ⚠️ Critical Issues Found

### **Issue 1: Missing Database Fields**
- `trailer_url` - Frontend has it, database doesn't
- `gallery_images` - Frontend has it, database doesn't
- `originalTitle` - Frontend has it, database doesn't

**Impact:** Templates will include fields that backend won't accept on import.

### **Issue 2: Field Name Mismatches**
- Frontend: `synopsis` → Database: `overview`
- Frontend: `certification` → Database: `rating`
- Frontend: `languages` (array) → Database: `language` (string)

**Impact:** Import validation will fail if field names don't match exactly.

### **Issue 3: Incomplete Backend Implementation**
- Media export has TODO comments for trailer_url and gallery_images
- Awards export references fields that may not exist in AwardNomination table

---

## ✅ Recommendations for Phase 2

### **Template Generation Strategy**

1. **Use ONLY database fields** - Don't include frontend-only fields
2. **Use database field names** - Not frontend names
3. **Include movie context** - title, year, tmdb_id for LLM reference
4. **Add clear instructions** - Category-specific LLM prompts
5. **Provide 2-3 examples** - Show expected data structure

### **Field Mapping for Templates**

Use the database field names and structures documented above, NOT the frontend field names.

---

## 📋 Summary Table

| Category | DB Fields | Export Endpoint | Import Endpoint | Status |
|----------|-----------|---|---|---|
| basic-info | 14 fields | ✅ Implemented | ✅ Full | Ready |
| cast-crew | people table | ✅ Implemented | ⚠️ Stub | Ready |
| timeline | JSONB array | ✅ Implemented | ✅ Full | Ready |
| trivia | JSONB array | ✅ Implemented | ✅ Full | Ready |
| awards | AwardNomination | ✅ Implemented | ⚠️ Stub | Ready |
| media | 2 fields | ✅ Implemented | ⚠️ Stub | ⚠️ Incomplete |
| streaming | MovieStreamingOption | ✅ Implemented | ⚠️ Stub | Ready |

---

## 🎯 Next Steps for Phase 2

1. ✅ Use database field names (not frontend names)
2. ✅ Include movie context (title, year, tmdb_id)
3. ✅ Add category-specific LLM instructions
4. ✅ Provide 2-3 realistic example items
5. ✅ Validate templates against backend import endpoints

**Status:** Ready to proceed with Phase 2 template generation.

