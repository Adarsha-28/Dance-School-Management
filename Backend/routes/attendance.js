const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
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
} = require("../controllers/attendanceController");

// Protect all routes
router.use(protect);

router.post("/", markAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

router.get("/student/:studentId", getAttendanceByStudent);
router.get("/batch/:batchId", getAttendanceByBatch);
router.get("/analytics", getAttendanceAnalytics);
router.get("/student-analytics/:studentId", getStudentAnalytics);

router.get("/qr/generate", generateQRCodeToken);
router.post("/qr/scan", scanQRCodeToken);

router.get("/batches/all", getAllBatches);

module.exports = router;
