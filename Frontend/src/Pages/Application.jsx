import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function Application() {
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
          <p className="eyebrow">ADMISSION DETAILS</p>

          <h1>
            Application <span>Form</span>
          </h1>

          <p>
            Fill in your admission details to apply for a dance academy batch.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="student-name">Student Name</label>
              <input
                id="student-name"
                type="text"
                placeholder="Enter student name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                placeholder="Enter age"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="guardian">
                Parent / Guardian Name
              </label>

              <input
                id="guardian"
                type="text"
                placeholder="Enter guardian name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Course</label>

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
              <label htmlFor="batch">Preferred Batch</label>

              <select id="batch">
                <option>Morning Batch</option>
                <option>Evening Batch</option>
                <option>Weekend Batch</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experience">
                Previous Experience
              </label>

              <select id="experience">
                <option>No Experience</option>
                <option>Less than 1 Year</option>
                <option>1 to 3 Years</option>
                <option>More than 3 Years</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>

            <textarea
              id="address"
              rows="4"
              placeholder="Enter full address"
            ></textarea>
          </div>

          <button className="btn" type="submit">
            SEND APPLICATION
          </button>

          <div className="form-links">
            <span>Need help choosing a course?</span>

            <Link to="/enquiry">
              Make an enquiry
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Application;