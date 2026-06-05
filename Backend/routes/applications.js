const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", createApplication);
router.get("/", protect, adminOnly, getApplications);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

module.exports = router;
