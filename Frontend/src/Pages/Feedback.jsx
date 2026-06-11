import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/CSS/Home.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getApiUrl } from "../utils/api";

function Feedback() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

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
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setIsError(true);
      return;
    }
    if (!comment.trim()) {
      setMessage("Please enter your feedback comments.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(getApiUrl("api/feedback"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          rating: Number(rating),
          comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Thank you! Your feedback has been submitted successfully.");
        setIsError(false);
        setComment("");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to submit feedback.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setMessage("Server connection failed. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="auth-wrap">
        <form className="form-box wide" onSubmit={handleSubmit}>
          <p className="eyebrow">SHARE YOUR EXPERIENCE</p>

          <h1>
            Student <span>Feedback</span>
          </h1>

          <p>
            We value your reviews. Let us know how your training and experience has been at the academy.
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
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1 to 5 Stars)</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ padding: "13px 15px", borderRadius: "6px" }}
            >
              <option value="5">★★★★★ (5 - Excellent)</option>
              <option value="4">★★★★☆ (4 - Very Good)</option>
              <option value="3">★★★☆☆ (3 - Good)</option>
              <option value="2">★★☆☆☆ (2 - Fair)</option>
              <option value="1">★☆☆☆☆ (1 - Poor)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review / Comments</label>
            <textarea
              id="comment"
              rows="5"
              placeholder="Tell us what you liked or how we can improve"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <button className="btn" type="submit" style={{ width: "100%" }}>
            SUBMIT FEEDBACK
          </button>

          {message && (
            <p
              className="form-message"
              style={{
                color: isError ? "#c0392b" : "#1a9a12",
                marginTop: "15px",
                fontWeight: "600",
                textAlign: "center"
              }}
            >
              {message}
            </p>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Feedback;
