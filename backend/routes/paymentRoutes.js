// backend/routes/paymentRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  handleRazorpayWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Razorpay webhook (no authentication - Razorpay calls this directly)
// This must be before other routes to avoid authentication middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Raw body for signature verification
  handleRazorpayWebhook
);

// Student creates a Razorpay order
router.post(
  "/create-order",
  protect,
  authorize("student"),
  createPaymentOrder
);

// Verify Razorpay payment
router.post(
  "/verify",
  protect,
  authorize("student"),
  verifyPayment
);

router.get(
  "/history",
  protect,
  authorize("student"),
  getPaymentHistory
);

export default router;
