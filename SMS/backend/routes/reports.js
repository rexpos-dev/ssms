const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get academic reports
router.get('/academic/:studentId', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [report] = await connection.query(`
      SELECT
        sg.academic_year,
        COUNT(DISTINCT sg.subject_id) as total_subjects,
        AVG(sg.average_marks) as overall_average,
        MAX(sg.average_marks) as highest_subject,
        MIN(sg.average_marks) as lowest_subject
      FROM subject_grades sg
      WHERE sg.student_id = ?
      GROUP BY sg.academic_year
    `, [req.params.studentId]);
    connection.release();

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
