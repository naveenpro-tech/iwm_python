@echo off
echo ==========================================
echo   Movie Madders Development Starter
echo ==========================================

echo.
echo [1/2] Starting Backend Server...
start "Movie Madders Backend" cmd /k "cd backend && start.bat"

echo.
echo [2/2] Starting Frontend Server...
cd frontend

IF NOT EXIST "node_modules" (
    echo Node modules not found. Installing dependencies...
    call bun install
)

echo.
echo Starting Next.js Dev Server...
call bun run dev
