const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get parent's children
router.get('/children', authenticate, authorize('parent'), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [parents] = await connection.query(`
      SELECT sp.student_id FROM student_parents sp
      JOIN parents p ON sp.parent_id = p.id
      WHERE p.user_id = ?
    `, [req.user.id]);

    const studentIds = parents.map(p => p.student_id);
    if (studentIds.length === 0) {
      connection.release();
      return res.json({ success: true, data: [] });
    }

    const [students] = await connection.query(`
      SELECT s.id, s.roll_number, u.first_name, u.last_name, u.email, g.grade_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN grades g ON s.current_grade_id = g.id
      WHERE s.id IN (${studentIds.join(',')})
    `);
    connection.release();

    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

module.exports = router;
