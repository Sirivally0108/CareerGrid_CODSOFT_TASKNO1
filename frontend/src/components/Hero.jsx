import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import heroImage from "../assets/careergrid-hero.png";

function Hero() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const searchTerm = keyword.trim();

    navigate(
      searchTerm
        ? `/jobs?search=${encodeURIComponent(searchTerm)}`
        : "/jobs"
    );
  };

  return (
    <section className="hero">
      <div className="hero-content">

        <div className="hero-text">
          <h1>Find Your Dream Job</h1>

          <p>
            Discover thousands of opportunities from top companies
            across India.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search jobs..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="hero-visual">
          <img
            src={heroImage}
            alt="Person working on a laptop, surrounded by icons representing design, development and career growth"
            className="hero-image"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;