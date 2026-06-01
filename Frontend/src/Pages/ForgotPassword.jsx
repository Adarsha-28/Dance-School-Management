import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("Password reset instructions have been sent to your email.");
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
          <Link to="/">HOME</Link>
          <Link to="/about">ABOUT</Link>
          <Link to="/courses">COURSES</Link>
          <Link to="/contact">CONTACT</Link>
          <Link className="btn" to="/signup">
            JOIN NOW
          </Link>
        </nav>
      </header>

      <main className="auth-wrap">
        <form className="form-box" onSubmit={handleSubmit}>
          <p className="eyebrow">RESET ACCESS</p>

          <h1>Forgot Password</h1>

          <p>
            Enter your email and we will send password reset instructions.
          </p>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="btn" type="submit">
            SEND RESET LINK
          </button>

          {message && (
            <p
              className="form-message"
              style={{ marginTop: "15px", color: "#1a9a12" }}
            >
              {message}
            </p>
          )}

          <div className="form-links">
            <Link to="/login">Back to Login</Link>
            <Link to="/signup">Create Account</Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;