const { mongoose } = require("mongoose");
async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri);
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
}
module.exports = { connectToDatabase };
