# 🗄️ Database Migration Alternatives (No Shell Access)

If you don't have Shell access on Render, here are your alternatives to run database migrations:

---

## ✅ **OPTION 1: Run Migrations from Local Machine (RECOMMENDED)**

This is the easiest and most reliable method.

### Step 1: Set Database URL Environment Variable

**On Windows (PowerShell):**
```powershell
$env:DATABASE_URL="postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"
```

**On Windows (Command Prompt):**
```cmd
set DATABASE_URL=postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db
```

**On Mac/Linux:**
```bash
export DATABASE_URL="postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"
```

### Step 2: Activate Python Virtual Environment

```bash
# Navigate to project root
cd c:\iwm\v142

# Activate venv (Windows)
venv\Scripts\activate

# Or if using different venv location
.\venv\Scripts\activate
```

### Step 3: Install Dependencies (if not already installed)

```bash
cd apps/backend
pip install -r requirements.txt
```

### Step 4: Run Migrations

```bash
# Make sure you're in apps/backend directory
cd apps/backend

# Run migrations
alembic upgrade head
```

### Expected Output:
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> abc123, Initial schema
INFO  [alembic.runtime.migration] Running upgrade abc123 -> def456, Add users table
...
```

### Step 5: Verify Migration Success

```bash
# Check current migration version
alembic current

# Should show the latest migration version
```

---

## ✅ **OPTION 2: Use Render CLI (Alternative)**

If you have Render CLI installed, you can use it to run migrations.

### Step 1: Install Render CLI

**On Windows (using Scoop):**
```powershell
scoop install render
```

**On Mac:**
```bash
brew install render
```

**Or download from:** https://render.com/docs/cli

### Step 2: Login to Render

```bash
render login
```

### Step 3: Connect to Database

```bash
render psql dpg-d450gci4d50c73ervgl0-a
```

This opens a PostgreSQL shell connected to your database.

### Step 4: Run Migrations from Local Machine

In a separate terminal (not the psql shell):

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"

# Navigate to backend
cd apps/backend

# Run migrations
alembic upgrade head
```

---

## ✅ **OPTION 3: Use Render Web Service Deploy Hook**

You can configure Render to run migrations automatically on each deployment.

### Step 1: Update render.yaml

Add a build command that runs migrations:

```yaml
services:
  - type: web
    name: moviemadders-api
    env: python
    buildCommand: |
      cd apps/backend
      pip install -r requirements.txt
      alembic upgrade head
    startCommand: cd apps/backend && hypercorn src.main:app --bind 0.0.0.0:$PORT
```

### Step 2: Commit and Push

```bash
git add render.yaml
git commit -m "feat: Auto-run migrations on deployment"
git push origin main
```

### Step 3: Trigger Redeploy

Go to Render Dashboard → Your Service → Click "Manual Deploy" → "Deploy latest commit"

**Note:** This will run migrations on every deployment automatically.

---

## ✅ **OPTION 4: Direct Database Connection with psql**

If you have PostgreSQL client installed locally.

### Step 1: Install PostgreSQL Client

**On Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Or use: `scoop install postgresql`

**On Mac:**
```bash
brew install postgresql
```

### Step 2: Connect to Database

```bash
psql "postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"
```

### Step 3: Verify Connection

```sql
-- List all tables
\dt

-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### Step 4: Run Migrations from Local Machine

In a separate terminal:

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"

# Run migrations
cd apps/backend
alembic upgrade head
```

---

## 🎯 **RECOMMENDED APPROACH FOR YOU**

Since you're on Windows and already have the project set up locally, **OPTION 1** is the best choice:

### Quick Steps:

1. **Open PowerShell in your project directory:**
   ```powershell
   cd c:\iwm\v142
   ```

2. **Set the database URL:**
   ```powershell
   $env:DATABASE_URL="postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"
   ```

3. **Activate your Python virtual environment:**
   ```powershell
   venv\Scripts\activate
   ```

4. **Navigate to backend and run migrations:**
   ```powershell
   cd apps\backend
   alembic upgrade head
   ```

5. **Verify success:**
   ```powershell
   alembic current
   ```

---

## 🔍 **Verify Migrations Were Successful**

After running migrations, verify they worked:

### Method 1: Check Alembic Version

```bash
alembic current
```

Should show the latest migration version (e.g., `abc123def456 (head)`).

### Method 2: Connect to Database and Check Tables

```bash
# Using Render CLI
render psql dpg-d450gci4d50c73ervgl0-a

# Or using psql directly
psql "postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"
```

Then run:
```sql
-- List all tables
\dt

-- Expected tables:
-- alembic_version
-- users
-- movies
-- reviews
-- collections
-- etc.
```

### Method 3: Test Backend API

```bash
# Try to create a user via API
curl -X POST https://iwm-python.onrender.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

If migrations worked, you should get a success response.

---

## ⚠️ **IMPORTANT SECURITY NOTE**

Your database credentials are now exposed in this conversation. After completing the migration, consider:

1. **Rotating the database password** in Render Dashboard
2. **Updating the DATABASE_URL** environment variable in Render
3. **Never committing database credentials** to Git

---

## 🐛 **Troubleshooting**

### Error: "psycopg2 not installed"

```bash
pip install psycopg2-binary
```

### Error: "Connection refused"

- Check that your IP is allowed (Render allows all IPs by default)
- Verify the database URL is correct
- Check that the database is running in Render Dashboard

### Error: "SSL required"

Add `?sslmode=require` to the connection string:

```
postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db?sslmode=require
```

### Error: "Permission denied"

Make sure you're using the correct database user and password from Render Dashboard.

---

## 📝 **Summary**

**Best Option:** Run migrations from your local machine (Option 1)

**Steps:**
1. Set `DATABASE_URL` environment variable
2. Activate Python venv
3. Run `alembic upgrade head`
4. Verify with `alembic current`

**Time:** 2-3 minutes  
**Difficulty:** Easy  
**No additional tools needed:** Uses your existing local setup

---

**Ready to proceed? Follow Option 1 above!** 🚀

