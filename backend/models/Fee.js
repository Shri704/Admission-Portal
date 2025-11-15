// backend/models/Fee.js
import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    branch: {
      type: String,
      enum: ["CSE", "ECE", "MECH", "CIVIL", "EEE", "AI", "IT"],
      required: true,
    },
    category: {
      type: String,
      enum: ["CET", "COMEDK", "SNQ", "MANAGEMENT", "SC", "ST"],
      required: true,
      default: "CET",
    },
    type: {
      type: String,
      enum: ["Academic", "Exam", "Backlog", "Other"],
      required: true,
    },
    description: { type: String },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

feeSchema.index({ year: 1, branch: 1, category: 1, type: 1 }, { unique: true });

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;
