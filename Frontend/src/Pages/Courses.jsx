import React from "react";
import { Link } from "react-router-dom";

import logo from "../Assets/Images/logo.png";
import img1 from "../Assets/Images/img1.png";
import img2 from "../Assets/Images/img2.png";
import img3 from "../Assets/Images/img3.png";
import img4 from "../Assets/Images/img4.png";
import img5 from "../Assets/Images/img5.png";
import img6 from "../Assets/Images/img6.png";
import img7 from "../Assets/Images/img7.png";
import img8 from "../Assets/Images/img8.png";

function Courses() {
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
          <Link className="active" to="/courses">
            COURSES
          </Link>
          <Link to="/contact">CONTACT</Link>
          <Link className="btn" to="/signup">
            JOIN NOW
          </Link>
        </nav>
      </header>

      <main>
        <section className="content-page">
          <div className="content-box">
            <p className="eyebrow">TRAIN WITH US</p>

            <h1>
              Dance <span>Courses</span>
            </h1>

            <p>
              Choose from energetic, classical, fitness, and performance-focused
              dance programs. Each course is taught with step-by-step training,
              practice sessions, and stage confidence.
            </p>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">
            All Dance <span>Varieties</span>
          </h2>

          <div className="grid">
            <div className="card course-card">
              <img className="course-img" src={img1} alt="Hip Hop" />
              <h3>Hip Hop</h3>
              <p>
                Learn grooves, footwork, freestyle, musicality, and powerful
                street-style combinations.
              </p>

              <div className="course-meta">
                <span>Beginner to Advanced</span>
                <span>3 Days / Week</span>
              </div>
            </div>

            <div className="card course-card">
              <img className="course-img" src={img4} alt="Bharatanatyam" />
              <h3>Bharatanatyam</h3>
              <p>
                Build grace, posture, expressions, mudras, rhythm, and
                classical performance discipline.
              </p>

              <div className="course-meta">
                <span>All Levels</span>
                <span>Weekend Batch</span>
              </div>
            </div>

            <div className="card course-card">
              <img className="course-img" src={img2} alt="Contemporary" />
              <h3>Contemporary</h3>
              <p>
                Explore fluid movement, body control, floor work, emotion, and
                creative storytelling.
              </p>

              <div className="course-meta">
                <span>Intermediate</span>
                <span>Evening Batch</span>
              </div>
            </div>

            <div className="card course-card">
              <img className="course-img" src={img3} alt="Salsa" />
              <h3>Salsa</h3>
              <p>
                Practice partner work, turns, rhythm, timing, basic steps, and
                confident social dancing.
              </p>

              <div className="course-meta">
                <span>Beginner Friendly</span>
                <span>2 Days / Week</span>
              </div>
            </div>

            <div className="card course-card">
              <img className="course-img" src={img5} alt="Zumba" />
              <h3>Zumba</h3>
              <p>
                Enjoy dance fitness with fun choreography, cardio movement,
                stamina, and full-body energy.
              </p>

              <div className="course-meta">
                <span>Fitness Batch</span>
                <span>Morning / Evening</span>
              </div>
            </div>

            <div className="card course-card">
              <img className="course-img" src={img6} alt="Kathak" />
              <h3>Kathak</h3>
              <p>
                Learn footwork, spins, hand gestures, rhythm cycles, and
                graceful classical presentation.
              </p>

              <div className="course-meta">
                <span>Foundation Level</span>
                <span>Weekend Batch</span>
              </div>
            </div>

            <div className="card course-card">
              <img className="course-img" src={img7} alt="Kids Dance" />
              <h3>Kids Dance</h3>
              <p>
                A cheerful class for children with basic rhythm, coordination,
                confidence, and performance practice.
              </p>

              <div className="course-meta">
                <span>Ages 5 to 12</span>
                <span>After School</span>
              </div>
            </div>

            <div className="card course-card">
              <img
                className="course-img"
                src={img8}
                alt="Wedding Choreography"
              />
              <h3>Wedding Choreography</h3>
              <p>
                Custom choreography for solo, couple, family, and group
                performances for special events.
              </p>

              <div className="course-meta">
                <span>Custom Plan</span>
                <span>Private Sessions</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <h3>DANCE ACADEMY</h3>
          <p>Empowering students through rhythm, movement, and confidence.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/application">Application Form</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Resources</h4>
          <Link to="/enquiry">Enquiry Form</Link>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms and Conditions</Link>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>
            +91 98765 43210
            <br />
            info@danceacademy.com
            <br />
            Mumbai, India
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Courses;