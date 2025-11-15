// backend/models/Student.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    phone: { type: String },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT"],
    },
    category: {
      type: String,
      enum: ["CET", "COMEDK", "SNQ", "MANAGEMENT", "SC", "ST"],
      required: true,
      default: "CET",
    },
    usn: {
      type: String,
      unique: true,
      sparse: true, // 1st-year won't have it
      uppercase: true,
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    photoUrl: { type: String },
    programStartYear: { type: Number, required: true },
    programDurationYears: { type: Number, default: 4 },
    expectedGraduationYear: { type: Number },
    accountExpiresAt: { type: Date },
    role: {
      type: String,
      default: "student",
    },
    admissionStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// password hashing middleware
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.pre("save", function (next) {
  if (!this.programDurationYears) {
    this.programDurationYears = 4;
  }

  if (this.programStartYear && !this.expectedGraduationYear) {
    this.expectedGraduationYear = this.programStartYear + this.programDurationYears - 1;
  }

  if (this.programStartYear && !this.accountExpiresAt) {
    const endYear = this.programStartYear + this.programDurationYears;
    this.accountExpiresAt = new Date(endYear, 5, 30); // June 30th of final year
  }

  next();
});

// method to verify password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model("Student", studentSchema);
export default Student;
