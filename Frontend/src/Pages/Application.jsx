import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getApiUrl } from "../utils/api";

function Application() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("Hip Hop");
  const [batch, setBatch] = useState("Morning Batch");
  const [experience, setExperience] = useState("No Experience");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("danceAcademyUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setStudentName(user.name || "");
        setEmail(user.email || "");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName.trim()) {
      setMessage("Please enter the student's name.");
      setIsError(true);
      return;
    }
    if (!age || age <= 0) {
      setMessage("Please enter a valid age.");
      setIsError(true);
      return;
    }
    if (!phone.trim()) {
      setMessage("Please enter a phone number.");
      setIsError(true);
      return;
    }
    if (!email.trim()) {
      setMessage("Please enter an email address.");
      setIsError(true);
      return;
    }
    if (!address.trim()) {
      setMessage("Please enter the address.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(getApiUrl("api/applications"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName,
          age: parseInt(age),
          guardianName,
          phone,
          email,
          course,
          batch,
          experience,
          address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Application submitted successfully! Redirecting...");
        setIsError(false);
        setAge("");
        setGuardianName("");
        setPhone("");
        setAddress("");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to submit application.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setMessage("Server connection failed. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="auth-wrap">
        <form className="form-box wide" onSubmit={handleSubmit}>
          <p className="eyebrow">ADMISSION DETAILS</p>

          <h1>
            Application <span>Form</span>
          </h1>

          <p>
            Fill in your admission details to apply for a dance academy batch.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="student-name">Student Name</label>
              <input
                id="student-name"
                type="text"
                placeholder="Enter student name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="guardian">
                Parent / Guardian Name
              </label>

              <input
                id="guardian"
                type="text"
                placeholder="Enter guardian name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Course</label>

              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option>Hip Hop</option>
                <option>Bharatanatyam</option>
                <option>Contemporary</option>
                <option>Salsa</option>
                <option>Zumba</option>
                <option>Kathak</option>
                <option>Kids Dance</option>
                <option>Wedding Choreography</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="batch">Preferred Batch</label>

              <select
                id="batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              >
                <option>Morning Batch</option>
                <option>Evening Batch</option>
                <option>Weekend Batch</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experience">
                Previous Experience
              </label>

              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option>No Experience</option>
                <option>Less than 1 Year</option>
                <option>1 to 3 Years</option>
                <option>More than 3 Years</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>

            <textarea
              id="address"
              rows="4"
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <button className="btn" type="submit">
            SEND APPLICATION
          </button>

          {message && (
            <p
              className="form-message"
              style={{
                color: isError ? "#c0392b" : "#1a9a12",
                marginTop: "15px",
                fontWeight: "600",
              }}
            >
              {message}
            </p>
          )}

          <div className="form-links">
            <span>Have feedback for our trainers?</span>

            <Link to="/feedback">
              Give feedback
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Application;
