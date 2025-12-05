import express from "express";
import {
  getAllJobs,
  addJob,
  fetchRecruiterJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import recruiterAuthMiddleware from "../middlewares/recruiterAuthMiddleware.js";

const router = express.Router();

// Public routes
router.get("/all-jobs", getAllJobs);

// Protected routes (recruiter only)
router.post("/add", recruiterAuthMiddleware, addJob);
router.get("/recruiter-jobs", recruiterAuthMiddleware, fetchRecruiterJobs);
router.put("/update/:jobId", recruiterAuthMiddleware, updateJob);
router.delete("/delete/:jobId", recruiterAuthMiddleware, deleteJob);

export default router;
