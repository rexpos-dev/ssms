# Bridges Academy SMS - Complete Full-Stack Setup Guide

## 🎯 Project Overview

A complete School Management System with:
- **Backend**: Node.js/Express REST API with MySQL database
- **Frontend**: React with authentication and multi-role portals
- **Database**: MySQL with comprehensive schema
- **Features**: Admin, Teacher, Student, and Parent portals

## 📦 Project Structure

```
SMS/
├── database/
│   └── schema.sql              # MySQL database schema
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment template
│   ├── config/
│   │   └── database.js        # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   └── routes/
│       ├── auth.js            # Authentication endpoints
│       ├── students.js        # Student management API
│       ├── teachers.js        # Teacher management API
│       ├── parents.js         # Parent management API
│       ├── grades.js          # Grades API
│       ├── attendance.js      # Attendance API
│       ├── assignments.js     # Assignments API
│       ├── messages.js        # Messaging API
│       ├── dashboard.js       # Dashboard data
│       ├── reports.js         # Reports API
│       └── users.js           # User management
├── app/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Login page (NEW)
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentDirectory.jsx
│   │   │   └── [Teacher, Student, Parent portals]
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx  # Route protection (NEW)
│   │   │   └── [UI components]
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state (NEW)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MySQL Server 5.7+
- Git (optional)

### Step 1: Database Setup

1. **Create MySQL Database**:
```bash
mysql -u root -p
```

```sql
CREATE DATABASE ssms_sql;
USE ssms_sql;
```

2. **Import Schema**:
```bash
mysql -u root -p ssms_sql < database/schema.sql
```

3. **Verify Tables**:
```bash
mysql -u root -p ssms_sql -e "SHOW TABLES;"
```

### Step 2: Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create .env file**:
```bash
cp .env.example .env
```

4. **Edit .env with your database credentials**:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123700
DB_NAME=ssms_sql
DB_PORT=3306
JWT_SECRET=your_super_secret_key_change_in_production
```

5. **Start backend server**:
```bash
npm run dev
```

Expected output:
```
╔════════════════════════════════════════╗
║   Bridges Academy SMS - Backend API    ║
║          Server Running on Port        ║
║              8080                      ║
╚════════════════════════════════════════╝
```

### Step 3: Frontend Setup

1. **Navigate to React app directory**:
```bash
cd app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create .env file** (if needed):
```
VITE_API_URL=http://localhost:8080
```

4. **Start development server**:
```bash
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

## 🔑 Default Credentials

Use these to test the system:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@school.edu | demo123 | Admin Dashboard, All Management |
| Teacher | teacher@school.edu | demo123 | Teacher Portal, Grading, Attendance |
| Student | student@school.edu | demo123 | Student Portal, Grades, Submissions |
| Parent | parent@school.edu | demo123 | Parent Portal, Child Progress |

## 📱 Available Portals

### Admin Portal
- Dashboard with KPIs
- Student management
- Faculty management
- Financial management
- Reports and analytics
- System settings

**Routes**: `/admin`, `/admin/students`, `/admin/faculty`, `/admin/calendar`, etc.

### Teacher Portal
- Dashboard
- My Classes
- Grading system
- Attendance tracking
- Assignment management
- Student communication
- Reports

**Route**: `/teacher`

### Student Portal
- Dashboard
- My Subjects
- Schedule
- Grades
- Assignments
- Attendance
- Communication

**Route**: `/student`

### Parent Portal
- Dashboard
- Child's Academic Progress
- Grades & Results
- Attendance
- Communication
- Fee Status

**Route**: `/parent`

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login           - Login
POST   /api/auth/register        - Register
GET    /api/auth/profile         - Get profile
PUT    /api/auth/profile         - Update profile
POST   /api/auth/change-password - Change password
```

### Students
```
GET    /api/students             - List all students
GET    /api/students/:id         - Get student details
GET    /api/students/:id/dashboard - Student dashboard
```

### Teachers
```
GET    /api/teachers             - List teachers
GET    /api/teachers/:id         - Get teacher details
```

### Grades
```
GET    /api/grades/student/:id   - Get student grades
```

### Attendance
```
GET    /api/attendance/student/:id - Get attendance records
```

### Assignments
```
GET    /api/assignments/class/:id   - Get class assignments
```

### Dashboard
```
GET    /api/dashboard/:role      - Get role-specific dashboard
```

### Reports
```
GET    /api/reports/academic/:id - Get academic reports
```

## 🗄️ Database Schema Overview

### Core Tables
- **users** - All system users with roles
- **students** - Student profiles with enrollment
- **teachers** - Faculty information
- **parents** - Parent/guardian details
- **grades** - Academic grades
- **sections** - Class sections
- **subjects** - Course information

### Academic Tables
- **student_enrollments** - Enrollment tracking
- **class_assignments** - Teacher-class assignments
- **attendance** - Attendance records
- **student_grades** - Individual assessments
- **assignments** - Homework/assignments

### Administrative Tables
- **academic_years** - School years
- **holidays** - Holiday calendar
- **events** - School events
- **messages** - User communications
- **announcements** - School announcements
- **documents** - Document management

### Financial Tables
- **fee_types** - Fee configurations
- **student_fees** - Fee assignments
- **fee_payments** - Payment tracking

## 🔄 Authentication Flow

1. **User logs in** with email/password
2. **Backend verifies** credentials
3. **JWT token generated** and returned
4. **Frontend stores** token in localStorage
5. **Token sent** with each API request
6. **Routes protected** by role

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ Input validation with Joi
- ✅ SQL injection prevention
- ✅ Protected routes

## 🚢 Deployment

### Backend Deployment (Heroku Example)

```bash
heroku create your-app-name
git push heroku main
```

Set environment variables:
```bash
heroku config:set DB_HOST=your-db-host
heroku config:set JWT_SECRET=your-secret
```

### Frontend Deployment (Vercel Example)

```bash
npm run build
vercel deploy
```

## 📊 Database Credentials

```
Host: localhost
Port: 3306
Username: root
Password: 123700
Database: ssms_sql
```

## 🧪 Testing

### Test Backend API
```bash
# Check if server is running
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"demo123"}'
```

### Test Frontend
1. Open http://localhost:3000
2. Login with demo credentials
3. Navigate through different portals

## 🔧 Development Tips

### Adding New Student Portal Page

1. **Create component** in `src/pages/StudentXXX.jsx`:
```jsx
import { Card, Button } from '../components';

export const StudentXXX = () => {
  return (
    <Layout>
      <h1>New Page</h1>
    </Layout>
  );
};
```

2. **Add route** in `src/App.jsx`:
```jsx
<Route path="/student/xxx" element={<StudentXXX />} />
```

3. **Add navigation** in `src/components/Layout.jsx`

### Calling API Endpoints

```javascript
const response = await fetch('/api/students/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Debugging

**Check Backend Logs**:
```bash
cd backend
npm run dev
# Check console for errors
```

**Check Frontend Console**:
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

**Test Database Connection**:
```bash
mysql -u root -p ssms_sql -e "SELECT * FROM users LIMIT 1;"
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Guide](https://jwt.io/introduction)
- [Tailwind CSS](https://tailwindcss.com)

## ❓ Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:3306

Solution:
1. Ensure MySQL is running
2. Check credentials in .env
3. Verify database exists: mysql -u root -p -e "SHOW DATABASES;"
```

### API Port Already in Use
```
Error: listen EADDRINUSE :::8080

Solution:
1. Change port in .env (PORT=5001)
2. Or kill existing process
```

### React App Not Loading
```
Error: API_URL not accessible

Solution:
1. Ensure backend is running
2. Check VITE_API_URL in .env
3. Check CORS settings in backend
```

### Login Not Working
```
Error: Invalid credentials

Solution:
1. Ensure user exists in database
2. Check password is correct
3. Verify JWT_SECRET matches between frontend and backend
```

## 📞 Support

For issues or questions:
1. Check the logs (console output)
2. Verify all credentials
3. Ensure all services are running
4. Review the API documentation above

## 🎉 Next Steps

1. **Create sample data**: Run seed scripts to populate test data
2. **Customize design**: Modify colors in tailwind.config.js
3. **Add features**: Expand API endpoints and React components
4. **Implement notifications**: Add email/SMS alerts
5. **Mobile app**: Build React Native version

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready ✓
