import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userData._id;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Job ID are required",
      });
    }

    // Check if user has uploaded a resume
    const user = await User.findById(userId);
    if (!user || !user.resume) {
      return res.status(400).json({
        success: false,
        message: "Resume is required to apply for jobs. Please upload your resume first.",
      });
    }

    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });

    if (isAlreadyApplied) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const jobApplication = new JobApplication({
      jobId,
      userId,
      companyId: jobData.companyId,
      date: new Date(),
    });

    await jobApplication.save();

    return res.status(201).json({
      success: true,
      message: "Job applied successfully",
      jobApplication,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Job application failed",
    });
  }
};

export const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.userData._id;

    const application = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title location date status")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Jobs application fetched successfully",
      jobApplications: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs application",
    });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.userData._id;

    // Find the application and verify it belongs to the user
    const application = await JobApplication.findOne({ 
      _id: applicationId, 
      userId: userId 
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or you don't have permission to withdraw it",
      });
    }

    // Check if application status has already been changed by recruiter
    if (application.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw application. Status has already been changed to "${application.status}" by the recruiter.`,
        currentStatus: application.status,
      });
    }

    // Delete the application
    await JobApplication.findByIdAndDelete(applicationId);

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to withdraw application",
    });
  }
};

export const fetchJobApplications = async (req, res) => {
  try {
    const recruiterId = req.userData._id;
    const applications = await JobApplication.find({ companyId: recruiterId })
      .populate("userId", "name email image resume")
      .populate("jobId", "title location salary")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      applicationsData: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

export const fetchJobApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.userData._id;

    // Verify that the job belongs to the recruiter
    const job = await Job.findOne({ _id: jobId, companyId: recruiterId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you don't have permission to view its applications",
      });
    }

    const applications = await JobApplication.find({ jobId: jobId })
      .populate("userId", "name email image resume")
      .populate("jobId", "title location salary")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Job applications fetched successfully",
      applicationsData: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job applications",
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const recruiterId = req.userData._id;

    const application = await JobApplication.findOne({
      _id: applicationId,
      companyId: recruiterId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or has been withdrawn by the user",
      });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    )
      .populate("userId", "name email image")
      .populate("jobId", "title location salary");

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      applicationData: updatedApplication,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

