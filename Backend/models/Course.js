const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    level: {
      type: String,
      required: [true, "Course level/difficulty is required"],
    },
    timing: {
      type: String,
      required: [true, "Course timing is required"],
    },
    image: {
      type: String,
      required: [true, "Course image path is required"],
    },
    fees: {
      type: String,
      required: [true, "Course fees are required"],
    },
    seats: {
      type: Number,
      required: [true, "Available seats are required"],
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
