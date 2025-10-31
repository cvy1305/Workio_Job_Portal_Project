import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    const imageFile = req.file;

    if (!name) {
      return res.status(400).json({ success: false, message: "Enter your name" });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Enter your email" });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "Enter your password" });
    }

    if (!userType || !['candidate', 'recruiter'].includes(userType)) {
      return res.status(400).json({ success: false, message: "Please select user type (candidate or recruiter)" });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Upload your image" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: `An account with this email already exists. Please use a different email or try logging in instead.` 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imageUploadUrl = await cloudinary.uploader.upload(imageFile.path);

    const user = await User({
      name,
      email,
      password: hashedPassword,
      image: imageUploadUrl.secure_url,
      userType,
    });

    await user.save();

    const token = await generateToken(user._id);

    // Set cookie with token
    res.cookie('userToken', token, {
      httpOnly: false, // Changed to false for debugging
      secure: false, // Changed to false for localhost
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      userData: user,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    if (!userType || !['candidate', 'recruiter'].includes(userType)) {
      return res
        .status(400)
        .json({ success: false, message: "Please select a valid user type" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email does not exist" });
    }

    // Check if userType matches
    if (user.userType !== userType) {
      return res
        .status(401)
        .json({ success: false, message: "Email does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = await generateToken(user._id);

    // Set cookie with token
    res.cookie('userToken', token, {
      httpOnly: false, // Changed to false for debugging
      secure: false, // Changed to false for localhost
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userData: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const fetchUserData = async (req, res) => {
  try {
    const userData = req.userData;

    return res.status(200).json({
      success: true,
      message: "user data fetched successfully",
      userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user data fetched failed",
    });
  }
};

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

export const uploadResume = async (req, res) => {
  try {
    const userId = req.userData._id;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload resume to Cloudinary
    const uploadedResumeUrl = await cloudinary.uploader.upload(resumeFile.path);
    userData.resume = uploadedResumeUrl.secure_url;

    await userData.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: userData.resume,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('userToken');
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// Recruiter-specific functions
export const fetchRecruiterData = async (req, res) => {
  try {
    const recruiter = req.userData;
    return res.status(200).json({
      success: true,
      message: "Recruiter data fetched",
      recruiterData: recruiter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter data",
    });
  }
};

export const addJob = async (req, res) => {
  try {
    const {
      title,
      location,
      level,
      description,
      salary,
      category,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Job title is required" });
    }
    if (!location) {
      return res.status(400).json({ success: false, message: "Job location is required" });
    }
    if (!level) {
      return res.status(400).json({ success: false, message: "Job level is required" });
    }
    if (!description) {
      return res.status(400).json({ success: false, message: "Job description is required" });
    }
    if (!salary) {
      return res.status(400).json({ success: false, message: "Job salary is required" });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: "Job category is required" });
    }

    const recruiterId = req.userData._id;

    const job = await Job({
      title,
      location,
      level,
      description,
      salary,
      category,
      companyId: recruiterId,
      date: new Date(),
    });

    await job.save();

    return res.status(201).json({
      success: true,
      message: "Job added successfully",
      jobData: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add job",
    });
  }
};

export const fetchRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.userData._id;
    const jobs = await Job.find({ companyId: recruiterId }).sort({ date: -1 });

    // Add applicant count for each job
    const jobsWithApplicantCount = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await JobApplication.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicants: applicantCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobsData: jobsWithApplicantCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      title,
      location,
      level,
      description,
      salary,
      category,
      visible,
    } = req.body;

    const recruiterId = req.userData._id;

    const job = await Job.findOne({ _id: jobId, companyId: recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title: title || job.title,
        location: location || job.location,
        level: level || job.level,
        description: description || job.description,
        salary: salary || job.salary,
        category: category || job.category,
        visible: visible !== undefined ? visible : job.visible,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      jobData: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.userData._id;

    const job = await Job.findOne({ _id: jobId, companyId: recruiterId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Delete all job applications related to this job
    await JobApplication.deleteMany({ jobId: jobId });

    // Delete the job itself
    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      success: true,
      message: "Job and all related applications deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
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
