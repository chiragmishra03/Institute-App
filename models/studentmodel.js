const { mongoose } = require("mongoose");
const StudentSchema = new mongoose.Schema(
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
    institute: {
      type: String,
      default: "N/A",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    displayPicture: {
      type: String,
      default: "https://rb.gy/h05p8p",
    },
    description: {
      type: String,
    },
  },
  { timeStamps: true }
);
const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
