import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/jobdetails.css";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

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

  const handleApplyClick = () => {
    setMessage("");
    setError("");

    if (!token) {
      setError("Please login as a candidate before applying.");
      return;
    }

    setShowApplicationForm(true);
  };

  const handleSubmitApplication = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Please login as a candidate before applying.");
      return;
    }

    if (!resume) {
      setError("Please select your resume.");
      return;
    }

    if (!coverLetter.trim()) {
      setError("Please enter a cover letter.");
      return;
    }

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
            job_id: job.id,
            resume: resume.name,
            cover_letter: coverLetter.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit application.");
        return;
      }

      setMessage("Application submitted successfully!");

      setShowApplicationForm(false);
      setResume(null);
      setCoverLetter("");
    } catch (error) {
      console.error(error);
      setError("Unable to submit application.");
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

          {!showApplicationForm && (
            <div className="job-actions">
              <button
                className="apply-button"
                onClick={handleApplyClick}
              >
                Apply Now
              </button>

              <Link to="/jobs" className="back-button">
                Back to Jobs
              </Link>
            </div>
          )}

          {showApplicationForm && (
            <form
              className="application-form"
              onSubmit={handleSubmitApplication}
            >
              <h2>Apply for this Job</h2>

              <div className="form-group">
                <label htmlFor="resume">
                  Resume
                </label>

                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) =>
                    setResume(event.target.files[0])
                  }
                />

                <small>
                  PDF, DOC or DOCX
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="coverLetter">
                  Cover Letter
                </label>

                <textarea
                  id="coverLetter"
                  rows="7"
                  placeholder="Tell the employer why you are suitable for this job..."
                  value={coverLetter}
                  onChange={(event) =>
                    setCoverLetter(event.target.value)
                  }
                />
              </div>

              <div className="application-form-actions">
                <button
                  type="submit"
                  className="apply-button"
                >
                  Submit Application
                </button>

                <button
                  type="button"
                  className="back-button"
                  onClick={() => {
                    setShowApplicationForm(false);
                    setMessage("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default JobDetails;