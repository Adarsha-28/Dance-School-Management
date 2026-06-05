import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import "../Assets/CSS/Home.css";
import logo from "../Assets/Images/logo.png";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const showMessage = (text, error) => {
    setMessage(text);
    setIsError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userName = name.trim();
    const userEmail = email.trim().toLowerCase();

    if (!userName || userName.length < 3) {
      showMessage(
        "Please enter your full name (at least 3 characters).",
        true
      );
      return;
    }

    if (!userEmail) {
      showMessage("Please enter your email address.", true);
      return;
    }

    if (!emailRegex.test(userEmail)) {
      showMessage("Please enter a valid email address.", true);
      return;
    }

    if (!passwordRegex.test(password)) {
      showMessage(
        "Password must be at least 8 characters and include one uppercase letter, one number, and one special character.",
        true
      );
      return;
    }

    if (!acceptedTerms) {
      showMessage(
        "You must agree to the Terms & Conditions and Privacy Policy to register.",
        true
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Registration failed. Please try again.", true);
        return;
      }

      localStorage.setItem("danceAcademyLastSignupEmail", userEmail);

      showMessage(
        "Account created successfully! Redirecting to login...",
        false
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      showMessage("Server connection failed. Please try again later.", true);
    }
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

          <NavLink className="btn" to="/signup">
            JOIN NOW
          </NavLink>
        </nav>
      </header>

      <main className="auth-wrap">
        <form className="form-box" onSubmit={handleSubmit}>
          <div className="auth-logo-container">
            <img src={logo} alt="Dance Academy logo" className="auth-logo" />
          </div>

          <p className="eyebrow" style={{ textAlign: "center" }}>START DANCING</p>

          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Signup</h1>

          <p style={{ textAlign: "center", marginBottom: "25px" }}>
            Create your account and book your first dance class.
          </p>

          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className="form-group checkbox-group" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
            <input
              id="accept-terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              style={{ width: "auto", cursor: "pointer" }}
            />
            <label htmlFor="accept-terms" style={{ margin: 0, fontWeight: "normal", fontSize: "13px", cursor: "pointer", color: "#e2e0ff" }}>
              I agree to the <Link to="/terms" style={{ color: "#d946ef", textDecoration: "underline" }} target="_blank">Terms & Conditions</Link> and <Link to="/privacy" style={{ color: "#d946ef", textDecoration: "underline" }} target="_blank">Privacy Policy</Link>
            </label>
          </div>

          <button className="btn" type="submit" style={{ width: "100%", marginTop: "10px" }}>
            CREATE ACCOUNT
          </button>

          {message && (
            <p
              className="form-message"
              style={{
                color: isError
                  ? "#c0392b"
                  : "#1a9a12",
                marginTop: "15px",
                fontWeight: "600",
                textAlign: "center"
              }}
            >
              {message}
            </p>
          )}

          <div className="form-links" style={{ justifyContent: "center", marginTop: "20px" }}>
            <span>Already joined? </span>
            <Link to="/login" style={{ marginLeft: "5px", textDecoration: "underline" }}>
              Login here
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Signup;