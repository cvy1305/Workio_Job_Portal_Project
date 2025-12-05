import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true })
      .populate("companyId", "-password")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      jobData: jobs,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Job fetched failed",
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
