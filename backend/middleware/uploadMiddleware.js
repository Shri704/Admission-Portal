// backend/middleware/uploadMiddleware.js
import multer from "multer";

// Allowed file types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

// Multer memory storage (no saving to local disk)
const storage = multer.memoryStorage();

// File filter validation
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and PDF allowed."), false);
  }
};

// File size limit (5MB per file)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Expose upload single and multiple handlers
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

export default upload;
