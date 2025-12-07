import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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

    // Password strength validation - must be at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    if (!userType || !['candidate', 'recruiter'].includes(userType)) {
      return res.status(400).json({ success: false, message: "Please select user type (candidate or recruiter)" });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Upload your image" });
    }

    // Validate image size (2MB max)
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
    if (imageFile.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Profile picture must be less than 2MB",
      });
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
      httpOnly: true, // Cookie is not accessible via JavaScript (security)
      secure: true, // Cookie only sent over HTTPS (security)
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
      httpOnly: true, // Cookie is not accessible via JavaScript (security)
      secure: true, // Cookie only sent over HTTPS (security)
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

    // Validate resume size (5MB max)
    const MAX_RESUME_SIZE = 5 * 1024 * 1024;
    if (resumeFile.size > MAX_RESUME_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Resume must be less than 5MB",
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
    res.clearCookie('userToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
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
