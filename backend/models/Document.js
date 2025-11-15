// backend/models/Document.js
import mongoose from "mongoose";
import { DOCUMENT_TYPE_VALUES } from "../utils/constants.js";

const documentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    docType: {
      type: String,
      required: true,
      enum: DOCUMENT_TYPE_VALUES,
    },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

documentSchema.index({ studentId: 1, docType: 1 }, { unique: true });

const Document = mongoose.model("Document", documentSchema);
export default Document;
