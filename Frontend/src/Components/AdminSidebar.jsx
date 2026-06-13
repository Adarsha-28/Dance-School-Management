import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminSidebar({ active }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("danceAcademyToken");
    sessionStorage.removeItem("danceAcademyUser");
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <h3>Admin Panel</h3>

      <nav style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <Link 
          to="/admin/dashboard" 
          className={active === "dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/admins" 
          className={active === "admins" ? "active" : ""}
        >
          Manage Admins
        </Link>
        <Link 
          to="/admin/applications" 
          className={active === "applications" ? "active" : ""}
        >
          Applications
        </Link>
        <Link 
          to="/admin/joined-students" 
          className={active === "joined-students" ? "active" : ""}
        >
          Joined Students
        </Link>
        <Link 
          to="/admin/feedback" 
          className={active === "feedback" ? "active" : ""}
        >
          Feedback
        </Link>
        <Link 
          to="/admin/courses" 
          className={active === "courses" ? "active" : ""}
        >
          Courses
        </Link>
        <Link 
          to="/admin/batches" 
          className={active === "batches" ? "active" : ""}
        >
          Batches
        </Link>
        <Link 
          to="/admin/attendance" 
          className={active === "attendance" ? "active" : ""}
        >
          Attendance
        </Link>
      </nav>

      <div style={{ marginTop: "auto", paddingTop: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link 
          to="/" 
          style={{ 
            fontSize: "13px", 
            color: "#aaa", 
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          ← Go to Website
        </Link>
        <button 
          onClick={handleLogout}
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            width: "100%",
            textAlign: "left",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(239, 68, 68, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(239, 68, 68, 0.15)";
          }}
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
