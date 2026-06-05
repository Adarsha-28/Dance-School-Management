const Enquiry = require("../models/Enquiry");

// Submit a new enquiry
const createEnquiry = async (req, res) => {
  const { name, phone, email, course, level, timing, message } = req.body;

  try {
    const enquiry = new Enquiry({
      name,
      phone,
      email,
      course,
      level,
      timing,
      message,
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all enquiries (Admin only)
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update enquiry status (Admin only)
const updateEnquiryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    enquiry.status = status;
    const updatedEnquiry = await enquiry.save();

    res.json(updatedEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
};
