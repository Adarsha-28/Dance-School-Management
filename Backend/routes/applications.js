const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  getMyApplications,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", createApplication);
router.get("/my", protect, getMyApplications);
router.get("/", protect, adminOnly, getApplications);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

module.exports = router;

