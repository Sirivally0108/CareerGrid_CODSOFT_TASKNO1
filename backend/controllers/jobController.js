const pool = require("../config/db");

// Create a new job
const createJob = async (req, res) => {
  try {
    // Only employers can post jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can post jobs",
      });
    }

    const {
      title,
      company,
      location,
      salary,
      employment_type,
      description,
      skills,
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        message: "Title, company, location and description are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO jobs
      (title, company, location, salary, employment_type, description, skills, employer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        title,
        company,
        location,
        salary,
        employment_type,
        description,
        skills,
        req.user.id,
      ]
    );

    res.status(201).json({
      message: "Job posted successfully",
      job: result.rows[0],
    });
  } catch (error) {
    console.error("Create job error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM jobs
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get one job
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM jobs WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get job error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get jobs posted by the logged-in employer
const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view their jobs",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM jobs
       WHERE employer_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get my jobs error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
};