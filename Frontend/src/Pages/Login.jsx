import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Assets/CSS/Home.css";
import logo from "../Assets/Images/logo.png";
import Navbar from "../Components/Navbar";
import { getApiUrl } from "../utils/api";

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

  const handleSubmit = async (e) => {
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

    try {
      const response = await fetch(getApiUrl("api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Invalid email or password.", true);
        return;
      }

      sessionStorage.setItem("danceAcademyLoggedIn", "true");
      sessionStorage.setItem("danceAcademyToken", data.token);
      sessionStorage.setItem(
        "danceAcademyUser",
        JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        })
      );

      localStorage.setItem(
        "danceAcademyLastLoginEmail",
        userEmail
      );

      showMessage("Login successful! Redirecting...", false);

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1200);
    } catch (error) {
      console.error("Login error:", error);
      showMessage("Server connection failed. Please try again later.", true);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="auth-wrap">
        <form className="form-box" onSubmit={handleSubmit}>
          <div className="auth-logo-container">
            <img src={logo} alt="Dance Academy logo" className="auth-logo" />
          </div>

          <p className="eyebrow" style={{ textAlign: "center" }}>WELCOME BACK</p>

          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h1>

          <p style={{ textAlign: "center", marginBottom: "25px" }}>
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

          <button className="btn" type="submit" style={{ width: "100%", marginTop: "20px" }}>
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
                textAlign: "center"
              }}
            >
              {message}
            </p>
          )}

          <div className="form-links" style={{ marginTop: "20px" }}>
            <Link to="/forgot-password" style={{ textDecoration: "underline" }}>
              Forgot password?
            </Link>
            <Link to="/signup" style={{ textDecoration: "underline" }}>
              New user
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
