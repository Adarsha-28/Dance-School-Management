import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function Contact() {
  return (
    <div className="page">
          <header className="navbar">
            <a className="brand" href="/">
              <img src={logo} alt="Dance Academy logo" />
              <strong>
                DANCE <span>ACADEMY</span>
              </strong>
            </a>

          <nav className="nav-links">
            <Link to="/">HOME</Link>
            <Link to="/about">ABOUT</Link>
            <Link to="/courses">COURSES</Link>
            <Link className="active" to="/contact">
              CONTACT
            </Link>
            <Link className="btn" to="/signup">
              JOIN NOW
            </Link>
          </nav>
    </header>

      <main className="contact-page">
        <div className="contact-header">
          <div>
            <p className="eyebrow">GET IN TOUCH</p>

            <h1>
              Contact <span>Us</span>
            </h1>

            <p>
              Have questions about classes, fees, batches, or trial sessions?
              Send a message and our academy team will contact you soon.
            </p>
          </div>

          <div className="contact-card">
            <h2>Studio Details</h2>

            <p>
              <strong>Address:</strong> 123 Dance Street, Mumbai, India
            </p>

            <p>
              <strong>Phone:</strong> +91 98765 43210
            </p>

            <p>
              <strong>Email:</strong> info@danceacademy.com
            </p>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Class Enquiry</h3>

            <p>
              Ask about dance styles, batch timing, admission process, or trial
              class options.
            </p>

            <Link className="btn enquiry-btn" to="/enquiry">
              Open Enquiry Form
            </Link>
          </div>

          <form className="form-panel">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter phone number" />
              </div>

              <div className="form-group">
                <label>Interested Course</label>

                <select>
                  <option>Choose course</option>
                  <option>Hip Hop</option>
                  <option>Bharatanatyam</option>
                  <option>Contemporary</option>
                  <option>Salsa</option>
                  <option>Zumba</option>
                  <option>Kathak</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>

              <textarea rows="5" placeholder="Write your message"></textarea>
            </div>

            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Contact;