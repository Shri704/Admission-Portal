// backend/models/Branch.js
import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

branchSchema.index({ code: 1 }, { unique: true });

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;

