import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";
import { getApiUrl } from "../utils/api";

function AdminJoinedStudents() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
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

    // Fetch applications
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const appsRes = await fetch(getApiUrl("api/applications"), { headers });
        const appsData = await appsRes.json();

        if (appsRes.ok) {
          setApplications(appsData);
          setError("");
        } else {
          setError("Failed to load applications data.");
        }
      } catch (err) {
        console.error("Fetch apps error:", err);
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token, userStr, navigate]);

  const joinedStudents = applications.filter((app) => app.status === "Approved");

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="joined-students" />

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
              <h2>Loading Enrolled Students List...</h2>
            </div>
          ) : (
            <>
              <h2 className="section-title">
                Joined <span>Students ({joinedStudents.length})</span>
              </h2>

              <div className="card table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Age</th>
                      <th>Guardian</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Enrolled Course</th>
                      <th>Batch</th>
                      <th>Fee Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joinedStudents.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          No joined students found.
                        </td>
                      </tr>
                    ) : (
                      joinedStudents.map((app) => (
                        <tr key={app._id}>
                          <td>
                            <strong>{app.studentName}</strong>
                          </td>
                          <td>{app.age}</td>
                          <td>{app.guardianName || "N/A"}</td>
                          <td>{app.phone}</td>
                          <td>{app.email}</td>
                          <td>{app.course}</td>
                          <td>{app.batch}</td>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                backgroundColor: app.paid ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                border: app.paid ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                                color: app.paid ? "#22c55e" : "#f59e0b",
                              }}
                            >
                              {app.paid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminJoinedStudents;
