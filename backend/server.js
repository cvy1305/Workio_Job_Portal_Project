import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/db/connectDB.js";
import userRoutes from "./src/routes/userRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import Cloudinary from "./src/utils/Cloudinary.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://workio-job-portal-project-bzf8.vercel.app' // Your frontend URL
  ].filter(Boolean), // Remove undefined values
  credentials: true
}));

// Debug logging
console.log('FRONTEND_URL env var:', process.env.FRONTEND_URL);
console.log('CORS origins:', [
  process.env.FRONTEND_URL,
  'https://workio-job-portal-project-bzf8.vercel.app'
].filter(Boolean));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

connectDB();
Cloudinary();

app.get("/", (req, res) => res.send("api is working"));

// Test endpoint to check CORS
app.get("/test-cors", (req, res) => {
  res.json({ 
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});


app.use("/user", userRoutes);
app.use("/job", jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
