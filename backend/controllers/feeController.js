// backend/controllers/feeController.js
import asyncHandler from "express-async-handler";
import Fee from "../models/Fee.js";
import Payment from "../models/Payment.js";
import Student from "../models/Student.js";

/**
 * @desc Get all fee structures
 * @route GET /api/fees
 */
export const getFees = asyncHandler(async (req, res) => {
  const fees = await Fee.find();
  res.json({ success: true, data: fees });
});

/**
 * @desc Get applicable fees for a student's year/sem
 * @route GET /api/fees/student
 */
export const getStudentFees = asyncHandler(async (req, res) => {
  const { year } = req.query;

  if (!year) {
    res.status(400);
    throw new Error("Academic year is required to fetch fees.");
  }

  const student = await Student.findById(req.user._id).select("category branch");
  if (!student) {
    res.status(404);
    throw new Error("Student profile not found.");
  }

  const numericYear = Number(year);
  const category = student.category || "CET";
  const branch = student.branch;

  // Only fetch Academic fees for this endpoint
  const fees = await Fee.find({
    year: numericYear,
    branch,
    category,
    type: "Academic",
  });
  const total = fees.reduce((acc, f) => acc + f.amount, 0);

  // Only count Academic fee payments
  const payments = await Payment.find({
    studentId: req.user._id,
    year: numericYear,
    status: "success",
    feeType: "Academic",
  });
  const paid = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const pending = Math.max(total - paid, 0);

  res.json({ success: true, total, paid, pending, data: fees });
});

/**
 * @desc Get fees by type (Exam, Backlog, etc.) for a student
 * @route GET /api/fees/student/:type
 */
export const getStudentFeesByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { year } = req.query;

  if (!type || !["Exam", "Backlog", "Academic", "Other"].includes(type)) {
    res.status(400);
    throw new Error("Valid fee type (Exam, Backlog, Academic, Other) is required.");
  }

  if (!year) {
    res.status(400);
    throw new Error("Academic year is required to fetch fees.");
  }

  const student = await Student.findById(req.user._id).select("category branch");
  if (!student) {
    res.status(404);
    throw new Error("Student profile not found.");
  }

  const numericYear = Number(year);
  const category = student.category || "CET";
  const branch = student.branch;

  const fees = await Fee.find({
    year: numericYear,
    branch,
    category,
    type,
  });

  const total = fees.reduce((acc, f) => acc + f.amount, 0);

  // Get payments for this specific fee type only
  const payments = await Payment.find({
    studentId: req.user._id,
    year: numericYear,
    status: "success",
    feeType: type,
  });
  const paid = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const pending = Math.max(total - paid, 0);

  res.json({ success: true, total, paid, pending, data: fees });
});