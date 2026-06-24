const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get attendance for a student
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [attendance] = await connection.query(`
      SELECT
        a.id, a.attendance_date, a.status, a.remarks,
        ca.subject_id,
        s.subject_name
      FROM attendance a
      JOIN class_assignments ca ON a.class_assignment_id = ca.id
      JOIN subjects s ON ca.subject_id = s.id
      WHERE a.student_id = ?
      ORDER BY a.attendance_date DESC
      LIMIT 100
    `, [req.params.studentId]);
    connection.release();

    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

module.exports = router;
