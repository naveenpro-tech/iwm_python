@echo off
echo ========================================
echo   Stopping Movie Madders Servers
echo ========================================
echo.

echo Killing Node.js processes (Next.js frontend)...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [OK] Node.js processes stopped
) else (
    echo [INFO] No Node.js processes found
)

echo.
echo Killing Python processes (FastAPI backend)...
taskkill /F /IM python.exe >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [OK] Python processes stopped
) else (
    echo [INFO] No Python processes found
)

echo.
echo ========================================
echo   All servers stopped!
echo ========================================
pause
