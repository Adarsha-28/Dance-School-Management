import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

import img1 from "../Assets/Images/img1.png";
import img2 from "../Assets/Images/img2.png";
import img3 from "../Assets/Images/img3.png";
import img4 from "../Assets/Images/img4.png";
import img5 from "../Assets/Images/img5.png";
import img6 from "../Assets/Images/img6.png";
import img7 from "../Assets/Images/img7.png";
import img8 from "../Assets/Images/img8.png";
import contemporaryImg from "../Assets/Images/about_dance_class.png";

const imageMap = {
  "img1.png": img1,
  "img2.png": img2,
  "img3.png": img3,
  "img4.png": img4,
  "img5.png": img5,
  "img6.png": img6,
  "img7.png": img7,
  "img8.png": img8,
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://groovix-78ic.onrender.com/api/courses");
        const data = await response.json();
        if (response.ok) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="page">
      <Navbar />

      <main>
        <section className="content-page">
          <div className="content-box">
            <p className="eyebrow">TRAIN WITH US</p>

            <h1>
              Dance <span>Courses</span>
            </h1>

            <p>
              Choose from energetic, classical, fitness, and performance-focused
              dance programs. Each course is taught with step-by-step training,
              practice sessions, and stage confidence.
            </p>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">
            All Dance <span>Varieties</span>
          </h2>

          <div className="grid">
            {loading ? (
              <div style={{ textAlign: "center", gridColumn: "span 3", padding: "40px" }}>
                <h3>Loading Courses...</h3>
              </div>
            ) : courses.length === 0 ? (
              <div style={{ textAlign: "center", gridColumn: "span 3", padding: "40px" }}>
                <h3>No courses found.</h3>
              </div>
            ) : (
              courses.map((course) => (
                <div className="card course-card" key={course._id}>
                  <img
                    className="course-img"
                    src={
                      (course.title && course.title.toLowerCase().includes("contemporary"))
                        ? contemporaryImg
                        : (imageMap[course.image] || img1)
                    }
                    alt={course.title}
                  />
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="course-meta">
                    <span>{course.level}</span>
                    <span>{course.timing}</span>
                  </div>

                  <div style={{ marginTop: "15px", borderTop: "1px solid rgba(255, 255, 255, 0.12)", paddingTop: "12px", fontSize: "13px" }}>
                    <p style={{ margin: "5px 0" }}><strong>Schedule:</strong> {course.timing}</p>
                    <p style={{ margin: "5px 0" }}><strong>Fees:</strong> {course.fees}</p>
                    <p style={{ margin: "5px 0", color: "#2ecc71" }}><strong>Available Seats:</strong> {course.seats} left</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <h3>DANCE ACADEMY</h3>
          <p>Empowering students through rhythm, movement, and confidence.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/application">Application Form</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Resources</h4>
          <Link to="/feedback">Feedback Form</Link>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms and Conditions</Link>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>
            +91 98765 43210
            <br />
            info@danceacademy.com
            <br />
            Mumbai, India
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Courses;
