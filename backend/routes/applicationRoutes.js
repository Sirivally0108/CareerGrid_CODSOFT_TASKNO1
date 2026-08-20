const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
// Candidate applies for a job
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  applyForJob
);

// Candidate views their applications
router.get("/my", authMiddleware, getMyApplications);

// Employer views applications for their jobs
router.get("/employer", authMiddleware, getEmployerApplications);
router.patch("/:id/status", authMiddleware, updateApplicationStatus);
router.patch("/:id/withdraw", authMiddleware, withdrawApplication);

module.exports = router;