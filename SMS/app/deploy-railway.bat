@echo off
REM Railway Deployment Script for School Management System (Windows)
REM This script automates the deployment process to Railway

setlocal enabledelayedexpansion

echo.
echo 🚀 School Management System - Railway Deployment
echo ==================================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the app directory.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Step 1: Install dependencies
echo 1️⃣  Installing dependencies...
call npm install
if !errorlevel! neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Step 2: Build the project
echo 2️⃣  Building the project...
call npm run build
if !errorlevel! neq 0 (
    echo ❌ Build failed. Please fix errors and try again.
    pause
    exit /b 1
)
echo ✅ Build successful
echo.

REM Step 3: Login to Railway
echo 3️⃣  Logging in to Railway...
echo Note: If you don't have Railway CLI installed, please run:
echo npm install -g railway
echo.

REM Step 4: Deploy to Railway
echo 4️⃣  Deploying to Railway...
echo This may take 10-15 minutes...
echo.
call railway up --token e5a9ea87-eba5-4247-bcf5-8456681b66e3

if !errorlevel! equ 0 (
    echo.
    echo 🎉 Deployment successful!
    echo.
    echo Next steps:
    echo 1. Check deployment logs: railway logs --follow
    echo 2. Your app will be available at: https://your-project.railway.app
    echo 3. To set a custom domain: railway domain
    echo.
    echo Demo Credentials:
    echo Admin:   admin@school.edu / demo123
    echo Teacher: teacher@school.edu / demo123
    echo Student: student@school.edu / demo123
    echo Parent:  parent@school.edu / demo123
) else (
    echo.
    echo ❌ Deployment failed. Check the logs above for details.
    pause
    exit /b 1
)

pause
