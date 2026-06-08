// ─── 1. Configure DNS resolver for Atlas SRV records & Load Environment Variables ───
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dotenv = require("dotenv");
dotenv.config();

// ─── 2. Connect to Database ───────────────────────────────────────────────────
const dbConnect = require("./config/db");
dbConnect();

// ─── 3. Core Dependencies ─────────────────────────────────────────────────────
const express = require("express");
const cors = require("cors");

// ─── 4. Initialize Express App ────────────────────────────────────────────────
const app = express();

// ─── 5. Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── 6. API Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));

// ─── 7. Root Health Check Route ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Dance Academy Management System API" });
});

// ─── 8. Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ─── 9. Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
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
