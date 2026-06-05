import React from "react";
import "../Assets/CSS/Home.css";
import logo from "../Assets/Images/logo.png";
import First from "../Assets/Images/First.png";
import img1 from "../Assets/Images/img1.png";
import img4 from "../Assets/Images/img4.png";
import img2 from "../Assets/Images/img2.png";

import { Link, NavLink } from "react-router-dom";

function Homepage() {
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

          <Link className="btn" to="/signup">
            JOIN NOW
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">MOVE. EXPRESS. INSPIRE.</p>

            <h1>
              DANCE IS <span>YOUR SUPERPOWER</span>
            </h1>

            <p>
              Join our dance family and discover the joy of movement. All ages,
              all styles, and all levels are welcome.
            </p>

            <div className="hero-actions">
              <Link className="btn" to="/courses">
                EXPLORE CLASSES
              </Link>

              <Link className="btn secondary" to="/feedback">
                GIVE FEEDBACK
              </Link>

              <Link className="btn secondary" to="/application">
                APPLY NOW
              </Link>
            </div>
          </div>

          <img
            className="hero-image"
            src={First}
            alt="Dancer performing on purple smoke"
          />
        </section>

        <section className="stats">
          <div className="stat">
            <strong>500+</strong>
            Happy Students
          </div>

          <div className="stat">
            <strong>25+</strong>
            Expert Trainers
          </div>

          <div className="stat">
            <strong>100+</strong>
            Dance Shows
          </div>

          <div className="stat">
            <strong>10+</strong>
            Years Experience
          </div>
        </section>

        <section className="section light">
          <h2 className="section-title">
            Popular <span>Dance Courses</span>
          </h2>

          <div className="grid">
            <div className="card">
              <img className="course-img" src={img1} alt="Hip Hop" />

              <h3>Hip Hop</h3>

              <p>
                High energy moves, rhythm practice, and freestyle confidence.
              </p>
            </div>

            <div className="card">
              <img
                className="course-img"
                src={img4}
                alt="Bharatanatyam"
              />

              <h3>Bharatanatyam</h3>

              <p>
                Grace, expression, posture, and traditional Indian dance basics.
              </p>
            </div>

            <div className="card">
              <img
                className="course-img"
                src={img2}
                alt="Contemporary"
              />

              <h3>Contemporary</h3>

              <p>
                Fluid movement, storytelling, strength, and creative expression.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">
            Why Choose <span>Our Academy?</span>
          </h2>

          <div className="grid">
            <div className="card">
              <h3>Professional Trainers</h3>

              <p>
                Learn from skilled instructors who guide every student with
                care.
              </p>
            </div>

            <div className="card">
              <h3>Flexible Timings</h3>

              <p>
                Morning and evening batches make it easy to keep dancing.
              </p>
            </div>

            <div className="card">
              <h3>Stage Opportunities</h3>

              <p>
                Perform in academy events, competitions, and seasonal
                showcases.
              </p>
            </div>
          </div>
        </section>

        <section className="section light" id="testimonials">
          <h2 className="section-title">
            Student & Parent <span>Reviews</span>
          </h2>

          <div className="grid">
            <div className="card">
              <div style={{ color: "#f39c12", marginBottom: "10px", fontSize: "18px" }}>★★★★★</div>
              <p style={{ fontStyle: "italic", marginBottom: "15px" }}>
                "The instructors at Dance Academy are incredible! My daughter has built so much confidence in her Hip Hop class. Highly recommend!"
              </p>
              <strong style={{ color: "#222" }}>- Priya Sharma (Parent)</strong>
            </div>

            <div className="card">
              <div style={{ color: "#f39c12", marginBottom: "10px", fontSize: "18px" }}>★★★★★</div>
              <p style={{ fontStyle: "italic", marginBottom: "15px" }}>
                "As a beginner, I was nervous to try Salsa. The instructors broke down the steps perfectly and made it so much fun. I'm hooked!"
              </p>
              <strong style={{ color: "#222" }}>- Rohan Kapoor (Student)</strong>
            </div>

            <div className="card">
              <div style={{ color: "#f39c12", marginBottom: "10px", fontSize: "18px" }}>★★★★★</div>
              <p style={{ fontStyle: "italic", marginBottom: "15px" }}>
                "Excellent classical training! The Bharatanatyam classes are detailed and focus a lot on mudras and rhythm. It's a wonderful space."
              </p>
              <strong style={{ color: "#222" }}>- Anjali Mehta (Student)</strong>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <h3>DANCE ACADEMY</h3>

          <p>
            Empowering students through rhythm, movement, and confidence.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>

          <Link to="/about">About Us</Link>

          <Link to="/courses">Courses</Link>

          <Link to="/application">Application Form</Link>

          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Resources</h4>

          <Link to="/feedback">Feedback Form</Link>

          <Link to="/admin">Admin Panel</Link>

          <Link to="/privacy">Privacy Policy</Link>

          <Link to="/terms">Terms and Conditions</Link>

          <Link to="/faq">FAQs</Link>
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

export default Homepage;