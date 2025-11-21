# Movie Madders Database Setup Guide

## Current PostgreSQL Status
You have 2 PostgreSQL services running:
- PostgreSQL 16 (Running)
- PostgreSQL 18 (Running)

## Steps to Create Database

### Option 1: Using pgAdmin (Recommended - GUI Method)
1. Open **pgAdmin 4** (should be installed with PostgreSQL)
2. Connect to PostgreSQL 16 server
3. Right-click on "Databases" → "Create" → "Database"
4. Enter database name: `moviemadders_local`
5. Click "Save"

### Option 2: Using Command Line (with password)
1. Open a new PowerShell terminal
2. Run this command (you'll be prompted for password):
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
   ```
3. Once connected, run:
   ```sql
   CREATE DATABASE moviemadders_local;
   \q
   ```

### Option 3: Using Environment Variable for Password
1. Set the password as environment variable (for current session):
   ```powershell
   $env:PGPASSWORD = "your_postgres_password"
   ```
2. Then run:
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE moviemadders_local;"
   ```

## After Creating Database

### Step 1: Create .env file
Create `apps/backend/.env` with this content:
```
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/moviemadders_local
JWT_SECRET_KEY=dev-secret-change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXP_MINUTES=30
REFRESH_TOKEN_EXP_DAYS=7
CORS_ORIGINS=["http://localhost:3000"]
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### Step 2: Run Database Migrations
```powershell
cd apps\backend
.\venv\Scripts\activate
alembic upgrade head
```

This will create all the tables and schema in your database.

### Step 3: (Optional) Seed the Database
```powershell
python seed_database.py
```

## Verification
After migrations, you can verify the database was created:
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d moviemadders_local -c "\dt"
```

This will list all tables in the database.
