const express = require("express");
const router = express.Router();
const Student = require("../models/studentmodel.js");
const { verifyToken, verifyAdmin } = require("../utils/VerifyToken.js");

router.get("/get-all-students", verifyAdmin, async (req, res) => {
  try {
    const students = await Student.find({});
    return await res.json({ students: students });
  } catch (error) {
    console.log(error);
    return res.json({ message: "cannot be fetched rn" });
  }
});

router.get("/profile/:id", verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select(
      "name institute displayPicture"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (req.user.id === req.params.id) {
      const studentWithCourses = await Student.findById(req.params.id).populate(
        "enrolledCourses"
      );
      return res.status(200).json(studentWithCourses);
    } else {
      return res.status(200).json(student);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/update-profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      if (req.user.userRole !== "admin")
        return res.status(403).json({ message: "Access Denied" });
    }
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Profile
router.delete("/delete-profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      if (req.user.userRole !== "admin")
        return res.status(403).json({ message: "Access Denied" });
    }
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Student profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/enrolled-courses/:id", verifyToken, async (req, res) => {
  try {
    const studentId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.userRole;
    if (userRole !== "admin" && userId !== studentId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const student = await Student.findById(studentId).populate(
      "enrolledCourses"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student.enrolledCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { studentroute: router };
