// backend/controllers/reportController.js
import asyncHandler from "express-async-handler";
import Payment from "../models/Payment.js";
import Student from "../models/Student.js";

/**
 * @desc Get payment statistics
 * @route GET /api/reports/payments
 */
export const getPaymentReport = asyncHandler(async (req, res) => {
  const payments = await Payment.find();

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const count = payments.length;

  res.json({
    success: true,
    summary: {
      totalPayments: count,
      totalCollected,
    },
  });
});

/**
 * @desc Student count by branch
 * @route GET /api/reports/students
 */
export const getStudentStats = asyncHandler(async (req, res) => {
  const result = await Student.aggregate([
    { $group: { _id: "$branch", count: { $sum: 1 } } },
  ]);
  res.json({ success: true, data: result });
});
