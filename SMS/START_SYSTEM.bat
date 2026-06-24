@echo off
echo.
echo ╔════════════════════════════════════════╗
echo ║  Bridges Academy SMS - System Startup  ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js is not installed. Please install it from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo.

REM Check if MySQL is accessible
mysql -u root -p123700 -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo ⚠ MySQL connection failed.
    echo Please ensure MySQL is running and credentials are correct:
    echo   Host: localhost
    echo   User: root
    echo   Password: 123700
    echo.
    pause
)

REM Create database if not exists
echo ★ Setting up database...
mysql -u root -p123700 -e "CREATE DATABASE IF NOT EXISTS ssms_sql;" 2>nul
mysql -u root -p123700 ssms_sql < database/schema.sql 2>nul
echo ✓ Database ready

echo.
echo ★ Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ✗ Backend installation failed
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
cd ..

echo.
echo ★ Starting backend server on port 8080...
start cmd /k "cd backend && npm run dev"

echo.
echo ★ Installing frontend dependencies...
cd app
call npm install
if errorlevel 1 (
    echo ✗ Frontend installation failed
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

echo.
echo ★ Starting frontend server on port 3000...
start cmd /k "npm run dev"
cd ..

echo.
echo ╔════════════════════════════════════════╗
echo ║     ✓ SYSTEM STARTING                  ║
echo ║                                        ║
echo ║  Backend:  http://localhost:8080      ║
echo ║  Frontend: http://localhost:3000      ║
echo ║                                        ║
echo ║  Demo Credentials:                    ║
echo ║  Email:    admin@school.edu           ║
echo ║  Password: demo123                    ║
echo ╚════════════════════════════════════════╝
echo.
echo Waiting for servers to start (15 seconds)...
timeout /t 15
start http://localhost:3000

pause
