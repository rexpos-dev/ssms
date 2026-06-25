@echo off
setlocal enabledelayedexpansion

REM Diagnostic script for "Failed to fetch" errors

echo.
echo ============================================
echo    Fetch Error Diagnostic Tool
echo ============================================
echo.

REM Check 1: Is MySQL running?
echo [1] Checking MySQL connection...
mysql -u root -p123700 -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] MySQL is not running
    echo Fix: Run "net start MySQL80" in Command Prompt (Admin)
    echo.
) else (
    echo [OK] MySQL is running
)

REM Check 2: Does database exist?
echo [2] Checking if database 'ssms_sql' exists...
mysql -u root -p123700 -e "USE ssms_sql; SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Database 'ssms_sql' not found
    echo Fix: Run "mysql -u root -p123700 < database\schema.sql"
    echo.
) else (
    echo [OK] Database 'ssms_sql' exists
)

REM Check 3: Is backend running?
echo [3] Checking if backend is running on port 8080...
timeout /t 1 /nobreak >nul
curl -s http://localhost:8080/api/health | find /I "healthy" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Backend is NOT running
    echo Fix: Open Terminal and run:
    echo   cd "D:\School Management System V2\SMS\backend"
    echo   npm run dev
    echo.
    echo Waiting for backend to start in 3 seconds...
    echo.
) else (
    echo [OK] Backend is running on port 8080
)

REM Check 4: Is frontend running?
echo [4] Checking if frontend is running on port 3000...
timeout /t 1 /nobreak >nul
curl -s http://localhost:3000 | find /I "DOCTYPE" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Frontend is NOT running
    echo Fix: Open new Terminal and run:
    echo   cd "D:\School Management System V2\SMS\app"
    echo   npm run dev
    echo.
) else (
    echo [OK] Frontend is running on port 3000
)

REM Summary
echo.
echo ============================================
echo    Diagnostic Complete
echo ============================================
echo.
echo Quick Fixes:
echo.
echo 1. Make sure BOTH terminals are open:
echo    - Terminal 1: Backend (port 8080)
echo    - Terminal 2: Frontend (port 3000)
echo.
echo 2. If backend failed to start:
echo    - Check if MySQL is running: net start MySQL80
echo    - Check if database exists: mysql -u root -p123700 -e "USE ssms_sql"
echo    - Try: npm install && npm run dev
echo.
echo 3. Test the fix:
echo    - Open http://localhost:3000 in browser
echo    - Try logging in with:
echo      Email: admin@school.edu
echo      Password: demo123
echo.
echo 4. Check browser console (F12) for detailed errors
echo.
pause
