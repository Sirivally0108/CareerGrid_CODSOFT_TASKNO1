import "../styles/jobcard.css";

function JobCard({ title, company, location, salary }) {
  return (
    <div className="job-card">
      <div className="job-card-top">
        <div className="company-logo">
          {company?.charAt(0)}
        </div>

        <span className="job-type">Full Time</span>
      </div>

      <h3>{title}</h3>

      <p className="company-name">{company}</p>

      <div className="job-info">
        <span>{location}</span>
        <span>{salary}</span>
      </div>

      <button>View Details</button>
    </div>
  );
}

export default JobCard;