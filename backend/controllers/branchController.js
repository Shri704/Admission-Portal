// backend/controllers/branchController.js
import asyncHandler from "express-async-handler";
import Branch from "../models/Branch.js";

/**
 * @desc Get all active branches (public endpoint)
 * @route GET /api/branches
 */
export const getBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find({ active: true }).sort({ name: 1 });
  res.json({ success: true, count: branches.length, data: branches });
});

