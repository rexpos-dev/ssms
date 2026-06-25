# 🔐 Fix "Invalid Credentials" Error

## The Problem

You're getting **"Invalid credentials"** when trying to log in. This means the backend is working, but the user accounts don't exist in the database yet.

---

## The Solution: 3 Steps

### Step 1: Stop Your Servers

If you have terminals running with `npm run dev`, close them. Or press `Ctrl+C` to stop them.

### Step 2: Create Demo Users

**Double-click this file:**
```
D:\School Management System V2\SMS\SETUP_DEMO_USERS.bat
```

This will automatically create 4 demo user accounts:
- 👨‍💼 **Admin**: admin@school.edu
- 👨‍🏫 **Teacher**: teacher@school.edu  
- 👨‍🎓 **Student**: student@school.edu
- 👨‍👩‍👧 **Parent**: parent@school.edu

**Password for all:** `demo123`

Wait for the message:
```
✨ Demo users seeded successfully!
```

### Step 3: Restart Backend & Frontend

**Terminal 1 (Backend):**
```bash
cd "D:\School Management System V2\SMS\backend"
npm run dev
```

**Terminal 2 (Frontend - New Terminal):**
```bash
cd "D:\School Management System V2\SMS\app"
npm run dev
```

Then open: **http://localhost:3000**

Try logging in with:
- **Email:** admin@school.edu
- **Password:** demo123

✅ Should work now!

---

## What If SETUP_DEMO_USERS.bat Fails?

### Manual Method

Open Command Prompt and run:

```bash
cd "D:\School Management System V2\SMS\backend"
npm install
node scripts/seed-demo-users.js
```

You should see:
```
✅ Created ADMIN: admin@school.edu
✅ Created TEACHER: teacher@school.edu
✅ Created STUDENT: student@school.edu
✅ Created PARENT: parent@school.edu

✨ Demo users seeded successfully!
```

---

## Verify Demo Users Were Created

Open MySQL and run:

```sql
mysql -u root -p123700
USE ssms_sql;
SELECT email, role, status FROM users;
```

Should show:
```
admin@school.edu   | admin   | active
teacher@school.edu | teacher | active
student@school.edu | student | active
parent@school.edu  | parent  | active
```

---

## Login Test

### Try Each Role

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | demo123 |
| Teacher | teacher@school.edu | demo123 |
| Student | student@school.edu | demo123 |
| Parent | parent@school.edu | demo123 |

Each should see a dashboard after login.

---

## Troubleshooting

### Error: "Cannot find module"
```
npm install
node scripts/seed-demo-users.js
```

### Error: "Database connection failed"
```bash
# Start MySQL first
net start MySQL80

# Then try again
node scripts/seed-demo-users.js
```

### Error: "Access denied"
Wrong database credentials. Check:
- Username: `root`
- Password: `123700`
- Database: `ssms_sql`

### Users already exist but still can't login
Your password might be wrong. Reset and recreate users:

```bash
mysql -u root -p123700
USE ssms_sql;
DELETE FROM users WHERE email IN ('admin@school.edu', 'teacher@school.edu', 'student@school.edu', 'parent@school.edu');
EXIT;

# Then run the seed script again
node scripts/seed-demo-users.js
```

---

## Important Notes

⚠️ **These are demo accounts only.**

To create production accounts:
- Use the register endpoint: `POST /api/auth/register`
- Or add users manually in the database
- Change demo passwords immediately in production

---

## Files You Need

| File | Purpose |
|------|---------|
| `SETUP_DEMO_USERS.bat` | Run this to create demo users |
| `backend/scripts/seed-demo-users.js` | The seeding script |
| `backend/.env` | Database configuration |
| `database/schema.sql` | Database structure |

---

## Quick Command Reference

```bash
# Create demo users
node scripts/seed-demo-users.js

# Check users exist
mysql -u root -p123700 -e "USE ssms_sql; SELECT email, role FROM users;"

# Delete all users (reset)
mysql -u root -p123700 -e "USE ssms_sql; DELETE FROM users;"

# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@school.edu\",\"password\":\"demo123\"}"
```

---

## Ready?

1. ✅ Double-click `SETUP_DEMO_USERS.bat`
2. ✅ Wait for success message
3. ✅ Restart backend and frontend
4. ✅ Log in with `admin@school.edu` / `demo123`

🎉 You're in!
