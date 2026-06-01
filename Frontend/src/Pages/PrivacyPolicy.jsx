import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function PrivacyPolicy() {
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
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/about">ABOUT</NavLink>
          <NavLink to="/courses">COURSES</NavLink>
          <NavLink to="/contact">CONTACT</NavLink>
          <NavLink className="btn" to="/signup">
            JOIN NOW
          </NavLink>
        </nav>
      </header>

      <main className="content-page">
        <section className="content-box">
          <p className="eyebrow">YOUR DATA</p>

          <h1>
            Privacy <span>Policy</span>
          </h1>

          <div className="policy-item">
            <h3>Information We Collect</h3>
            <p>
              We may collect your name, email, phone number, and class
              preferences when you register or contact us.
            </p>
          </div>

          <div className="policy-item">
            <h3>How We Use It</h3>
            <p>
              Your information is used to manage classes, send updates, and
              improve your academy experience.
            </p>
          </div>

          <div className="policy-item">
            <h3>Data Safety</h3>
            <p>
              We keep your details private and do not sell your personal
              information to other companies.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPolicy;