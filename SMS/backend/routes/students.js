const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all students (admin/teacher only)
router.get('/', authenticate, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query(`
      SELECT
        s.id, s.user_id, s.roll_number, s.admission_number,
        u.first_name, u.last_name, u.email, u.phone,
        s.current_grade_id, s.current_section_id,
        g.grade_name, sec.section_name,
        s.status, s.admission_date
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN grades g ON s.current_grade_id = g.id
      LEFT JOIN sections sec ON s.current_section_id = sec.id
      ORDER BY s.roll_number
      LIMIT 100
    `);
    connection.release();

    res.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get single student
router.get('/:id', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query(`
      SELECT
        s.*, u.first_name, u.last_name, u.email, u.phone, u.date_of_birth,
        g.grade_name, sec.section_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN grades g ON s.current_grade_id = g.id
      LEFT JOIN sections sec ON s.current_section_id = sec.id
      WHERE s.id = ?
    `, [req.params.id]);
    connection.release();

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      success: true,
      data: students[0],
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Get student dashboard data
router.get('/:id/dashboard', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Get student info
    const [students] = await connection.query(`
      SELECT s.*, u.first_name, u.last_name, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [req.params.id]);

    if (students.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get current grades
    const [grades] = await connection.query(`
      SELECT
        sub.subject_name, sub.subject_code,
        sg.total_marks, sg.average_marks, sg.grade_letter
      FROM subject_grades sg
      JOIN subjects sub ON sg.subject_id = sub.id
      WHERE sg.student_id = ? AND sg.status = 'completed'
      ORDER BY sub.subject_name
    `, [req.params.id]);

    // Get attendance
    const [attendance] = await connection.query(`
      SELECT
        COUNT(*) as total_classes,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
        ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as attendance_percentage
      FROM attendance
      WHERE student_id = ? AND attendance_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    `, [req.params.id]);

    // Get upcoming assignments
    const [assignments] = await connection.query(`
      SELECT
        a.id, a.title, a.due_date,
        COALESCE(asub.submission_status, 'not_submitted') as status
      FROM assignments a
      JOIN class_assignments ca ON a.class_assignment_id = ca.id
      JOIN student_subjects ss ON ca.subject_id = ss.subject_id
      LEFT JOIN assignment_submissions asub ON a.id = asub.assignment_id AND asub.student_id = ?
      WHERE ss.student_id = ? AND a.due_date >= CURDATE()
      ORDER BY a.due_date
      LIMIT 10
    `, [req.params.id, req.params.id]);

    connection.release();

    res.json({
      success: true,
      data: {
        student: students[0],
        grades,
        attendance: attendance[0],
        assignments,
      },
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
