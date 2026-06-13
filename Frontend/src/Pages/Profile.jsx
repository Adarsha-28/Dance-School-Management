import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Assets/CSS/Home.css";
import "../Assets/CSS/Profile.css";
import { getApiUrl } from "../utils/api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Payment portal states
  const [paymentApp, setPaymentApp] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("danceAcademyToken");
    const isLoggedIn = sessionStorage.getItem("danceAcademyLoggedIn") === "true";

    if (!isLoggedIn || !token) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Fetch User Details from backend
        const userRes = await fetch(getApiUrl("api/auth/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to load user profile");
        }

        const userData = await userRes.json();
        setUser(userData);

        // Fetch Applications from backend
        const appsRes = await fetch(getApiUrl("api/applications/my"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData);
        }

        // Fetch Courses to dynamically lookup course fees
        const coursesRes = await fetch(getApiUrl("api/courses"));
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }
      } catch (err) {
        console.error(err);
        setError("Could not retrieve profile information. Please log in again.");
        // Clear session storage on token/auth error
        sessionStorage.removeItem("danceAcademyLoggedIn");
        sessionStorage.removeItem("danceAcademyToken");
        sessionStorage.removeItem("danceAcademyUser");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.cardholderName) {
      alert("Please fill in all card details.");
      return;
    }

    setSubmittingPayment(true);

    try {
      const token = sessionStorage.getItem("danceAcademyToken");
      const res = await fetch(getApiUrl(`api/applications/${paymentApp.app._id}/pay`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const updatedApp = await res.json();
        // Update local applications list
        setApplications(applications.map(a => a._id === updatedApp._id ? { ...a, paid: true } : a));

        // Create transaction receipt
        const receipt = {
          transactionId: "TXN-" + Math.floor(1000000000 + Math.random() * 9000000000),
          course: paymentApp.app.course,
          batch: paymentApp.app.batch,
          fee: paymentApp.fee,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          cardholder: cardDetails.cardholderName,
        };

        setPaymentSuccessReceipt(receipt);
      } else {
        const errData = await res.json();
        alert(`Payment failed: ${errData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting the backend server during payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <main className="profile-container loading-state">
          <div className="spinner"></div>
          <p>Loading your dance profile...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <main className="profile-container error-state">
          <div className="error-card">
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <p>Redirecting you to the login page...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="profile-container">
        <div className="profile-header">
          <div className="welcome-section">
            <span className="eyebrow">STUDENT PORTAL</span>
            <h1>
              Welcome back, <span>{user?.name}</span>!
            </h1>
            <p>View your profile details, application status, and manage your account.</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* User Details Sidebar */}
          <section className="profile-card info-card">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
            </div>
            <h2>Account Details</h2>
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <strong className="detail-val">{user?.name}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <strong className="detail-val">{user?.email}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Role</span>
                <strong className="detail-val capitalize">{user?.role}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since</span>
                <strong className="detail-val">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </strong>
              </div>
            </div>

            {user?.role === "admin" && (
              <Link to="/admin" className="btn admin-btn">
                GO TO ADMIN PANEL
              </Link>
            )}

            {user?.role === "student" && (
              <Link to="/profile/attendance" className="btn" style={{ marginTop: "15px", display: "block", textAlign: "center" }}>
                📊 VIEW ATTENDANCE
              </Link>
            )}
          </section>

          {/* Applications History */}
          <section className="profile-card history-card">
            <h2>My Course Applications</h2>
            <p className="section-desc">
              Here are all the admission applications you've submitted to the Academy.
            </p>

            {applications.length === 0 ? (
              <div className="empty-applications">
                <p>You haven't submitted any course applications yet.</p>
                <Link to="/application" className="btn">
                  APPLY FOR A COURSE
                </Link>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map((app) => (
                  <div key={app._id} className="app-item-card">
                    <div className="app-item-header">
                      <div>
                        <h3>{app.course}</h3>
                        <span className="app-date">
                          Submitted on{" "}
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <span className={`status-badge ${app.status.toLowerCase().replace(/\s+/g, "")}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="app-item-body">
                      <div className="app-info-grid">
                        <div>
                          <span>Preferred Batch:</span>
                          <strong>{app.batch}</strong>
                        </div>
                        <div>
                          <span>Applicant Age:</span>
                          <strong>{app.age} years</strong>
                        </div>
                        <div>
                          <span>Contact Phone:</span>
                          <strong>{app.phone}</strong>
                        </div>
                        {app.guardianName && (
                          <div>
                            <span>Guardian Name:</span>
                            <strong>{app.guardianName}</strong>
                          </div>
                        )}
                      </div>
                      <div className="app-experience">
                        <span>Experience details:</span>
                        <p>{app.experience}</p>
                      </div>

                      {/* Course Fee Payment Block */}
                      {app.status === "Approved" && (
                        <div style={{
                          marginTop: "15px",
                          paddingTop: "15px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px"
                        }}>
                          <div>
                            <span style={{ fontSize: "11px", color: "#b983ff", textTransform: "uppercase", letterSpacing: "0.5px" }}>Course Tuition Fee</span>
                            <div style={{ marginTop: "4px" }}>
                              {app.paid ? (
                                <span style={{ color: "#22c55e", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }}>
                                  ✓ Paid & Enrolled
                                </span>
                              ) : (
                                <span style={{ color: "#f59e0b", fontWeight: "700", fontSize: "14px" }}>
                                  ⚠️ Unpaid
                                </span>
                              )}
                            </div>
                          </div>
                          {!app.paid && (
                            <button
                              onClick={() => {
                                const matchedCourse = courses.find(c => c.title.toLowerCase() === app.course.toLowerCase());
                                const fee = matchedCourse ? matchedCourse.fees : "₹3,500 / Month";
                                setPaymentApp({ app, fee });
                                setCardDetails({
                                  cardholderName: user?.name || "",
                                  cardNumber: "",
                                  expiry: "",
                                  cvv: "",
                                });
                                setPaymentSuccessReceipt(null);
                              }}
                              className="btn"
                              style={{
                                padding: "8px 16px",
                                fontSize: "12px",
                                margin: 0,
                                background: "linear-gradient(135deg, #7a25ff, #d02dff)",
                              }}
                            >
                              Pay Course Fee
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Course Payment Modal Overlay */}
      {paymentApp && (
        <div className="modal-overlay" onClick={() => { if (!submittingPayment) setPaymentApp(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", position: "relative" }}>
            {!submittingPayment && (
              <button className="modal-close" onClick={() => setPaymentApp(null)}>
                &times;
              </button>
            )}

            {paymentSuccessReceipt ? (
              // Payment Success Receipt View
              <div style={{ textAlign: "center", padding: "10px" }}>
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "2px solid #22c55e",
                  color: "#22c55e",
                  fontSize: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}>
                  ✓
                </div>
                <h2 style={{ color: "#22c55e", marginBottom: "5px" }}>Payment Successful!</h2>
                <p style={{ color: "#bdb9d9", fontSize: "14px", marginTop: 0 }}>Thank you for your enrollment. Your seat is confirmed.</p>

                <div style={{
                  background: "rgba(0, 0, 0, 0.25)",
                  borderRadius: "8px",
                  padding: "20px",
                  margin: "20px 0",
                  textAlign: "left",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  fontSize: "14px",
                  lineHeight: "1.6"
                }}>
                  <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "10px", color: "#ffffff" }}>
                    Academy Fee Receipt
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#bdb9d9" }}>Course Name:</span>
                    <strong style={{ color: "#ffffff" }}>{paymentSuccessReceipt.course}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#bdb9d9" }}>Batch Schedule:</span>
                    <strong style={{ color: "#ffffff" }}>{paymentSuccessReceipt.batch}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#bdb9d9" }}>Paid Amount:</span>
                    <strong style={{ color: "#d946ef" }}>{paymentSuccessReceipt.fee}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#bdb9d9" }}>Paid By:</span>
                    <strong style={{ color: "#ffffff" }}>{paymentSuccessReceipt.cardholder}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#bdb9d9" }}>Payment Date:</span>
                    <strong style={{ color: "#ffffff" }}>{paymentSuccessReceipt.date}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.12)" }}>
                    <span style={{ color: "#bdb9d9" }}>Transaction ID:</span>
                    <code style={{ color: "#b983ff", fontWeight: "bold" }}>{paymentSuccessReceipt.transactionId}</code>
                  </div>
                </div>

                <button 
                  onClick={() => setPaymentApp(null)} 
                  className="btn"
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  Close & Return
                </button>
              </div>
            ) : (
              // Payment Submission Form View
              <div>
                <h2 style={{ marginBottom: "5px", background: "linear-gradient(135deg, #ffffff, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Course Fee Payment
                </h2>
                <p style={{ color: "#bdb9d9", fontSize: "14px", marginTop: 0, marginBottom: "20px" }}>
                  Complete your payment for <strong>{paymentApp.app.course}</strong> course.
                </p>

                <div style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                  padding: "12px 18px",
                  marginBottom: "20px",
                  borderLeft: "4px solid #d946ef",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#bdb9d9", textTransform: "uppercase" }}>Amount Due</span>
                    <h3 style={{ margin: "2px 0 0 0", color: "#ffffff", fontSize: "18px" }}>{paymentApp.fee}</h3>
                  </div>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#f59e0b",
                    fontSize: "11px",
                    fontWeight: "bold"
                  }}>
                    PENDING FEE
                  </span>
                </div>

                <form onSubmit={handlePaymentSubmit} style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "12px" }}>Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter name as on card"
                      value={cardDetails.cardholderName}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "white" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "12px" }}>Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength="19"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setCardDetails({ ...cardDetails, cardNumber: val });
                      }}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "white" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "12px" }}>Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength="5"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) {
                            val = val.slice(0, 2) + "/" + val.slice(2, 4);
                          }
                          setCardDetails({ ...cardDetails, expiry: val });
                        }}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "white" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "12px" }}>CVV</label>
                      <input
                        type="password"
                        required
                        maxLength="3"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "white" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <button
                      type="submit"
                      disabled={submittingPayment}
                      className="btn"
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "14px",
                        background: "linear-gradient(135deg, #7a25ff, #d02dff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                      }}
                    >
                      {submittingPayment ? "Processing..." : `Pay Fee (${paymentApp.fee})`}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;
