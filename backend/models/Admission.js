// backend/models/Admission.js
import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    year: { type: Number, required: true },
    branch: { type: String, required: true },
    usn: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

admissionSchema.index({ studentId: 1, year: 1 }, { unique: true });

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
