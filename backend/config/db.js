const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * Reads connection string from environment variable MONGO_URI.
 * Exits process on failure to prevent app from running without DB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
