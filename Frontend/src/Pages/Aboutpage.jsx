import React from "react";
import { Link } from "react-router-dom";
import "../Assets/CSS/Home.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import danceClassImg from "../Assets/Images/about_dance_class.png";

function Aboutpage() {
  return (
    <div className="page">
      <Navbar />

      <main style={{ paddingTop: "20px" }}>
        {/* Hero Section */}
        <section className="section" style={{ textAlign: "center", paddingBottom: "20px" }}>
          <p className="eyebrow">OUR STORY</p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", margin: "10px 0" }}>
            About <span>Us</span>
          </h1>
        </section>

        {/* Intro Section: Split text and image */}
        <section className="section" style={{ paddingTop: "20px", paddingBottom: "50px" }}>
          <div className="about-split">
            <div>
              <p style={{ fontSize: "19px", lineHeight: "1.8", color: "#f0eaff", marginBottom: "20px" }}>
                Welcome to <strong>Dance Academy</strong>, where movement meets passion. Founded with a vision to create an inclusive, inspiring environment, we believe that dance is not just about steps—it is a superpower that builds confidence, releases creativity, and fosters community.
              </p>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#bdb9d9" }}>
                Whether you are stepping onto the dance floor for the very first time or refining your advanced technique, our studio offers a place for everyone. We offer professional training across multiple disciplines, combining rigorous technique with the sheer joy of self-expression.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img 
                src={danceClassImg} 
                alt="Dance class studio practicing" 
              />
              <div className="about-image-border"></div>
            </div>
          </div>
        </section>

        {/* Mission & Culture Row (Full-width light section) */}
        <section className="section light">
          <div className="grid two">
            <div className="card" style={{ padding: "35px" }}>
              <h3 style={{ color: "#7a25ff", marginTop: 0, fontSize: "24px", marginBottom: "12px" }}>Our Mission</h3>
              <p style={{ lineHeight: "1.7", fontSize: "15px" }}>
                To make professional-grade dance training simple, friendly, and inspiring for every single learner. We prioritize healthy technique, mental wellness, and artistic freedom above all else.
              </p>
            </div>

            <div className="card" style={{ padding: "35px" }}>
              <h3 style={{ color: "#7a25ff", marginTop: 0, fontSize: "24px", marginBottom: "12px" }}>Our Culture</h3>
              <p style={{ lineHeight: "1.7", fontSize: "15px" }}>
                We foster a warm, high-energy community where teachers and students support one another. From seasonal showcases to community workshops, we celebrate every milestone together.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section">
          <h2 className="section-title">
            Our Core <span>Values</span>
          </h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
            <div className="card value-card" style={{ padding: "24px" }}>
              <span>🔥</span>
              <h4>Passion</h4>
              <p>Fueling the unique artistic spark inside every student who walks through our doors.</p>
            </div>
            <div className="card value-card" style={{ padding: "24px" }}>
              <span>🤝</span>
              <h4>Inclusivity</h4>
              <p>A friendly, supportive atmosphere welcoming all ages, bodies, and performance levels.</p>
            </div>
            <div className="card value-card" style={{ padding: "24px" }}>
              <span>⭐</span>
              <h4>Excellence</h4>
              <p>Providing premium instruction guided by certified, highly experienced choreographers.</p>
            </div>
            <div className="card value-card" style={{ padding: "24px" }}>
              <span>🎭</span>
              <h4>Expression</h4>
              <p>Teaching dance as a voice for storytelling, self-discovery, and emotional release.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section" style={{ paddingTop: "20px", paddingBottom: "80px" }}>
          <div className="about-cta" style={{ margin: "0 auto" }}>
            <h3>Ready to find your rhythm?</h3>
            <p>Explore our diverse schedule of classes and take your first step today.</p>
            <div className="about-cta-buttons">
              <Link className="btn" to="/courses">VIEW COURSES</Link>
              <Link className="btn secondary" to="/signup">JOIN THE ACADEMY</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Aboutpage;


