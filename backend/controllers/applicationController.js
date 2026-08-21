const pool = require("../config/db");
const { sendEmail } = require("../utils/emailService");

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can apply for jobs",
      });
    }

    const { job_id, cover_letter } = req.body;
    const resume = req.file ? req.file.filename : null;

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

    const candidateResult = await pool.query(
      "SELECT name, email FROM users WHERE id = $1",
      [req.user.id]
    );

    const candidate = candidateResult.rows[0];

    try {
      await sendEmail(
        candidate.email,
        `Application Submitted - ${jobResult.rows[0].title}`,
        `Hello ${candidate.name},

    Your application for "${jobResult.rows[0].title}" at ${jobResult.rows[0].company} has been successfully submitted.

    Application status: Applied

    Thank you for using CareerGrid.`
      );
    } catch (emailError) {
      console.error("Application email error:", emailError);
    }

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

// Employer updates application status
const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can update application status",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    // Make sure this application belongs to a job
    // posted by the logged-in employer.
    const applicationResult = await pool.query(
      `SELECT applications.id
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       WHERE applications.id = $1
       AND jobs.employer_id = $2`,
      [id, req.user.id]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const result = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    const candidateResult = await pool.query(
      `SELECT users.name, users.email, jobs.title, jobs.company
      FROM applications
      JOIN users ON applications.candidate_id = users.id
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.id = $1`,
      [id]
    );

    const candidate = candidateResult.rows[0];

    if (candidate) {
      try {
        await sendEmail(
          candidate.email,
          `Application Update - ${candidate.title}`,
          `Hello ${candidate.name},

    Your application for "${candidate.title}" at ${candidate.company} has been updated.

    New status: ${status}

    Please log in to CareerGrid to view your application.

    Thank you.`
        );
      } catch (emailError) {
        console.error("Status update email error:", emailError);
      }
    }
    res.json({
      message: "Application status updated successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Update application status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Candidate withdraws an application
const withdrawApplication = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can withdraw applications",
      });
    }

    const { id } = req.params;

    const result = await pool.query(
      `UPDATE applications
       SET status = 'Withdrawn'
       WHERE id = $1
       AND candidate_id = $2
       AND status <> 'Withdrawn'
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found or already withdrawn",
      });
    }

    res.json({
      message: "Application withdrawn successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Withdraw application error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  withdrawApplication,
};