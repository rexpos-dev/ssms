# 🚀 Bridges Academy SMS - Complete Startup Guide

## ✅ Prerequisites Check

Ensure you have:
- ✓ Node.js 16+ (`node --version`)
- ✓ npm 8+ (`npm --version`)
- ✓ MySQL Server running (`mysql --version`)
- ✓ Database credentials: root / 123700

## 📋 Step-by-Step Startup

### Step 1: Setup Database (Run Once)

**Open Command Prompt and run:**

```bash
cd "D:\School Management System V2\SMS"

mysql -u root -p123700 -e "CREATE DATABASE IF NOT EXISTS ssms_sql;"

mysql -u root -p123700 ssms_sql < database\schema.sql
```

**Expected output:**
```
Query OK, 28 rows affected
```

### Step 2: Start Backend API (Terminal 1)

```bash
cd "D:\School Management System V2\SMS\backend"

npm install

npm run dev
```

**Wait for this output:**
```
╔════════════════════════════════════════╗
║   Bridges Academy SMS - Backend API    ║
║          Server Running on Port        ║
║              8080                      ║
╚════════════════════════════════════════╝

Database: ssms_sql
Environment: development
```

✅ Backend is ready when you see the box!

### Step 3: Start Frontend (Terminal 2 - NEW window)

```bash
cd "D:\School Management System V2\SMS\app"

npm install

npm run dev
```

**Wait for this output:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

✅ Frontend is ready when you see the Local URL!

### Step 4: Open in Browser

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/health

## 🔑 Login Credentials

Use any of these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | demo123 |
| Teacher | teacher@school.edu | demo123 |
| Student | student@school.edu | demo123 |
| Parent | parent@school.edu | demo123 |

## 🆘 Troubleshooting

### Issue: "npm install" fails

**Solution:**
```bash
npm cache clean --force
npm install
```

### Issue: "nodemon is not recognized"

**Solution:**
```bash
cd backend
npm install
```

### Issue: MySQL connection fails

**Verify connection:**
```bash
mysql -u root -p123700 -e "SELECT 1;"
```

If it fails:
1. Ensure MySQL is running
2. Check credentials: root / 123700
3. Try: `mysql -u root -p123700`

### Issue: Port 3000 or 8080 already in use

**Kill the process:**

On Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F

netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Database schema import fails

**Verify database exists:**
```bash
mysql -u root -p123700 -e "SHOW DATABASES;"
```

**Re-import schema:**
```bash
mysql -u root -p123700 ssms_sql < database\schema.sql
```

## 📊 Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Test Login API
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@school.edu\",\"password\":\"demo123\"}"
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {...}
}
```

## 🎯 Project Structure

```
D:\School Management System V2\SMS\
├── backend/                 ← Backend API (Port 8080)
│   ├── server.js
│   ├── package.json
│   ├── .env                 ← Database credentials
│   ├── config/database.js
│   ├── middleware/auth.js
│   └── routes/             ← API endpoints
│
├── app/              ← Frontend (Port 3000)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── package.json
│
├── database/
│   └── schema.sql          ← MySQL database schema
│
└── [Documentation files]
```

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/login              - Login
POST   /api/auth/register           - Register
GET    /api/auth/profile            - Get profile
PUT    /api/auth/profile            - Update profile
POST   /api/auth/change-password    - Change password
```

### Data APIs
```
GET    /api/students                - List students
GET    /api/students/:id            - Get student
GET    /api/teachers                - List teachers
GET    /api/grades/student/:id      - Get grades
GET    /api/attendance/student/:id  - Get attendance
GET    /api/messages                - Get messages
GET    /api/health                  - Health check
```

## 💾 Database

**Host**: localhost  
**Port**: 3306  
**User**: root  
**Password**: 123700  
**Database**: ssms_sql  

**Tables**: 28+
- users, students, teachers, parents, admins
- grades, subjects, sections, enrollments
- attendance, assignments, messages, announcements
- academic_calendar, events, holidays
- student_fees, fee_payments, documents
- ... and more

## ⚡ Performance Tips

1. **Keep both terminals running**
   - Backend terminal 1
   - Frontend terminal 2

2. **Hot reload enabled**
   - Frontend: Changes instantly reflected
   - Backend: Restart needed for changes

3. **Database**
   - MySQL connection pool: 10 connections
   - Connection auto-timeout: 3600s

## 🔄 Restarting

If something breaks:

**Kill both services:**
```bash
# Terminal 1: Press Ctrl+C
# Terminal 2: Press Ctrl+C
```

**Restart in order:**
1. Start backend first
2. Wait for "API running on port 8080"
3. Start frontend second
4. Wait for "Local: http://localhost:3000"

## 📚 Documentation

- **README.md** - Project overview
- **COMPLETE_SYSTEM_SUMMARY.md** - Feature list
- **FULL_STACK_SETUP.md** - Detailed setup
- **database/schema.sql** - Database documentation
- **backend/.env.example** - Backend config template
- **app/README.md** - Frontend docs

## ✨ What's Included

✅ Complete React frontend with authentication  
✅ Express.js REST API with 11 route modules  
✅ MySQL database with 28+ tables  
✅ JWT authentication with bcrypt  
✅ Role-based access control (Admin/Teacher/Student/Parent)  
✅ Material Design 3 styling  
✅ Responsive design (mobile/tablet/desktop)  
✅ Demo data pre-populated  

## 🎉 You're All Set!

**Next Steps:**
1. Open Terminal 1 → Start Backend
2. Open Terminal 2 → Start Frontend
3. Open Browser → http://localhost:3000
4. Login with demo credentials
5. Explore all portals!

---

**Need Help?** Check the troubleshooting section above or review the documentation files.

**Backend**: Running on http://localhost:8080  
**Frontend**: Running on http://localhost:3000  
**Database**: Connected to ssms_sql  

✅ System ready to use!
