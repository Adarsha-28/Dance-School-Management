import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import "../Assets/CSS/Home.css";
import logo from "../Assets/Images/logo.png";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const showMessage = (text, error) => {
    setMessage(text);
    setIsError(error);
  };

  const handleSubmit = (e) => {
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

    const users = JSON.parse(
      localStorage.getItem("danceAcademyUsers") || "{}"
    );

    if (users[userEmail]) {
      showMessage(
        "This email is already registered. Please login instead.",
        true
      );
      return;
    }

    users[userEmail] = {
      name: userName,
      email: userEmail,
      password: password,
    };

    localStorage.setItem(
      "danceAcademyUsers",
      JSON.stringify(users)
    );

    localStorage.setItem(
      "danceAcademyLastSignupEmail",
      userEmail
    );

    sessionStorage.setItem(
      "danceAcademyLoggedIn",
      "true"
    );

    sessionStorage.setItem(
      "danceAcademyUser",
      JSON.stringify({
        name: userName,
        email: userEmail,
      })
    );

    showMessage(
      "Account created successfully! Redirecting to login...",
      false
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);
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
          <p className="eyebrow">START DANCING</p>

          <h1>Signup</h1>

          <p>
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

          <button className="btn" type="submit">
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
              }}
            >
              {message}
            </p>
          )}

          <div className="form-links">
            <span>Already joined?</span>

            <Link to="/login">
              Login here
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Signup;