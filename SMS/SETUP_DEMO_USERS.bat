@echo off
setlocal enabledelayedexpansion

REM Setup Demo Users Script
REM This creates the default demo user accounts

echo.
echo ============================================
echo   Setting Up Demo User Accounts
echo ============================================
echo.

REM Check if database exists
mysql -u root -p123700 -e "USE ssms_sql; SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Database 'ssms_sql' not found!
    echo.
    echo Please run DATABASE_SETUP.md first to create the database
    echo.
    pause
    exit /b 1
)

echo Database found. Creating demo users...
echo.

REM Run the seed script
cd /d "D:\School Management System V2\SMS\backend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies first...
    call npm install >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Run the seeding script
call node scripts/seed-demo-users.js

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to seed demo users
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ============================================
    echo   Demo Users Created Successfully!
    echo ============================================
    echo.
    echo You can now login with any of these accounts:
    echo.
    echo   Email: admin@school.edu
    echo   Email: teacher@school.edu
    echo   Email: student@school.edu
    echo   Email: parent@school.edu
    echo.
    echo   Password: demo123 (for all accounts)
    echo.
    echo Next: Start the backend and frontend
    echo.
    pause
)
