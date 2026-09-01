import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import "../styles/featuredjobs.css";

function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("https://careergrid-codsoft-taskno1.onrender.com/api/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }
        return response.json();
      })
      .then((data) => {
        // Make sure we only work with an array
        if (Array.isArray(data)) {
          setJobs(data.slice(0, 3));
        } else {
          console.error("Jobs API did not return an array:", data);
          setJobs([]);
        }
      })
      .catch((error) => {
        console.error("Error loading featured jobs:", error);
        setJobs([]);
      });
  }, []);

  return (
    <section className="featured">
      <h2>Featured Jobs</h2>

      <div className="job-container">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            jobType={job.job_type || job.employment_type}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;