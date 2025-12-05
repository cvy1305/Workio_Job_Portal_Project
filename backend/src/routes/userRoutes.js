import express from "express";
import {
  registerUser,
  loginUser,
  fetchUserData,
  uploadResume,
  logoutUser,
  fetchRecruiterData,
} from "../controllers/userController.js";
import upload from "../utils/upload.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";
import recruiterAuthMiddleware from "../middlewares/recruiterAuthMiddleware.js";

const router = express.Router();

// User routes
router.post("/register-user", upload.single("image"), registerUser);
router.post("/login-user", loginUser);
router.get("/user-data", userAuthMiddleware, fetchUserData);
router.post(
  "/upload-resume",
  userAuthMiddleware,
  upload.single("resume"),
  uploadResume
);
router.post("/logout-user", logoutUser);

// Recruiter routes
router.get("/recruiter-data", recruiterAuthMiddleware, fetchRecruiterData);

export default router;
