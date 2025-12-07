import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/db/connectDB.js";
import userRoutes from "./src/routes/userRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import Cloudinary from "./src/utils/Cloudinary.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// CORS configuration for single service deployment
app.use(cors({
  origin: true, // Allow all origins since frontend and backend are on same domain
  credentials: true
}));

// Initialize database and cloudinary
connectDB();
Cloudinary();

// API routes
app.get("/api", (req, res) => res.send("API is working"));
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all handler for React Router (must be last)
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Error handling middleware (including multer file upload errors)
app.use((err, req, res, next) => {
  // Handle Multer file size errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  // Handle custom file filter errors (wrong file type)
  if (err.message && (err.message.includes('PDF') || err.message.includes('image'))) {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
