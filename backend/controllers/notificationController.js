// backend/controllers/notificationController.js
import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

/**
 * @desc Create notification
 * @route POST /api/notifications
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { recipientId, message, recipientRole = "Student" } = req.body;

  if (!recipientId || !message) {
    res.status(400);
    throw new Error("recipientId and message are required.");
  }

  const notif = await Notification.create({
    senderId: req.user._id,
    senderRole: req.user.role === "admin" ? "Admin" : "Student",
    recipientId,
    recipientRole,
    message,
  });

  res.status(201).json({ success: true, data: notif });
});

/**
 * @desc Get my notifications
 * @route GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifs = await Notification.find({ recipientId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, data: notifs });
});
