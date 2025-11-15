// backend/controllers/adminController.js
import asyncHandler from "express-async-handler";
import Student from "../models/Student.js";
import Fee from "../models/Fee.js";
import Admission from "../models/Admission.js";
import Branch from "../models/Branch.js";

/**
 * @desc Get all students
 * @route GET /api/admin/students
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().select("-password");
  res.json({ success: true, count: students.length, data: students });
});

/**
 * @desc Get admissions with optional status, year, and branch filter
 * @route GET /api/admin/admissions
 */
export const getAdmissions = asyncHandler(async (req, res) => {
  const { status, year, branch } = req.query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (year) {
    filter.year = parseInt(year);
  }

  if (branch) {
    filter.branch = branch;
  }

  const admissions = await Admission.find(filter)
    .populate("studentId", "-password")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: admissions.length,
    data: admissions,
  });
});

/**
 * @desc Approve or reject admission
 * @route PUT /api/admin/admissions/:id
 */
export const updateAdmissionStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("Admission ID is required.");
  }

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Valid status (pending, approved, or rejected) is required.");
  }

  const admission = await Admission.findById(id);

  if (!admission) {
    res.status(404);
    throw new Error("Admission record not found.");
  }

  // Update admission status
  const oldStatus = admission.status;
  admission.status = status;
  
  if (remarks !== undefined) {
    admission.remarks = remarks;
  }
  
  if (status === "approved") {
    admission.approvedBy = req.user._id;
  }

  await admission.save();

  // Update student's admission status
  await Student.findByIdAndUpdate(admission.studentId, {
    admissionStatus: status,
    isActive: status !== "rejected",
  });

  // Populate and return updated admission
  const updated = await Admission.findById(admission._id)
    .populate("studentId", "-password")
    .populate("approvedBy", "name email");

  res.json({ 
    success: true, 
    message: `Admission status changed from ${oldStatus} to ${status} successfully`,
    data: updated 
  });
});

/**
 * @desc Create or update fee structure
 * @route POST /api/admin/fees
 */
export const createFee = asyncHandler(async (req, res) => {
  const { year, branch, category, type, amount, description } = req.body;

  if (!category) {
    res.status(400);
    throw new Error("Fee category is required.");
  }

  if (!branch) {
    res.status(400);
    throw new Error("Branch is required.");
  }

  const normalizedCategory = String(category).toUpperCase();
  const allowedCategories = ["CET", "COMEDK", "SNQ", "MANAGEMENT", "SC", "ST"];
  if (!allowedCategories.includes(normalizedCategory)) {
    res.status(400);
    throw new Error("Invalid fee category supplied.");
  }

  const normalizedBranch = String(branch).toUpperCase();
  // Check if branch exists in database
  const branchExists = await Branch.findOne({ code: normalizedBranch, active: true });
  if (!branchExists) {
    res.status(400);
    throw new Error(`Invalid branch supplied. Branch "${normalizedBranch}" does not exist or is inactive.`);
  }

  const feeType = type || "Academic";
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    res.status(400);
    throw new Error("Fee amount must be a valid number.");
  }

  let fee = await Fee.findOne({
    year,
    branch: normalizedBranch,
    category: normalizedCategory,
    type: feeType,
  });
  if (!fee) {
    fee = await Fee.findOne({
      year,
      branch: normalizedBranch,
      type: feeType,
      $or: [{ category: { $exists: false } }, { category: null }],
    });
  }
  if (fee) {
    fee.amount = numericAmount;
    fee.description = description;
    fee.category = normalizedCategory;
    await fee.save();
  } else {
    fee = await Fee.create({
      year,
      branch: normalizedBranch,
      category: normalizedCategory,
      type: feeType,
      amount: numericAmount,
      description,
    });
  }

  res.json({ success: true, message: "Fee structure saved", data: fee });
});

/**
 * @desc Get all branches
 * @route GET /api/admin/branches
 */
export const getAllBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find().sort({ name: 1 });
  res.json({ success: true, count: branches.length, data: branches });
});

/**
 * @desc Create a new branch
 * @route POST /api/admin/branches
 */
export const createBranch = asyncHandler(async (req, res) => {
  const { code, name } = req.body;

  if (!code || !name) {
    res.status(400);
    throw new Error("Branch code and name are required.");
  }

  const normalizedCode = String(code).toUpperCase().trim();
  
  // Check if branch already exists
  const existingBranch = await Branch.findOne({ code: normalizedCode });
  if (existingBranch) {
    res.status(400);
    throw new Error(`Branch with code "${normalizedCode}" already exists.`);
  }

  const branch = await Branch.create({
    code: normalizedCode,
    name: String(name).trim(),
    active: true,
  });

  res.json({ success: true, message: "Branch created successfully", data: branch });
});

/**
 * @desc Update a branch
 * @route PUT /api/admin/branches/:id
 */
export const updateBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { code, name, active } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Branch ID is required.");
  }

  const branch = await Branch.findById(id);
  if (!branch) {
    res.status(404);
    throw new Error("Branch not found.");
  }

  if (code !== undefined) {
    const normalizedCode = String(code).toUpperCase().trim();
    // Check if another branch with this code exists
    const existingBranch = await Branch.findOne({ code: normalizedCode, _id: { $ne: id } });
    if (existingBranch) {
      res.status(400);
      throw new Error(`Branch with code "${normalizedCode}" already exists.`);
    }
    branch.code = normalizedCode;
  }

  if (name !== undefined) {
    branch.name = String(name).trim();
  }

  if (active !== undefined) {
    branch.active = Boolean(active);
  }

  await branch.save();

  res.json({ success: true, message: "Branch updated successfully", data: branch });
});

/**
 * @desc Delete a branch
 * @route DELETE /api/admin/branches/:id
 */
export const deleteBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("Branch ID is required.");
  }

  const branch = await Branch.findById(id);
  if (!branch) {
    res.status(404);
    throw new Error("Branch not found.");
  }

  // Check if branch is being used by students
  const studentsCount = await Student.countDocuments({ branch: branch.code });
  if (studentsCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete branch. It is being used by ${studentsCount} student(s).`);
  }

  // Check if branch is being used in fees
  const feesCount = await Fee.countDocuments({ branch: branch.code });
  if (feesCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete branch. It is being used in ${feesCount} fee structure(s).`);
  }

  await Branch.findByIdAndDelete(id);

  res.json({ success: true, message: "Branch deleted successfully" });
});
