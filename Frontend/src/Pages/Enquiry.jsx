import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../Assets/CSS/Home.css";
import { getApiUrl } from "../utils/api";

function Enquiry() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("Hip Hop");
  const [level, setLevel] = useState("Beginner");
  const [timing, setTiming] = useState("Morning Batch");
  const [messageContent, setMessageContent] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const userStr = sessionStorage.getItem("danceAcademyUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setName(user.name || "");
        setEmail(user.email || "");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter your name.");
      setIsError(true);
      return;
    }
    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      setIsError(true);
      return;
    }
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setIsError(true);
      return;
    }
    if (!messageContent.trim()) {
      setMessage("Please enter your enquiry details.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(getApiUrl("api/enquiries"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          course,
          level,
          timing,
          message: messageContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Enquiry submitted successfully! We will contact you soon.");
        setIsError(false);
        setPhone("");
        setMessageContent("");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to submit enquiry.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Enquiry submission error:", error);
      setMessage("Server connection failed. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="auth-wrap">
        <form className="form-box wide" onSubmit={handleSubmit}>
          <p className="eyebrow">ASK US ANYTHING</p>

          <h1>
            Enquiry <span>Form</span>
          </h1>

          <p>
            Send your details and our team will contact you with batch, fee,
            and course information.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Interested Course</label>

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
              <label htmlFor="level">Dance Level</label>

              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timing">Preferred Timing</label>

              <select
                id="timing"
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
              >
                <option>Morning Batch</option>
                <option>Evening Batch</option>
                <option>Weekend Batch</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>

            <textarea
              id="message"
              rows="5"
              placeholder="Tell us what you want to know"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            ></textarea>
          </div>

          <button className="btn" type="submit">
            SUBMIT ENQUIRY
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
        </form>
      </main>
    </div>
  );
}

export default Enquiry;
