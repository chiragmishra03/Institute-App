const express = require("express");
const app = express();
const { authRoute } = require("./routes/authRoute.js");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { connectToDatabase } = require("./dbConfig/dbconnect");
const cookieParser = require("cookie-parser");
const { courseRoute } = require("./routes/courseroute.js");
const { studentroute } = require("./routes/studentroutes.js");
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/student", studentroute);
app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
  connectToDatabase(process.env.MONGO_URI);
});
