import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";
import { getApiUrl } from "../utils/api";

function AdminFeedback() {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
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

    // Fetch feedbacks
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const feedbacksRes = await fetch(getApiUrl("api/feedback"), { headers });
        const feedbacksData = await feedbacksRes.json();

        if (feedbacksRes.ok) {
          setFeedbacks(feedbacksData);
          setError("");
        } else {
          setError("Failed to load feedbacks data.");
        }
      } catch (err) {
        console.error("Fetch feedbacks error:", err);
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token, userStr, navigate]);

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="feedback" />

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
              <h2>Loading Student Reviews...</h2>
            </div>
          ) : (
            <>
              <h2 className="section-title">
                Latest <span>Feedback Reviews</span>
              </h2>

              <div className="grid two">
                {feedbacks.length === 0 ? (
                  <div className="card" style={{ gridColumn: "span 2", textAlign: "center" }}>
                    <p>No feedback reviews found.</p>
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
                      <p style={{ margin: "5px 0", fontSize: "13px", color: "#aaa" }}>
                        <strong>Email:</strong> {f.email}
                      </p>
                      <p style={{ marginTop: "10px", fontStyle: "italic" }}>
                        "{f.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminFeedback;
