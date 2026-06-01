import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import "../Assets/CSS/Home.css";

function Admin() {
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

          <NavLink to="/admin">
            ADMIN
          </NavLink>

          <NavLink className="btn" to="/login">
            LOGOUT
          </NavLink>
        </nav>
      </header>

      <main className="admin-shell">
        <aside className="admin-sidebar">
          <h3>Admin Panel</h3>

          <a href="#dashboard">Dashboard</a>
          <a href="#applications">Applications</a>
          <a href="#enquiries">Enquiries</a>
          <a href="#batches">Batches</a>
        </aside>

        <section className="admin-main">
          <div className="admin-header" id="dashboard">
            <div>
              <p className="eyebrow">ACADEMY OVERVIEW</p>
              <h1>Dashboard</h1>
            </div>

            <Link className="btn" to="/application">
              NEW APPLICATION
            </Link>
          </div>

          <div className="grid">
            <div className="card summary-card">
              <strong>48</strong>
              <p>Active Students</p>
            </div>

            <div className="card summary-card">
              <strong>12</strong>
              <p>New Enquiries</p>
            </div>

            <div className="card summary-card">
              <strong>8</strong>
              <p>Pending Applications</p>
            </div>
          </div>

          <section className="section" id="applications">
            <h2 className="section-title">
              Recent <span>Applications</span>
            </h2>

            <div className="card table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Batch</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Riya Sharma</td>
                    <td>Hip Hop</td>
                    <td>Evening</td>
                    <td>98765 43210</td>
                    <td>
                      <span className="status">Pending</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Aarav Mehta</td>
                    <td>Kathak</td>
                    <td>Weekend</td>
                    <td>99887 77665</td>
                    <td>
                      <span className="status approved">
                        Approved
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Neha Iyer</td>
                    <td>Zumba</td>
                    <td>Morning</td>
                    <td>91234 56780</td>
                    <td>
                      <span className="status followup">
                        Follow Up
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="section" id="enquiries">
            <h2 className="section-title">
              Latest <span>Enquiries</span>
            </h2>

            <div className="grid two">
              <div className="card">
                <h3>Priya Kapoor</h3>
                <p>
                  Interested in Contemporary, evening batch.
                  Asked about fees and trial class.
                </p>
              </div>

              <div className="card">
                <h3>Manav Rao</h3>
                <p>
                  Looking for kids dance class for age 8,
                  weekend timing preferred.
                </p>
              </div>
            </div>
          </section>

          <section className="section" id="batches">
            <h2 className="section-title">
              Batch <span>Overview</span>
            </h2>

            <div className="grid">
              <div className="card">
                <h3>Morning</h3>
                <p>Hip Hop, Zumba, Bharatanatyam</p>
              </div>

              <div className="card">
                <h3>Evening</h3>
                <p>Contemporary, Salsa, Hip Hop</p>
              </div>

              <div className="card">
                <h3>Weekend</h3>
                <p>
                  Kathak, Kids Dance, Wedding Choreography
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Admin;