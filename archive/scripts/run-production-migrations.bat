@echo off
REM Batch script to run database migrations on Render PostgreSQL from local machine
REM Usage: scripts\run-production-migrations.bat

echo ========================================
echo Movie Madders - Production DB Migration
echo ========================================
echo.

REM Set the production database URL
set DATABASE_URL=postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db

echo Setting DATABASE_URL environment variable...
echo [OK] DATABASE_URL set
echo.

REM Check if we're in the right directory
if not exist "apps\backend\alembic.ini" (
    echo [ERROR] Please run this script from the project root directory
    echo Example: cd c:\iwm\v142
    pause
    exit /b 1
)

echo Checking Python virtual environment...

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Python virtual environment not found at .\venv
    echo Please create a virtual environment first:
    echo   python -m venv venv
    pause
    exit /b 1
)

echo [OK] Virtual environment found
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo [OK] Virtual environment activated
echo.

REM Navigate to backend directory
echo Navigating to backend directory...
cd apps\backend

echo [OK] In backend directory
echo.

REM Run migrations
echo ========================================
echo Running Database Migrations...
echo ========================================
echo.

alembic upgrade head

echo.
echo ========================================
echo Checking Migration Status...
echo ========================================
echo.

alembic current

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.

echo Next steps:
echo 1. Verify migrations in Render Dashboard
echo 2. Test your application at https://iwm-python.vercel.app/
echo 3. Try signing up for a new account
echo.

REM Return to project root
cd ..\..

echo Done! Press any key to exit...
pause >nul

