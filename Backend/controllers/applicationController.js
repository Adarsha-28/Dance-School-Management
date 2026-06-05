const Application = require("../models/Application");

// Submit a new application
const createApplication = async (req, res) => {
  const {
    studentName,
    age,
    guardianName,
    phone,
    email,
    course,
    batch,
    experience,
    address,
  } = req.body;

  try {
    const application = new Application({
      studentName,
      age,
      guardianName,
      phone,
      email,
      course,
      batch,
      experience,
      address,
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all applications (Admin only)
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (Admin only)
const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
};
