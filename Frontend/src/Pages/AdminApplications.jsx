import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";
import { getApiUrl } from "../utils/api";

function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

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

  // Notifications dismiss timer
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleApplicationStatus = async (id, newStatus) => {
    try {
      const response = await fetch(getApiUrl(`api/applications/${id}/status`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedApps = applications.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        );
        setApplications(updatedApps);
        triggerNotification("Application status updated successfully!", "success");
      } else {
        triggerNotification("Failed to update application status.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error contacting server.", "error");
    }
  };

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="applications" />

        <section className="admin-main">
          {notification && (
            <div
              className={`admin-notification ${notification.type}`}
              style={{
                padding: "15px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                animation: "slideDown 0.3s ease-out",
                border: notification.type === "success" ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                background: notification.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                backdropFilter: "blur(8px)",
                color: notification.type === "success" ? "#4ade80" : "#f87171",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>{notification.type === "success" ? "✓" : "✗"}</span>
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "0 5px",
                }}
              >
                &times;
              </button>
            </div>
          )}

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
              <h2>Loading Student Applications...</h2>
            </div>
          ) : (
            <>
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
                            <div style={{ fontSize: "12px", color: "#888" }}>
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
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                color: "white",
                              }}
                            >
                              <option value="Pending" style={{ color: "#000" }}>Pending</option>
                              <option value="Approved" style={{ color: "#000" }}>Approve</option>
                              <option value="Follow Up" style={{ color: "#000" }}>Follow Up</option>
                            </select>
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

export default AdminApplications;
