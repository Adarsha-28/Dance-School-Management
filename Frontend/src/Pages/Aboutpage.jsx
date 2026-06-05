import React from "react";
import "../Assets/CSS/Home.css";
import Navbar from "../Components/Navbar";

function Aboutpage() {
  return (
    <div className="page">
      <Navbar />

      <main className="content-page">
        <section className="content-box">
          <p className="eyebrow">OUR STORY</p>

          <h1>
            About <span>Us</span>
          </h1>

          <p>
            Dance Academy is a creative space for students who want to learn,
            perform, and grow with confidence. We teach dance with patience,
            discipline, and joy.
          </p>

          <div className="grid two">
            <div className="card">
              <h3>Our Mission</h3>
              <p>
                To make quality dance training simple, friendly, and inspiring
                for every learner.
              </p>
            </div>

            <div className="card">
              <h3>Our Classes</h3>
              <p>
                We offer hip hop, classical, contemporary, salsa, zumba, and
                performance training.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Aboutpage;
