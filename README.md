# 💃 Dance Academy Management System

A full-stack web application for managing a dance academy — handling student enrollments, course listings, applications, enquiries, feedback, and admin operations.

---

## 📁 Project Structure

```
Dance_Management/
├── Backend/          # Node.js + Express REST API
└── Frontend/         # React.js web application
```

---


## Features

### Student Features

* User Registration (Signup)
* Secure Login System
* Forgot Password Page
* Browse Dance Courses
* Submit Course Enquiries
* Apply for Admission
* View Academy Information
* Contact Academy Team

### Academy Features

* Course Management
* Student Registration Management
* Enquiry Tracking
* Application Tracking
* Batch Information Management
* Student Statistics Dashboard

### Informational Pages

* Home Page
* About Us
* Contact Us
* FAQ Page
* Privacy Policy
* Terms and Conditions

### Admin Dashboard

* View Student Statistics
* Manage Applications
* Manage Enquiries
* View Batch Information
* Academy Overview Dashboard

---

## Technologies Used

### Frontend

* React.js
* React Router DOM
* HTML5
* CSS3
* JavaScript (ES6)

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Node.js
* npm

---

- 🔐 **User Authentication** — Register, login, forgot password with JWT-based auth
- 👤 **Student Profile** — View and manage personal profile
- 📚 **Course Listings** — Browse available dance courses and batches
- 📋 **Course Applications** — Apply to courses and track application status
- 💬 **Feedback System** — Submit and view feedback
- 📞 **Enquiry System** — Send enquiries to the academy
- 🛡️ **Admin Dashboard** — Manage students, courses, applications, and enquiries
- 📄 **Info Pages** — About, FAQ, Privacy Policy, Terms & Conditions

---

## 📂 Backend Overview

```
Backend/
├── config/
│   └── db.js                    # MongoDB connection setup
├── controllers/
│   ├── authController.js        # Register, login, forgot password
│   ├── courseController.js      # Course CRUD operations
│   ├── applicationController.js # Student course applications
│   ├── feedbackController.js    # Feedback handling
│   ├── enquiryController.js     # Enquiry handling
│   └── adminController.js       # Admin operations
├── middleware/                  # Auth & role-based middleware
├── models/
│   ├── User.js                  # User schema
│   ├── Course.js                # Course schema
│   ├── Batch.js                 # Batch schema
│   ├── Application.js           # Application schema
│   ├── Feedback.js              # Feedback schema
│   └── Enquiry.js               # Enquiry schema
├── routes/
│   ├── auth.js                  # /api/auth
│   ├── courses.js               # /api/courses
│   ├── applications.js          # /api/applications
│   ├── feedback.js              # /api/feedback
│   ├── enquiries.js             # /api/enquiries
│   └── admin.js                 # /api/admin
├── .env                         # Environment variables (not committed)
├── .gitignore
└── server.js                    # App entry point
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Forgot password |
| GET | `/api/courses` | Get all courses |
| POST | `/api/applications` | Submit a course application |
| GET | `/api/applications` | Get user's applications |
| POST | `/api/feedback` | Submit feedback |
| POST | `/api/enquiries` | Submit an enquiry |
| GET | `/api/admin/*` | Admin-only routes |

---

## 📂 Frontend Overview

```
Frontend/
├── public/
└── src/
    ├── Assets/           # Images and static assets
    ├── Components/       # Reusable UI components (including AdminSidebar)
    ├── Pages/
    │   ├── Homepage.jsx
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── ForgotPassword.jsx
    │   ├── Profile.jsx
    │   ├── Courses.jsx
    │   ├── Application.jsx
    │   ├── Feedback.jsx
    │   ├── Enquiry.jsx
    │   ├── AdminDashboard.jsx
    │   ├── AdminJoinedStudents.jsx
    │   ├── AdminCourses.jsx
    │   ├── AdminApplications.jsx
    │   ├── AdminBatches.jsx
    │   ├── AdminFeedback.jsx
    │   ├── AdminAdmins.jsx
    │   ├── Aboutpage.jsx
    │   ├── Contact.jsx
    │   ├── FAQ.jsx
    │   ├── PrivacyPolicy.jsx
    │   └── TermsConditions.jsx
    ├── Routers/          # Route definitions
    ├── utils/            # Helper utilities (including api.js)
    ├── App.js
    └── index.js
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Dance_Management.git
cd Dance_Management
```

---

### 2. Setup the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/danceAcademy
JWT_SECRET=your_jwt_secret_key
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

**Start the backend server:**

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend runs at: `http://localhost:5000`

---

### 3. Setup the Frontend

```bash
cd ../Frontend
npm install
npm start
```

The frontend runs at: `http://localhost:3000`

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the backend server | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/danceAcademy` |
| `JWT_SECRET` | Secret key for JWT signing | `your_strong_secret` |

---

## 🛠️ Available Scripts

### Backend (`/Backend`)

| Command | Description |
|---|---|
| `npm start` | Start server in production mode |
| `npm run dev` | Start server with nodemon (auto-reload) |

### Frontend (`/Frontend`)

| Command | Description |
|---|---|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📜 License

This project is for educational purposes. All rights reserved.
