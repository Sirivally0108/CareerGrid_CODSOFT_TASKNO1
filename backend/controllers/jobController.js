const pool = require("../config/db");

const getJobs = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM jobs ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
};

const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM jobs WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({
            message: "Failed to fetch job"
        });
    }
};

module.exports = {
    getJobs,
    getJobById
};