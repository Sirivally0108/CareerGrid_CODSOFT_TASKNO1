import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/postjob.css";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    employment_type: "Full Time",
    description: "",
    skills: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSubmitting(true);

    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Please login as an employer to post a job.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post job");
      }

      setMessage("Job posted successfully!");

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        employment_type: "Full Time",
        description: "",
        skills: "",
      });

      setTimeout(() => {
        navigate("/jobs");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="post-job-page">
        <div className="post-job-card">
          <h1>Post a Job</h1>

          <p className="post-job-subtitle">
            Find the right candidate for your company.
          </p>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend React Developer"
                required
              />
            </div>

            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. TechNova Solutions"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad, India"
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹6 - ₹10 LPA"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Employment Type</label>

              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label>Skills</label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Git, HTML, CSS"
              />
            </div>

            <div className="form-group">
              <label>Job Description *</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities and requirements..."
                rows="7"
                required
              />
            </div>

            <button
              type="submit"
              className="post-job-button"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PostJob;