import express from "express";
import {
  registerUser,
  loginUser,
  fetchUserData,
  applyJob,
  getUserAppliedJobs,
  withdrawApplication,
  uploadResume,
  logoutUser,
  // Recruiter functions
  fetchRecruiterData,
  addJob,
  fetchRecruiterJobs,
  updateJob,
  deleteJob,
  fetchJobApplications,
  fetchJobApplicationsByJobId,
  updateApplicationStatus,
} from "../controllers/userController.js";
import upload from "../utils/upload.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";
import recruiterAuthMiddleware from "../middlewares/recruiterAuthMiddleware.js";

const router = express.Router();

// User routes
router.post("/register-user", upload.single("image"), registerUser);
router.post("/login-user", loginUser);
router.get("/user-data", userAuthMiddleware, fetchUserData);
router.post("/apply-job", userAuthMiddleware, applyJob);
router.post("/get-user-applications", userAuthMiddleware, getUserAppliedJobs);
router.delete("/withdraw-application/:applicationId", userAuthMiddleware, withdrawApplication);
router.post(
  "/upload-resume",
  userAuthMiddleware,
  upload.single("resume"),
  uploadResume
);
router.post("/logout-user", logoutUser);

// Recruiter routes
router.get("/recruiter-data", recruiterAuthMiddleware, fetchRecruiterData);
router.post("/add-job", recruiterAuthMiddleware, addJob);
router.get("/recruiter-jobs", recruiterAuthMiddleware, fetchRecruiterJobs);
router.put("/update-job/:jobId", recruiterAuthMiddleware, updateJob);
router.delete("/delete-job/:jobId", recruiterAuthMiddleware, deleteJob);
router.get("/job-applications", recruiterAuthMiddleware, fetchJobApplications);
router.get("/job-applications/:jobId", recruiterAuthMiddleware, fetchJobApplicationsByJobId);
router.put("/update-application-status/:applicationId", recruiterAuthMiddleware, updateApplicationStatus);

export default router;
