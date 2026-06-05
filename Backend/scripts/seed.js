const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load model files
const User = require("../models/User");
const Course = require("../models/Course");
const Application = require("../models/Application");
const Feedback = require("../models/Feedback");
const Batch = require("../models/Batch");

// Configure dotenv path
dotenv.config({ path: path.join(__dirname, "../.env") });

const seedDB = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Application.deleteMany({});
    await Feedback.deleteMany({});
    await Batch.deleteMany({});
    console.log("Cleared existing collections.");

    // Hash Admin Password
    const adminPasswordHash = await bcrypt.hash("Admin@123", 10);

    // Create Admin User
    const admin = await User.create({
      name: "Academy Administrator",
      email: "admin@danceacademy.com",
      password: adminPasswordHash,
      role: "admin",
    });
    console.log("Admin account created.");

    // Create a student user for testing
    const studentPasswordHash = await bcrypt.hash("Student@123", 10);
    await User.create({
      name: "Riya Sharma",
      email: "student@danceacademy.com",
      password: studentPasswordHash,
      role: "student",
    });
    console.log("Student account created.");

    // Insert Courses
    const courses = [
      {
        title: "Hip Hop",
        description:
          "Learn grooves, footwork, freestyle, musicality, and powerful street-style combinations.",
        level: "Beginner to Advanced",
        timing: "3 Days / Week",
        image: "img1.png",
        fees: "₹2,500/month",
        seats: 8,
      },
      {
        title: "Bharatanatyam",
        description:
          "Build grace, posture, expressions, mudras, rhythm, and classical performance discipline.",
        level: "All Levels",
        timing: "Weekend Batch",
        image: "img4.png",
        fees: "₹3,000/month",
        seats: 5,
      },
      {
        title: "Contemporary",
        description:
          "Explore fluid movement, body control, floor work, emotion, and creative storytelling.",
        level: "Intermediate",
        timing: "Evening Batch",
        image: "img2.png",
        fees: "₹2,800/month",
        seats: 12,
      },
      {
        title: "Salsa",
        description:
          "Practice partner work, turns, rhythm, timing, basic steps, and confident social dancing.",
        level: "Beginner Friendly",
        timing: "2 Days / Week",
        image: "img3.png",
        fees: "₹3,200/month",
        seats: 6,
      },
      {
        title: "Zumba",
        description:
          "Enjoy dance fitness with fun choreography, cardio movement, stamina, and full-body energy.",
        level: "Fitness Batch",
        timing: "Morning / Evening",
        image: "img5.png",
        fees: "₹2,000/month",
        seats: 15,
      },
      {
        title: "Kathak",
        description:
          "Learn footwork, spins, hand gestures, rhythm cycles, and graceful classical presentation.",
        level: "Foundation Level",
        timing: "Weekend Batch",
        image: "img6.png",
        fees: "₹3,000/month",
        seats: 4,
      },
      {
        title: "Kids Dance",
        description:
          "A cheerful class for children with basic rhythm, coordination, confidence, and performance practice.",
        level: "Ages 5 to 12",
        timing: "After School",
        image: "img7.png",
        fees: "₹2,200/month",
        seats: 10,
      },
      {
        title: "Wedding Choreography",
        description:
          "Custom choreography for solo, couple, family, and group performances for special events.",
        level: "Custom Plan",
        timing: "Private Sessions",
        image: "img8.png",
        fees: "₹12,000/course",
        seats: 2,
      },
    ];

    await Course.insertMany(courses);
    console.log("Courses seeded.");

    // Insert Batches
    const batches = [
      {
        name: "Morning",
        courses: ["Hip Hop", "Zumba", "Bharatanatyam"],
        timing: "8:00 AM - 10:00 AM",
      },
      {
        name: "Evening",
        courses: ["Contemporary", "Salsa", "Hip Hop"],
        timing: "5:00 PM - 8:00 PM",
      },
      {
        name: "Weekend",
        courses: ["Kathak", "Kids Dance", "Wedding Choreography"],
        timing: "10:00 AM - 2:00 PM",
      },
    ];

    await Batch.insertMany(batches);
    console.log("Batches seeded.");

    // Insert Sample Applications
    const applications = [
      {
        studentName: "Riya Sharma",
        age: 20,
        guardianName: "Sunil Sharma",
        phone: "9876543210",
        email: "riya@gmail.com",
        course: "Hip Hop",
        batch: "Evening Batch",
        experience: "Less than 1 Year",
        address: "123 Lokhandwala Complex, Andheri West, Mumbai, India",
        status: "Pending",
      },
      {
        studentName: "Aarav Mehta",
        age: 22,
        guardianName: "Rajesh Mehta",
        phone: "9988777665",
        email: "aarav@gmail.com",
        course: "Kathak",
        batch: "Weekend Batch",
        experience: "1 to 3 Years",
        address: "456 Shivaji Nagar, Pune, India",
        status: "Approved",
      },
      {
        studentName: "Neha Iyer",
        age: 25,
        guardianName: "Kalyan Iyer",
        phone: "9123456780",
        email: "neha@gmail.com",
        course: "Zumba",
        batch: "Morning Batch",
        experience: "No Experience",
        address: "789 Indiranagar, Bangalore, India",
        status: "Follow Up",
      },
    ];

    await Application.insertMany(applications);
    console.log("Sample Applications seeded.");

    // Insert Sample Feedback
    const feedbacks = [
      {
        name: "Priya Kapoor",
        email: "priya@gmail.com",
        rating: 5,
        comment: "The contemporary classes are amazing! The instructors pay individual attention.",
      },
      {
        name: "Manav Rao",
        email: "manav@gmail.com",
        rating: 4,
        comment: "Excellent kids batch. My son has learned so much in just a few weekends.",
      },
    ];

    await Feedback.insertMany(feedbacks);
    console.log("Sample Feedback seeded.");

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();
