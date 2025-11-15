// backend/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["created", "success", "failed", "refunded"],
      default: "created",
    },
    feeType: {
      type: String,
      enum: ["Academic", "Exam", "Backlog", "Other"],
      default: "Academic",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

paymentSchema.index({ studentId: 1, orderId: 1 }, { unique: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
