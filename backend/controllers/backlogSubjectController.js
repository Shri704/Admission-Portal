// backend/controllers/backlogSubjectController.js
import asyncHandler from "express-async-handler";
import BacklogSubject from "../models/BacklogSubject.js";
import Fee from "../models/Fee.js";
import Student from "../models/Student.js";

/**
 * @desc Get all student backlog entries (admin view)
 * @route GET /api/backlog-subjects
 * @access Admin
 */
export const getAllBacklogSubjects = asyncHandler(async (req, res) => {
  const { studentId, paid, branch, semester } = req.query;
  
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (paid !== undefined) filter.paid = paid === "true";
  if (branch) filter.branch = branch;
  if (semester) filter.semester = Number(semester);

  const subjects = await BacklogSubject.find(filter)
    .populate("studentId", "name email usn branch")
    .populate("paymentId", "amount status paymentDate")
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

/**
 * @desc Get student's own backlog entries
 * @route GET /api/backlog-subjects/student
 * @access Student
 */
export const getStudentBacklogSubjects = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { paid } = req.query;

  const filter = { studentId };
  if (paid !== undefined) {
    filter.paid = paid === "true";
  }

  const subjects = await BacklogSubject.find(filter)
    .populate("paymentId", "amount status paymentDate")
    .sort({ semester: 1, subjectCode: 1 });
  
  res.json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

/**
 * @desc Get backlog fee amount per subject (set by admin)
 * @route GET /api/backlog-subjects/fee-amount
 * @access Student
 */
export const getBacklogFeeAmount = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // Get backlog fee amount from Fee model (admin configured)
  const backlogFee = await Fee.findOne({
    type: "Backlog",
    category: student.category || "CET",
    active: true,
  }).sort({ createdAt: -1 });

  const perBacklogAmount = backlogFee?.amount || 0;

  res.json({
    success: true,
    perBacklogAmount,
    currency: "INR",
  });
});

/**
 * @desc Add backlog subjects for student
 * @route POST /api/backlog-subjects
 * @access Student
 */
export const createBacklogSubject = asyncHandler(async (req, res) => {
  const { subjects } = req.body; // Array of { subjectCode, subjectName, branch, semester, usn }

  if (!Array.isArray(subjects) || subjects.length === 0) {
    res.status(400);
    throw new Error("Subjects array is required and must not be empty");
  }

  const studentId = req.user._id;
  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const createdSubjects = [];
  const errors = [];

  for (const subj of subjects) {
    const { subjectCode, subjectName, branch, semester, usn } = subj;

    if (!subjectCode || !subjectName || !branch || !semester || !usn) {
      errors.push(`Missing required fields for subject: ${subjectCode || "unknown"}`);
      continue;
    }

    const numericSemester = Number(semester);
    if (![1, 2, 3, 4, 5, 6, 7, 8].includes(numericSemester)) {
      errors.push(`Invalid semester for subject ${subjectCode}`);
      continue;
    }

    const allowedBranches = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT"];
    if (!allowedBranches.includes(branch)) {
      errors.push(`Invalid branch for subject ${subjectCode}`);
      continue;
    }

    // Check if this backlog entry already exists (unpaid)
    const existing = await BacklogSubject.findOne({
      studentId,
      subjectCode: subjectCode.toUpperCase().trim(),
      semester: numericSemester,
      paid: false,
    });

    if (existing) {
      errors.push(`Backlog for ${subjectCode} semester ${numericSemester} already exists`);
      continue;
    }

    try {
      const subject = await BacklogSubject.create({
        studentId,
        subjectCode: subjectCode.toUpperCase().trim(),
        subjectName: subjectName.trim(),
        branch,
        semester: numericSemester,
        usn: usn.toUpperCase().trim(),
        paid: false,
      });
      createdSubjects.push(subject);
    } catch (error) {
      errors.push(`Failed to create backlog for ${subjectCode}: ${error.message}`);
    }
  }

  if (createdSubjects.length === 0 && errors.length > 0) {
    res.status(400);
    throw new Error(errors.join("; "));
  }

  res.status(201).json({
    success: true,
    message: `Created ${createdSubjects.length} backlog ${createdSubjects.length === 1 ? "entry" : "entries"}`,
    data: createdSubjects,
    errors: errors.length > 0 ? errors : undefined,
  });
});

/**
 * @desc Update a backlog subject entry
 * @route PUT /api/backlog-subjects/:id
 * @access Student (own entries) or Admin
 */
export const updateBacklogSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subjectCode, subjectName, branch, semester, usn } = req.body;

  const subject = await BacklogSubject.findById(id);
  if (!subject) {
    res.status(404);
    throw new Error("Backlog subject not found");
  }

  // Students can only update their own unpaid entries
  if (req.user.role === "student" && subject.studentId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this backlog entry");
  }

  if (req.user.role === "student" && subject.paid) {
    res.status(400);
    throw new Error("Cannot update paid backlog entries");
  }

  if (subjectCode !== undefined) {
    subject.subjectCode = subjectCode.toUpperCase().trim();
  }
  if (subjectName !== undefined) {
    subject.subjectName = subjectName.trim();
  }
  if (branch !== undefined) {
    const allowedBranches = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT"];
    if (!allowedBranches.includes(branch)) {
      res.status(400);
      throw new Error("Invalid branch");
    }
    subject.branch = branch;
  }
  if (semester !== undefined) {
    const numericSemester = Number(semester);
    if (![1, 2, 3, 4, 5, 6, 7, 8].includes(numericSemester)) {
      res.status(400);
      throw new Error("Semester must be between 1 and 8");
    }
    subject.semester = numericSemester;
  }
  if (usn !== undefined) {
    subject.usn = usn.toUpperCase().trim();
  }

  await subject.save();

  res.json({
    success: true,
    message: "Backlog subject updated successfully",
    data: subject,
  });
});

/**
 * @desc Delete a backlog subject entry
 * @route DELETE /api/backlog-subjects/:id
 * @access Student (own unpaid entries) or Admin
 */
export const deleteBacklogSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subject = await BacklogSubject.findById(id);
  if (!subject) {
    res.status(404);
    throw new Error("Backlog subject not found");
  }

  // Students can only delete their own unpaid entries
  if (req.user.role === "student" && subject.studentId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this backlog entry");
  }

  if (req.user.role === "student" && subject.paid) {
    res.status(400);
    throw new Error("Cannot delete paid backlog entries");
  }

  await subject.deleteOne();

  res.json({
    success: true,
    message: "Backlog subject deleted successfully",
  });
});

