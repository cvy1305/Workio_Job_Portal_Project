import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export default connectDB;
