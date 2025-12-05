import express from "express";
import {
  applyJob,
  getUserAppliedJobs,
  withdrawApplication,
  fetchJobApplications,
  fetchJobApplicationsByJobId,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";
import recruiterAuthMiddleware from "../middlewares/recruiterAuthMiddleware.js";

const router = express.Router();

// User routes (candidate)
router.post("/apply", userAuthMiddleware, applyJob);
router.get("/user-applications", userAuthMiddleware, getUserAppliedJobs);
router.delete("/withdraw/:applicationId", userAuthMiddleware, withdrawApplication);

// Recruiter routes
router.get("/recruiter-applications", recruiterAuthMiddleware, fetchJobApplications);
router.get("/job/:jobId", recruiterAuthMiddleware, fetchJobApplicationsByJobId);
router.put("/update-status/:applicationId", recruiterAuthMiddleware, updateApplicationStatus);

export default router;

