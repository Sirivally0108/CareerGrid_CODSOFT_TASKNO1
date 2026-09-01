import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import "../styles/jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The Home page search box now sends candidates here as
  // ?search=...&location=..., and this page also keeps its own
  // search box in sync with those params so a shared/bookmarked
  // link still shows the same filtered results.
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "https://careergrid-codsoft-taskno1.onrender.com/api/jobs"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const activeKeyword = (searchParams.get("search") || "").toLowerCase().trim();
  const activeLocation = (searchParams.get("location") || "").toLowerCase().trim();

  const filteredJobs = jobs.filter((job) => {
    // The Home page hero has a single search field (matching the
    // reference design), so it also needs to match on location —
    // otherwise typing a city there would silently return nothing.
    // The Jobs page's own dedicated location field still narrows
    // results further via activeLocation below.
    const matchesKeyword =
      !activeKeyword ||
      [job.title, job.company, job.skills, job.location]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(activeKeyword));

    const matchesLocation =
      !activeLocation ||
      (job.location || "").toLowerCase().includes(activeLocation);

    return matchesKeyword && matchesLocation;
  });

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setKeyword("");
    setLocation("");
    setSearchParams({});
  };

  const isFiltering = Boolean(activeKeyword || activeLocation);

  return (
    <>
      <Navbar />

      <main className="jobs-page">
        <div className="jobs-header">
          <h1>Find Your Next Opportunity</h1>
          <p>
            Explore jobs from companies hiring through CareerGrid.
          </p>
        </div>

        <form className="jobs-search-box" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Job title, keywords or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit" className="jobs-search-button">
            Search
          </button>

          {isFiltering && (
            <button
              type="button"
              className="jobs-search-clear"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </form>

        {loading && (
          <p className="jobs-message">Loading jobs...</p>
        )}

        {error && (
          <p className="jobs-error">{error}</p>
        )}

        {!loading && !error && (
          <div className="jobs-container">
            {filteredJobs.length === 0 ? (
              <p className="jobs-message">
                {isFiltering
                  ? "No jobs match your search."
                  : "No jobs available at the moment."}
              </p>
            ) : (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  salary={job.salary}
                  jobType={job.employment_type}
                />
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Jobs;
