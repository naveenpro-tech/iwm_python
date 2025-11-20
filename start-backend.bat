
@echo off
REM Movie Madders Backend Server Start Script (Windows)
REM This script activates the virtual environment and starts the FastAPI backend server

echo.
echo 🚀 Starting Movie Madders Backend Server...
echo.

REM Check if virtual environment exists
if exist "apps\backend\venv\Scripts\activate.bat" (
    set VENV_PATH=apps\backend\venv
) else if exist "apps\backend\.venv\Scripts\activate.bat" (
    set VENV_PATH=apps\backend\.venv
) else if exist ".venv\Scripts\activate.bat" (
    set VENV_PATH=.venv
) else (
    echo ❌ Error: Virtual environment not found!
    echo    Expected locations:
    echo    - apps\backend\venv
    echo    - apps\backend\.venv
    echo    - .venv
    echo.
    echo    Please run: cd apps\backend ^&^& python -m venv venv
    exit /b 1
)

echo ✓ Found virtual environment at: %VENV_PATH%

REM Activate virtual environment
echo ✓ Activating virtual environment...
call "%VENV_PATH%\Scripts\activate.bat"

REM Check if hypercorn is installed
where hypercorn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Hypercorn not found in virtual environment!
    echo    Please run: pip install -r apps\backend\requirements.txt
    exit /b 1
)

echo ✓ Starting FastAPI backend server...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   🌐 Server running at: http://localhost:8000
echo   📚 API docs available at: http://localhost:8000/docs
echo   📖 ReDoc available at: http://localhost:8000/redoc
echo   🔧 OpenAPI schema: http://localhost:8000/openapi.json
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
hypercorn apps.backend.src.main:app --bind 0.0.0.0:8000 --worker-class asyncio --reload

