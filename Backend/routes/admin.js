const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/dashboard", protect, adminOnly, getStats);

module.exports = router;
