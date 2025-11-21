@echo off
REM Run Alembic Migrations for Movie Madders

echo.
echo ========================================
echo   Running Database Migrations
echo ========================================
echo.

cd apps\backend

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Running Alembic migrations...
python -m alembic upgrade head

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Database schema created
    echo ========================================
    echo.
    echo All tables have been created in moviemadders_local database.
    echo.
    echo Next steps:
    echo   1. Start backend: .\start-backend.bat
    echo   2. Start frontend: bun run dev
    echo   3. Optional - Seed data: python seed_database.py
    echo.
) else (
    echo.
    echo ========================================
    echo   Migration Failed
    echo ========================================
    echo.
    echo Please check the error above.
    echo.
)

cd ..\..
pause
