# Manual Testing - Draft/Publish Workflow

## ✅ Server Status

**Backend:** ✅ Running on http://127.0.0.1:8000
**Frontend:** ✅ Running on http://localhost:3000

## 🔐 Login Credentials

- **Email:** admin@iwm.com
- **Password:** AdminPassword123!

## 📋 Test Steps

### Step 1: Login
1. Open browser to http://localhost:3000/login
2. Enter email: `admin@iwm.com`
3. Enter password: `AdminPassword123!`
4. Click "Sign In"
5. **Expected:** Redirected to dashboard

### Step 2: Navigate to Movie Detail
1. Click "Admin" in navigation
2. Click "Movies" 
3. Search for "Fight Club" or navigate to tmdb-550
4. Click on Fight Club movie
5. **Expected:** Movie detail page loads with tabs

### Step 3: Test Trivia Import as Draft
1. Click "Trivia" tab
2. Click "Import Trivia JSON" button
3. Paste this JSON:
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
4. Click "Validate"
5. Click "Import"
6. **Expected Results:**
   - ✅ Toast: "Import Successful - Saved as Draft"
   - ✅ Modal closes
   - ✅ "Draft Available" badge appears
   - ✅ "Publish Draft" button visible
   - ✅ "Discard Draft" button visible

### Step 4: Publish Draft
1. Click "Publish Draft" button
2. **Expected Results:**
   - ✅ Toast: "Published Successfully"
   - ✅ Status badge changes to "Published"
   - ✅ Buttons become disabled

### Step 5: Test Timeline Draft
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
        "description": "Filming started"
      }
    ]
  }
}
```
4. Validate and import
5. **Expected:** "Draft Available" badge appears

### Step 6: Test Discard Draft
1. Click "Discard Draft" button
2. Confirm in dialog
3. **Expected Results:**
   - ✅ Toast: "Draft Discarded"
   - ✅ Status badge shows "No Data"
   - ✅ Buttons disabled

### Step 7: Test Awards Draft
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
5. **Expected:** "Draft Available" badge appears

### Step 8: Test Cast & Crew Draft
1. Click "Cast & Crew" tab
2. Click "Import Cast & Crew JSON"
3. Paste this JSON:
```json
{
  "category": "cast_crew",
  "movie_id": "tmdb-550",
  "data": {
    "directors": [{"name": "David Fincher"}],
    "writers": [{"name": "Jim Uhls"}],
    "producers": [{"name": "Art Linson"}],
    "cast": [{"name": "Brad Pitt", "character": "Tyler Durden"}]
  }
}
```
4. Validate and import
5. **Expected:** "Draft Available" badge appears

### Step 9: Test Media Draft
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
5. **Expected:** "Draft Available" badge appears

### Step 10: Test Streaming Draft
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
        "type": "subscription"
      }
    ]
  }
}
```
4. Validate and import
5. **Expected:** "Draft Available" badge appears

### Step 11: Test Basic Info Draft
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
5. **Expected:** "Draft Available" badge appears

## ✅ Verification Checklist

- [ ] All 7 categories can import as draft
- [ ] Draft status badge shows correctly
- [ ] Publish button works
- [ ] Discard button works with confirmation
- [ ] Status changes from Draft to Published
- [ ] Toast messages are clear
- [ ] UI is responsive
- [ ] No console errors

## 🐛 Issues Found

(Document any issues here)

## 📝 Notes

- Browser: Open DevTools (F12) to check for errors
- Check backend logs for API errors
- Clear browser cache if seeing stale data

