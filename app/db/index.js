const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/library");
    console.log(`MongoDb connected: ${conn.connection.host}`);
    return conn;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

module.exports = { connectDB };
