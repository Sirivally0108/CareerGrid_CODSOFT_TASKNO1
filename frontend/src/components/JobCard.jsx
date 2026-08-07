import "../styles/jobcard.css";

function JobCard({ title, company, location, salary }) {
  return (
    <div className="job-card">
      <h3>{title}</h3>

      <p><strong>Company:</strong> {company}</p>

      <p><strong>Location:</strong> {location}</p>

      <p><strong>Salary:</strong> {salary}</p>

      <button>Apply Now</button>
    </div>
  );
}

export default JobCard;