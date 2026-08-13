const pool = require("../config/db");

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can apply for jobs",
      });
    }

    const { job_id, resume, cover_letter } = req.body;

    if (!job_id) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Check whether the job exists
    const jobResult = await pool.query(
      "SELECT * FROM jobs WHERE id = $1",
      [job_id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check whether candidate already applied
    const existingApplication = await pool.query(
      `SELECT * FROM applications
       WHERE job_id = $1 AND candidate_id = $2`,
      [job_id, req.user.id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create application
    const result = await pool.query(
      `INSERT INTO applications
       (job_id, candidate_id, resume, cover_letter, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        job_id,
        req.user.id,
        resume || null,
        cover_letter || null,
        "Applied",
      ]
    );

    res.status(201).json({
      message: "Application submitted successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Apply job error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get candidate's applications
const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can view their applications",
      });
    }

    const result = await pool.query(
      `SELECT
        applications.*,
        jobs.title,
        jobs.company,
        jobs.location
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       WHERE applications.candidate_id = $1
       ORDER BY applications.applied_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get applications for employer's jobs
const getEmployerApplications = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view applications",
      });
    }

    const result = await pool.query(
      `SELECT
        applications.*,
        jobs.title,
        jobs.company,
        users.name AS candidate_name,
        users.email AS candidate_email
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       JOIN users ON applications.candidate_id = users.id
       WHERE jobs.employer_id = $1
       ORDER BY applications.applied_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get employer applications error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
};