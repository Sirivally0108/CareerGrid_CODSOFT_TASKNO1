require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded resumes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});

// Home
app.get("/", (req, res) => {
  res.json({
    message: "CareerGrid Backend is Running!",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err && err.name === "MulterError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      message: err.message || "Something went wrong.",
    });
  }

  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});