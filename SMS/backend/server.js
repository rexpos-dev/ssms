const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('express-async-errors');
require('dotenv').config();

const pool = require('./config/database');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 8080;

// ============================================================
// MIDDLEWARE
// ============================================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================
// IMPORT ROUTES
// ============================================================

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const studentsRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
const parentsRoutes = require('./routes/parents');
const gradesRoutes = require('./routes/grades');
const attendanceRoutes = require('./routes/attendance');
const assignmentsRoutes = require('./routes/assignments');
const messagesRoutes = require('./routes/messages');
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');

// ============================================================
// ROUTE REGISTRATION
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/parents', parentsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1');
    connection.release();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Bridges Academy SMS - Backend API    ║
║          Server Running on Port        ║
║              ${PORT}                    ║
╚════════════════════════════════════════╝

API Documentation:
- Auth: POST /api/auth/login
- Auth: POST /api/auth/register
- Auth: GET /api/auth/profile
- Students: GET /api/students
- Teachers: GET /api/teachers
- Parents: GET /api/parents
- Dashboard: GET /api/dashboard/:role
- Health: GET /api/health

Database: ${process.env.DB_NAME}
Environment: ${process.env.NODE_ENV}
  `);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await pool.end();
  process.exit(0);
});

module.exports = app;
