import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../Pages/Homepage";
import Aboutpage from "../Pages/Aboutpage";
import Courses from "../Pages/Courses";
import Contact from "../Pages/Contact";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import ForgotPassword from "../Pages/ForgotPassword";
import FAQ from "../Pages/FAQ";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import TermsConditions from "../Pages/TermsConditions";
import Application from "../Pages/Application";
import Feedback from "../Pages/Feedback";
import AdminDashboard from "../Pages/AdminDashboard";
import AdminAdmins from "../Pages/AdminAdmins";
import AdminApplications from "../Pages/AdminApplications";
import AdminJoinedStudents from "../Pages/AdminJoinedStudents";
import AdminFeedback from "../Pages/AdminFeedback";
import AdminCourses from "../Pages/AdminCourses";
import AdminBatches from "../Pages/AdminBatches";
import Profile from "../Pages/Profile";
import Enquiry from "../Pages/Enquiry";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/about" element={<Aboutpage />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/application" element={<Application />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/enquiry" element={<Enquiry />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/admins" element={<AdminAdmins />} />
      <Route path="/admin/applications" element={<AdminApplications />} />
      <Route path="/admin/joined-students" element={<AdminJoinedStudents />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/batches" element={<AdminBatches />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;
