@echo off
REM Movie Madders - Complete Database Setup
REM This script will guide you through database creation and migration

echo.
echo ========================================
echo   Movie Madders Database Setup
echo ========================================
echo.

REM Check if .env exists
if not exist "apps\backend\.env" (
    echo Creating .env file...
    echo.
    
    set /p DB_PASSWORD="Enter your PostgreSQL password: "
    
    (
        echo DATABASE_URL=postgresql+asyncpg://postgres:!DB_PASSWORD!@localhost:5432/moviemadders_local
        echo JWT_SECRET_KEY=dev-secret-change-me
        echo JWT_ALGORITHM=HS256
        echo ACCESS_TOKEN_EXP_MINUTES=30
        echo REFRESH_TOKEN_EXP_DAYS=7
        echo CORS_ORIGINS=["http://localhost:3000"]
    ) > apps\backend\.env
    
    echo ✓ .env file created
    echo.
) else (
    echo .env file already exists
    echo.
)

echo.
echo ========================================
echo   Step 1: Create Database
echo ========================================
echo.
echo Please create the database manually using ONE of these methods:
echo.
echo METHOD 1 - pgAdmin (Easiest):
echo   1. Open pgAdmin 4
echo   2. Connect to PostgreSQL 16
echo   3. Right-click Databases -^> Create -^> Database
echo   4. Name: moviemadders_local
echo   5. Click Save
echo.
echo METHOD 2 - Command Line:
echo   Run: "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
echo   Then: CREATE DATABASE moviemadders_local;
echo.
set /p CONTINUE="Press Enter after you've created the database..."

echo.
echo ========================================
echo   Step 2: Run Migrations
echo ========================================
echo.

cd apps\backend
call venv\Scripts\activate.bat

echo Running Alembic migrations...
alembic upgrade head

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database schema created successfully!
    echo.
    echo ========================================
    echo   Setup Complete!
    echo ========================================
    echo.
    echo Your database is ready. You can now:
    echo   1. Start the backend: .\start-backend.bat
    echo   2. Start the frontend: bun run dev
    echo.
    echo Optional: Seed sample data with: python seed_database.py
    echo.
) else (
    echo.
    echo ✗ Migration failed. Please check the error above.
    echo.
)

cd ..\..
pause
