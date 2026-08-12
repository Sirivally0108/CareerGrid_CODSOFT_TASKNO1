const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone can view all jobs
router.get("/", getJobs);

// Anyone can view one job
router.get("/:id", getJobById);

// Only logged-in employers can create jobs
router.post("/", authMiddleware, createJob);

module.exports = router;