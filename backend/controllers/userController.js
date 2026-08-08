const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!["candidate", "employer"].includes(role)) {
      return res.status(400).json({
        message: "Role must be candidate or employer",
      });
    }

    const existingUser = await User.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createUser(
      name,
      email,
      hashedPassword,
      role
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  getUsers,
};