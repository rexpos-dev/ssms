const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get grades for a student
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [grades] = await connection.query(`
      SELECT
        sg.id, sg.student_id,
        sub.subject_name, sub.subject_code,
        sg.total_marks, sg.average_marks, sg.grade_letter,
        sg.academic_year, sg.status
      FROM subject_grades sg
      JOIN subjects sub ON sg.subject_id = sub.id
      WHERE sg.student_id = ?
      ORDER BY sg.academic_year DESC, sub.subject_name
    `, [req.params.studentId]);
    connection.release();

    res.json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

module.exports = router;
