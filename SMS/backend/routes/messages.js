const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get messages for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [messages] = await connection.query(`
      SELECT m.*, u.first_name, u.last_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.recipient_id = ? OR m.sender_id = ?
      ORDER BY m.created_at DESC
      LIMIT 50
    `, [req.user.id, req.user.id]);
    connection.release();

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
