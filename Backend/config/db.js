const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to MongoDB Atlas...");
    const conn = await mongoose.connect(uri, { 
      dbName: "DanceAcademyDB",
      tlsAllowInvalidCertificates: true // Bypass local TLS validation failures
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
