const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  getMyApplications,
  payApplicationFee,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", createApplication);
router.get("/my", protect, getMyApplications);
router.get("/", protect, adminOnly, getApplications);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);
router.put("/:id/pay", protect, payApplicationFee);

module.exports = router;

