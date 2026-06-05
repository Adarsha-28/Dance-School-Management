import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import Navbar from "../Components/Navbar";

function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeStudents: 0,
    totalFeedback: 0,
    pendingApplications: 0,
  });
  const [applications, setApplications] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("danceAcademyToken");
  const userStr = sessionStorage.getItem("danceAcademyUser");

  useEffect(() => {
    // Check if user is admin
    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        navigate("/");
        return;
      }
    } catch (e) {
      navigate("/login");
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch Stats
        const statsRes = await fetch("http://localhost:5000/api/admin/dashboard", { headers });
        const statsData = await statsRes.json();

        // Fetch Applications
        const appsRes = await fetch("http://localhost:5000/api/applications", { headers });
        const appsData = await appsRes.json();

        // Fetch Feedbacks
        const feedbacksRes = await fetch("http://localhost:5000/api/feedback", { headers });
        const feedbacksData = await feedbacksRes.json();

        // Fetch Courses
        const coursesRes = await fetch("http://localhost:5000/api/courses");
        const coursesData = await coursesRes.json();

        if (statsRes.ok && appsRes.ok && feedbacksRes.ok && coursesRes.ok) {
          setStats(statsData);
          setApplications(appsData);
          setFeedbacks(feedbacksData);
          setCourses(coursesData);
          setError("");
        } else {
          setError("Failed to load dashboard data. Please try again.");
        }
      } catch (err) {
        console.error("Fetch stats error:", err);
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, userStr, navigate]);

  const handleApplicationStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh local state
        const updatedApps = applications.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        );
        setApplications(updatedApps);

        // Recalculate quick stats locally
        const active = updatedApps.filter((a) => a.status === "Approved").length;
        const pending = updatedApps.filter((a) => a.status === "Pending").length;
        setStats((prev) => ({
          ...prev,
          activeStudents: active,
          pendingApplications: pending,
        }));
      } else {
        alert("Failed to update application status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server.");
    }
  };

  const handleUpdateSeats = async (id, newSeats) => {
    if (!newSeats || Number(newSeats) < 0) {
      alert("Please enter a valid seat count (0 or more).");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}/seats`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seats: Number(newSeats) }),
      });

      if (response.ok) {
        const updatedCourses = courses.map((course) =>
          course._id === id ? { ...course, seats: Number(newSeats) } : course
        );
        setCourses(updatedCourses);
        alert("Seats updated successfully!");
      } else {
        alert("Failed to update course seats.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server.");
    }
  };



  return (
    <div className="page">
      <Navbar />

      <main className="admin-shell">
        <aside className="admin-sidebar">
          <h3>Admin Panel</h3>

          <a href="#dashboard">Dashboard</a>
          <a href="#applications">Applications</a>
          <a href="#feedback">Feedback</a>
          <a href="#courses">Courses</a>
          <a href="#batches">Batches</a>
        </aside>

        <section className="admin-main">
          {error && (
            <div
              style={{
                background: "#fde8e8",
                color: "#e53e3e",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <h2>Loading Dashboard Data...</h2>
            </div>
          ) : (
            <>
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
                  <strong>{stats.activeStudents}</strong>
                  <p>Active Students</p>
                </div>

                <div className="card summary-card">
                  <strong>{stats.totalFeedback}</strong>
                  <p>Total Feedback Reviews</p>
                </div>

                <div className="card summary-card">
                  <strong>{stats.pendingApplications}</strong>
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
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            No applications found.
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app._id}>
                            <td>
                              <strong>{app.studentName}</strong>
                              <div style={{ fontSize: "12px", color: "#666" }}>
                                Age: {app.age} | Guardian: {app.guardianName || "N/A"}
                              </div>
                            </td>
                            <td>{app.course}</td>
                            <td>{app.batch}</td>
                            <td>{app.phone}</td>
                            <td>
                              <span
                                className={`status ${
                                  app.status === "Approved"
                                    ? "approved"
                                    : app.status === "Follow Up"
                                    ? "followup"
                                    : ""
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td>
                              <select
                                value={app.status}
                                onChange={(e) =>
                                  handleApplicationStatus(app._id, e.target.value)
                                }
                                style={{
                                  padding: "5px",
                                  borderRadius: "4px",
                                  border: "1px solid #ccc",
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approve</option>
                                <option value="Follow Up">Follow Up</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="section" id="feedback">
                <h2 className="section-title">
                  Latest <span>Feedback Reviews</span>
                </h2>

                <div className="grid two">
                  {feedbacks.length === 0 ? (
                    <div className="card" style={{ gridColumn: "span 2", textAlign: "center" }}>
                      <p>No feedback found.</p>
                    </div>
                  ) : (
                    feedbacks.map((f) => (
                      <div className="card" key={f._id} style={{ position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h3>{f.name}</h3>
                          <span
                            style={{ fontSize: "15px", color: "#f39c12", fontWeight: "bold" }}
                          >
                            {"★".repeat(f.rating) + "☆".repeat(5 - f.rating)}
                          </span>
                        </div>
                        <p style={{ margin: "5px 0", fontSize: "13px", color: "#888" }}>
                          <strong>Email:</strong> {f.email}
                        </p>
                        <p style={{ marginTop: "10px", fontStyle: "italic" }}>
                          "{f.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="section" id="courses">
                <h2 className="section-title">
                  Manage <span>Course Seats</span>
                </h2>

                <div className="card table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Level / Pricing</th>
                        <th>Current Seats Available</th>
                        <th>Update Available Seats</th>
                      </tr>
                    </thead>

                    <tbody>
                      {courses.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            No courses loaded.
                          </td>
                        </tr>
                      ) : (
                        courses.map((course) => (
                          <tr key={course._id}>
                            <td>
                              <strong>{course.title}</strong>
                            </td>
                            <td>{course.level} | {course.fees}</td>
                            <td>
                              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#d946ef" }}>
                                {course.seats}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <input
                                  type="number"
                                  min="0"
                                  defaultValue={course.seats}
                                  id={`seats-input-${course._id}`}
                                  style={{
                                    width: "80px",
                                    padding: "6px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    background: "rgba(255, 255, 255, 0.08)",
                                    color: "white",
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const input = document.getElementById(`seats-input-${course._id}`);
                                    if (input) {
                                      handleUpdateSeats(course._id, input.value);
                                    }
                                  }}
                                  className="btn"
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                  }}
                                >
                                  Update
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                      Timing: 8:00 AM - 10:00 AM
                    </p>
                  </div>

                  <div className="card">
                    <h3>Evening</h3>
                    <p>Contemporary, Salsa, Hip Hop</p>
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                      Timing: 5:00 PM - 8:00 PM
                    </p>
                  </div>

                  <div className="card">
                    <h3>Weekend</h3>
                    <p>Kathak, Kids Dance, Wedding Choreography</p>
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                      Timing: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Admin;