// backend/controllers/authController.js
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import config from "../config/env.js";

/**
 * Generate JWT Token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

/**
 * @desc Register new student
 * @route POST /api/auth/register
 */
export const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, password, year, branch, category, programStartYear } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // Normalize email to lowercase for consistent lookup and storage
  const normalizedEmail = email.toLowerCase().trim();

  const exists = await Student.findOne({ email: normalizedEmail });
  if (exists) {
    res.status(400);
    throw new Error("Student already exists");
  }

  // Don't hash password here - let the pre-save hook in the Student model handle it
  // This prevents double-hashing which would make login fail after first registration

  const currentCalendarYear = new Date().getFullYear();
  const numericYear = Number(year) || 1;
  const programDurationYears = 4;

  let normalizedProgramStartYear = Number(programStartYear);
  if (!normalizedProgramStartYear || Number.isNaN(normalizedProgramStartYear)) {
    normalizedProgramStartYear = currentCalendarYear - (numericYear - 1);
  }

  // Prevent future start years or wildly past years
  if (normalizedProgramStartYear > currentCalendarYear) {
    normalizedProgramStartYear = currentCalendarYear;
  }
  if (normalizedProgramStartYear < currentCalendarYear - 10) {
    normalizedProgramStartYear = currentCalendarYear - 10;
  }

  const expectedGraduationYear =
    normalizedProgramStartYear + programDurationYears - 1;
  const accountExpiresAt = new Date(
    normalizedProgramStartYear + programDurationYears,
    5,
    30
  );

  const student = await Student.create({
    name,
    email: normalizedEmail,
    password, // Pass plain password - pre-save hook will hash it
    branch,
    year: numericYear,
    category: (category || "CET").toUpperCase(),
    role: "student",
    programStartYear: normalizedProgramStartYear,
    programDurationYears,
    expectedGraduationYear,
    accountExpiresAt,
  });

  const token = generateToken(student._id, "student");

  res.status(201).json({
    success: true,
    message: "Student registered successfully",
    data: {
      _id: student._id,
      name: student.name,
      email: student.email,
      year: student.year,
      branch: student.branch,
      category: student.category,
      programStartYear: student.programStartYear,
      expectedGraduationYear: student.expectedGraduationYear,
      accountExpiresAt: student.accountExpiresAt,
      role: student.role,
      token,
    },
  });
});

/**
 * @desc Login for both student & admin
 * @route POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // Normalize email to lowercase for consistent lookup
  const normalizedEmail = email.toLowerCase().trim();

  // Try to find user (student first, then admin)
  let user = await Student.findOne({ email: normalizedEmail });
  if (!user) {
    user = await Admin.findOne({ email: normalizedEmail });
  }

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password. Please check your credentials and try again.");
  }

  // Check if user account is active (for students)
  if (user.role === "student" && user.isActive === false) {
    res.status(403);
    throw new Error("Your account has been deactivated. Please contact the administration.");
  }

  // Try password comparison - handle potential double-hashed passwords
  let isMatch = await bcrypt.compare(password, user.password);
  
  // If password doesn't match, check if it might be double-hashed
  // (from before the registration fix)
  if (!isMatch && user.role === "student") {
    // Try comparing against a potential double-hash
    // This handles cases where password was hashed twice during registration
    const tempHash = await bcrypt.hash(password, 10);
    const isDoubleHashed = await bcrypt.compare(tempHash, user.password);
    
    if (isDoubleHashed) {
      // Password is double-hashed, fix it by storing the correct single hash
      user.password = tempHash;
      // Mark password as modified so pre-save hook doesn't hash it again
      user.markModified("password");
      // Use updateOne to bypass pre-save hook and save directly
      await Student.updateOne({ _id: user._id }, { password: tempHash });
      isMatch = true;
    }
  }

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.role === "student") {
    if (user.accountExpiresAt && user.accountExpiresAt < new Date()) {
      res.status(403);
      throw new Error("Student account has expired after completing the 4-year program.");
    }

    if (user.programStartYear) {
      const currentYear = new Date().getFullYear();
      const computedYear =
        currentYear - user.programStartYear + 1 > 0
          ? Math.min(
              user.programDurationYears || 4,
              Math.max(1, currentYear - user.programStartYear + 1)
            )
          : 1;
      if (computedYear !== user.year) {
        // Use updateOne to update only the year field, avoiding pre-save hook
        // This prevents any accidental password re-hashing
        await Student.updateOne(
          { _id: user._id },
          { year: computedYear }
        );
        // Update the user object for response
        user.year = computedYear;
      }
    }
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.role === "student"
        ? {
            year: user.year,
            branch: user.branch,
            category: user.category,
            programStartYear: user.programStartYear,
            expectedGraduationYear: user.expectedGraduationYear,
            accountExpiresAt: user.accountExpiresAt,
          }
        : {}),
      token,
    },
  });
});
