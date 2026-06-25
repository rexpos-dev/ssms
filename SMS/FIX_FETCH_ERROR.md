# 🔧 Fix "Failed to fetch" Error

## What This Means

The frontend (port 3000) cannot reach the backend API (port 8080). Common causes:

---

## Checklist (Do These First)

### ✅ Is Backend Running?

**Terminal Check:**
Look at your backend terminal for this message:
```
╔════════════════════════════════════════╗
║   Bridges Academy SMS - Backend API    ║
║          Server Running on Port        ║
║              8080                      ║
╚════════════════════════════════════════╝
```

If you DON'T see this, your backend crashed.

### ✅ Test Backend Directly

Open browser and visit:
```
http://localhost:8080/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-06-24T..."
}
```

**If you see this:** Backend is working! Go to Step 3.

**If you see error:** Backend failed to start. See "Fix Backend" below.

---

## Fix #1: Backend Crashed (Most Common)

### Step 1: Check Backend Error

Look at the **backend terminal** for error message. Common ones:

#### Error: "Database connection failed"
```
✗ Database connection failed: Access denied for user 'root'@'localhost'
```

**Solution:**
```bash
# Check MySQL is running
mysql -u root -p123700 -e "SELECT 1"

# If that fails, start MySQL:
net start MySQL80

# Then restart backend:
cd "D:\School Management System V2\SMS\backend"
npm run dev
```

#### Error: "Unknown database 'ssms_sql'"
```
✗ Database connection failed: Unknown database 'ssms_sql'
```

**Solution:**
```bash
# Import database schema
mysql -u root -p123700 < "D:\School Management System V2\SMS\database\schema.sql"

# Restart backend
cd "D:\School Management System V2\SMS\backend"
npm run dev
```

#### Error: "Cannot find module"
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd "D:\School Management System V2\SMS\backend"
npm install
npm run dev
```

---

## Fix #2: Frontend Configuration

### Check Login URL

Open: `D:\School Management System V2\SMS\app\src\pages\Login.jsx`

Look for this line (should be around line 17):
```javascript
const response = await fetch('http://localhost:8080/api/auth/login', {
```

**Must be:**
- ✅ `http://localhost:8080` (NOT https)
- ✅ Port 8080 (backend port)
- ✅ Full path: `/api/auth/login`

If wrong, edit it to correct URL.

---

## Fix #3: Check .env File

Backend config: `D:\School Management System V2\SMS\backend\.env`

Must have:
```
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123700
DB_NAME=ssms_sql
```

If PORT is different, you need to change it in Login.jsx too.

---

## Fix #4: CORS Issue (Advanced)

If backend runs but still getting fetch error:

Check: `D:\School Management System V2\SMS\backend\.env`

Should have:
```
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

If missing, add it and restart backend.

---

## Complete Diagnostic Test

Run all checks:

```bash
# 1. Check MySQL
echo Checking MySQL...
mysql -u root -p123700 -e "SELECT 1" && echo [OK] MySQL running || echo [FAIL] MySQL not running

# 2. Check database exists
echo Checking database...
mysql -u root -p123700 -e "USE ssms_sql; SELECT 1" && echo [OK] Database exists || echo [FAIL] Database missing

# 3. Test backend API
echo Testing backend API...
curl -s http://localhost:8080/api/health | find /I "healthy" >nul && echo [OK] Backend running || echo [FAIL] Backend not responding
```

---

## Step-by-Step Fix (Guaranteed to Work)

### Step 1: Stop Everything
Close all terminals with Node.js running.

### Step 2: Clear npm Cache (Optional)
```bash
npm cache clean --force
```

### Step 3: Start MySQL
```bash
net start MySQL80
```

Wait 3 seconds.

### Step 4: Start Backend
```bash
cd "D:\School Management System V2\SMS\backend"
npm install
npm run dev
```

**WAIT** for this message:
```
Server Running on Port 8080
```

Then **DO NOT CLOSE** this terminal.

### Step 5: Start Frontend (New Terminal)
```bash
cd "D:\School Management System V2\SMS\app"
npm install
npm run dev
```

Wait for:
```
Local: http://localhost:3000
```

### Step 6: Test
Open browser to: `http://localhost:3000`

Should see login page. Try logging in:
- Email: `admin@school.edu`
- Password: `demo123`

---

## If Still Not Working

### Test Each Component

**Test 1: Backend Health**
```bash
curl http://localhost:8080/api/health
```

**Test 2: Backend Auth Endpoint**
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@school.edu\",\"password\":\"demo123\"}"
```

**Test 3: Frontend to Backend**

Open browser console (F12) and run:
```javascript
fetch('http://localhost:8080/api/health').then(r => r.json()).then(console.log).catch(console.error)
```

Should print health status.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Backend terminal closed | Keep it open while using app |
| Wrong port (8000, 3001, etc) | Must be 8080 for backend |
| Frontend on http, backend on https | Use http for both |
| MySQL not started | Run: `net start MySQL80` |
| Old node_modules | Delete node_modules, run `npm install` |
| Wrong database | Check database name is `ssms_sql` |

---

## Emergency Reset (Last Resort)

```bash
# 1. Stop all Node.js
taskkill /F /IM node.exe

# 2. Stop MySQL
net stop MySQL80

# 3. Wait 5 seconds, then start fresh
timeout /t 5

# 4. Start MySQL
net start MySQL80

# 5. Recreate database
mysql -u root -p123700 < "D:\School Management System V2\SMS\database\schema.sql"

# 6. Start backend
cd "D:\School Management System V2\SMS\backend"
npm install
npm run dev

# 7. In new terminal, start frontend
cd "D:\School Management System V2\SMS\app"
npm install
npm run dev
```

---

## Need Help?

Check these files:
- Backend logs: `backend/server.js`
- Database config: `backend/config/database.js`
- Frontend requests: `app/src/pages/Login.jsx`
- Env variables: `backend/.env`

All errors should be printed in the terminal where you ran `npm run dev`.
