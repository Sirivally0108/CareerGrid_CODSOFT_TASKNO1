import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <div className="hero-text">
          <span className="hero-label">CAREERGRID</span>

          <h1>
            Find Your Dream <span>Job</span>
          </h1>

          <p>
            Discover thousands of opportunities from top companies
            across India and take the next step in your career.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Job title, keywords or company"
            />

            <input
              type="text"
              placeholder="Location"
              className="location-input"
            />

            <button>Search Jobs</button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>
            <button>React Developer</button>
            <button>Java Developer</button>
            <button>UI/UX Designer</button>
          </div>
        </div>

        <div className="hero-visual">

          <div className="decorative-circle circle-one"></div>
          <div className="decorative-circle circle-two"></div>

          <div className="workspace-card">
            <div className="plant">
              <div className="leaf leaf-one"></div>
              <div className="leaf leaf-two"></div>
              <div className="leaf leaf-three"></div>
              <div className="plant-pot"></div>
            </div>

            <div className="chair">
              <div className="chair-back"></div>
              <div className="chair-seat"></div>
              <div className="chair-leg"></div>
            </div>

            <div className="laptop">
              <div className="laptop-screen">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="laptop-base"></div>
            </div>
          </div>

          <div className="active-jobs-card">
            <div className="stat-icon">✓</div>
            <div>
              <strong>20K+</strong>
              <small>Active Jobs</small>
            </div>
          </div>

        </div>

      </div>

      <div className="hero-stats">

        <div className="stat-item">
          <strong>20K+</strong>
          <span>Active Jobs</span>
        </div>

        <div className="stat-item">
          <strong>5K+</strong>
          <span>Companies</span>
        </div>

        <div className="stat-item">
          <strong>10K+</strong>
          <span>Job Seekers</span>
        </div>

      </div>
    </section>
  );
}

export default Hero;