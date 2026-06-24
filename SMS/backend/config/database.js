const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123700',
  database: process.env.DB_NAME || 'ssms_sql',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: process.env.DB_POOL_LIMIT || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('✓ Database connection established');
    connection.release();
  })
  .catch(error => {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  });

module.exports = pool;
