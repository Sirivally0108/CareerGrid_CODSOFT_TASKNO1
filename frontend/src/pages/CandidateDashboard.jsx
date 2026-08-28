import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "https://careergrid-codsoft-taskno1.onrender.com/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    } else {
      setError("Please login to view your dashboard.");
      setLoading(false);
    }
  }, [token]);
  const handleWithdraw = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://careergrid-codsoft-taskno1.onrender.com/api/applications/${applicationId}/withdraw`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to withdraw application.");
        return;
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: "Withdrawn" }
            : application
        )
      );

      alert("Application withdrawn successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to withdraw application.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Candidate Dashboard</h1>
            <p>Track your job applications and opportunities.</p>
          </div>

          <Link to="/jobs" className="dashboard-button">
            Browse Jobs
          </Link>
        </div>

        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>{applications.length}</h3>
            <p>Total Applications</p>
          </div>

          <div className="stat-card">
            <h3>
              {
                applications.filter(
                  (application) =>(application.status || "").toLowerCase() === "applied"
                ).length
              }
            </h3>
            <p>Pending</p>
          </div>

          <div className="stat-card">
            <h3>
              {
                applications.filter(
                  (application) => (application.status || "").toLowerCase() === "shortlisted"
                ).length
              }
            </h3>
            <p>Shortlisted</p>
          </div>

          <div className="stat-card">
            <h3>
              {
                applications.filter(
                  (application) => (application.status || "").toLowerCase() === "rejected"
                ).length
              }
            </h3>
            <p>Rejected</p>
          </div>
        </section>

        <section className="applications-section">
          <h2>My Applications</h2>

          {loading && (
            <p className="dashboard-message">
              Loading your applications...
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
              <p>Start exploring jobs and apply for your next opportunity.</p>

              <Link to="/jobs" className="dashboard-button">
                Find Jobs
              </Link>
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="applications-list">
              {applications.map((application) => (
                <div
                  className="application-card"
                  key={application.id}
                >
                  <div>
                    <h3>{application.title}</h3>

                    <p className="application-company">
                      {application.company}
                    </p>

                    <p>
                      📍 {application.location}
                    </p>

                    <p>
                      Applied:{" "}
                      {application.applied_at
                        ? new Date(
                            application.applied_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="application-actions">
                    <span
                      className={`status ${application.status || "pending"}`}
                    >
                      {application.status || "Pending"}
                    </span>

                    <Link
                      to={`/jobs/${application.job_id}`}
                      className="view-job-button"
                    >
                      View Job
                    </Link>
                    {["Applied", "Shortlisted"].includes(application.status) && (
                      <button
                        className="view-job-button"
                        onClick={() => handleWithdraw(application.id)}
                      >
                        Withdraw Application
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CandidateDashboard;
