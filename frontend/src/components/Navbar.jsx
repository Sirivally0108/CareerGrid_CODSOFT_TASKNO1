import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        CareerGrid
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/jobs">Jobs</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            {user.role === "candidate" && (
              <Link to="/candidate">
                Dashboard
              </Link>
            )}

            {user.role === "employer" && (
              <>
                <Link to="/employer">
                  Dashboard
                </Link>

                <Link to="/post-job">
                  Post Job
                </Link>
              </>
            )}

            <Link to="/messages">
              Messages
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;