import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function FAQ() {
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
          <p className="eyebrow">HELP CENTER</p>

          <h1>
            Frequently Asked <span>Questions</span>
          </h1>

          <div className="faq-item">
            <h3>Do beginners need dance experience?</h3>
            <p>
              No. Our beginner batches start with basic rhythm, posture, and
              movement.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I attend a trial class?</h3>
            <p>
              Yes. Contact us or sign up online to book your first trial class.
            </p>
          </div>

          <div className="faq-item">
            <h3>What styles do you teach?</h3>
            <p>
              We teach Hip Hop, Bharatanatyam, Contemporary, Salsa, Zumba, and
              Stage Performance.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are there weekend batches?</h3>
            <p>
              Yes. We have weekday and weekend timings for students and working
              professionals.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FAQ;