import jwt from "jsonwebtoken";
import User from "../models/User.js";

const recruiterAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const recruiter = await User.findById(decoded.id).select("-password");

    if (!recruiter) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    // Check if user is a recruiter
    if (recruiter.userType !== 'recruiter') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Recruiter access required.",
      });
    }

    req.userData = recruiter;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export default recruiterAuthMiddleware;
