import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";
import { getApiUrl } from "../utils/api";

function AdminAdmins() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  // Admin creation form state
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

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

    // Fetch users data
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const usersRes = await fetch(getApiUrl("api/users"), { headers });
        const usersData = usersRes.ok ? await usersRes.json() : [];

        if (usersRes.ok) {
          setUsers(usersData);
          setError("");
        } else {
          setError("Failed to load admins data.");
        }
      } catch (err) {
        console.error("Fetch admins error:", err);
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      triggerNotification("Please fill in all fields.", "error");
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      triggerNotification("Passwords do not match.", "error");
      return;
    }

    try {
      const response = await fetch(getApiUrl("api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password,
          role: "admin", // Enforce admin role creation
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const addedUser = {
          ...data.user,
          _id: data.user.id || data.user._id
        };
        setUsers([...users, addedUser]);
        setNewAdmin({ name: "", email: "", password: "", confirmPassword: "", role: "admin" });
        setShowCreateAdminForm(false);
        triggerNotification("Admin created successfully!", "success");
      } else {
        const errorData = await response.json();
        triggerNotification(`Failed to create admin: ${errorData.message}`, "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error creating admin.", "error");
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(getApiUrl(`api/users/${userId}/role`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        triggerNotification("Admin role updated successfully!", "success");
      } else {
        triggerNotification("Failed to update admin role.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error updating admin role.", "error");
    }
  };

  // Filter list to only show administrators
  const adminUsers = users.filter((u) => u.role === "admin");

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="admins" />

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
              <h2>Loading Admins Registry...</h2>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  Manage <span>Admins</span>
                </h2>
                <button
                  className="btn"
                  onClick={() => setShowCreateAdminForm(true)}
                  style={{ marginBottom: 0 }}
                >
                  Add New Admin
                </button>
              </div>

              <div className="card table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Current Role</th>
                      <th>Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          No admin users found.
                        </td>
                      </tr>
                    ) : (
                      adminUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <strong>{user.name}</strong>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              style={{
                                padding: "5px 10px",
                                borderRadius: "4px",
                                background: "#c934ff",
                                color: "white",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              ADMIN
                            </span>
                          </td>
                          <td>
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                              style={{
                                padding: "6px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                color: "white",
                              }}
                            >
                              <option value="admin">Admin</option>
                              <option value="student">Student (Demote)</option>
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

      {/* Create Admin Hover Modal Overlay */}
      {showCreateAdminForm && (
        <div className="modal-overlay" onClick={() => setShowCreateAdminForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
            <button className="modal-close" onClick={() => setShowCreateAdminForm(false)}>
              &times;
            </button>
            <h2 style={{ marginBottom: "20px", background: "linear-gradient(135deg, #ffffff, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Create New Admin
            </h2>
            <form onSubmit={handleCreateAdmin} style={{ display: "grid", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={newAdmin.confirmPassword}
                  onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn">Create Admin</button>
                <button type="button" className="btn secondary" onClick={() => setShowCreateAdminForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAdmins;
