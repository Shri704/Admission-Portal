// backend/routes/notificationRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createNotification,
  getNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// Both roles can create/get notifications
router.post("/", protect, createNotification);
router.get("/", protect, getNotifications);

export default router;
