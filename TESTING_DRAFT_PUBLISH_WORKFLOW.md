# Testing Guide: Draft/Publish Workflow

## 🚀 Setup

### Start Servers
```bash
# Terminal 1: Backend
cd apps/backend
.\.venv\Scripts\python -m hypercorn src.main:app --reload --bind 127.0.0.1:8000

# Terminal 2: Frontend
bun run dev
```

### Login
1. Navigate to `http://localhost:3001/login`
2. Email: `admin@iwm.com`
3. Password: `AdminPassword123!`

## 📝 Test Cases

### Test 1: Import Trivia as Draft

**Steps:**
1. Navigate to `/admin/movies/tmdb-550` (Fight Club)
2. Click "Trivia" tab
3. Click "Import Trivia JSON" button
4. Paste this JSON:
```json
{
  "category": "trivia",
  "movie_id": "tmdb-550",
  "data": {
    "items": [
      {
        "question": "Did you know?",
        "answer": "This is a test trivia item",
        "category": "production",
        "explanation": "Test explanation"
      }
    ]
  }
}
```
5. Click "Validate" button
6. Click "Import" button

**Expected Results:**
- ✅ Toast shows "Import Successful - Saved as Draft"
- ✅ Modal closes
- ✅ Draft status badge appears showing "Draft Available"
- ✅ "Publish Draft" and "Discard Draft" buttons appear

### Test 2: Publish Draft

**Steps:**
1. In Trivia tab, click "Publish Draft" button
2. Wait for success toast

**Expected Results:**
- ✅ Toast shows "Published Successfully"
- ✅ Status badge changes to "Published"
- ✅ "Publish Draft" button becomes disabled
- ✅ "Discard Draft" button becomes disabled

### Test 3: Discard Draft

**Steps:**
1. Import new trivia data (creates draft)
2. Click "Discard Draft" button
3. Click "Discard" in confirmation dialog

**Expected Results:**
- ✅ Toast shows "Draft Discarded"
- ✅ Status badge shows "No Data"
- ✅ Buttons are disabled

### Test 4: Timeline Draft/Publish

**Steps:**
1. Click "Timeline" tab
2. Click "Import Timeline JSON"
3. Paste this JSON:
```json
{
  "category": "timeline",
  "movie_id": "tmdb-550",
  "data": {
    "events": [
      {
        "date": "2009-10-02",
        "event": "Production began",
        "description": "Filming started in Los Angeles"
      }
    ]
  }
}
```
4. Validate and import
5. Click "Publish Draft"

**Expected Results:**
- ✅ Same workflow as trivia
- ✅ Status changes from Draft to Published

### Test 5: Awards Draft

**Steps:**
1. Click "Awards" tab
2. Click "Import Awards JSON"
3. Paste this JSON:
```json
{
  "category": "awards",
  "movie_id": "tmdb-550",
  "data": {
    "awards": [
      {
        "ceremony": "Academy Awards",
        "year": 2010,
        "category": "Best Picture",
        "nominee": "Fight Club",
        "won": false
      }
    ]
  }
}
```
4. Validate and import

**Expected Results:**
- ✅ Saved as draft
- ✅ Status badge shows "Draft Available"

### Test 6: Cast & Crew Draft

**Steps:**
1. Click "Cast & Crew" tab
2. Click "Import Cast & Crew JSON"
3. Paste this JSON:
```json
{
  "category": "cast_crew",
  "movie_id": "tmdb-550",
  "data": {
    "directors": [{"name": "David Fincher", "image": "url"}],
    "writers": [{"name": "Jim Uhls", "image": "url"}],
    "producers": [{"name": "Art Linson", "image": "url"}],
    "cast": [{"name": "Brad Pitt", "character": "Tyler Durden", "image": "url"}]
  }
}
```
4. Validate and import

**Expected Results:**
- ✅ Saved as draft
- ✅ Status badge shows "Draft Available"

### Test 7: Media Draft

**Steps:**
1. Click "Media" tab
2. Click "Import Media JSON"
3. Paste this JSON:
```json
{
  "category": "media",
  "movie_id": "tmdb-550",
  "data": {
    "poster_url": "https://example.com/poster.jpg",
    "backdrop_url": "https://example.com/backdrop.jpg"
  }
}
```
4. Validate and import

**Expected Results:**
- ✅ Saved as draft
- ✅ Status badge shows "Draft Available"

### Test 8: Streaming Draft

**Steps:**
1. Click "Streaming" tab
2. Click "Import Streaming JSON"
3. Paste this JSON:
```json
{
  "category": "streaming",
  "movie_id": "tmdb-550",
  "data": {
    "streaming_options": [
      {
        "provider": "Netflix",
        "region": "US",
        "type": "subscription",
        "url": "https://netflix.com/watch/..."
      }
    ]
  }
}
```
4. Validate and import

**Expected Results:**
- ✅ Saved as draft
- ✅ Status badge shows "Draft Available"

### Test 9: Basic Info Draft

**Steps:**
1. Click "Basic Info" tab
2. Click "Import Basic Info JSON"
3. Paste this JSON:
```json
{
  "category": "basic_info",
  "movie_id": "tmdb-550",
  "data": {
    "title": "Fight Club",
    "year": 1999,
    "runtime": 139,
    "rating": "R"
  }
}
```
4. Validate and import

**Expected Results:**
- ✅ Saved as draft
- ✅ Status badge shows "Draft Available"

### Test 10: Public API Filtering

**Steps:**
1. Publish trivia draft
2. Open browser console
3. Run:
```javascript
fetch('http://localhost:8000/api/v1/movies/tmdb-550')
  .then(r => r.json())
  .then(d => console.log(d.trivia))
```

**Expected Results:**
- ✅ Response includes published trivia
- ✅ Response does NOT include trivia_draft field

## ✅ Verification Checklist

- [ ] All 7 categories can be imported as drafts
- [ ] Draft status badge shows correctly
- [ ] Publish button works for all categories
- [ ] Discard button works with confirmation
- [ ] Status changes from Draft to Published
- [ ] Public API filters out draft data
- [ ] Error handling works (invalid JSON, etc.)
- [ ] Toast messages are clear and helpful
- [ ] UI is responsive and accessible

## 🐛 Troubleshooting

**Issue**: Import button doesn't appear
- **Solution**: Make sure you're on an existing movie (not "new")

**Issue**: Draft status doesn't load
- **Solution**: Check browser console for errors, refresh page

**Issue**: Publish fails
- **Solution**: Check backend logs for errors

**Issue**: Public API still shows draft data
- **Solution**: Restart backend server to reload code

