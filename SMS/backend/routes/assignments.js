const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get assignments for a class
router.get('/class/:classId', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [assignments] = await connection.query(`
      SELECT a.*, s.subject_name
      FROM assignments a
      JOIN class_assignments ca ON a.class_assignment_id = ca.id
      JOIN subjects s ON ca.subject_id = s.id
      WHERE a.class_assignment_id = ?
      ORDER BY a.due_date DESC
    `, [req.params.classId]);
    connection.release();

    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

module.exports = router;
