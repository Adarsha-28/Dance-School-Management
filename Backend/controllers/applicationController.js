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

// Get current user's applications
const getMyApplications = async (req, res) => {
  try {
    const email = req.user.email;
    if (!email) {
      return res.status(400).json({ message: "User email not found in token" });
    }
    const applications = await Application.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay for course fee
const payApplicationFee = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify application owner
    if (application.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: "Not authorized to pay for this application" });
    }

    application.paid = true;
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
  getMyApplications,
  payApplicationFee,
};

