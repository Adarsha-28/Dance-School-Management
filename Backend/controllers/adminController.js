const Application = require("../models/Application");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

// Get admin dashboard statistics
const getStats = async (req, res) => {
  try {
    const activeStudents = await Application.countDocuments({
      status: "Approved",
    });
    const totalFeedback = await Feedback.countDocuments({});
    const pendingApplications = await Application.countDocuments({
      status: "Pending",
    });

    res.json({
      activeStudents,
      totalFeedback,
      pendingApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
