import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/jobdetails.css";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs/${id}`
        );

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!token) {
      setError("Please login as a candidate before applying.");
      return;
    }

    setApplying(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            job_id: Number(id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to apply for this job");
      }

      setMessage("Application submitted successfully!");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="job-details-page">
          <p>Loading job details...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (error && !job) {
    return (
      <>
        <Navbar />

        <main className="job-details-page">
          <h2>Job Not Found</h2>
          <p>{error}</p>

          <Link to="/jobs" className="back-button">
            Back to Jobs
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="job-details-page">
        <div className="job-details-card">

          <div className="job-details-header">
            <div className="company-logo">
              {job.company?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1>{job.title}</h1>
              <p className="company-name">{job.company}</p>
            </div>
          </div>

          <div className="job-details-info">
            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p>
              <strong>Salary:</strong> {job.salary}
            </p>

            <p>
              <strong>Employment Type:</strong>{" "}
              {job.employment_type}
            </p>
          </div>

          <section>
            <h2>Job Description</h2>
            <p>{job.description}</p>
          </section>

          <section>
            <h2>Skills Required</h2>
            <p>{job.skills}</p>
          </section>

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {error && job && (
            <p className="error-message">
              {error}
            </p>
          )}

          <div className="job-actions">
            <button
              className="apply-button"
              onClick={handleApply}
              disabled={applying || !!message}
            >
              {applying
                ? "Applying..."
                : message
                ? "Applied"
                : "Apply Now"}
            </button>

            <Link to="/jobs" className="back-button">
              Back to Jobs
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default JobDetails;