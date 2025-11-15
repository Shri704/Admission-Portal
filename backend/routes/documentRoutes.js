// backend/routes/documentRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  uploadDocument,
  deleteDocument,
} from "../controllers/documentController.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file type. Only JPG, PNG, and PDF allowed.",
    });
  }
  next();
};

// Student uploads document
router.post(
  "/upload",
  protect,
  authorize("student"),
  uploadSingle("file"),
  handleMulterError,
  uploadDocument
);

// Delete document (student/admin)
router.delete("/:id", protect, deleteDocument);

export default router;
