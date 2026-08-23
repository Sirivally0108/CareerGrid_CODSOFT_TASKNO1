require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// User routes
app.use("/api/users", userRoutes);

// Job routes
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);

// Application routes
app.use("/api/applications", applicationRoutes);
// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});

// Home API
app.get("/", (req, res) => {
  res.json({
    message: "CODSOFT Job Board API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
    res.send("CareerGrid Backend is Running!");
});

app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});