import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

const API_URL =
  "https://careergrid-codsoft-taskno1.onrender.com/api";

function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const { jobId } = useParams();

  const fetchApplications = async () => {
    if (!token) {
      setError("Please login as an employer.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/applications/employer`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to load applications (${response.status})`
        );
      }

      // Remove withdrawn applications from employer dashboard
      let visibleApplications = Array.isArray(data)
        ? data.filter(
            (application) =>
              (application.status || "").toLowerCase() !== "withdrawn"
          )
        : [];

      // If this page was opened for one particular job,
      // only show applications for that job.
      if (jobId) {
        visibleApplications = visibleApplications.filter(
          (application) =>
            String(application.job_id) === String(jobId)
        );
      }

      setApplications(visibleApplications);
    } catch (err) {
      console.error("Employer applications error:", err);
      setError(
        err.message || "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token, jobId]);

  const updateStatus = async (applicationId, status) => {
    if (!token) {
      setError("Please login as an employer.");
      return;
    }

    setUpdatingId(applicationId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update application status"
        );
      }

      const updatedApplication = data.application;

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                ...updatedApplication,
                status: updatedApplication.status,
              }
            : application
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
      setError(
        err.message || "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openMessage = (application) => {
    navigate(
      `/messages?user=${application.candidate_id}&job=${application.job_id}`
    );
  };

  const appliedCount = applications.filter(
    (application) =>
      (application.status || "").toLowerCase() === "applied"
  ).length;

  const shortlistedCount = applications.filter(
    (application) =>
      (application.status || "").toLowerCase() === "shortlisted"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      (application.status || "").toLowerCase() === "rejected"
  ).length;

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Job Applications</h1>

            <p>
              Review and manage candidates who applied for your jobs.
            </p>
          </div>

          <Link
            to="/employer"
            className="dashboard-button"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>{applications.length}</h3>
            <p>Total Applications</p>
          </div>

          <div className="stat-card">
            <h3>{appliedCount}</h3>
            <p>New Applications</p>
          </div>

          <div className="stat-card">
            <h3>{shortlistedCount}</h3>
            <p>Shortlisted</p>
          </div>

          <div className="stat-card">
            <h3>{rejectedCount}</h3>
            <p>Rejected</p>
          </div>
        </section>

        {loading && (
          <p className="dashboard-message">
            Loading applications...
          </p>
        )}

        {error && (
          <p className="dashboard-error">
            {error}
          </p>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="empty-dashboard">
            <h3>No applications yet</h3>

            <p>
              Candidates who apply for your jobs will appear here.
            </p>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <section className="applications-section">
            <h2>Applicants</h2>

            <div className="applications-list">
              {applications.map((application) => {
                const status =
                  application.status || "Applied";

                return (
                  <div
                    className="application-card"
                    key={application.id}
                  >
                    <div>
                      <h3>
                        {application.candidate_name}
                      </h3>

                      <p className="application-company">
                        {application.candidate_email}
                      </p>

                      <p>
                        <strong>Job:</strong>{" "}
                        {application.title}
                      </p>

                      <p>
                        <strong>Company:</strong>{" "}
                        {application.company}
                      </p>

                      <p>
                        <strong>Resume:</strong>{" "}
                        {application.resume ? (
                          <a
                            href={`${API_URL.replace(
                              "/api",
                              ""
                            )}/uploads/${application.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-job-button"
                          >
                            📄 View Resume
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>

                      <p>
                        <strong>Cover Letter:</strong>
                      </p>

                      <p>
                        {application.cover_letter ||
                          "No cover letter provided."}
                      </p>

                      <p>
                        <strong>Applied:</strong>{" "}
                        {application.applied_at
                          ? new Date(
                              application.applied_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="application-actions">
                      <span
                        className={`status ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>

                      <button
                        type="button"
                        className="view-job-button"
                        onClick={() =>
                          openMessage(application)
                        }
                      >
                        💬 Message Candidate
                      </button>

                      <label>
                        <strong>Status:</strong>{" "}
                        <select
                          value={status}
                          disabled={
                            updatingId === application.id
                          }
                          onChange={(event) =>
                            updateStatus(
                              application.id,
                              event.target.value
                            )
                          }
                        >
                          <option value="Applied">
                            Applied
                          </option>

                          <option value="Shortlisted">
                            Shortlisted
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default EmployerApplications;