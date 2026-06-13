import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import AdminSidebar from "../Components/AdminSidebar";
import { getApiUrl } from "../utils/api";

function AdminAttendance() {
  const navigate = useNavigate();

  // Authentication State
  const token = sessionStorage.getItem("danceAcademyToken");
  const userStr = sessionStorage.getItem("danceAcademyUser");

  // App Data States
  const [batches, setBatches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Selected batch & date
  const [allHistory, setAllHistory] = useState([]); // All attendance records for table view

  // UI Flow States
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  // QR Code States
  const [qrToken, setQrToken] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  // Statistics Dashboard State
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    overallPercentage: 100,
  });

  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Verify Role & Fetch Init Data
  useEffect(() => {
    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin" && user.role !== "instructor") {
        navigate("/");
        return;
      }
    } catch (e) {
      navigate("/login");
      return;
    }

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userStr, navigate]);

  // Fetch data for current batch/date whenever selection changes
  useEffect(() => {
    if (selectedBatch && selectedDate && token) {
      fetchBatchAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch, selectedDate, token]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Batches
      const batchesRes = await fetch(getApiUrl("api/attendance/batches/all"), { headers });
      const batchesData = batchesRes.ok ? await batchesRes.json() : [];
      setBatches(batchesData);
      if (batchesData.length > 0) {
        setSelectedBatch(batchesData[0]._id);
      }

      // 2. Fetch Applications (to find enrolled students)
      const appsRes = await fetch(getApiUrl("api/applications"), { headers });
      const appsData = appsRes.ok ? await appsRes.json() : [];
      setApplications(appsData);

      // 3. Fetch Users (to get student IDs)
      const usersRes = await fetch(getApiUrl("api/users"), { headers });
      const usersData = usersRes.ok ? await usersRes.json() : [];
      setUsers(usersData);

      // 4. Fetch Analytics Stats
      const statsRes = await fetch(getApiUrl("api/attendance/analytics"), { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 5. Fetch Full History
      fetchFullHistory();

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load initial registry data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchAttendance = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(
        getApiUrl(`api/attendance/batch/${selectedBatch}?date=${selectedDate}`),
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        setAttendanceRecords(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFullHistory = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Retrieve history by hitting all batches sequentially or aggregation (we will construct from query)
      // For simplicity in a small app, we can aggregate records by querying the database for all records
      const allRecs = [];
      for (const b of batches) {
        const res = await fetch(getApiUrl(`api/attendance/batch/${b._id}`), { headers });
        if (res.ok) {
          const data = await res.json();
          allRecs.push(...data);
        }
      }
      // Sort history descending by date
      allRecs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllHistory(allRecs);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  // Get list of students enrolled in the current batch
  const getBatchStudents = () => {
    const activeBatch = batches.find((b) => b._id === selectedBatch);
    if (!activeBatch) return [];

    const enrolledApps = applications.filter(
      (app) => {
        const appBatch = app.batch.toLowerCase();
        const batchName = activeBatch.name.toLowerCase();
        return app.status === "Approved" && (appBatch === batchName || appBatch === `${batchName} batch`);
      }
    );

    return enrolledApps.map((app) => {
      // Find matching user ID
      const userMatch = users.find((u) => u.email.toLowerCase() === app.email.toLowerCase());
      const existingStatus = attendanceRecords.find(
        (rec) => rec.studentId?._id === userMatch?._id || rec.studentId === userMatch?._id
      );

      return {
        studentId: userMatch?._id || null,
        name: app.studentName,
        email: app.email,
        course: app.course,
        phone: app.phone,
        status: existingStatus ? existingStatus.status : "", // Present, Absent, or Empty
        recordId: existingStatus ? existingStatus._id : null,
      };
    });
  };

  // Handle Radio Button changes locally
  const [localStatuses, setLocalStatuses] = useState({});

  useEffect(() => {
    // Reset local changes when batch/date/records load
    const initialLocal = {};
    const students = getBatchStudents();
    students.forEach((s) => {
      if (s.studentId) {
        initialLocal[s.studentId] = s.status;
      }
    });
    setLocalStatuses(initialLocal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch, selectedDate, attendanceRecords, applications, users]);

  const handleStatusChange = (studentId, status) => {
    setLocalStatuses({
      ...localStatuses,
      [studentId]: status,
    });
  };

  const handleSaveAttendance = async () => {
    const students = getBatchStudents();
    const recordsToSubmit = [];

    for (const s of students) {
      if (!s.studentId) {
        continue; // Skip students who haven't registered an account yet
      }
      const status = localStatuses[s.studentId];
      if (!status) {
        triggerNotification("Please mark attendance status for all registered students.", "error");
        return;
      }
      recordsToSubmit.push({
        studentId: s.studentId,
        status,
      });
    }

    if (recordsToSubmit.length === 0) {
      triggerNotification("No registered students found to mark attendance.", "error");
      return;
    }

    try {
      const response = await fetch(getApiUrl("api/attendance"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: selectedBatch,
          date: selectedDate,
          records: recordsToSubmit,
        }),
      });

      if (response.ok) {
        triggerNotification("Attendance marked successfully!", "success");
        fetchBatchAttendance();
        fetchFullHistory();
        // Refresh stats
        const statsRes = await fetch(getApiUrl("api/attendance/analytics"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } else {
        const data = await response.json();
        triggerNotification(data.message || "Failed to mark attendance.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error connecting to backend server.", "error");
    }
  };

  // Generate QR Code daily token
  const handleGenerateQR = async () => {
    try {
      setQrLoading(true);
      const res = await fetch(getApiUrl(`api/attendance/qr/generate?batchId=${selectedBatch}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setQrToken(data.qrToken);
        setShowQrModal(true);
      } else {
        triggerNotification("Failed to generate QR Code token.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Error generating QR.", "error");
    } finally {
      setQrLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    const activeBatch = batches.find((b) => b._id === selectedBatch);
    const batchName = activeBatch ? `${activeBatch.name} (${activeBatch.timing})` : "N/A";

    const presentStudents = batchStudents.filter(
      (s) => s.studentId && localStatuses[s.studentId] === "Present"
    );

    if (presentStudents.length === 0) {
      triggerNotification("No students marked as Present to export.", "error");
      return;
    }

    try {
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      if (!window.jspdf.plugin) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.6.0/jspdf.plugin.autotable.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const primaryColor = [217, 70, 239];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("GROOVIX DANCE ACADEMY", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.text("Daily Present Students Roster", 105, 28, { align: "center" });

      doc.setDrawColor(220, 220, 220);
      doc.line(15, 33, 195, 33);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(`Date: ${selectedDate}`, 15, 42);
      doc.text(`Batch: ${batchName}`, 15, 48);
      doc.text(`Total Present: ${presentStudents.length} / ${batchStudents.length}`, 195, 42, { align: "right" });

      const tableHeaders = [["S.No", "Student Name", "Course", "Email", "Phone"]];
      const tableData = presentStudents.map((s, idx) => [
        idx + 1,
        s.name,
        s.course,
        s.email,
        s.phone || "N/A"
      ]);

      doc.autoTable({
        startY: 55,
        head: tableHeaders,
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold"
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [33, 33, 33]
        },
        alternateRowStyles: {
          fillColor: [253, 244, 255]
        },
        margin: { left: 15, right: 15 }
      });

      const finalY = doc.lastAutoTable.finalY || 100;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Verified By:", 15, finalY + 30);
      doc.line(15, finalY + 42, 70, finalY + 42);
      doc.text("Instructor / Admin Signature", 15, finalY + 47);

      doc.save(`Attendance_Report_${selectedDate}_${activeBatch ? activeBatch.name : "Batch"}.pdf`);
      triggerNotification("PDF report generated successfully!", "success");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      triggerNotification("Error generating PDF document.", "error");
    }
  };

  // Edit individual record status from history table
  const handleEditHistoryStatus = async (recordId, newStatus) => {
    try {
      const res = await fetch(getApiUrl(`api/attendance/${recordId}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        triggerNotification("Record updated successfully!", "success");
        fetchBatchAttendance();
        fetchFullHistory();
      } else {
        triggerNotification("Failed to update record.", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete individual record from history table
  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;

    try {
      const res = await fetch(getApiUrl(`api/attendance/${recordId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        triggerNotification("Record deleted successfully!", "success");
        fetchBatchAttendance();
        fetchFullHistory();
      } else {
        triggerNotification("Failed to delete record.", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter History Data
  const filteredHistory = allHistory.filter((rec) => {
    const studentName = rec.studentId?.name || "Unknown";
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rec.status.toLowerCase() === statusFilter;
    const recBatchId = rec.batchId && typeof rec.batchId === "object" ? rec.batchId._id : rec.batchId;
    const matchesBatch = batchFilter === "all" || recBatchId === batchFilter;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredHistory.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);

  const batchStudents = getBatchStudents();

  return (
    <div className="page">
      <main className="admin-shell">
        <AdminSidebar active="attendance" />

        <section className="admin-main">
          {/* Notifications banner */}
          {notification && (
            <div
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
                border: notification.type === "success" ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                background: notification.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: notification.type === "success" ? "#4ade80" : "#f87171",
              }}
            >
              <span>{notification.message}</span>
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

          <div className="admin-header">
            <h2 className="section-title" style={{ margin: 0 }}>
              Attendance <span>Management</span>
            </h2>
          </div>

          {/* Analytics Overview Section */}
          <div className="grid" style={{ marginBottom: "30px" }}>
            <div className="card summary-card">
              <strong>{stats.totalStudents}</strong>
              <p>Total Active Students</p>
            </div>
            <div className="card summary-card" style={{ borderLeft: "4px solid #22c55e" }}>
              <strong style={{ color: "#22c55e" }}>{stats.presentToday}</strong>
              <p>Present Today</p>
            </div>
            <div className="card summary-card" style={{ borderLeft: "4px solid #f87171" }}>
              <strong style={{ color: "#f87171" }}>{stats.absentToday}</strong>
              <p>Absent Today</p>
            </div>
            <div className="card summary-card" style={{ borderLeft: "4px solid #c934ff" }}>
              <strong style={{ color: "#c934ff" }}>{stats.overallPercentage}%</strong>
              <p>Monthly Average Rate</p>
            </div>
          </div>

          {/* Form & Student List Section */}
          <div className="grid two" style={{ gap: "25px", alignItems: "start", marginBottom: "40px" }}>
            <div className="card">
              <h3 style={{ marginBottom: "20px", color: "#d946ef" }}>Mark Class Attendance</h3>

              <div className="form-group">
                <label>Select Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
                >
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.timing})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  className="btn"
                  onClick={handleSaveAttendance}
                  disabled={batchStudents.length === 0}
                  style={{ flex: 1 }}
                >
                  Save Attendance
                </button>
                <button
                  className="btn secondary"
                  onClick={handleGenerateQR}
                  disabled={!selectedBatch}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {qrLoading ? "Generating..." : "📱 Daily QR"}
                </button>
              </div>
              <button
                className="btn secondary"
                onClick={handleGeneratePDF}
                disabled={batchStudents.length === 0}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                  background: "rgba(217, 70, 239, 0.15)",
                  border: "1px solid rgba(217, 70, 239, 0.4)",
                  color: "#d946ef"
                }}
              >
                📄 Export Present Roster PDF
              </button>
            </div>

            {/* Student Mark Roster */}
            <div className="card">
              <h3 style={{ marginBottom: "15px", color: "#d946ef" }}>
                Student Roster ({batchStudents.length})
              </h3>
              <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "20px" }}>
                Confirm or update each student's attendance below.
              </p>

              {loading ? (
                <p>Loading roster...</p>
              ) : batchStudents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#aaa" }}>
                  No approved students enrolled in this batch.
                </div>
              ) : (
                <div style={{ display: "grid", gap: "12px", maxHeight: "350px", overflowY: "auto", paddingRight: "5px" }}>
                  {batchStudents.map((student) => (
                    <div
                      key={student.email}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <div>
                        <strong style={{ display: "block" }}>{student.name}</strong>
                        <span style={{ fontSize: "11px", color: "#b983ff" }}>
                          {student.course} {!student.studentId && "⚠️ No Account"}
                        </span>
                      </div>

                      {student.studentId ? (
                        <div style={{ display: "flex", gap: "15px" }}>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: localStatuses[student.studentId] === "Present" ? "#22c55e" : "#888",
                            }}
                          >
                            <input
                              type="radio"
                              name={`attendance-${student.studentId}`}
                              checked={localStatuses[student.studentId] === "Present"}
                              onChange={() => handleStatusChange(student.studentId, "Present")}
                              style={{ width: "auto", margin: 0 }}
                            />
                            Present
                          </label>
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: localStatuses[student.studentId] === "Absent" ? "#f87171" : "#888",
                            }}
                          >
                            <input
                              type="radio"
                              name={`attendance-${student.studentId}`}
                              checked={localStatuses[student.studentId] === "Absent"}
                              onChange={() => handleStatusChange(student.studentId, "Absent")}
                              style={{ width: "auto", margin: 0 }}
                            />
                            Absent
                          </label>
                        </div>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#ea580c", fontStyle: "italic" }}>
                          Unregistered
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History logs & filtering table */}
          <div className="card">
            <h3 style={{ marginBottom: "20px", color: "#d946ef" }}>Attendance Logs History</h3>

            {/* Filter Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
              />
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
              >
                <option value="all">All Batches</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Batch</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Marked By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#aaa" }}>
                        No logs found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((rec) => (
                      <tr key={rec._id}>
                        <td>
                          <strong>{rec.studentId?.name || "Unknown"}</strong>
                        </td>
                        <td>{rec.batchId?.name || "N/A"}</td>
                        <td>
                          {new Date(rec.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td>
                          <select
                            value={rec.status}
                            onChange={(e) => handleEditHistoryStatus(rec._id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: rec.status === "Present" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                              color: rec.status === "Present" ? "#4ade80" : "#f87171",
                              border: "none",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            <option value="Present" style={{ color: "black" }}>Present</option>
                            <option value="Absent" style={{ color: "black" }}>Absent</option>
                          </select>
                        </td>
                        <td>{rec.markedBy?.name || "System"}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteRecord(rec._id)}
                            style={{
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "none",
                              color: "#f87171",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "11px",
                              fontWeight: "bold",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                <button
                  className="btn secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  Prev
                </button>
                <span style={{ display: "flex", alignItems: "center", color: "#aaa", fontSize: "13px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "450px", textAlign: "center", position: "relative" }}
          >
            <button className="modal-close" onClick={() => setShowQrModal(false)}>
              &times;
            </button>
            <h2 style={{ marginBottom: "10px", color: "#d946ef" }}>Daily QR Attendance</h2>
            <p style={{ fontSize: "13px", color: "#bdb9d9", marginBottom: "20px" }}>
              Students can scan this QR code to mark themselves present.
            </p>

            <div
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                display: "inline-block",
                marginBottom: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  qrToken
                )}`}
                alt="Attendance QR Code"
                style={{ width: "220px", height: "220px" }}
              />
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.3)",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "16px",
                wordBreak: "break-all",
                color: "#cfa6ff",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "20px",
                fontFamily: "monospace",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              <strong>Security Token Key:</strong>
              <div style={{ marginTop: "5px", fontSize: "24px", color: "#e0f2fe" }}>{qrToken}</div>
            </div>

            <button className="btn" onClick={() => setShowQrModal(false)} style={{ width: "100%" }}>
              Close QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAttendance;
