const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Get the token from cookies
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token; // Get the token from cookies
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.userRole === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Only admin access" });
    }
  });
};

const verifyTeacher = (req, res, next) => {
  const token = req.cookies.access_token; // Get the token from cookies
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.userRole === "teacher") {
      next();
    } else {
      return res.status(403).json({ message: "Only teacher access" });
    }
  });
};

const verifyPrivilege = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log(user);
    if (user.userRole === "teacher" || user.userRole === "admin") {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Only special access" });
    }
  });
};

module.exports = { verifyToken, verifyAdmin, verifyTeacher, verifyPrivilege };
