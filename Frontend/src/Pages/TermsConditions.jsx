import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function TermsConditions() {
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
          <p className="eyebrow">ACADEMY RULES</p>

          <h1>
            Terms and <span>Conditions</span>
          </h1>

          <div className="policy-item">
            <h3>Class Registration</h3>
            <p>
              Students must provide correct details while registering and choose
              the suitable batch timing.
            </p>
          </div>

          <div className="policy-item">
            <h3>Attendance</h3>
            <p>
              Students are expected to attend classes on time and inform the
              academy about planned absences.
            </p>
          </div>

          <div className="policy-item">
            <h3>Payments</h3>
            <p>
              Course fees should be paid before the start of the selected
              program or monthly batch.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TermsConditions;