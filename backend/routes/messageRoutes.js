const express = require("express");

const {
  sendMessage,
  getConversation,
  getContacts,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, sendMessage);

router.get("/contacts", authMiddleware, getContacts);

router.get(
  "/conversation/:userId",
  authMiddleware,
  getConversation
);

module.exports = router;