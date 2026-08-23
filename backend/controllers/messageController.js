const pool = require("../config/db");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, job_id, message } = req.body;

    if (!receiver_id || !message || !message.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    if (Number(receiver_id) === Number(senderId)) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }

    const receiverResult = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [receiver_id]
    );

    if (receiverResult.rows.length === 0) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    if (job_id) {
      const jobResult = await pool.query(
        "SELECT id FROM jobs WHERE id = $1",
        [job_id]
      );

      if (jobResult.rows.length === 0) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO messages
       (sender_id, receiver_id, job_id, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        senderId,
        receiver_id,
        job_id || null,
        message.trim(),
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


// Get conversation for a specific user AND job
const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId: otherUserId } = req.params;
    const { job_id } = req.query;

    let query = `
      SELECT
        messages.id,
        messages.sender_id,
        messages.receiver_id,
        messages.job_id,
        messages.message,
        messages.sent_at,
        sender.name AS sender_name,
        receiver.name AS receiver_name
      FROM messages
      JOIN users sender
        ON messages.sender_id = sender.id
      JOIN users receiver
        ON messages.receiver_id = receiver.id
      WHERE
        (
          (messages.sender_id = $1 AND messages.receiver_id = $2)
          OR
          (messages.sender_id = $2 AND messages.receiver_id = $1)
        )
    `;

    const params = [userId, otherUserId];

    if (job_id) {
      query += ` AND messages.job_id = $3`;
      params.push(job_id);
    }

    query += ` ORDER BY messages.sent_at ASC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get all messages involving logged-in user
const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        messages.*,
        sender.name AS sender_name,
        receiver.name AS receiver_name,
        jobs.title AS job_title,
        jobs.company
       FROM messages
       JOIN users sender
         ON messages.sender_id = sender.id
       JOIN users receiver
         ON messages.receiver_id = receiver.id
       LEFT JOIN jobs
         ON messages.job_id = jobs.id
       WHERE messages.sender_id = $1
          OR messages.receiver_id = $1
       ORDER BY messages.sent_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  sendMessage,
  getConversation,
  getMyMessages,
};