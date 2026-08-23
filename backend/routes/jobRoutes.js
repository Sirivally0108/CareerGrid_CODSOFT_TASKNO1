const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone can view all jobs
router.get("/", getJobs);

// Logged-in employer can view their own jobs
router.get("/my", authMiddleware, getMyJobs);

// Anyone can view one job
router.get("/:id", getJobById);

// Only logged-in employers can create jobs
router.post("/", authMiddleware, createJob);

module.exports = router;