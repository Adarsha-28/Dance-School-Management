import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function Enquiry() {
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

      <main className="auth-wrap">
        <form className="form-box wide">
          <p className="eyebrow">ASK US ANYTHING</p>

          <h1>
            Enquiry <span>Form</span>
          </h1>

          <p>
            Send your details and our team will contact you with batch, fee,
            and course information.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Interested Course</label>

              <select id="course">
                <option>Hip Hop</option>
                <option>Bharatanatyam</option>
                <option>Contemporary</option>
                <option>Salsa</option>
                <option>Zumba</option>
                <option>Kathak</option>
                <option>Kids Dance</option>
                <option>Wedding Choreography</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="level">Dance Level</label>

              <select id="level">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timing">Preferred Timing</label>

              <select id="timing">
                <option>Morning Batch</option>
                <option>Evening Batch</option>
                <option>Weekend Batch</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>

            <textarea
              id="message"
              rows="5"
              placeholder="Tell us what you want to know"
            ></textarea>
          </div>

          <button className="btn" type="submit">
            SUBMIT ENQUIRY
          </button>
        </form>
      </main>
    </div>
  );
}

export default Enquiry;