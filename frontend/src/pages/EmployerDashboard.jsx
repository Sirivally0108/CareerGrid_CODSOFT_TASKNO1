import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/jobs/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your jobs.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyJobs();
    } else {
      setError("Please login as an employer.");
      setLoading(false);
    }
  }, [token]);

  return (
    <>
      <Navbar />

      <main className="dashboard-page">

        <div className="dashboard-header">
          <div>
            <h1>Employer Dashboard</h1>
            <p>Manage your job postings and applications.</p>
          </div>

          <Link to="/post-job" className="dashboard-button">
            + Post a Job
          </Link>
        </div>

        <section className="dashboard-stats">

          <div className="stat-card">
            <h3>{jobs.length}</h3>
            <p>My Jobs</p>
          </div>

          <div className="stat-card">
            <h3>Active</h3>
            <p>Job Postings</p>
          </div>

        </section>

        <section className="applications-section">

          <h2>My Job Postings</h2>

          {loading && (
            <p className="dashboard-message">
              Loading your jobs...
            </p>
          )}

          {error && (
            <p className="dashboard-error">
              {error}
            </p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="empty-dashboard">
              <h3>No jobs posted yet</h3>
              <p>Create your first job posting to start receiving applications.</p>

              <Link to="/post-job" className="dashboard-button">
                Post Your First Job
              </Link>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="applications-list">

              {jobs.map((job) => (
                <div className="application-card" key={job.id}>

                  <div>
                    <h3>{job.title}</h3>

                    <p className="application-company">
                      {job.company}
                    </p>

                    <p>
                      📍 {job.location}
                    </p>

                    <p>
                      💰 {job.salary || "Salary not specified"}
                    </p>

                    <p>
                      {job.employment_type || "Full Time"}
                    </p>
                  </div>

                  <div className="application-actions">

                    <Link
                      to={`/jobs/${job.id}`}
                      className="view-job-button"
                    >
                      View Job
                    </Link>

                    <Link
                      to={`/employer/applications/${job.id}`}
                      className="view-job-button"
                    >
                      Applications
                    </Link>

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

export default EmployerDashboard;