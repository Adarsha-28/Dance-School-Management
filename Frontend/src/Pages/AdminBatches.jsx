import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";

function AdminBatches() {
  const navigate = useNavigate();

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
  }, [token, userStr, navigate]);

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="batches" />

        <section className="admin-main">
          <h2 className="section-title">
            Batch <span>Overview</span>
          </h2>

          <div className="grid">
            <div className="card">
              <h3>Morning</h3>
              <p>Hip Hop, Zumba, Bharatanatyam</p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                Timing: 8:00 AM - 10:00 AM
              </p>
            </div>

            <div className="card">
              <h3>Evening</h3>
              <p>Contemporary, Salsa, Hip Hop</p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                Timing: 5:00 PM - 8:00 PM
              </p>
            </div>

            <div className="card">
              <h3>Weekend</h3>
              <p>Kathak, Kids Dance, Wedding Choreography</p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                Timing: 10:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminBatches;
