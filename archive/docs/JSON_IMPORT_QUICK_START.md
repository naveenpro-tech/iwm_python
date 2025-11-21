# JSON Import - Quick Start Guide

**⏱️ Time to add a movie: 2 minutes**

---

## 🚀 Quick Start (3 Steps)

### Step 1: Open Import Modal
1. Go to `/admin/movies/new`
2. Click **"Import via JSON"** button

### Step 2: Generate Movie Data
1. Enter movie name (e.g., "Interstellar")
2. Click **"Copy Movie Request Prompt"**
3. Paste into ChatGPT or Claude
4. Copy the JSON response

### Step 3: Import
1. Switch to **"Paste/Upload JSON"** tab
2. Paste the JSON
3. Click **"Validate"** (optional but recommended)
4. Click **"Import Movie Data"**
5. Review and save!

---

## 💡 Example Prompt

**You enter**: "Interstellar"

**Prompt generated**:
```
Generate a complete movie JSON object for "Interstellar" following this EXACT structure. 
Fill in ALL fields with accurate, real data for the movie. Do not omit any fields.

IMPORTANT INSTRUCTIONS:
1. Use real, accurate data for "Interstellar"
2. Include ALL fields shown in the template
3. For cast/crew, include at least 5 cast members and 5 crew members
4. For streaming links, include current availability (2025 data)
5. For awards, include all major wins and nominations
6. For trivia, include 3-5 interesting facts
7. For timeline, include 4-6 key events
8. Use proper date format: YYYY-MM-DD
9. Ensure all URLs are valid (use TMDB image URLs if available)
10. Return ONLY the JSON object, no additional text

JSON TEMPLATE:
{
  "title": "Inception",
  "originalTitle": "Inception",
  "synopsis": "A thief who steals corporate secrets...",
  ...
}

Now generate the complete JSON for "Interstellar".
```

---

## ✅ What Gets Imported

### All 7 Tabs Populated:
- ✅ **Basic Info** - Title, synopsis, genres, languages, etc.
- ✅ **Media** - Poster, backdrop, gallery images, trailer
- ✅ **Cast & Crew** - Actors and production team
- ✅ **Streaming** - Where to watch online
- ✅ **Awards** - Oscars, Golden Globes, etc.
- ✅ **Trivia** - Fun facts and behind-the-scenes
- ✅ **Timeline** - Production milestones

### Total Fields: 44+ fields auto-populated!

---

## 🎯 Tips for Best Results

### For ChatGPT/Claude:
1. **Use the full prompt** - Don't shorten it
2. **Specify the movie clearly** - Use full title and year if ambiguous
3. **Ask for corrections** - If data looks wrong, ask the LLM to fix it
4. **Validate before import** - Always click "Validate" to catch errors

### For Manual JSON:
1. **Copy the template** - Click "Copy Template Only"
2. **Edit carefully** - Watch for commas and quotes
3. **Use a JSON validator** - Paste into jsonlint.com first
4. **Start small** - Fill required fields first, add details later

---

## ⚠️ Common Errors

### Error: "Title is required"
**Fix**: Add `"title": "Movie Name"` to your JSON

### Error: "Invalid date format"
**Fix**: Use YYYY-MM-DD format (e.g., "2014-11-07")

### Error: "Invalid genre"
**Fix**: Use exact genre names from the list:
- Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Sci-Fi, Sport, Thriller, War, Western, TV Movie

### Error: "Invalid status"
**Fix**: Use one of: upcoming, released, archived, draft, in-production, post-production

### Error: "Invalid JSON syntax"
**Fix**: Check for:
- Missing commas between fields
- Missing quotes around strings
- Unclosed brackets or braces
- Extra commas at end of arrays

---

## 📋 Minimal Valid JSON

If you just want to test, here's the absolute minimum:

```json
{
  "title": "Test Movie",
  "status": "draft",
  "isPublished": false,
  "isArchived": false,
  "genres": []
}
```

This will import successfully but you'll need to fill in the rest manually.

---

## 🎬 Example: Complete Movie JSON

Here's a real example for "The Matrix":

```json
{
  "title": "The Matrix",
  "originalTitle": "The Matrix",
  "synopsis": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  "releaseDate": "1999-03-31",
  "runtime": 136,
  "status": "released",
  "genres": ["Action", "Sci-Fi"],
  "languages": ["English"],
  "sidduScore": 8.7,
  "certification": "R",
  "poster": "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  "backdrop": "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
  "cast": [
    {
      "id": "cast-1",
      "name": "Keanu Reeves",
      "character": "Neo",
      "image": "https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg",
      "order": 1
    },
    {
      "id": "cast-2",
      "name": "Laurence Fishburne",
      "character": "Morpheus",
      "image": "https://image.tmdb.org/t/p/w500/8suOhUmPbfKqDQ17jQ1Gy0mI3P4.jpg",
      "order": 2
    }
  ],
  "crew": [
    {
      "id": "crew-1",
      "name": "Lana Wachowski",
      "role": "Director",
      "department": "Directing",
      "image": "https://image.tmdb.org/t/p/w500/5VqPTjqzBJRqWaGXDxdJYJqo2Lf.jpg"
    },
    {
      "id": "crew-2",
      "name": "Lilly Wachowski",
      "role": "Director",
      "department": "Directing",
      "image": "https://image.tmdb.org/t/p/w500/5VqPTjqzBJRqWaGXDxdJYJqo2Lf.jpg"
    }
  ],
  "streamingLinks": [
    {
      "id": "stream-1",
      "provider": "HBO Max",
      "region": "US",
      "url": "https://www.hbomax.com/the-matrix",
      "type": "subscription",
      "quality": "4K",
      "verified": true
    }
  ],
  "awards": [
    {
      "id": "award-1",
      "name": "Academy Awards",
      "year": 2000,
      "category": "Best Visual Effects",
      "status": "Winner"
    }
  ],
  "trivia": [
    {
      "id": "trivia-1",
      "question": "What color pill does Neo take?",
      "category": "Cultural Reference",
      "answer": "The red pill",
      "explanation": "Neo chooses the red pill to learn the truth about the Matrix, creating one of cinema's most iconic moments."
    }
  ],
  "timelineEvents": [
    {
      "id": "timeline-1",
      "title": "World Premiere",
      "description": "The Matrix premieres in Los Angeles",
      "date": "1999-03-24",
      "category": "Premiere"
    }
  ],
  "isPublished": true,
  "isArchived": false,
  "budget": 63000000,
  "boxOffice": 467222728,
  "tagline": "Welcome to the Real World",
  "importedFrom": "JSON"
}
```

---

## 🔍 Validation Checklist

Before clicking "Import", make sure:

- [ ] Title is filled
- [ ] Status is set (draft, released, etc.)
- [ ] Dates are in YYYY-MM-DD format
- [ ] Genres are from the valid list
- [ ] Cast members have name AND character
- [ ] Crew members have name, role, AND department
- [ ] Streaming links have provider, url, type, AND quality
- [ ] Awards have name, year, category, AND status
- [ ] Trivia has question, answer, AND category
- [ ] Timeline events have title, date, AND category

---

## 🆘 Need Help?

### Validation Failed?
1. Click "Validate" to see specific errors
2. Fix each error listed
3. Click "Validate" again
4. Repeat until validation passes

### LLM Generated Bad Data?
1. Ask the LLM to fix specific fields
2. Or manually edit the JSON
3. Validate before importing

### Import Successful but Data Looks Wrong?
1. Review each tab manually
2. Edit fields directly in the form
3. Save when ready

---

## 📚 More Information

- **Full Documentation**: See `docs/JSON_IMPORT_FEATURE.md`
- **Form Structure**: See `docs/admin-movie-creation-form-structure.md`
- **API Reference**: See `lib/utils/movie-json-template.ts`

---

**Happy Importing! 🎬**

