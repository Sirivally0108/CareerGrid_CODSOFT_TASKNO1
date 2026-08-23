import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const fetchApplications = async () => {
    if (!token) {
      setError("Please login as an employer.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/applications/employer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load applications");
      }

      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const updateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: data.application.status,
              }
            : application
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to update application status.");
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

          <Link to="/employer" className="dashboard-button">
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
                const status = application.status || "Applied";

                return (
                  <div
                    className="application-card"
                    key={application.id}
                  >
                    <div>
                      <h3>{application.candidate_name}</h3>

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
                            href={`http://localhost:5000/uploads/${application.resume}`}
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
                        onClick={() => openMessage(application)}
                      >
                        💬 Message Candidate
                      </button>

                      <button
                        type="button"
                        className="view-job-button"
                        disabled={updatingId === application.id}
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "Shortlisted"
                          )
                        }
                      >
                        Shortlist
                      </button>

                      <button
                        type="button"
                        className="view-job-button"
                        disabled={updatingId === application.id}
                        onClick={() =>
                          updateStatus(
                            application.id,
                            "Rejected"
                          )
                        }
                      >
                        Reject
                      </button>
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