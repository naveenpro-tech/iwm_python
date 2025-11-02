# 🧪 Testing Guide: Intelligent Template Generation (Bug Fixed)

**Status:** ✅ Servers Running | Bug Fixed | Ready for Testing

---

## 🐛 Bug That Was Fixed

**Issue:** Data was lost after import because the page reloaded before fetching fresh data.

**Fix:** 
- Frontend now waits 1 second for backend to process
- Fetches fresh data from API instead of reloading page
- Updates React state with new data
- Shows "Data Refreshed" toast

---

## 🚀 Test Workflow

### **Step 1: Login**

1. Browser should be at: `http://localhost:3000/admin/movies/tmdb-550`
2. Login with:
   - Email: `admin@iwm.com`
   - Password: `AdminPassword123!`

### **Step 2: Test Template Generation**

1. Click **"Timeline"** tab
2. Click **"Copy Template"** button
3. Verify template includes:
   - ✅ Movie title: "Fight Club"
   - ✅ Movie year: 1999
   - ✅ TMDB ID: 550
   - ✅ Instructions for LLM
   - ✅ Example timeline events
   - ✅ Database field names

**Expected Template Structure:**
```json
{
  "category": "timeline",
  "movie_id": "tmdb-550",
  "version": "1.0",
  "data": {
    "events": [
      {
        "date": "2023-01-15",
        "title": "Pre-production Begins",
        "description": "Director and producers begin planning...",
        "category": "Production Start",
        "mediaUrl": "https://example.com/image.jpg"
      }
    ]
  },
  "instructions": "Research the production timeline for 'Fight Club' (1999)...",
  "metadata": {
    "source": "llm-generated",
    "last_updated": "2025-11-02T..."
  }
}
```

### **Step 3: Enrich with LLM**

1. Open ChatGPT or Claude
2. Paste the template
3. Add this prompt:
   ```
   Fill in the production timeline for this movie with accurate historical events.
   Keep the JSON structure exactly as provided.
   Include 5-10 timeline events from pre-production through release.
   ```
4. Copy the enriched JSON response

### **Step 4: Import Enriched Data**

1. Back in IWM, click **"Import Timeline JSON"** button
2. Paste the enriched JSON into the modal
3. Click **"Validate"** button
   - ✅ Should show green success alert
4. Click **"Import"** button
   - ✅ Should show "Import Successful" toast
   - ✅ Modal should close after 1 second
   - ✅ "Data Refreshed" toast should appear

### **Step 5: Verify Data Persistence**

1. **Check Form:** Timeline events should appear in the form
2. **Refresh Page:** Press F5 or Ctrl+R
3. **Verify:** Timeline events should still be visible
4. **Check Database:** Events were saved to database

---

## 📋 Test All 7 Categories

Repeat the workflow for each category:

| Category | Tab Name | Template Includes |
|----------|----------|---|
| **Basic Info** | Basic Information | Title, year, ratings, synopsis |
| **Cast & Crew** | Cast & Crew | Directors, writers, producers, cast |
| **Timeline** | Timeline | Production events with dates |
| **Trivia** | Trivia | Questions, answers, explanations |
| **Awards** | Awards | Ceremony, year, category, result |
| **Media** | Media | Poster, backdrop, trailer, gallery |
| **Streaming** | Streaming | Provider, region, type, quality |

---

## ✅ Success Criteria

### **Template Generation:**
- ✅ Template includes movie context (title, year, TMDB ID)
- ✅ Template includes category-specific instructions
- ✅ Template includes example data structure
- ✅ Template uses database field names (not frontend names)
- ✅ Template is <5000 tokens (LLM-friendly)

### **Import Workflow:**
- ✅ JSON validation succeeds
- ✅ Import succeeds without errors
- ✅ Modal closes after 1 second
- ✅ "Data Refreshed" toast appears
- ✅ Data appears in form immediately
- ✅ Data persists after page refresh

### **Data Persistence:**
- ✅ Imported data visible in form
- ✅ Data survives page refresh
- ✅ Data saved to database
- ✅ No data loss

---

## 🔍 Troubleshooting

### **Issue: Template doesn't include movie context**
- **Solution:** Ensure movieData prop is passed to ImportCategoryModal
- **Check:** Browser console for errors

### **Issue: Import fails with validation error**
- **Solution:** Verify JSON structure matches template
- **Check:** JSON is valid (use JSONLint.com)

### **Issue: Data lost after import**
- **Solution:** This should be fixed! Check browser console for errors
- **Check:** Backend logs for import errors

### **Issue: "Data Refreshed" toast doesn't appear**
- **Solution:** Check browser console for fetch errors
- **Check:** Backend is running and responding

---

## 🐛 Debug Checklist

1. **Browser Console (F12):**
   - Check for JavaScript errors
   - Check for network errors
   - Look for fetch failures

2. **Backend Terminal:**
   - Check for import endpoint errors
   - Verify database commit succeeded
   - Look for validation errors

3. **Network Tab (F12):**
   - Verify import POST request succeeds (200)
   - Verify fetch GET request succeeds (200)
   - Check response data

---

## 📊 Expected Results

### **Before Fix:**
- ❌ Import succeeds
- ❌ Page reloads
- ❌ Data is lost
- ❌ Form is empty

### **After Fix:**
- ✅ Import succeeds
- ✅ Modal closes
- ✅ "Data Refreshed" toast appears
- ✅ Data visible in form
- ✅ Data persists on refresh

---

## 🎯 Next Steps

1. **Test all 7 categories** (30 min)
2. **Test LLM enrichment workflow** (30 min)
3. **Verify data persistence** (10 min)
4. **Document any issues** (5 min)
5. **Commit and deploy** (5 min)

---

## 📝 Notes

- Templates are optimized for ChatGPT-4 and Claude-3
- Each category can be enriched independently
- Data is saved to database immediately on import
- No manual "Save" button needed after import
- Refresh page to verify data persistence

**Status:** ✅ Ready for Testing

