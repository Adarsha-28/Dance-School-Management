import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
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
  );
}

export default Footer;
