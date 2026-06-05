const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", createFeedback);
router.get("/", protect, adminOnly, getFeedbacks);

module.exports = router;
