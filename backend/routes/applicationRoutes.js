const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Candidate applies for a job
router.post("/", authMiddleware, applyForJob);

// Candidate views their applications
router.get("/my", authMiddleware, getMyApplications);

// Employer views applications for their jobs
router.get("/employer", authMiddleware, getEmployerApplications);

module.exports = router;