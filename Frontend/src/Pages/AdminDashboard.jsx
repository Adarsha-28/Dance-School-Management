import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";
import { getApiUrl } from "../utils/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeStudents: 0,
    totalFeedback: 0,
    pendingApplications: 0,
  });
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

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const statsRes = await fetch(getApiUrl("api/admin/dashboard"), { headers });
        const statsData = await statsRes.json();

        if (statsRes.ok) {
          setStats(statsData);
          setError("");
        } else {
          setError("Failed to load dashboard statistics.");
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

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="dashboard" />

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
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
