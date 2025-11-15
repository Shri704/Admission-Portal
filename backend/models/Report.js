// backend/models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Payment", "Admission", "Student", "Custom"],
      default: "Custom",
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    fileUrl: { type: String },
    filters: { type: Object },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
