import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";
import { getApiUrl } from "../utils/api";

function AdminCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  // Course creation & editing states
  const [showCreateCourseForm, setShowCreateCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    level: "Beginner",
    timing: "Evening Batch",
    image: "img1.png",
    fees: "",
    seats: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);

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

    // Fetch courses
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesRes = await fetch(getApiUrl("api/courses"));
        const coursesData = await coursesRes.json();

        if (coursesRes.ok) {
          setCourses(coursesData);
          setError("");
        } else {
          setError("Failed to load courses data.");
        }
      } catch (err) {
        console.error("Fetch courses error:", err);
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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

  const handleUpdateSeats = async (id, newSeats) => {
    if (!newSeats || Number(newSeats) < 0) {
      triggerNotification("Please enter a valid seat count (0 or more).", "error");
      return;
    }

    try {
      const response = await fetch(getApiUrl(`api/courses/${id}/seats`), {
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
        triggerNotification("Seats updated successfully!", "success");
      } else {
        triggerNotification("Failed to update course seats.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error contacting server.", "error");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!newCourse.title || !newCourse.description || !newCourse.fees || !newCourse.seats) {
      triggerNotification("Please fill in all fields.", "error");
      return;
    }

    try {
      const response = await fetch(getApiUrl("api/courses"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newCourse.title,
          description: newCourse.description,
          level: newCourse.level,
          timing: newCourse.timing,
          image: newCourse.image,
          fees: newCourse.fees,
          seats: Number(newCourse.seats),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCourses([...courses, data]);
        setNewCourse({
          title: "",
          description: "",
          level: "Beginner",
          timing: "Evening Batch",
          image: "img1.png",
          fees: "",
          seats: "",
        });
        setShowCreateCourseForm(false);
        triggerNotification("Course created successfully!", "success");
      } else {
        const errorData = await response.json();
        triggerNotification(`Failed to create course: ${errorData.message}`, "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error creating course.", "error");
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!editingCourse.title || !editingCourse.description || !editingCourse.fees || !editingCourse.seats) {
      triggerNotification("Please fill in all fields.", "error");
      return;
    }

    try {
      const response = await fetch(getApiUrl(`api/courses/${editingCourse._id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingCourse.title,
          description: editingCourse.description,
          level: editingCourse.level,
          timing: editingCourse.timing,
          image: editingCourse.image,
          fees: editingCourse.fees,
          seats: Number(editingCourse.seats),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(courses.map((c) => (c._id === editingCourse._id ? data : c)));
        setEditingCourse(null);
        triggerNotification("Course updated successfully!", "success");
      } else {
        const errorData = await response.json();
        triggerNotification(`Failed to update course: ${errorData.message}`, "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error updating course.", "error");
    }
  };

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="courses" />

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
              <h2>Loading Courses Registry...</h2>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  Manage <span>Courses</span>
                </h2>
                <button
                  className="btn"
                  onClick={() => setShowCreateCourseForm(true)}
                  style={{ marginBottom: 0 }}
                >
                  Create New Course
                </button>
              </div>

              <div className="card table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Level / Pricing</th>
                      <th>Current Seats Available</th>
                      <th>Update / Edit Course</th>
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
                              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                                <input
                                  type="number"
                                  min="0"
                                  defaultValue={course.seats}
                                  id={`seats-input-${course._id}`}
                                  style={{
                                    width: "60px",
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
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    marginBottom: 0,
                                  }}
                                >
                                  Update Seats
                                </button>
                              </div>
                              <button
                                onClick={() => setEditingCourse(course)}
                                className="btn"
                                style={{
                                  padding: "6px 12px",
                                  fontSize: "12px",
                                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                  marginBottom: 0,
                                }}
                              >
                                Edit Details
                              </button>
                            </div>
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

      {/* Edit Course Hover Modal Overlay */}
      {editingCourse && (
        <div className="modal-overlay" onClick={() => setEditingCourse(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
            <button className="modal-close" onClick={() => setEditingCourse(null)}>
              &times;
            </button>
            <h2 style={{ marginBottom: "20px", background: "linear-gradient(135deg, #ffffff, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Edit Course Details
            </h2>
            <form onSubmit={handleUpdateCourse} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white", minHeight: "80px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Difficulty Level</label>
                <select
                  value={editingCourse.level}
                  onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Timing / Schedule</label>
                <input
                  type="text"
                  value={editingCourse.timing}
                  onChange={(e) => setEditingCourse({ ...editingCourse, timing: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Image Source</label>
                <select
                  value={editingCourse.image}
                  onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                >
                  <option value="img1.png">Image 1 (Hip Hop)</option>
                  <option value="img2.png">Image 2 (Zumba)</option>
                  <option value="img3.png">Image 3 (Salsa)</option>
                  <option value="img4.png">Image 4 (Contemporary)</option>
                  <option value="img5.png">Image 5 (Kathak)</option>
                  <option value="img6.png">Image 6 (Kids Dance)</option>
                  <option value="img7.png">Image 7 (Wedding Choreography)</option>
                  <option value="img8.png">Image 8 (General Dance)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Fees / Pricing</label>
                <input
                  type="text"
                  value={editingCourse.fees}
                  onChange={(e) => setEditingCourse({ ...editingCourse, fees: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Available Seats</label>
                <input
                  type="number"
                  min="0"
                  value={editingCourse.seats}
                  onChange={(e) => setEditingCourse({ ...editingCourse, seats: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", gridColumn: "span 2", marginTop: "10px" }}>
                <button type="submit" className="btn" style={{ background: "linear-gradient(135deg, #7a25ff, #d02dff)" }}>Save Changes</button>
                <button type="button" className="btn secondary" onClick={() => setEditingCourse(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Course Hover Modal Overlay */}
      {showCreateCourseForm && (
        <div className="modal-overlay" onClick={() => setShowCreateCourseForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
            <button className="modal-close" onClick={() => setShowCreateCourseForm(false)}>
              &times;
            </button>
            <h2 style={{ marginBottom: "20px", background: "linear-gradient(135deg, #ffffff, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Create New Course
            </h2>
            <form onSubmit={handleCreateCourse} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Contemporary, Hip Hop"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description</label>
                <textarea
                  placeholder="Enter course description details..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white", minHeight: "80px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Difficulty Level</label>
                <select
                  value={newCourse.level}
                  onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Timing / Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri | 6:00 PM - 7:30 PM"
                  value={newCourse.timing}
                  onChange={(e) => setNewCourse({ ...newCourse, timing: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Image Source</label>
                <select
                  value={newCourse.image}
                  onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                >
                  <option value="img1.png">Image 1 (Hip Hop)</option>
                  <option value="img2.png">Image 2 (Zumba)</option>
                  <option value="img3.png">Image 3 (Salsa)</option>
                  <option value="img4.png">Image 4 (Contemporary)</option>
                  <option value="img5.png">Image 5 (Kathak)</option>
                  <option value="img6.png">Image 6 (Kids Dance)</option>
                  <option value="img7.png">Image 7 (Wedding Choreography)</option>
                  <option value="img8.png">Image 8 (General Dance)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Fees / Pricing</label>
                <input
                  type="text"
                  placeholder="e.g. ₹3,500 / Month"
                  value={newCourse.fees}
                  onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Available Seats</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  min="0"
                  value={newCourse.seats}
                  onChange={(e) => setNewCourse({ ...newCourse, seats: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "white" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", gridColumn: "span 2", marginTop: "10px" }}>
                <button type="submit" className="btn">Create Course</button>
                <button type="button" className="btn secondary" onClick={() => setShowCreateCourseForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourses;
