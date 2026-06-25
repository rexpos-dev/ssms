const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get dashboard data based on role
router.get('/:role', authenticate, async (req, res) => {
  try {
    const { role } = req.params;
    const connection = await pool.getConnection();

    let data = {};

    if (role === 'admin') {
      const [students] = await connection.query('SELECT COUNT(*) as count FROM students WHERE status = "active"');
      const [teachers] = await connection.query('SELECT COUNT(*) as count FROM teachers');
      const [parents] = await connection.query('SELECT COUNT(*) as count FROM parents');

      data = {
        totalStudents: students[0].count,
        totalTeachers: teachers[0].count,
        totalParents: parents[0].count,
      };
    } else if (role === 'teacher') {
      const [classes] = await connection.query(`
        SELECT COUNT(*) as count FROM class_assignments WHERE teacher_id IN (
          SELECT id FROM teachers WHERE user_id = ?
        )
      `, [req.user.id]);

      data = { totalClasses: classes[0].count };
    }

    connection.release();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
