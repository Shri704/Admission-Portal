// backend/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderRole",
    },
    senderRole: {
      type: String,
      enum: ["Admin", "Student"],
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientRole",
    },
    recipientRole: {
      type: String,
      enum: ["Admin", "Student"],
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
