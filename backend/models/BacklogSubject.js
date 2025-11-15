// backend/models/BacklogSubject.js
import mongoose from "mongoose";

const backlogSubjectSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      enum: ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT"],
      required: true,
    },
    semester: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
      required: true,
    },
    usn: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for student backlog queries
backlogSubjectSchema.index({ studentId: 1, paid: 1 });
backlogSubjectSchema.index({ studentId: 1, subjectCode: 1, semester: 1 });

const BacklogSubject = mongoose.model("BacklogSubject", backlogSubjectSchema);
export default BacklogSubject;

