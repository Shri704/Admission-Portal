import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import { logInfo, logError } from "../services/loggerService.js";

export async function ensureDefaultStudent({ name, email, password, year, branch, category, programStartYear }) {
  try {
    if (!email || !password) {
      logInfo("Skipping default student setup: email/password not provided.");
      return;
    }

    const normalizedEmail = email.toLowerCase();
    let student = await Student.findOne({ email: normalizedEmail });

    if (!student) {
      student = await Student.create({
        name,
        email: normalizedEmail,
        password,
        year,
        branch,
        category: category?.toUpperCase?.() || "CET",
        programStartYear: programStartYear || new Date().getFullYear(),
      });
      logInfo(`✅ Default student created with email ${normalizedEmail}`);
      return;
    }

    let updated = false;

    if (name && student.name !== name) {
      student.name = name;
      updated = true;
    }

    if (year && student.year !== year) {
      student.year = year;
      updated = true;
    }

    if (branch && student.branch !== branch) {
      student.branch = branch;
      updated = true;
    }

    if (category && student.category !== category.toUpperCase()) {
      student.category = category.toUpperCase();
      updated = true;
    }

    // Ensure programStartYear is set (required field)
    const defaultProgramStartYear = programStartYear || new Date().getFullYear();
    if (!student.programStartYear || student.programStartYear !== defaultProgramStartYear) {
      student.programStartYear = defaultProgramStartYear;
      updated = true;
    }

    const passwordMatches = await bcrypt.compare(password, student.password);
    if (!passwordMatches) {
      student.password = password;
      updated = true;
    }

    if (updated) {
      await student.save();
      logInfo(`✅ Default student credentials synced for ${normalizedEmail}`);
    } else {
      logInfo(`ℹ️ Default student already up to date for ${normalizedEmail}`);
    }
  } catch (error) {
    logError("❌ Failed to ensure default student account", error);
    throw error;
  }
}

