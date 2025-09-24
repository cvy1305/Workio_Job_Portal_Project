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
// Simple CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

connectDB();
Cloudinary();

app.get("/", (req, res) => res.send("api is working"));


app.use("/user", userRoutes);
app.use("/job", jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
