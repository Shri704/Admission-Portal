// backend/services/notificationService.js
import Notification from "../models/Notification.js";

/**
 * Create a new notification
 */
export const createNotification = async (senderId, senderRole, recipientId, recipientRole, message) => {
  const notif = await Notification.create({
    senderId,
    senderRole,
    recipientId,
    recipientRole,
    message,
  });
  return notif;
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId) => {
  const notifs = await Notification.find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(50);
  return notifs;
};

/**
 * Mark notifications as read
 */
export const markAsRead = async (notifIds) => {
  await Notification.updateMany(
    { _id: { $in: notifIds } },
    { $set: { read: true } }
  );
  return { success: true };
};
