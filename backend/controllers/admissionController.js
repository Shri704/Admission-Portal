// backend/controllers/admissionController.js
import asyncHandler from "express-async-handler";
import Admission from "../models/Admission.js";
import Student from "../models/Student.js";
import Document from "../models/Document.js";
import { REQUIRED_DOCUMENT_TYPES } from "../utils/constants.js";

/**
 * @desc New admission (first year, no USN)
 * @route POST /api/admissions/apply
 */
export const applyAdmission = asyncHandler(async (req, res) => {
  const { year, branch, documents } = req.body;

  const existing = await Admission.findOne({
    studentId: req.user._id,
    year,
  });

  if (existing) {
    res.status(400);
    throw new Error("You already applied for this academic year");
  }

  const uploadedDocs = await Document.find({
    studentId: req.user._id,
    docType: { $in: REQUIRED_DOCUMENT_TYPES },
  }).select("docType");

  const uploadedTypes = new Set(uploadedDocs.map((doc) => doc.docType));
  const missing = REQUIRED_DOCUMENT_TYPES.filter((type) => !uploadedTypes.has(type));

  if (missing.length) {
    res.status(400);
    throw new Error(
      `Upload required documents before submitting the admission form: ${missing.join(", ")}.`
    );
  }

  const admission = await Admission.create({
    studentId: req.user._id,
    year,
    branch,
    status: "pending",
    documents,
  });

  res.status(201).json({
    success: true,
    message: "Admission form submitted successfully",
    data: admission,
  });
});

/**
 * @desc Get admission history
 * @route GET /api/admissions/history
 */
export const getAdmissionHistory = asyncHandler(async (req, res) => {
  const history = await Admission.find({ studentId: req.user._id })
    .populate("documents")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: history });
});
