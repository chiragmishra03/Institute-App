const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    createdby: {
      type: String,
      required: true,
    },
    instructors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      enum: ["Technical", "Business", "Marketing", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    sub_category: {
      type: String,
    },
    batch_size: {
      type: Number,
      required: true,
      default: 100,
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    expiry_date: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
