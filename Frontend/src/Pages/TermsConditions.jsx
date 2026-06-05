import React from "react";
import Navbar from "../Components/Navbar";
import "../Assets/CSS/Home.css";

function TermsConditions() {
  return (
    <div className="page">
      <Navbar />

      <main className="content-page">
        <section className="content-box">
          <p className="eyebrow">ACADEMY RULES</p>

          <h1>
            Terms and <span>Conditions</span>
          </h1>

          <div className="policy-item">
            <h3>1. Class Registration & Admission</h3>
            <p>
              By registering or applying for admission at Dance Academy, you agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete student details in all application forms.</li>
              <li>Choose a suitable batch timing that aligns with your skill level and availability.</li>
              <li>Maintain the security of your logged-in credentials and assume responsibility for all activities performed under your account.</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>2. Attendance & Cancellation Policy</h3>
            <p>
              Consistent practice is vital for learning dance. To ensure studio harmony:
            </p>
            <ul>
              <li>Students are expected to attend scheduled sessions regularly and arrive on time.</li>
              <li>In case of a planned absence, the academy admin must be informed at least 24 hours in advance.</li>
              <li>Missed classes without prior notification are not eligible for makeup sessions or credit adjustments.</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>3. Payments, Fees & Refund Guidelines</h3>
            <p>
              All class fees and program billings must adhere to the following conditions:
            </p>
            <ul>
              <li>Course fees must be paid in full prior to the start of the selected monthly program or workshop.</li>
              <li>Fees are non-refundable once a batch has started, except in verified cases of injury or medical leaves.</li>
              <li>Late payments may result in a temporary suspension of studio privileges until outstanding balances are cleared.</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>4. Code of Conduct & Studio Rules</h3>
            <p>
              To maintain a supportive and professional learning environment:
            </p>
            <ul>
              <li>Respect must be shown to all instructors, administrators, peers, and studio staff at all times.</li>
              <li>Students must wear appropriate dance attire and clean footwear suitable for their selected dance styles.</li>
              <li>Disruptive behavior, property damage, or harassment of any kind will lead to immediate expulsion from the academy.</li>
            </ul>
          </div>

          <div className="policy-item">
            <h3>5. Medical Disclaimer & Liability Waiver</h3>
            <p>
              Dance training is physically demanding. By enrolling:
            </p>
            <ul>
              <li>You confirm that the student is physically fit to engage in dance movements.</li>
              <li>You release Dance Academy and its instructors from liability for any injuries sustained during classes, rehearsals, or stage shows.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TermsConditions;