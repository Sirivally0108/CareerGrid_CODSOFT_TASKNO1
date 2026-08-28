import { Link } from "react-router-dom";
import "../styles/jobcard.css";

function JobCard({ id, title, company, location, salary, jobType }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo">
          {company?.charAt(0).toUpperCase()}
        </div>

        <span className="job-type">
          {jobType || "Full Time"}
        </span>
      </div>

      <h3>{title}</h3>

      <p className="company-name">{company}</p>

      <div className="job-info">
        <span>📍 {location}</span>
        <span>💰 {salary}</span>
      </div>

      <Link
        to={`/jobs/${id}`}
        className="view-details"
      >
        View Details
      </Link>
    </div>
  );
}

export default JobCard;
