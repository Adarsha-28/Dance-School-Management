import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../Assets/CSS/Home.css";

function Contact() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("Hip Hop");
  const [messageContent, setMessageContent] = useState("");

  const [feedback, setFeedback] = useState("");
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
      setFeedback("Please enter your name.");
      setIsError(true);
      return;
    }
    if (!email.trim()) {
      setFeedback("Please enter your email.");
      setIsError(true);
      return;
    }
    if (!phone.trim()) {
      setFeedback("Please enter your phone number.");
      setIsError(true);
      return;
    }
    if (!messageContent.trim()) {
      setFeedback("Please enter your message.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch("https://groovix-78ic.onrender.com/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          course,
          level: "Beginner",
          timing: "Evening Batch",
          message: messageContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback("Message sent successfully! We will contact you soon.");
        setIsError(false);
        setPhone("");
        setMessageContent("");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setFeedback(data.message || "Failed to send message.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Contact error:", error);
      setFeedback("Server connection failed. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="contact-page">
        <div className="contact-header">
          <div>
            <p className="eyebrow">GET IN TOUCH</p>

            <h1>
              Contact <span>Us</span>
            </h1>

            <p>
              Have questions about classes, fees, batches, or trial sessions?
              Send a message and our academy team will contact you soon.
            </p>
          </div>

          <div className="contact-card">
            <h2>Studio Details</h2>

            <p>
              <strong>Address:</strong> 123 Dance Street, Mumbai, India
            </p>

            <p>
              <strong>Phone:</strong> +91 98765 43210
            </p>

            <p>
              <strong>Email:</strong> info@danceacademy.com
            </p>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h3>Student Feedback</h3>

            <p>
              Tell us about your learning experience or rate our trainers and programs.
            </p>

            <Link className="btn enquiry-btn" to="/feedback">
              Open Feedback Form
            </Link>
          </div>

          <form className="form-panel" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Interested Course</label>

                <select
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

            <div className="form-group">
              <label>Message</label>

              <textarea
                rows="5"
                placeholder="Write your message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn">
              Send Message
            </button>

            {feedback && (
              <p
                className="form-message"
                style={{
                  color: isError ? "#c0392b" : "#1a9a12",
                  marginTop: "15px",
                  fontWeight: "600",
                }}
              >
                {feedback}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default Contact;