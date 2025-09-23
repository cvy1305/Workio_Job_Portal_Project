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
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://workio-job-portal-project-bzf8.vercel.app' // Temporary hardcoded for debugging
    ];
    
    // Add FRONTEND_URL from environment if it exists
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    console.log('CORS check - Origin:', origin);
    console.log('CORS check - Allowed origins:', allowedOrigins);
    console.log('CORS check - FRONTEND_URL env var:', process.env.FRONTEND_URL);
    
    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('CORS: Origin blocked');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    console.log('CORS Error:', err.message);
    console.log('Request origin:', req.headers.origin);
    return res.status(403).json({ 
      error: 'CORS Error', 
      message: 'Origin not allowed',
      origin: req.headers.origin 
    });
  }
  next(err);
});

// Debug logging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

connectDB();
Cloudinary();

app.get("/", (req, res) => res.send("api is working"));

// Test endpoint for CORS debugging
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
