import { Link } from "react-router-dom";
import "../styles/jobcard.css";

function JobCard({ id, title, company, location, salary }) {
  return (
    <div className="job-card">

      <div className="job-card-top">
        <div className="company-logo-small">
          {company?.charAt(0)}
        </div>

        <span className="job-type">
          Full Time
        </span>
      </div>

      <h3>{title}</h3>

      <p className="company-name">
        {company}
      </p>

      <div className="job-info">
        <span>📍 {location}</span>
        <span>💰 {salary}</span>
      </div>

      <Link to={`/jobs/${id}`} className="details-button">
        View Details
      </Link>

    </div>
  );
}

export default JobCard;