const pool = require("../config/db");
const { sendEmail } = require("../utils/emailService");

// ======================================================
// APPLY FOR A JOB
// ======================================================
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

    // Check whether job exists
    const jobResult = await pool.query(
      "SELECT * FROM jobs WHERE id = $1",
      [job_id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check duplicate application
    const existingApplication = await pool.query(
      `SELECT *
       FROM applications
       WHERE job_id = $1
       AND candidate_id = $2`,
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
        resume,
        cover_letter || null,
        "Applied",
      ]
    );

    // Get candidate information
    const candidateResult = await pool.query(
      `SELECT name, email
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    const candidate = candidateResult.rows[0];

    // Send email
    if (candidate) {
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
    }

    return res.status(201).json({
      message: "Application submitted successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Apply job error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// GET CANDIDATE APPLICATIONS
// IMPORTANT: Withdrawn applications are NOT returned
// ======================================================
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
       JOIN jobs
         ON applications.job_id = jobs.id
       WHERE applications.candidate_id = $1
       AND LOWER(COALESCE(applications.status, 'Applied')) <> 'withdrawn'
       ORDER BY applications.applied_at DESC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Get candidate applications error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// GET EMPLOYER APPLICATIONS
// IMPORTANT: Withdrawn applications are NOT returned
// ======================================================
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
        users.id AS candidate_id,
        users.name AS candidate_name,
        users.email AS candidate_email
       FROM applications
       JOIN jobs
         ON applications.job_id = jobs.id
       JOIN users
         ON applications.candidate_id = users.id
       WHERE jobs.employer_id = $1
       AND LOWER(COALESCE(applications.status, 'Applied')) <> 'withdrawn'
       ORDER BY applications.applied_at DESC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Get employer applications error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================
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

    // Make sure application belongs to employer's job
    const applicationResult = await pool.query(
      `SELECT applications.id
       FROM applications
       JOIN jobs
         ON applications.job_id = jobs.id
       WHERE applications.id = $1
       AND jobs.employer_id = $2`,
      [id, req.user.id]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Update status
    const result = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    // Get candidate information
    const candidateResult = await pool.query(
      `SELECT
        users.name,
        users.email,
        jobs.title,
        jobs.company
       FROM applications
       JOIN users
         ON applications.candidate_id = users.id
       JOIN jobs
         ON applications.job_id = jobs.id
       WHERE applications.id = $1`,
      [id]
    );

    const candidate = candidateResult.rows[0];

    // Send status email
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

    return res.json({
      message: "Application status updated successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// ======================================================
// CANDIDATE WITHDRAWS APPLICATION
// ======================================================
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
       AND LOWER(COALESCE(status, 'Applied')) <> 'withdrawn'
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found or already withdrawn",
      });
    }

    return res.json({
      message: "Application withdrawn successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Withdraw application error:", error);

    return res.status(500).json({
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