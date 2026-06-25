@echo off
REM Database Connection Test Script
REM This script tests if MySQL is running and the database is accessible

echo.
echo ============================================
echo    Database Connection Test
echo ============================================
echo.

REM Test MySQL connection
echo Testing MySQL connection...
echo.

mysql -u root -p123700 -e "SELECT 1" >nul 2>&1

if errorlevel 1 (
    echo [FAILED] Cannot connect to MySQL
    echo.
    echo Possible causes:
    echo 1. MySQL is not running
    echo 2. Wrong credentials (user: root, password: 123700)
    echo 3. MySQL is not installed
    echo.
    echo Solutions:
    echo - Start MySQL: Open Services (Win+R, services.msc) and start MySQL80
    echo - Or run: net start MySQL80
    echo.
    pause
    exit /b 1
) else (
    echo [OK] MySQL is running and accessible
    echo.
)

REM Test database exists
echo Testing if database 'ssms_sql' exists...
mysql -u root -p123700 -e "USE ssms_sql; SELECT 1" >nul 2>&1

if errorlevel 1 (
    echo [FAILED] Database 'ssms_sql' does not exist
    echo.
    echo Importing database schema...
    mysql -u root -p123700 < "%~dp0database\schema.sql"

    if errorlevel 1 (
        echo [FAILED] Could not import schema
        echo.
        echo Manual fix:
        echo   mysql -u root -p123700 ^< "%~dp0database\schema.sql"
        pause
        exit /b 1
    ) else (
        echo [OK] Database imported successfully
    )
) else (
    echo [OK] Database 'ssms_sql' exists
    echo.
)

REM Count tables
echo Checking database tables...
for /f %%A in ('mysql -u root -p123700 -N -e "USE ssms_sql; SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='ssms_sql';"') do set TABLE_COUNT=%%A

echo [OK] Found !TABLE_COUNT! tables in database
echo.

REM Final status
echo ============================================
echo    All tests passed! Database is ready.
echo ============================================
echo.
echo Next steps:
echo 1. Start backend:  npm run dev (in backend folder)
echo 2. Start frontend: npm run dev (in app folder)
echo 3. Open: http://localhost:3000
echo.
echo Login with:
echo   Email: admin@school.edu
echo   Password: demo123
echo.
pause
