# Database Reset and End-to-End Testing Guide

**Date**: 2025-10-31  
**Status**: ✅ READY FOR TESTING  
**Database**: Completely reset with fresh schema (68 tables)

---

## ✅ **Phase 1: Database Reset - COMPLETED**

### What Was Done:
1. ✅ Stopped all servers
2. ✅ Dropped all tables and enum types from database
3. ✅ Ran Alembic migrations to recreate fresh schema
4. ✅ Verified 68 tables were created successfully
5. ✅ Started backend server (http://127.0.0.1:8000)
6. ✅ Started frontend server (http://localhost:3000)

### Database Status:
- **Tables Created**: 68
- **Data**: Completely empty (no users, no movies, nothing)
- **Schema**: Fresh from migrations
- **Enum Types**: Recreated

---

## 📋 **Phase 2: Create Test Accounts - MANUAL STEPS**

### Step 1: Create Admin Account

1. **Open browser** and navigate to: http://localhost:3000/signup

2. **Fill in the signup form:**
   - **Name**: `Admin User`
   - **Email**: `admin@iwm.com`
   - **Password**: `admin123`
   - **Confirm Password**: `admin123`

3. **Click "Sign Up"**

4. **You should be redirected to the home page** and logged in

5. **Make this user an admin** (run this SQL in database):
   ```sql
   -- Connect to database
   psql -U postgres -d iwm_db -p 5433

   -- Find the user ID
   SELECT id, email, name FROM users WHERE email = 'admin@iwm.com';

   -- Create admin_user_meta with admin role
   INSERT INTO admin_user_meta (user_id, email, roles, status)
   VALUES (
       (SELECT id FROM users WHERE email = 'admin@iwm.com'),
       'admin@iwm.com',
       '["Admin"]'::jsonb,
       'Active'
   );
   ```

6. **Verify admin access:**
   - Log out and log back in as `admin@iwm.com`
   - Navigate to http://localhost:3000/admin
   - You should see the admin dashboard

### Step 2: Create Regular User Account

1. **Log out** from admin account

2. **Navigate to**: http://localhost:3000/signup

3. **Fill in the signup form:**
   - **Name**: `Test User`
   - **Email**: `user@iwm.com`
   - **Password**: `user123`
   - **Confirm Password**: `user123`

4. **Click "Sign Up"**

5. **You should be redirected to the home page** and logged in

6. **Verify regular user cannot access admin:**
   - Try to navigate to http://localhost:3000/admin
   - You should be redirected or see "Access Denied"

---

## 🎬 **Phase 3: Test Movie Creation via JSON Import**

### Step 1: Login as Admin

1. **Navigate to**: http://localhost:3000/login
2. **Login with**:
   - Email: `admin@iwm.com`
   - Password: `admin123`

### Step 2: Navigate to Movie Creation Page

1. **Go to**: http://localhost:3000/admin/movies/new
2. **You should see** the "Add New Movie" form with 7 tabs

### Step 3: Import Movie via JSON

1. **Click** the "Import via JSON" button (should be visible at the top)

2. **Click** the "Paste/Upload JSON" tab in the modal

3. **Paste this JSON** into the text area:

```json
{
  "title": "RRR",
  "originalTitle": "రౌద్రం రణం రుధిరం",
  "synopsis": "Set in the 1920s, RRR is a fictional story about two legendary revolutionaries, Alluri Sitarama Raju and Komaram Bheem, who embark on a journey away from home to fight against British colonialism and the Nizam of Hyderabad.",
  "releaseDate": "2022-03-25",
  "runtime": 187,
  "language": "Telugu",
  "genres": ["Action", "Drama", "Adventure"],
  "directors": [{"name": "S. S. Rajamouli", "role": "Director"}],
  "cast": [
    {"name": "N. T. Rama Rao Jr.", "role": "Komaram Bheem"},
    {"name": "Ram Charan", "role": "Alluri Sitarama Raju"},
    {"name": "Alia Bhatt", "role": "Sita"},
    {"name": "Ajay Devgn", "role": "A. Rama Raju"}
  ],
  "crew": [
    {"name": "M. M. Keeravani", "role": "Music Director"},
    {"name": "K. K. Senthil Kumar", "role": "Cinematographer"}
  ],
  "budget": 5500000000,
  "boxOffice": 12000000000,
  "productionCompanies": ["DVV Entertainment"],
  "countriesOfOrigin": ["India"],
  "tagline": "Rise. Roar. Revolt.",
  "keywords": ["freedom", "friendship", "revolution", "colonialism", "action epic"],
  "aspectRatio": "2.39:1",
  "soundMix": ["Dolby Atmos", "Dolby Digital", "DTS"],
  "camera": "Arri Alexa LF, Cooke Anamorphic/i Lenses",
  "importedFrom": "JSON"
}
```

4. **Click "Validate JSON"**
   - You should see: "✅ Validation passed! No errors found."

5. **Click "Import Movie Data"**
   - The modal should close
   - All form fields should be populated with the imported data

### Step 4: Publish Movie to Backend

1. **Review the populated form** - all fields should have data from the JSON

2. **Click "Publish to Backend"** button

3. **Expected behavior:**
   - ✅ No duplicate warning (database is empty)
   - ✅ Success toast: "Published Successfully: Imported: 1, Updated: 0"
   - ✅ 1-second delay
   - ✅ Redirect to movie page: `/movies/manual-rrr-{timestamp}`

4. **Verify movie page loads:**
   - Movie title should be "RRR"
   - All imported data should be visible
   - No errors in console

---

## 🌐 **Phase 4: Verify Public Visibility**

### Step 1: Check Movies List Page

1. **Navigate to**: http://localhost:3000/movies

2. **Expected:**
   - You should see the "RRR" movie in the list
   - Movie card should show title, poster (if any), and basic info

3. **Click on the movie card**
   - Should navigate to the movie details page
   - All data should be visible

### Step 2: Verify as Logged-In Admin

1. **While logged in as admin**, navigate to movie page
2. **Verify** you can see all movie details
3. **Check** if there are any admin-only features visible

---

## 👤 **Phase 5: Test Regular User Access**

### Step 1: Logout and Login as Regular User

1. **Logout** from admin account
2. **Navigate to**: http://localhost:3000/login
3. **Login with**:
   - Email: `user@iwm.com`
   - Password: `user123`

### Step 2: Verify Movie Visibility

1. **Navigate to**: http://localhost:3000/movies
2. **Verify** the "RRR" movie is visible in the list
3. **Click on the movie**
4. **Verify** movie details page loads correctly

### Step 3: Verify Admin Access Denied

1. **Try to navigate to**: http://localhost:3000/admin
2. **Expected**: You should be redirected or see "Access Denied"
3. **Try to navigate to**: http://localhost:3000/admin/movies/new
4. **Expected**: You should be redirected or see "Access Denied"

---

## ✅ **Expected Outcomes - Checklist**

### Database Reset
- [x] Database completely reset with fresh schema
- [x] 68 tables created successfully
- [x] All enum types recreated
- [x] No data in database

### Test Accounts
- [ ] Admin account created (`admin@iwm.com`)
- [ ] Admin can log in successfully
- [ ] Admin can access `/admin` routes
- [ ] Regular user account created (`user@iwm.com`)
- [ ] Regular user can log in successfully
- [ ] Regular user CANNOT access `/admin` routes

### Movie Creation
- [ ] Admin can access `/admin/movies/new`
- [ ] "Import via JSON" button is visible
- [ ] JSON import modal opens
- [ ] JSON validation works
- [ ] Form fields populate from JSON
- [ ] "Publish to Backend" works
- [ ] No duplicate warning (fresh database)
- [ ] Success toast appears
- [ ] Redirect to movie page works
- [ ] Movie page loads successfully

### Public Visibility
- [ ] Movie visible on `/movies` page
- [ ] Movie card displays correctly
- [ ] Movie details page loads
- [ ] All imported data is visible

### Regular User Access
- [ ] Regular user can see movies list
- [ ] Regular user can view movie details
- [ ] Regular user CANNOT access admin panel
- [ ] Regular user CANNOT create movies

---

## 🐛 **Troubleshooting**

### Issue: Cannot create admin account
**Solution**: Run the SQL command to insert admin_user_meta manually (see Phase 2, Step 1, item 5)

### Issue: Movie not saving
**Check**:
1. Backend server is running (http://127.0.0.1:8000)
2. Frontend server is running (http://localhost:3000)
3. Check backend logs for errors
4. Check browser console for errors

### Issue: Duplicate warning appears
**Reason**: Movie with same title already exists
**Solution**: This is expected behavior if you try to import the same movie twice

### Issue: Movie page shows 404
**Check**:
1. Movie was actually saved (check backend logs)
2. Movie ID format is correct (`manual-{slug}-{timestamp}`)
3. Backend GET endpoint is working

### Issue: Regular user can access admin panel
**Problem**: Admin middleware not working
**Solution**: Check `middleware.ts` - `/admin` should NOT be in `publicRoutes`

---

## 📊 **Database Verification Commands**

```sql
-- Connect to database
psql -U postgres -d iwm_db -p 5433

-- Check users
SELECT id, email, name FROM users ORDER BY id;

-- Check admin users
SELECT u.id, u.email, u.name, a.roles, a.status
FROM users u
LEFT JOIN admin_user_meta a ON u.id = a.user_id
ORDER BY u.id;

-- Check movies
SELECT external_id, title, status, created_at
FROM movies
ORDER BY created_at DESC
LIMIT 10;

-- Count tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
```

---

## 🚀 **Quick Start Commands**

```bash
# Backend server (if not running)
cd apps/backend
.venv\Scripts\python -m hypercorn src.main:app --reload --bind 127.0.0.1:8000

# Frontend server (if not running)
bun run dev

# Reset database again (if needed)
cd apps/backend
.venv\Scripts\python reset_database.py
```

---

**Status**: ✅ **READY FOR MANUAL TESTING**

Both servers are running. Database is reset. Follow the steps above to complete the end-to-end test.

