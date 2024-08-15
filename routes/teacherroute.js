const express = require("express");
const router = express.Router();
const Teacher = require("../models/teachermodel.js");
const { verifyToken, verifyAdmin } = require("../utils/VerifyToken.js");
// Read Profile
router.get("/teacher-profile/:id", verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select(
      "name department profilePicture"
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    if (req.user.userId === req.params.id || req.user.userRole === "admin") {
      return res.status(200).json(teacher);
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update-teacher-profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.userRole !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTeacher)
      return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Profile
router.delete("/delete-teacher-profile/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.userRole !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher)
      return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json({ message: "Teacher profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/teacher-courses/:id", verifyToken, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.userRole;
    if (userRole !== "admin" && userId !== teacherId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const teacher = await Teacher.findById(teacherId).populate("courses");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher.courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { teacherroute: router };
