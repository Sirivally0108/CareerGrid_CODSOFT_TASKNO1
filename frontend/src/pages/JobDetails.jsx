import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/jobdetails.css";

function JobDetails() {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <main className="job-details-page">
        <div className="job-details-container">

          <div className="job-details-header">
            <div className="company-logo">C</div>

            <div>
              <h1>Java Backend Developer</h1>
              <p className="details-company">InnoTech Labs</p>
            </div>

            <span className="details-job-type">Full Time</span>
          </div>

          <div className="job-meta">
            <span>📍 Bangalore, India</span>
            <span>💰 ₹7 - ₹12 LPA</span>
            <span>💼 Full Time</span>
          </div>

          <hr />

          <section>
            <h2>Job Description</h2>
            <p>
              Develop scalable backend services and REST APIs for enterprise
              applications.
            </p>
          </section>

          <section>
            <h2>Required Skills</h2>

            <div className="skills">
              <span>Java</span>
              <span>Spring Boot</span>
              <span>REST API</span>
              <span>PostgreSQL</span>
            </div>
          </section>

          <button className="apply-button">
            Apply Now
          </button>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default JobDetails;