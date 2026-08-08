import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import "../styles/jobs.css";

function Jobs() {

  const jobs = [
    {
      id: 1,
      title: "React Developer",
      company: "Google",
      location: "Hyderabad, India",
      salary: "₹12 LPA"
    },
    {
      id: 2,
      title: "Java Backend Developer",
      company: "InnoTech Labs",
      location: "Bangalore, India",
      salary: "₹7 - ₹12 LPA"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "TCS",
      location: "Remote",
      salary: "₹7 LPA"
    }
  ];

  return (
    <>
      <Navbar />

      <main className="jobs-page">

        <div className="jobs-header">
          <h1>Find Jobs</h1>
          <p>
            Explore opportunities that match your skills and career goals.
          </p>
        </div>

        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
            />
          ))}
        </div>

      </main>

      <Footer />
    </>
  );
}

export default Jobs;