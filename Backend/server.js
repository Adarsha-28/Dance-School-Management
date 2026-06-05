const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = async () => {
  // DB connection logic is imported below
};

// Load environment variables
dotenv.config();

// Connect to Database
const dbConnect = require("./config/db");
dbConnect();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/admin", require("./routes/admin"));

// Welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Dance Academy Management System API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`👉 Run this command to free the port, then try again:`);
    console.error(`   npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
