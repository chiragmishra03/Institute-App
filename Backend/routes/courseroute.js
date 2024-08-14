const router = require("express").Router();
const Course = require("../models/coursemodel.js");
const Teacher = require("../models/teachermodel.js");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyPrivilege } = require("../utils/VerifyToken.js");

router.get("/get-course/:id", verifyToken, async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId);
    return res.json({
      "course-details": course,
      message: "course retirved succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "course cannot be retrived now" });
  }
});

router.post("/create-course", verifyPrivilege, async (req, res) => {
  const newCourse = new Course(req.body);
  newCourse.createdby = req.user.userId;
  try {
    const savedCourse = await newCourse.save();
    if (req.user.userRole === "teacher") {
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        req.user.userId,
        { $push: { courses: savedCourse._id } },
        { new: true }
      );
      console.log(`${savedCourse._id} added to ${updatedTeacher}`);
    }
    return res.status(201).json({
      message: "Course creation successful",
      course: savedCourse,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Course cannot be created!" });
  }
});

router.put("/update-course/:id", verifyPrivilege, async (req, res) => {
  const courseId = req.params.id;
  const updateData = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.json({ message: "course cannot be found" });
  const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
    new: true,
  });
  res.status(200).json({
    message: "Course updated successfully",
    updatedCourse,
  });
});

router.delete("/delete-course/:id", verifyPrivilege, async (req, res) => {
  const courseId = req.params.id;

  try {
    // Find the course to delete
    const courseToDelete = await Course.findById(courseId);
    if (!courseToDelete) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is admin or the creator of the course
    if (
      req.user.userRole === "admin" ||
      courseToDelete.createdby === req.user.userId
    ) {
      // Delete the course
      await Course.findByIdAndDelete(courseId);

      // Remove course ID from all teachers' courses array
      await Teacher.updateMany(
        { courses: courseId },
        { $pull: { courses: courseId } }
      );

      res.status(200).json({
        message: "Course deleted successfully",
      });
    } else {
      res.status(403).json({ message: "You cannot delete this course" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the course" });
  }
});

module.exports = { courseRoute: router };
