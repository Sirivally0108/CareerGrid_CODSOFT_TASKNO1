const express = require("express");

const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected users route
router.get("/", authMiddleware, getUsers);

module.exports = router;