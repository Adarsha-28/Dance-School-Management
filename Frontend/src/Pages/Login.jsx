import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import "../Assets/CSS/Home.css";
import logo from "../Assets/Images/logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showMessage = (text, error) => {
    setMessage(text);
    setIsError(error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userEmail = email.trim().toLowerCase();

    if (!userEmail) {
      showMessage("Please enter your email address.", true);
      return;
    }

    if (!emailRegex.test(userEmail)) {
      showMessage("Please enter a valid email address.", true);
      return;
    }

    if (!password) {
      showMessage("Please enter your password.", true);
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("danceAcademyUsers") || "{}"
    );

    const userRecord = users[userEmail];

    if (!userRecord) {
      showMessage(
        "No account found for this email. Please sign up first.",
        true
      );
      return;
    }

    if (userRecord.password !== password) {
      showMessage("Invalid email or password. Please try again.", true);
      return;
    }

    sessionStorage.setItem("danceAcademyLoggedIn", "true");

    sessionStorage.setItem(
      "danceAcademyUser",
      JSON.stringify({
        name: userRecord.name,
        email: userRecord.email,
      })
    );

    localStorage.setItem(
      "danceAcademyLastLoginEmail",
      userEmail
    );

    showMessage("Login successful! Redirecting...", false);

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div className="page">
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

          <NavLink to="/contact">
            CONTACT
          </NavLink>

          <Link className="btn" to="/signup">
            JOIN NOW
          </Link>
        </nav>
      </header>

      <main className="auth-wrap">
        <form className="form-box" onSubmit={handleSubmit}>
          <p className="eyebrow">WELCOME BACK</p>

          <h1>Login</h1>

          <p>
            Access your classes, schedules, and dance updates.
          </p>

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button className="btn" type="submit">
            LOGIN
          </button>

          {message && (
            <p
              className="form-message"
              style={{
                color: isError
                  ? "#c0392b"
                  : "#1a9a12",
                marginTop: "15px",
              }}
            >
              {message}
            </p>
          )}

          <div className="form-links">
            <Link to="/forgot-password">
              Forgot password?
            </Link>

            <Link to="/admin">
              Admin Panel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;