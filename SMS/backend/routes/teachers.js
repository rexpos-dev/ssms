const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all teachers
router.get('/', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [teachers] = await connection.query(`
      SELECT t.*, u.first_name, u.last_name, u.email, u.phone
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY u.first_name
      LIMIT 100
    `);
    connection.release();

    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

module.exports = router;
