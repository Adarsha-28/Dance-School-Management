const Feedback = require("../models/Feedback");

// Submit a new feedback
const createFeedback = async (req, res) => {
  const { name, email, rating, comment } = req.body;

  try {
    const feedback = new Feedback({
      name,
      email,
      rating: Number(rating),
      comment,
    });

    const createdFeedback = await feedback.save();
    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all feedback (Admin only)
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
};
