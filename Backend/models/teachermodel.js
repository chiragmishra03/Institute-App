const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    profilePicture: {
      type: String,
      default: "https://rb.gy/h05p8p",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;
