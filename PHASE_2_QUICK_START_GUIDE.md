# 🚀 Phase 2: Quick Start Guide

## ✅ What Was Implemented

Intelligent template generation for LLM-based movie data enrichment. Templates now include movie context, instructions, and realistic examples.

---

## 🎯 How to Use

### **1. Start the Servers**

**Backend:**
```bash
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 127.0.0.1:8000
```

**Frontend:**
```bash
bun run dev
```

### **2. Login to Admin Panel**

- URL: `http://localhost:3000/admin/movies/tmdb-550`
- Email: `admin@iwm.com`
- Password: `AdminPassword123!`

### **3. Copy Template**

1. Click any category tab (Timeline, Trivia, etc.)
2. Click "Copy Template" button
3. Template is copied to clipboard with:
   - Movie title and year
   - Category-specific instructions
   - Example data structure
   - Database field names

### **4. Enrich with LLM**

1. Open ChatGPT or Claude
2. Paste the template
3. Add prompt: "Fill in the [category] data for this movie"
4. LLM fills in realistic data
5. Copy enriched JSON

### **5. Import**

1. Click "Import [Category] JSON" button
2. Paste enriched JSON
3. Click "Validate" → Green success message
4. Click "Import" → Data saves to database

---

## 📋 Template Example

**Before (Empty):**
```json
{
  "category": "timeline",
  "movie_id": "tmdb-550",
  "data": {}
}
```

**After (Intelligent):**
```json
{
  "category": "timeline",
  "movie_id": "tmdb-550",
  "version": "1.0",
  "data": {
    "events": [
      {
        "date": "2009-06-01",
        "title": "Principal Photography Starts",
        "description": "Filming begins in Tokyo",
        "category": "Production Start",
        "mediaUrl": "https://example.com/image.jpg"
      }
    ]
  },
  "instructions": "Research the production timeline for 'Inception' (2010)...",
  "metadata": {
    "source": "llm-generated",
    "last_updated": "2025-11-02T..."
  }
}
```

---

## 🧪 Test Workflow

### **Timeline Category**

1. **Copy Template**
   - Click "Timeline" tab
   - Click "Copy Template"
   - Paste into ChatGPT

2. **LLM Prompt**
   ```
   Fill in the production timeline for "Inception" (2010).
   Include key events from pre-production through release.
   Use the provided JSON structure.
   ```

3. **Import Enriched Data**
   - Copy LLM response
   - Click "Import Timeline JSON"
   - Paste JSON
   - Click "Validate" → Green success
   - Click "Import" → Data saves

4. **Verify**
   - Refresh page
   - Timeline events should appear in the form

---

## 📊 All 7 Categories

| Category | Template Includes | LLM Task |
|----------|---|---|
| **Basic Info** | Title, year, ratings, synopsis | Fill in movie metadata |
| **Cast & Crew** | Directors, writers, producers, cast | List main talent |
| **Timeline** | Production events with dates | Research production history |
| **Trivia** | Questions, answers, explanations | Find interesting facts |
| **Awards** | Ceremony, year, category, result | List nominations/wins |
| **Media** | Poster, backdrop, trailer, gallery | Provide image/video URLs |
| **Streaming** | Provider, region, type, quality | Find streaming links |

---

## ✨ Key Features

✅ **Movie Context** - Templates include title, year, TMDB ID  
✅ **Clear Instructions** - LLMs know what to do  
✅ **Example Data** - Shows expected structure  
✅ **Database Fields** - Uses actual field names  
✅ **All 7 Categories** - Complete coverage  
✅ **LLM-Friendly** - Optimized for ChatGPT/Claude  

---

## 🔍 Files Changed

1. `lib/api/movie-export-import.ts` - Added template generation
2. `components/admin/movies/import-category-modal.tsx` - Updated to use templates
3. `app/admin/movies/[id]/page.tsx` - Pass movie context

---

## 🎯 Next Steps

1. **Test all 7 categories** (15 min)
2. **Test LLM enrichment workflow** (30 min)
3. **Verify data persistence** (5 min)
4. **Commit and deploy** (5 min)

---

## 💡 Tips

- Templates are <5000 tokens (LLM-friendly)
- Use ChatGPT-4 or Claude-3 for best results
- Verify JSON is valid before importing
- Refresh page after import to see changes
- Each category can be enriched independently

---

**Status:** ✅ Ready for Testing

