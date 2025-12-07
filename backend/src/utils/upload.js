import multer from "multer";

const storage = multer.diskStorage({});

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB for profile pictures
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB for resumes

// Allowed file types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const ALLOWED_RESUME_TYPES = ["application/pdf"];

// File filter function - checks file type before upload completes
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    // Resume must be PDF only
    if (!ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only PDF files are allowed for resume"), false);
    }
  } else if (file.fieldname === "image") {
    // Image must be JPEG, PNG, JPG, or WebP
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, JPG, and WebP images are allowed"), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_RESUME_SIZE, // 5MB max (global limit, per-field limits checked in controller)
  },
});

export { MAX_IMAGE_SIZE, MAX_RESUME_SIZE };
export default upload;
