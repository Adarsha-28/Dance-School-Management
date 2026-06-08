import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../Assets/CSS/Home.css";
import "../Assets/CSS/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("danceAcademyToken");
    const isLoggedIn = sessionStorage.getItem("danceAcademyLoggedIn") === "true";

    if (!isLoggedIn || !token) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Fetch User Details from backend
        const userRes = await fetch("https://groovix-78ic.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to load user profile");
        }

        const userData = await userRes.json();
        setUser(userData);

        // Fetch Applications from backend
        const appsRes = await fetch("https://groovix-78ic.onrender.com/api/applications/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData);
        }
      } catch (err) {
        console.error(err);
        setError("Could not retrieve profile information. Please log in again.");
        // Clear session storage on token/auth error
        sessionStorage.removeItem("danceAcademyLoggedIn");
        sessionStorage.removeItem("danceAcademyToken");
        sessionStorage.removeItem("danceAcademyUser");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <main className="profile-container loading-state">
          <div className="spinner"></div>
          <p>Loading your dance profile...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <main className="profile-container error-state">
          <div className="error-card">
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <p>Redirecting you to the login page...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="profile-container">
        <div className="profile-header">
          <div className="welcome-section">
            <span className="eyebrow">STUDENT PORTAL</span>
            <h1>
              Welcome back, <span>{user?.name}</span>!
            </h1>
            <p>View your profile details, application status, and manage your account.</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* User Details Sidebar */}
          <section className="profile-card info-card">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
            </div>
            <h2>Account Details</h2>
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <strong className="detail-val">{user?.name}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <strong className="detail-val">{user?.email}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Role</span>
                <strong className="detail-val capitalize">{user?.role}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since</span>
                <strong className="detail-val">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </strong>
              </div>
            </div>

            {user?.role === "admin" && (
              <Link to="/admin" className="btn admin-btn">
                GO TO ADMIN PANEL
              </Link>
            )}
          </section>

          {/* Applications History */}
          <section className="profile-card history-card">
            <h2>My Course Applications</h2>
            <p className="section-desc">
              Here are all the admission applications you've submitted to the Academy.
            </p>

            {applications.length === 0 ? (
              <div className="empty-applications">
                <p>You haven't submitted any course applications yet.</p>
                <Link to="/application" className="btn">
                  APPLY FOR A COURSE
                </Link>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map((app) => (
                  <div key={app._id} className="app-item-card">
                    <div className="app-item-header">
                      <div>
                        <h3>{app.course}</h3>
                        <span className="app-date">
                          Submitted on{" "}
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <span className={`status-badge ${app.status.toLowerCase().replace(/\s+/g, "")}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="app-item-body">
                      <div className="app-info-grid">
                        <div>
                          <span>Preferred Batch:</span>
                          <strong>{app.batch}</strong>
                        </div>
                        <div>
                          <span>Applicant Age:</span>
                          <strong>{app.age} years</strong>
                        </div>
                        <div>
                          <span>Contact Phone:</span>
                          <strong>{app.phone}</strong>
                        </div>
                        {app.guardianName && (
                          <div>
                            <span>Guardian Name:</span>
                            <strong>{app.guardianName}</strong>
                          </div>
                        )}
                      </div>
                      <div className="app-experience">
                        <span>Experience details:</span>
                        <p>{app.experience}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Profile;
