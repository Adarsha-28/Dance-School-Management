const express = require("express");
const router = express.Router();
const { getCourses, createCourse, updateCourseSeats, updateCourse } = require("../controllers/courseController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getCourses);
router.post("/", protect, adminOnly, createCourse);
router.put("/:id/seats", protect, adminOnly, updateCourseSeats);
router.put("/:id", protect, adminOnly, updateCourse);

module.exports = router;
