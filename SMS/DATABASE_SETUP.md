# 🗄️ Database Setup Guide

## Issue: Cannot Connect to Database

Follow these steps to set up MySQL and initialize your database:

---

## Step 1: Check if MySQL is Running

### Windows
Open **Services** (press `Win + R`, type `services.msc`) and look for:
- **MySQL80** or **MySQL57** (depending on your version)

It should show **Running**. If not, right-click and select **Start**.

Alternatively, open Command Prompt and run:
```bash
mysql -u root -p123700
```

If it connects, type `EXIT` to close.

---

## Step 2: Create Database & Import Schema

### Option A: Using MySQL Command Line (Recommended)
```bash
# Open Command Prompt and run:
mysql -u root -p123700 < "D:\School Management System V2\SMS\database\schema.sql"
```

### Option B: Using MySQL Workbench
1. Open **MySQL Workbench**
2. Connect to your MySQL server
3. Go to **File** → **Open SQL Script**
4. Select: `D:\School Management System V2\SMS\database\schema.sql`
5. Click the **Execute** button (⚡ icon) or press `Ctrl+Shift+Enter`

### Option C: Command Line Step-by-Step
```bash
# 1. Connect to MySQL
mysql -u root -p123700

# 2. Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS ssms_sql;

# 3. Use the database
USE ssms_sql;

# 4. Import schema from file
SOURCE D:/School Management System V2/SMS/database/schema.sql;

# 5. Verify (should show many tables)
SHOW TABLES;

# 6. Exit
EXIT;
```

---

## Step 3: Verify Database Connection

Once MySQL is running and the database is created, test the backend:

### Terminal 1 - Start Backend
```bash
cd "D:\School Management System V2\SMS\backend"
npm run dev
```

**Expected Output:**
```
✓ Database connection established
API running on port 8080
```

If you see this, your database is connected! ✓

---

## Common Issues & Fixes

### ❌ Error: "Access denied for user 'root'@'localhost'"
**Fix:** Your password is wrong. The default is `123700`
```bash
mysql -u root -p123700
```

### ❌ Error: "Unknown database 'ssms_sql'"
**Fix:** The database doesn't exist. Run the schema import:
```bash
mysql -u root -p123700 < "D:\School Management System V2\SMS\database\schema.sql"
```

### ❌ Error: "Can't connect to MySQL server on 'localhost'"
**Fix:** MySQL is not running. Start it:
- **Windows:** Open Services → Find MySQL → Right-click → Start
- **Or:** Open Command Prompt as Admin and run:
```bash
net start MySQL80
```

### ❌ Error: "Connection timeout"
**Fix:** Check MySQL port (default 3306). In `.env` file, make sure:
```
DB_HOST=localhost
DB_PORT=3306
```

---

## Database Credentials

```
Host:     localhost
User:     root
Password: 123700
Database: ssms_sql
Port:     3306
```

These are configured in: `backend/.env`

---

## Next Steps

Once you see **"✓ Database connection established"**:

### Terminal 1 (Backend - Keep Running)
```bash
cd "D:\School Management System V2\SMS\backend"
npm run dev
```

### Terminal 2 (Frontend)
```bash
cd "D:\School Management System V2\SMS\app"
npm run dev
```

### Terminal 3 (Optional - Test API)
```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@school.edu\",\"password\":\"demo123\"}"
```

---

## Need Help?

- MySQL not installed? [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- Check `backend/config/database.js` for connection settings
- Logs are in `backend/server.js`
- Database schema is in `database/schema.sql`
