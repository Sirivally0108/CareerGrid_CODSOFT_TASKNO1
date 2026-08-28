import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import "../styles/featuredjobs.css";

function FeaturedJobs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch("https://careergrid-codsoft-taskno1.onrender.com/api/jobs")
            .then((response) => response.json())
            .then((data) => {
                setJobs(data.slice(0, 3));
            })
            .catch((error) => {
                console.error("Error loading featured jobs:", error);
            });
    }, []);

    return (
        <section className="featured">
            <h2>Featured Jobs</h2>

            <div className="job-container">
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        salary={job.salary}
                    />
                ))}
            </div>
        </section>
    );
}

export default FeaturedJobs;
