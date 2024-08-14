const router = require("express").Router();
const User = require("../models/usermodel.js");
const Teacher = require("../models/teachermodel.js");
const Student = require("../models/studentmodel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/signup", async (req, res) => {
  const { name, password, email, userRole, phoneNumber, description } =
    req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      const saltRounds = 10;
      const hashedPass = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        name,
        password: hashedPass,
        email,
        userRole,
        phoneNumber,
        description,
      });
      const savedUser = await newUser.save();
      const id = savedUser._id;
      if (userRole === "teacher") {
        const newTeacher = new Teacher({
          _id:id,
          name,
          email,
          userRole,
          phoneNumber,
          description,
        });
        await newTeacher.save();
      } else if (userRole === "student") {
        const newStudent = new Student({
          _id: id,
          name,
          email,
          userRole,
          phoneNumber,
          description,
        });
        await newStudent.save();
      }
      res.status(201).json({
        message: "User created successfully",
        savedUser: savedUser.email,
      });
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing request" });
  }
});
router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ message: "user not found!" });
    const isCorrectPass = await bcrypt.compare(password, user.password);
    if (isCorrectPass) {
      const token = jwt.sign(
        { userRole: user.userRole, userId: user._id, userEmail: email },
        process.env.JWT_SECRET_KEY
      );
      return res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ message: "user login success" });
    } else {
      return res.json({ message: "please enter valid email and password" });
    }
  } catch (error) {
    console.log(error);
  }

  return res.json({ message: "something went wrong" });
});
module.exports = { authRoute: router };
