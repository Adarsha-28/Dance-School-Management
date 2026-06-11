import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Assets/CSS/Home.css";

function PrivacyPolicy() {
  return (
    <div className="page">
      <Navbar />

      <main className="content-page">
        <section className="content-box">
          <p className="eyebrow">YOUR DATA</p>

          <h1>
            Privacy <span>Policy</span>
          </h1>

          <div className="policy-item">
            <h3>1. Information We Collect</h3>
            <p>
              We gather necessary details to provide you with seamless studio services, including:
            </p>
            <ul>
              <li>**Personal Identification**: Full name, email address, phone number, and age.</li>
              <li>**Admission Information**: Guardian name, experience level, preferred batches, and full address.</li>
              <li>**Technical Details**: Auth credentials and browser session identifiers stored securely during usage.</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>2. How We Utilize Your Data</h3>
            <p>
              Your information is exclusively processed to manage academy operations:
            </p>
            <ul>
              <li>To schedule classes, assign batches, and coordinate with instructors.</li>
              <li>To keep you updated about scheduled classes, fee payments, and events.</li>
              <li>To compile admin dashboard metrics (active students and pending enquiries).</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>3. Password Encryption & Security</h3>
            <p>
              We prioritize data safety and take stringent measures to defend your information:
            </p>
            <ul>
              <li>**Hashing**: All passwords are encrypted using one-way cryptographic hashing (`bcryptjs`) before saving to MongoDB.</li>
              <li>**JWT Verification**: Access to dashboard pages requires authentication validated by JSON Web Tokens.</li>
              <li>**Protected Environments**: Database connections and API credentials are kept hidden in environment configurations.</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>4. Zero Third-Party Sharing</h3>
            <p>
              We enforce a strict non-disclosure privacy model:
            </p>
            <ul>
              <li>Your personal credentials and application profiles are never sold, traded, or shared with external marketing entities.</li>
              <li>Data is only accessed by authorized academy staff to complete your admission and resolve enquiries.</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>5. Access, Edits & Data Erasure</h3>
            <p>
              You maintain ownership over your personal database records:
            </p>
            <ul>
              <li>If you wish to review, modify, or completely delete your account or application profiles from the academy database, please contact our support desk at `info@danceacademy.com`.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;