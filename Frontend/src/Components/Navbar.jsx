import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check login state on mount and subscribe to changes
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = sessionStorage.getItem("danceAcademyLoggedIn") === "true";
      const userStr = sessionStorage.getItem("danceAcademyUser");
      setIsLoggedIn(loggedIn);
      if (loggedIn && userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage events (e.g. login updates) or standard polling/updates
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("danceAcademyLoggedIn");
    sessionStorage.removeItem("danceAcademyToken");
    sessionStorage.removeItem("danceAcademyUser");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <img src={logo} alt="Dance Academy logo" />
        <strong>
          DANCE <span>ACADEMY</span>
        </strong>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
          HOME
        </NavLink>

        <NavLink to="/about">
          ABOUT
        </NavLink>

        <NavLink to="/courses">
          COURSES
        </NavLink>

        {user?.role !== "admin" && (
          <NavLink to="/contact">
            CONTACT
          </NavLink>
        )}

        {isLoggedIn ? (
          <>
            {user?.role === "admin" && (
              <NavLink to="/admin">
                ADMIN PANEL
              </NavLink>
            )}
            {user?.role !== "admin" && (
              <NavLink to="/profile" className="profile-icon-link" title="Profile">
                👤
              </NavLink>
            )}
            <button
              className="btn logout-btn"
              onClick={handleLogout}
              style={{
                background: "linear-gradient(135deg, #7a25ff, #d02dff)",
                marginLeft: "8px",
                border: "none"
              }}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link className="btn" to="/signup">
              JOIN NOW
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
