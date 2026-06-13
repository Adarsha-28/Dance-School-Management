const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Application = require("../models/Application");
const jwt = require("jsonwebtoken");

// Middleware helper to check if user is admin or instructor
const isAdminOrInstructor = (role) => {
  return role === "admin" || role === "instructor";
};

// Normalize date to midnight UTC to prevent timezone duplicates
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

// @desc    Mark attendance for all students in a batch (Bulk)
// @route   POST /api/attendance
// @access  Private (Admin/Instructor)
const markAttendance = async (req, res) => {
  const { batchId, date, records } = req.body;

  if (!batchId || !date || !records || !Array.isArray(records)) {
    return res.status(400).json({ message: "Invalid parameters. Batch, date, and records array are required." });
  }

  if (!isAdminOrInstructor(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Only Admins and Instructors can mark attendance." });
  }

  try {
    const attendanceDate = normalizeDate(date);
    const markedBy = req.user.id;

    // Use updateOne with upsert to prevent duplicates and support editing
    const promises = records.map((rec) => {
      return Attendance.updateOne(
        { studentId: rec.studentId, batchId, date: attendanceDate },
        { $set: { status: rec.status, markedBy } },
        { upsert: true }
      );
    });

    await Promise.all(promises);

    res.status(200).json({ message: "Attendance recorded successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a specific attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Admin/Instructor)
const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["Present", "Absent"].includes(status)) {
    return res.status(400).json({ message: "Valid status (Present/Absent) is required." });
  }

  if (!isAdminOrInstructor(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Only Admins and Instructors can update attendance." });
  }

  try {
    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    attendance.status = status;
    attendance.markedBy = req.user.id;
    await attendance.save();

    res.status(200).json({ message: "Attendance record updated successfully.", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a specific attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin/Instructor)
const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  if (!isAdminOrInstructor(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Only Admins and Instructors can delete attendance." });
  }

  try {
    const record = await Attendance.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found." });
    }
    res.status(200).json({ message: "Attendance record deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records by student (history, percentages)
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getAttendanceByStudent = async (req, res) => {
  const { studentId } = req.params;

  // Students can only view their own attendance
  if (req.user.role === "student" && req.user.id !== studentId) {
    return res.status(403).json({ message: "Access denied. You can only view your own attendance." });
  }

  try {
    const records = await Attendance.find({ studentId })
      .populate("batchId", "name timing")
      .populate("markedBy", "name")
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance list by batch, date, and other filters
// @route   GET /api/attendance/batch/:batchId
// @access  Private (Admin/Instructor)
const getAttendanceByBatch = async (req, res) => {
  const { batchId } = req.params;
  const { date, status } = req.query;

  if (!isAdminOrInstructor(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Only Admins and Instructors can view batch attendance." });
  }

  try {
    const query = { batchId };

    if (date) {
      query.date = normalizeDate(date);
    }
    if (status) {
      query.status = status;
    }

    const records = await Attendance.find(query)
      .populate("studentId", "name email")
      .populate("batchId", "name timing")
      .populate("markedBy", "name")
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance summary/dashboard stats
// @route   GET /api/attendance/analytics
// @access  Private (Admin/Instructor)
const getAttendanceAnalytics = async (req, res) => {
  if (!isAdminOrInstructor(req.user.role)) {
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    const today = normalizeDate(new Date());

    // 1. Total Students enrolled in courses (approved applications)
    const approvedApps = await Application.find({ status: "Approved" });
    const totalStudents = approvedApps.length;

    // 2. Present & Absent today
    const presentToday = await Attendance.countDocuments({ date: today, status: "Present" });
    const absentToday = await Attendance.countDocuments({ date: today, status: "Absent" });

    // 3. Overall Attendance Percentage
    const totalRecords = await Attendance.countDocuments({});
    const presentRecords = await Attendance.countDocuments({ status: "Present" });
    const overallPercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 100;

    // 4. Batch-wise attendance statistics
    const batches = await Batch.find({});
    const batchStats = await Promise.all(
      batches.map(async (batch) => {
        const total = await Attendance.countDocuments({ batchId: batch._id });
        const present = await Attendance.countDocuments({ batchId: batch._id, status: "Present" });
        return {
          batchId: batch._id,
          batchName: batch.name,
          percentage: total > 0 ? Math.round((present / total) * 100) : 100,
          totalMarked: total,
        };
      })
    );

    // 5. Daily trends for the last 7 working days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const targetDate = normalizeDate(d);
      const present = await Attendance.countDocuments({ date: targetDate, status: "Present" });
      const absent = await Attendance.countDocuments({ date: targetDate, status: "Absent" });
      dailyStats.push({
        date: targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        present,
        absent,
      });
    }

    // 6. Monthly trends (last 6 months)
    const monthlyStats = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    for (let i = 5; i >= 0; i--) {
      const targetMonth = (currentMonth - i + 12) % 12;
      const targetYear = currentMonth - i < 0 ? currentYear - 1 : currentYear;

      const startDate = new Date(targetYear, targetMonth, 1);
      const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

      const total = await Attendance.countDocuments({ date: { $gte: startDate, $lte: endDate } });
      const present = await Attendance.countDocuments({ date: { $gte: startDate, $lte: endDate }, status: "Present" });

      monthlyStats.push({
        month: startDate.toLocaleDateString("en-US", { month: "short" }),
        rate: total > 0 ? Math.round((present / total) * 100) : 100,
      });
    }

    res.status(200).json({
      totalStudents,
      presentToday,
      absentToday,
      overallPercentage,
      batchStats,
      dailyStats,
      monthlyStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed student attendance metrics, calendar history, and streak details
// @route   GET /api/attendance/student-analytics/:studentId
// @access  Private
const getStudentAnalytics = async (req, res) => {
  const { studentId } = req.params;

  if (req.user.role === "student" && req.user.id !== studentId) {
    return res.status(403).json({ message: "Access denied. You can only view your own statistics." });
  }

  try {
    const records = await Attendance.find({ studentId })
      .populate("batchId", "name timing")
      .populate("markedBy", "name")
      .sort({ date: 1 }); // Chronological order for streak

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === "Present").length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    // Calculate Streak
    let currentStreak = 0;
    let highestStreak = 0;

    records.forEach((rec) => {
      if (rec.status === "Present") {
        currentStreak++;
        if (currentStreak > highestStreak) {
          highestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    });

    // Check badges
    const badges = {
      bronze: highestStreak >= 7,
      silver: highestStreak >= 15,
      gold: highestStreak >= 30,
    };

    // Group history by month for reports
    const monthlySummary = {};
    records.forEach((rec) => {
      const monthYear = rec.date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = { total: 0, present: 0 };
      }
      monthlySummary[monthYear].total++;
      if (rec.status === "Present") {
        monthlySummary[monthYear].present++;
      }
    });

    const monthlyReport = Object.keys(monthlySummary).map((my) => ({
      month: my,
      total: monthlySummary[my].total,
      present: monthlySummary[my].present,
      percentage: Math.round((monthlySummary[my].present / monthlySummary[my].total) * 100),
    }));

    res.status(200).json({
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      percentage,
      currentStreak,
      highestStreak,
      badges,
      monthlyReport,
      records: [...records].reverse(), // Return reverse chronological for lists
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a secure QR code token for daily attendance
// @route   GET /api/attendance/qr/generate
// @access  Private (Admin/Instructor)
const generateQRCodeToken = async (req, res) => {
  const { batchId } = req.query;

  if (!batchId) {
    return res.status(400).json({ message: "Batch ID is required." });
  }

  if (!isAdminOrInstructor(req.user.role)) {
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // Expires in 12 hours

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    batch.activeCode = code;
    batch.codeExpiresAt = expiresAt;
    await batch.save();

    res.status(200).json({ qrToken: code });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Scan and mark attendance automatically
// @route   POST /api/attendance/qr/scan
// @access  Private (Student)
const scanQRCodeToken = async (req, res) => {
  const { qrToken } = req.body;

  if (!qrToken) {
    return res.status(400).json({ message: "QR Code Token is required." });
  }

  try {
    // Find the batch with this activeCode that has not expired
    const batch = await Batch.findOne({
      activeCode: qrToken,
      codeExpiresAt: { $gt: new Date() },
    });

    if (!batch) {
      return res.status(400).json({ message: "Invalid or expired security key." });
    }

    const batchId = batch._id;
    const todayStr = new Date().toISOString().split("T")[0];
    const studentId = req.user.id;
    const attendanceDate = normalizeDate(todayStr);

    // 1. Verify that the student is actually enrolled in this batch (has an Approved application matching email)
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const app = await Application.findOne({
      email: user.email.toLowerCase(),
      status: "Approved",
      batch: { $in: [batch.name, `${batch.name} Batch`] },
    });

    if (!app) {
      return res.status(400).json({ message: `You are not enrolled in the '${batch.name}' batch.` });
    }

    // 2. Prevent duplicate marks for same student on the same date
    const existing = await Attendance.findOne({ studentId, batchId, date: attendanceDate });
    if (existing) {
      return res.status(400).json({ message: "Your attendance is already marked for today in this batch." });
    }

    // 3. Save attendance
    const attendance = await Attendance.create({
      studentId,
      batchId,
      date: attendanceDate,
      status: "Present",
      markedBy: studentId, // Marked by student themselves using the QR key
    });

    res.status(201).json({
      message: "Attendance successfully marked via QR Code!",
      attendance,
    });
  } catch (error) {
    console.error("QR Code validation error:", error);
    res.status(400).json({ message: "Invalid, expired, or corrupted QR code." });
  }
};

// @desc    Get all batches (seeds if empty)
// @route   GET /api/attendance/batches/all
// @access  Private
const getAllBatches = async (req, res) => {
  try {
    let batches = await Batch.find({});
    if (batches.length === 0) {
      batches = await Batch.insertMany([
        { name: "Morning", timing: "8:00 AM - 10:00 AM", courses: ["Hip Hop", "Zumba", "Bharatanatyam"] },
        { name: "Evening", timing: "5:00 PM - 8:00 PM", courses: ["Contemporary", "Salsa", "Hip Hop"] },
        { name: "Weekend", timing: "10:00 AM - 2:00 PM", courses: ["Kathak", "Kids Dance", "Wedding Choreography"] }
      ]);
    }
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceByStudent,
  getAttendanceByBatch,
  getAttendanceAnalytics,
  getStudentAnalytics,
  generateQRCodeToken,
  scanQRCodeToken,
  getAllBatches,
};
