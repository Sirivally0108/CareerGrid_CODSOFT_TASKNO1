
import "../styles/hero.css";
import heroImage from "../assets/careergrid-hero.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-text">
          <h1>Find Your Dream Job</h1>

          <p>
            Discover thousands of opportunities from top companies
            across India.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search jobs..."
            />

            <button>Search</button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={heroImage}
            alt="Career opportunities illustration"
          />
        </div>

      </div>

    </section>
  );
}

export default Hero;