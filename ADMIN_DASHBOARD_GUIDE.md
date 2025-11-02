# 🎬 ADMIN DASHBOARD - STEP-BY-STEP GUIDE TO CREATE A MOVIE

**Date:** 2025-11-01  
**Status:** ✅ Servers Running - Ready to Use

---

## 📋 **PREREQUISITES**

✅ Backend server running on http://localhost:8000  
✅ Frontend server running on http://localhost:3000  
✅ Admin credentials ready:
- **Email:** admin@iwm.com
- **Password:** AdminPassword123!

---

## 🚀 **STEP-BY-STEP GUIDE**

### **STEP 1: Login to Admin Panel**

1. **Open your browser** (preferably in Incognito/Private mode)

2. **Navigate to the login page:**
   ```
   http://localhost:3000/login
   ```

3. **Enter admin credentials:**
   - Email: `admin@iwm.com`
   - Password: `AdminPassword123!`

4. **Click "Sign In" button**

5. **Verify successful login:**
   - You should be redirected to: `http://localhost:3000/dashboard`
   - You should see your name "IWM Admin" in the top right corner
   - You should see an "Admin" badge or "Admin Panel" link in the navigation

---

### **STEP 2: Access Movie Management**

1. **Navigate to Admin Dashboard:**
   ```
   http://localhost:3000/admin
   ```
   OR click "Admin Panel" in the navigation menu

2. **Click on "Movies" in the sidebar**
   - This will take you to: `http://localhost:3000/admin/movies`

3. **You should see:**
   - "Movie Management" heading
   - Search bar and filters
   - Import buttons (API Import, JSON Import, Export)
   - Empty table (no movies yet)

---

### **STEP 3: Import a Movie via JSON**

Since there's no direct "Create New Movie" button, we'll use the **JSON Import** feature:

1. **Click the "JSON Import" button**
   - Located in the header area of the movie management page

2. **A modal will open with a JSON editor**

3. **Click "Insert Full Template" button** (if available)
   OR **Copy and paste this JSON template:**

```json
[
  {
    "external_id": "manual-test-001",
    "title": "The Matrix",
    "tagline": "Welcome to the Real World",
    "year": "1999",
    "release_date": "1999-03-31",
    "runtime": 136,
    "rating": "R",
    "siddu_score": 9.2,
    "critics_score": 88.0,
    "imdb_rating": 8.7,
    "rotten_tomatoes_score": 88.0,
    "language": "EN",
    "country": "United States",
    "overview": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    "poster_url": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "backdrop_url": "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    "budget": 63000000,
    "revenue": 467222728,
    "status": "Released",
    "genres": ["Action", "Sci-Fi"],
    "directors": [
      { "name": "Lana Wachowski", "image": null },
      { "name": "Lilly Wachowski", "image": null }
    ],
    "writers": [
      { "name": "Lana Wachowski", "image": null },
      { "name": "Lilly Wachowski", "image": null }
    ],
    "producers": [
      { "name": "Joel Silver", "image": null }
    ],
    "cast": [
      { "name": "Keanu Reeves", "character": "Neo", "image": null },
      { "name": "Laurence Fishburne", "character": "Morpheus", "image": null },
      { "name": "Carrie-Anne Moss", "character": "Trinity", "image": null },
      { "name": "Hugo Weaving", "character": "Agent Smith", "image": null }
    ],
    "streaming": [
      { "platform": "Netflix", "region": "US", "type": "subscription", "price": null, "quality": "HD", "url": "https://netflix.com" }
    ],
    "awards": [
      { "name": "Academy Awards", "year": 2000, "category": "Best Visual Effects", "status": "Winner" },
      { "name": "Academy Awards", "year": 2000, "category": "Best Film Editing", "status": "Winner" }
    ]
  }
]
```

4. **Click "Import" or "Submit" button**

5. **Wait for the import to complete**
   - You should see a success message
   - The modal should close
   - The movie list should refresh

---

### **STEP 4: Verify Movie Creation**

1. **Check the movie list:**
   - You should now see "The Matrix" in the table
   - It should show:
     - Title: The Matrix
     - Year: 1999
     - Status: Released
     - Siddu Score: 9.2

2. **Click on the movie title** to view details (if available)

3. **Success!** You've created your first movie via the admin dashboard!

---

## 🎯 **ALTERNATIVE: Create a Simple Test Movie**

If you want to create a simpler test movie, use this minimal JSON:

```json
[
  {
    "external_id": "test-movie-001",
    "title": "Test Movie",
    "year": "2025",
    "genres": ["Action"],
    "overview": "This is a test movie created via admin dashboard",
    "status": "Draft"
  }
]
```

---

## 📝 **REQUIRED FIELDS FOR MOVIE IMPORT**

Based on the backend API, these fields are **required**:

- ✅ `external_id` - Unique identifier (e.g., "manual-001")
- ✅ `title` - Movie title
- ✅ `year` - Release year (string, e.g., "2025")

**Optional but recommended:**
- `overview` - Plot description
- `genres` - Array of genres
- `status` - "Draft" or "Released"
- `poster_url` - Poster image URL
- `directors` - Array of director objects
- `cast` - Array of cast member objects

---

## 🔍 **TROUBLESHOOTING**

### **Problem: Can't see "JSON Import" button**

**Solution:**
1. Make sure you're on the correct page: `http://localhost:3000/admin/movies`
2. Look for buttons in the header area (near search bar)
3. Try refreshing the page

---

### **Problem: Import fails with error**

**Solution:**
1. Check that your JSON is valid (use https://jsonlint.com/)
2. Make sure `external_id` is unique
3. Check browser console (F12) for error details
4. Verify backend server is running

---

### **Problem: Movie doesn't appear after import**

**Solution:**
1. Refresh the page
2. Check if there are any filters applied
3. Look at the pagination controls
4. Check browser console for errors

---

### **Problem: "Access Denied" or redirected to dashboard**

**Solution:**
1. Verify you're logged in as admin
2. Check that admin role is enabled (run test_admin_login.py)
3. Clear browser cookies and login again
4. Use incognito/private browser window

---

## 🎬 **NEXT STEPS AFTER CREATING A MOVIE**

1. **View the movie details:**
   - Click on the movie title in the table
   - Navigate to: `http://localhost:3000/admin/movies/[id]`

2. **Edit movie information:**
   - Update streaming links
   - Add release dates
   - Modify genres and cast

3. **Publish the movie:**
   - Select the movie checkbox
   - Click "Publish Selected" button
   - Movie will be visible to public users

4. **Feature the movie:**
   - Select the movie checkbox
   - Click "Feature Selected" button
   - Movie will appear on homepage

---

## 📊 **ADMIN DASHBOARD FEATURES**

### **Movie Management** (`/admin/movies`)
- ✅ View all movies in table or grid view
- ✅ Search and filter movies
- ✅ Import movies via JSON or API
- ✅ Export movies to JSON
- ✅ Bulk operations (publish, feature, delete)
- ✅ Manage streaming links
- ✅ Update release dates

### **Other Admin Sections**
- `/admin/users` - User management
- `/admin/critics` - Critic applications
- `/admin/moderation` - Content moderation
- `/admin/analytics` - Analytics dashboard
- `/admin/system` - System settings

---

## ✅ **SUCCESS CHECKLIST**

After completing this guide, you should have:

- [ ] Successfully logged in as admin
- [ ] Accessed the admin dashboard
- [ ] Navigated to movie management page
- [ ] Imported a movie via JSON
- [ ] Verified the movie appears in the list
- [ ] (Optional) Viewed movie details
- [ ] (Optional) Published the movie

---

## 💡 **TIPS**

1. **Use Incognito Mode:** Always test in incognito/private browser to avoid cached sessions

2. **Check Browser Console:** Press F12 to open developer tools and check for errors

3. **Verify Backend:** Make sure backend server is running and accessible at http://localhost:8000/docs

4. **Test with Simple Data First:** Start with a minimal JSON before adding complex data

5. **Save Your JSON Templates:** Keep successful JSON templates for future use

---

## 🔗 **QUICK LINKS**

- **Login:** http://localhost:3000/login
- **Admin Dashboard:** http://localhost:3000/admin
- **Movie Management:** http://localhost:3000/admin/movies
- **Movie Import:** http://localhost:3000/admin/movies/import
- **Backend API Docs:** http://localhost:8000/docs

---

**Generated:** 2025-11-01  
**Status:** ✅ Ready to Use  
**Admin Email:** admin@iwm.com  
**Admin Password:** AdminPassword123!

