// backend/controllers/studentController.js
import asyncHandler from "express-async-handler";
import Student from "../models/Student.js";
import Document from "../models/Document.js";

/**
 * @desc Get logged-in student profile
 * @route GET /api/students/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id).select("-password").populate("documents");
  res.json({ success: true, data: student });
});

/**
 * @desc Update profile (photo, contact, etc.)
 * @route PUT /api/students/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const updated = await Student.findByIdAndUpdate(req.user._id, updates, {
    new: true,
  }).select("-password");

  res.json({ success: true, message: "Profile updated", data: updated });
});

/**
 * @desc Get uploaded documents
 * @route GET /api/students/documents
 * @note Only returns documents belonging to the authenticated student
 */
export const getDocuments = asyncHandler(async (req, res) => {
  // Ensure user is authenticated
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Authentication required");
  }

  // Only fetch documents for the authenticated student
  const docs = await Document.find({ studentId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: docs.length, data: docs });
});
