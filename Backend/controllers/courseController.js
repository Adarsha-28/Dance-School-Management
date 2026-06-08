const Course = require("../models/Course");

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course (Admin only)
const createCourse = async (req, res) => {
  const { title, description, level, timing, image, fees, seats } = req.body;

  try {
    const course = new Course({
      title,
      description,
      level,
      timing,
      image,
      fees,
      seats,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update course seats (Admin only)
const updateCourseSeats = async (req, res) => {
  const { id } = req.params;
  const { seats } = req.body;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.seats = Number(seats);
    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a course (Admin only)
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, level, timing, image, fees, seats } = req.body;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (level !== undefined) course.level = level;
    if (timing !== undefined) course.timing = timing;
    if (image !== undefined) course.image = image;
    if (fees !== undefined) course.fees = fees;
    if (seats !== undefined) course.seats = Number(seats);

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getCourses, createCourse, updateCourseSeats, updateCourse };
