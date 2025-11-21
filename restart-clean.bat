@echo off
echo ==========================================
echo   CLEAN RESTART - Movie Madders
echo ==========================================
echo.

echo [Step 1] Killing all servers...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
taskkill /F /IM bun.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [Step 2] Verifying all processes stopped...
tasklist | findstr /I "python.exe node.exe bun.exe"
IF %ERRORLEVEL% EQU 0 (
    echo WARNING: Some processes still running. Trying again...
    timeout /t 2 /nobreak >nul
    taskkill /F /IM python.exe 2>nul
    taskkill /F /IM node.exe 2>nul
    taskkill /F /IM bun.exe 2>nul
    timeout /t 2 /nobreak >nul
) ELSE (
    echo OK: All processes stopped.
)

echo.
echo [Step 3] Waiting for ports to release...
timeout /t 3 /nobreak >nul

echo.
echo [Step 4] Starting all servers...
echo.
call start_all.bat
