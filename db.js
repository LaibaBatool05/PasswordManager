// backend/db.js

const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/passop"; // Update this if needed

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to MongoDB");
  });
};

module.exports = connectToMongo;
