const pool = require("../config/db");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, job_id, message } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    if (req.user.id === Number(receiver_id)) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }

    const receiver = await pool.query(
      "SELECT id, name, role FROM users WHERE id = $1",
      [receiver_id]
    );

    if (receiver.rows.length === 0) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO messages
       (sender_id, receiver_id, job_id, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        req.user.id,
        receiver_id,
        job_id || null,
        message,
      ]
    );

    res.status(201).json({
      message: "Message sent successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get conversation between logged-in user and another user
const getConversation = async (req, res) => {
  try {
    const otherUserId = Number(req.params.userId);

    if (!otherUserId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const result = await pool.query(
      `SELECT
        messages.*,
        sender.name AS sender_name,
        receiver.name AS receiver_name
       FROM messages
       JOIN users AS sender
         ON messages.sender_id = sender.id
       JOIN users AS receiver
         ON messages.receiver_id = receiver.id
       WHERE
         (messages.sender_id = $1 AND messages.receiver_id = $2)
         OR
         (messages.sender_id = $2 AND messages.receiver_id = $1)
       ORDER BY messages.sent_at ASC`,
      [req.user.id, otherUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get people the logged-in user has conversations with
const getContacts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT
        u.id,
        u.name,
        u.email,
        u.role
       FROM messages m
       JOIN users u
         ON u.id =
           CASE
             WHEN m.sender_id = $1 THEN m.receiver_id
             ELSE m.sender_id
           END
       WHERE m.sender_id = $1
          OR m.receiver_id = $1
       ORDER BY u.name`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  sendMessage,
  getConversation,
  getContacts,
};