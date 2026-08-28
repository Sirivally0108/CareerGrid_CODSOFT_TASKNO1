import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import "../styles/jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "https://careergrid-codsoft-taskno1.onrender.com/api/jobs"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />

      <main className="jobs-page">
        <div className="jobs-header">
          <h1>Find Your Next Opportunity</h1>
          <p>
            Explore jobs from companies hiring through CareerGrid.
          </p>
        </div>

        {loading && (
          <p className="jobs-message">Loading jobs...</p>
        )}

        {error && (
          <p className="jobs-error">{error}</p>
        )}

        {!loading && !error && (
          <div className="jobs-container">
            {jobs.length === 0 ? (
              <p className="jobs-message">
                No jobs available at the moment.
              </p>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  salary={job.salary}
                  jobType={job.employment_type}
                />
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Jobs;
