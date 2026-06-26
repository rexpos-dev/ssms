#!/bin/bash

# Railway Deployment Script for School Management System
# This script automates the deployment process to Railway

set -e

echo "🚀 School Management System - Railway Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI not found. Installing...${NC}"
    npm install -g railway
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the app directory.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}1️⃣  Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Build the project
echo -e "${YELLOW}2️⃣  Building the project...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi
echo ""

# Step 3: Test preview
echo -e "${YELLOW}3️⃣  Testing preview build...${NC}"
timeout 5 npm run preview &
sleep 3
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Preview server working${NC}"
else
    echo -e "${YELLOW}⚠️  Preview test skipped${NC}"
fi
pkill -f "vite preview" 2>/dev/null || true
echo ""

# Step 4: Login to Railway
echo -e "${YELLOW}4️⃣  Logging in to Railway...${NC}"
railway login --token e5a9ea87-eba5-4247-bcf5-8456681b66e3 2>/dev/null || true
echo -e "${GREEN}✅ Railway authenticated${NC}"
echo ""

# Step 5: Deploy to Railway
echo -e "${YELLOW}5️⃣  Deploying to Railway...${NC}"
echo -e "${YELLOW}This may take 10-15 minutes...${NC}"
railway up

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Check deployment logs: railway logs --follow"
    echo "2. Your app will be available at: https://your-project.railway.app"
    echo "3. To set a custom domain: railway domain"
    echo ""
    echo -e "${YELLOW}Demo Credentials:${NC}"
    echo "Admin:   admin@school.edu / demo123"
    echo "Teacher: teacher@school.edu / demo123"
    echo "Student: student@school.edu / demo123"
    echo "Parent:  parent@school.edu / demo123"
else
    echo -e "${RED}❌ Deployment failed. Check the logs above for details.${NC}"
    exit 1
fi
