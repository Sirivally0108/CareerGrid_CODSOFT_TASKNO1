import JobCard from "./JobCard";
import "../styles/featuredjobs.css";

function FeaturedJobs() {

  const jobs = [
    {
      title: "React Developer",
      company: "Google",
      location: "Hyderabad",
      salary: "₹12 LPA"
    },
    {
      title: "Java Developer",
      company: "Infosys",
      location: "Bangalore",
      salary: "₹8 LPA"
    },
    {
      title: "UI/UX Designer",
      company: "TCS",
      location: "Remote",
      salary: "₹7 LPA"
    }
  ];

  return (
    <section className="featured">

      <h2>Featured Jobs</h2>

      <div className="job-container">

        {jobs.map((job, index) => (

          <JobCard
            key={index}
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