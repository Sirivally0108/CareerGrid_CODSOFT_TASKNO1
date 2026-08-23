const express = require("express");

const {
  sendMessage,
  getConversation,
  getMyMessages,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Send message
router.post("/", authMiddleware, sendMessage);

// Get all messages for logged-in user
router.get("/my", authMiddleware, getMyMessages);

// Get conversation with another user
router.get(
  "/conversation/:userId",
  authMiddleware,
  getConversation
);

module.exports = router;