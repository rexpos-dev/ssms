# 🔧 Troubleshooting Guide

## Quick Fixes

### Database Not Connecting

**Run this first:**
```bash
D:\School Management System V2\SMS\TEST_DATABASE.bat
```

This will automatically:
- ✓ Check if MySQL is running
- ✓ Check if database exists
- ✓ Create database if needed
- ✓ Import schema if needed

---

### Still Not Working?

#### Step 1: Start MySQL

**Windows Services:**
1. Press `Win + R`
2. Type `services.msc`
3. Find **MySQL80** (or MySQL57)
4. Right-click → **Start**

**Or via Command Line (Admin):**
```bash
net start MySQL80
```

**Or via MySQL Installer:**
1. Open MySQL Installer
2. Click "Reconfigure"
3. Choose your MySQL version
4. Click "Start Service"

---

#### Step 2: Verify MySQL is Running

```bash
mysql -u root -p123700
```

Expected: You're in MySQL prompt (`mysql>`). Type `EXIT` to close.

If you get **"Access denied"**: Wrong password or MySQL not running.

---

#### Step 3: Create Database

If the previous command failed, create the database manually:

```bash
# Option A: From Command Line
mysql -u root -p123700 < "D:\School Management System V2\SMS\database\schema.sql"

# Option B: From MySQL Prompt
mysql -u root -p123700
> CREATE DATABASE ssms_sql;
> SOURCE D:/School Management System V2/SMS/database/schema.sql;
> EXIT;
```

---

#### Step 4: Test Backend

```bash
cd "D:\School Management System V2\SMS\backend"
npm run dev
```

**Expected Output:**
```
✓ Database connection established
API running on port 8080
```

If you see this ✓, your database is working!

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Access denied for user 'root'@'localhost'` | Wrong password | Use password: `123700` |
| `Unknown database 'ssms_sql'` | Database not created | Run: `mysql -u root -p123700 < database/schema.sql` |
| `Can't connect to MySQL server` | MySQL not running | Start MySQL in Services or with: `net start MySQL80` |
| `Connection timeout` | Wrong host/port | Check `.env`: DB_HOST=localhost, DB_PORT=3306 |
| `Blank page in browser` | Frontend not loading | Run: `npm run dev` in app folder |
| `Cannot POST /api/auth/login` | Backend not running | Run: `npm run dev` in backend folder |

---

## Complete Startup Sequence

### 1️⃣ Ensure MySQL is Running

```bash
mysql -u root -p123700 -e "SELECT 1"
```

Expected: No error.

### 2️⃣ Ensure Database Exists

```bash
mysql -u root -p123700 -e "USE ssms_sql; SELECT COUNT(*) FROM information_schema.tables;"
```

Expected: Number of tables (should be 20+).

If error, import schema:
```bash
mysql -u root -p123700 < "D:\School Management System V2\SMS\database\schema.sql"
```

### 3️⃣ Start Backend (Terminal 1)

```bash
cd "D:\School Management System V2\SMS\backend"
npm run dev
```

Expected Output:
```
✓ Database connection established
API running on port 8080
```

### 4️⃣ Start Frontend (Terminal 2)

```bash
cd "D:\School Management System V2\SMS\app"
npm run dev
```

Expected Output:
```
Local: http://localhost:3000
```

### 5️⃣ Open Browser

Visit: **http://localhost:3000**

Login:
- Email: `admin@school.edu`
- Password: `demo123`

---

## Testing the API

### Test Login Endpoint

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@school.edu\",\"password\":\"demo123\"}"
```

Expected: Returns `token` and `user` object.

### Test Database Connection from Backend

```bash
cd "D:\School Management System V2\SMS\backend"
node -e "require('./config/database').getConnection().then(c => { console.log('✓ Connected'); c.release(); process.exit(0); }).catch(e => { console.log('✗ Error:', e.message); process.exit(1); })"
```

---

## File Locations

| File | Purpose |
|------|---------|
| `backend/.env` | Database credentials |
| `backend/config/database.js` | Database connection setup |
| `database/schema.sql` | Database structure & sample data |
| `app/src/App.jsx` | Frontend routing |
| `QUICK_STARTUP.txt` | Quick start guide |

---

## Still Having Issues?

### Check These Files

1. **backend/.env exists?**
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=123700
   DB_NAME=ssms_sql
   DB_PORT=3306
   ```

2. **backend/config/database.js readable?**
   - Should load `.env` and create connection pool

3. **database/schema.sql exists?**
   - Contains all 20+ table definitions

4. **MySQL version compatible?**
   - MySQL 5.7+ required
   - Check: `mysql --version`

---

## Need More Help?

### Manual Database Check

```bash
# Connect and view all tables
mysql -u root -p123700
> USE ssms_sql;
> SHOW TABLES;
```

Should show: users, students, teachers, grades, attendance, etc.

### Check Backend Logs

Look at `backend/server.js` for connection errors and API initialization messages.

### Test API Endpoints

After backend starts, test endpoints with Postman or curl:
- **POST** `http://localhost:8080/api/auth/login`
- **GET** `http://localhost:8080/api/students`
- **GET** `http://localhost:8080/api/users/profile`
