import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Assets/CSS/Home.css";
import "../Assets/CSS/Profile.css";
import { getApiUrl } from "../utils/api";

function StudentAttendance() {
  const navigate = useNavigate();

  // Authentication State
  const token = sessionStorage.getItem("danceAcademyToken");
  const userStr = sessionStorage.getItem("danceAcademyUser");

  // User & Analytics States
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrTokenInput, setQrTokenInput] = useState("");
  const [qrSuccess, setQrSuccess] = useState("");
  const [qrError, setQrError] = useState("");
  const [markingQr, setMarkingQr] = useState(false);

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  useEffect(() => {
    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const u = JSON.parse(userStr);
      setUser(u);
      fetchStudentAnalytics(u.id || u._id);
    } catch (e) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userStr, navigate]);

  const fetchStudentAnalytics = async (studentId) => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl(`api/attendance/student-analytics/${studentId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
        setError("");
      } else {
        const err = await res.json();
        setError(err.message || "Failed to load attendance metrics.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Submit QR Token/String
  const handleQRCheckIn = async (e) => {
    e.preventDefault();
    if (!qrTokenInput.trim()) return;

    setMarkingQr(true);
    setQrSuccess("");
    setQrError("");

    try {
      const res = await fetch(getApiUrl("api/attendance/qr/scan"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrToken: qrTokenInput.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setQrSuccess(data.message || "Attendance marked successfully!");
        setQrTokenInput("");
        // Reload analytics to update calendar/streaks
        fetchStudentAnalytics(user.id || user._id);
      } else {
        setQrError(data.message || "Failed to verify QR Code.");
      }
    } catch (err) {
      console.error(err);
      setQrError("Server error. Please try again.");
    } finally {
      setMarkingQr(false);
    }
  };

  // Render Calendar Logic
  const getCalendarDays = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // Day of the week for 1st
    const totalDays = new Date(year, month + 1, 0).getDate(); // Total days in month

    const days = [];

    // Padding for previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Days of the current month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const checkDayStatus = (day) => {
    if (!day || !analytics?.records) return "empty";

    // Date compare normalize
    const dayStr = day.toISOString().split("T")[0];
    const match = analytics.records.find((rec) => {
      const recStr = new Date(rec.date).toISOString().split("T")[0];
      return recStr === dayStr;
    });

    return match ? match.status : "unmarked";
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  if (loading && !analytics) {
    return (
      <div className="page">
        <Navbar />
        <main className="profile-container loading-state">
          <div className="spinner"></div>
          <p>Loading attendance history...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const calendarDays = getCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Custom Chart Drawing
  const chartHeight = 150;
  const chartWidth = 500;
  const monthlyReport = analytics?.monthlyReport || [];
  const barWidth = 35;
  const barSpacing = 20;

  return (
    <div className="page">
      <Navbar />

      <main className="profile-container" style={{ paddingBottom: "60px" }}>
        {/* Header section */}
        <div className="profile-header" style={{ marginBottom: "30px" }}>
          <div className="welcome-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className="eyebrow">STUDENT PORTAL</span>
              <h1>
                My <span>Attendance Dashboard</span>
              </h1>
              <p>Track your classes, streaks, and attendance stats.</p>
            </div>
            <Link to="/profile" className="btn secondary" style={{ fontSize: "12px", padding: "8px 16px" }}>
              ← Back to Profile
            </Link>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {/* Dashboard Statistics Grid */}
        <div className="grid" style={{ marginBottom: "30px" }}>
          <div className="card summary-card">
            <strong>{analytics?.presentDays} / {analytics?.totalDays}</strong>
            <p>Classes Attended</p>
          </div>
          <div className="card summary-card" style={{ borderLeft: "4px solid #22c55e" }}>
            <strong style={{ color: "#22c55e" }}>{analytics?.percentage}%</strong>
            <p>Overall Attendance Rate</p>
          </div>
          <div className="card summary-card" style={{ borderLeft: "4px solid #c934ff" }}>
            <strong style={{ color: "#c934ff" }}>{analytics?.currentStreak} Days</strong>
            <p>Current Streak 🔥</p>
          </div>
          <div className="card summary-card" style={{ borderLeft: "4px solid #eab308" }}>
            <strong style={{ color: "#eab308" }}>{analytics?.highestStreak} Days</strong>
            <p>Highest Streak 🏆</p>
          </div>
        </div>

        {/* Main Grid: Interactive Calendar & QR Scanner */}
        <div className="grid two" style={{ gap: "30px", alignItems: "start", marginBottom: "40px" }}>
          {/* Attendance Calendar Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", color: "#d946ef", margin: 0 }}>
                Attendance <span>Calendar</span>
              </h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn secondary" onClick={handlePrevMonth} style={{ padding: "4px 10px", fontSize: "12px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  ◀
                </button>
                <strong style={{ fontSize: "14px", alignSelf: "center", minWidth: "100px", textAlign: "center" }}>
                  {currentMonthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </strong>
                <button className="btn secondary" onClick={handleNextMonth} style={{ padding: "4px 10px", fontSize: "12px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  ▶
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center" }}>
              {weekDays.map((wd) => (
                <div key={wd} style={{ fontSize: "11px", color: "#b983ff", fontWeight: "bold", textTransform: "uppercase" }}>
                  {wd}
                </div>
              ))}
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} style={{ minHeight: "38px" }}></div>;
                const status = checkDayStatus(day);
                const isPresent = status === "Present";
                const isAbsent = status === "Absent";

                let dayBg = "rgba(255, 255, 255, 0.03)";
                let dayBorder = "1px solid rgba(255, 255, 255, 0.05)";
                let dotColor = "transparent";

                if (isPresent) {
                  dayBg = "rgba(34, 197, 94, 0.12)";
                  dayBorder = "1px solid rgba(34, 197, 94, 0.3)";
                  dotColor = "#22c55e";
                } else if (isAbsent) {
                  dayBg = "rgba(239, 68, 68, 0.12)";
                  dayBorder = "1px solid rgba(239, 68, 68, 0.3)";
                  dotColor = "#f87171";
                }

                return (
                  <div
                    key={day.toISOString()}
                    style={{
                      position: "relative",
                      minHeight: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      background: dayBg,
                      border: dayBorder,
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    {day.getDate()}
                    {status !== "unmarked" && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "3px",
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: dotColor,
                        }}
                      ></span>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "15px", marginTop: "20px", fontSize: "11px", color: "#aaa" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }}></span> Present
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f87171" }}></span> Absent
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}></span> No Class / Not Marked
              </span>
            </div>
          </div>

          {/* QR Scan Checkin */}
          <div className="card">
            <h2 style={{ fontSize: "20px", color: "#d946ef", marginBottom: "15px" }}>
              QR Code <span>Check-in</span>
            </h2>
            <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "20px" }}>
              Scan the daily code projected by your instructor or enter the security token below.
            </p>

            <form onSubmit={handleQRCheckIn} style={{ display: "grid", gap: "15px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Security Token Key</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit security key..."
                  value={qrTokenInput}
                  onChange={(e) => setQrTokenInput(e.target.value)}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color: "white",
                    fontFamily: "monospace",
                    fontSize: "16px",
                    textAlign: "center",
                    letterSpacing: "2px",
                    fontWeight: "bold",
                  }}
                />
              </div>

              <button type="submit" className="btn" disabled={markingQr || !qrTokenInput}>
                {markingQr ? "Verifying Token..." : "Check In Now"}
              </button>
            </form>

            {qrSuccess && (
              <div
                style={{
                  background: "rgba(34, 197, 94, 0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  padding: "10px",
                  borderRadius: "6px",
                  marginTop: "15px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                ✓ {qrSuccess}
              </div>
            )}

            {qrError && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#f87171",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "10px",
                  borderRadius: "6px",
                  marginTop: "15px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                ✗ {qrError}
              </div>
            )}
          </div>
        </div>

        {/* Streak Badges & Monthly Trends Grid */}
        <div className="grid two" style={{ gap: "30px", alignItems: "start", marginBottom: "40px" }}>
          {/* Badge Achievements */}
          <div className="card">
            <h2 style={{ fontSize: "20px", color: "#d946ef", marginBottom: "20px" }}>
              My <span>Achievements & Badges</span>
            </h2>

            <div style={{ display: "grid", gap: "15px" }}>
              {/* Bronze */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  borderRadius: "8px",
                  background: analytics?.badges?.bronze ? "rgba(205, 127, 50, 0.15)" : "rgba(255,255,255,0.02)",
                  border: analytics?.badges?.bronze ? "1px solid rgba(205, 127, 50, 0.4)" : "1px solid rgba(255,255,255,0.05)",
                  opacity: analytics?.badges?.bronze ? 1 : 0.5,
                  transition: "all 0.3s",
                }}
              >
                <span style={{ fontSize: "32px" }}>🥉</span>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#e2bf9c" }}>Bronze Stepper Badge</h4>
                  <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
                    Awarded for reaching a 7-day attendance streak.
                  </p>
                </div>
                {analytics?.badges?.bronze && (
                  <span style={{ marginLeft: "auto", color: "#22c55e", fontWeight: "bold", fontSize: "11px" }}>
                    UNLOCKED
                  </span>
                )}
              </div>

              {/* Silver */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  borderRadius: "8px",
                  background: analytics?.badges?.silver ? "rgba(192, 192, 192, 0.15)" : "rgba(255,255,255,0.02)",
                  border: analytics?.badges?.silver ? "1px solid rgba(192, 192, 192, 0.4)" : "1px solid rgba(255,255,255,0.05)",
                  opacity: analytics?.badges?.silver ? 1 : 0.5,
                  transition: "all 0.3s",
                }}
              >
                <span style={{ fontSize: "32px" }}>🥈</span>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#ffffff" }}>Silver Performer Badge</h4>
                  <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
                    Awarded for reaching a 15-day attendance streak.
                  </p>
                </div>
                {analytics?.badges?.silver && (
                  <span style={{ marginLeft: "auto", color: "#22c55e", fontWeight: "bold", fontSize: "11px" }}>
                    UNLOCKED
                  </span>
                )}
              </div>

              {/* Gold */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  borderRadius: "8px",
                  background: analytics?.badges?.gold ? "rgba(255, 215, 0, 0.15)" : "rgba(255,255,255,0.02)",
                  border: analytics?.badges?.gold ? "1px solid rgba(255, 215, 0, 0.4)" : "1px solid rgba(255,255,255,0.05)",
                  opacity: analytics?.badges?.gold ? 1 : 0.5,
                  transition: "all 0.3s",
                }}
              >
                <span style={{ fontSize: "32px" }}>🥇</span>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#ffd700" }}>Golden Dancer Badge</h4>
                  <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>
                    Awarded for reaching a 30-day attendance streak.
                  </p>
                </div>
                {analytics?.badges?.gold && (
                  <span style={{ marginLeft: "auto", color: "#22c55e", fontWeight: "bold", fontSize: "11px" }}>
                    UNLOCKED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Attendance Chart Card */}
          <div className="card">
            <h2 style={{ fontSize: "20px", color: "#d946ef", marginBottom: "20px" }}>
              Monthly <span>Attendance Trends</span>
            </h2>

            {monthlyReport.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
                No monthly data reports available.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Custom Responsive SVG Chart */}
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
                  style={{ width: "100%", height: "auto", overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#7a25ff" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = chartHeight - (val / 100) * chartHeight;
                    return (
                      <g key={val}>
                        <line
                          x1="40"
                          y1={y}
                          x2={chartWidth}
                          y2={y}
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="1"
                        />
                        <text x="5" y={y + 4} fill="#aaa" fontSize="10px" fontWeight="bold">
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Columns */}
                  {monthlyReport.map((item, idx) => {
                    const x = 50 + idx * (barWidth + barSpacing);
                    const barValHeight = (item.percentage / 100) * chartHeight;
                    const y = chartHeight - barValHeight;

                    return (
                      <g key={item.month}>
                        {/* Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barValHeight}
                          rx="4"
                          fill="url(#barGradient)"
                          opacity="0.85"
                        />
                        {/* Percent text */}
                        <text
                          x={x + barWidth / 2}
                          y={y - 6}
                          fill="white"
                          fontSize="10px"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {item.percentage}%
                        </text>
                        {/* Month text */}
                        <text
                          x={x + barWidth / 2}
                          y={chartHeight + 20}
                          fill="#cfa6ff"
                          fontSize="11px"
                          textAnchor="middle"
                        >
                          {item.month.split(" ")[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* History logs table */}
        <div className="card">
          <h2 style={{ fontSize: "20px", color: "#d946ef", marginBottom: "20px" }}>
            My Class <span>Attendance History</span>
          </h2>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Marked By</th>
                </tr>
              </thead>
              <tbody>
                {!analytics?.records || analytics.records.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#aaa" }}>
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  analytics.records.map((rec) => (
                    <tr key={rec._id}>
                      <td>
                        <strong>
                          {new Date(rec.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </strong>
                      </td>
                      <td>{rec.batchId?.name || "Dance Batch"}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            backgroundColor: rec.status === "Present" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            border: rec.status === "Present" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                            color: rec.status === "Present" ? "#22c55e" : "#f87171",
                          }}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td>{rec.markedBy?._id === user.id || rec.markedBy === user.id ? "Self (QR Scan)" : rec.markedBy?.name || "Instructor"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default StudentAttendance;
