import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero">
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
    </section>
  );
}

export default Hero;