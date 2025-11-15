// backend/controllers/paymentController.js
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import config from "../config/env.js";
import {
  createOrder,
  verifyPaymentSignature,
  razorpayConfigured,
  razorpayInstance,
} from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import BacklogSubject from "../models/BacklogSubject.js";

/**
 * @desc Create Razorpay order
 * @route POST /api/payments/create-order
 */
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, year, feeType } = req.body;

  const numericAmount = Number(amount);
  if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    res.status(400);
    throw new Error("Valid amount (in INR) is required to create an order.");
  }

  const numericYear = Number(year);
  if (![1, 2, 3, 4].includes(numericYear)) {
    res.status(400);
    throw new Error("Valid academic year is required to create an order.");
  }

  // Validate feeType if provided
  const validFeeTypes = ["Academic", "Exam", "Backlog", "Other"];
  const paymentFeeType = feeType && validFeeTypes.includes(feeType) ? feeType : "Academic";

  const order = await createOrder({
    amount: Math.round(numericAmount * 100), // Convert INR to paise for Razorpay
    currency: "INR",
    notes: {
      studentId: req.user._id.toString(),
      year: numericYear,
      feeType: paymentFeeType,
    },
  });

  res.json({
    success: true,
    order: {
      id: order.id,
      amount: numericAmount,
      currency: order.currency || "INR",
      status: order.status,
      receipt: order.receipt,
    },
    keyId: razorpayConfigured ? config.razorpay.keyId : null,
    mode: razorpayConfigured ? "live" : "mock",
    year: numericYear,
  });
});

/**
 * @desc Verify payment
 * @route POST /api/payments/verify
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    year,
    feeType,
    backlogSubjectIds, // Array of backlog subject IDs for backlog payments
  } = req.body;

  const numericAmount = Number(amount);
  if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    res.status(400);
    throw new Error("Valid amount (in INR) is required for verification.");
  }

  const numericYear = Number(year);
  if (![1, 2, 3, 4].includes(numericYear)) {
    res.status(400);
    throw new Error("Valid academic year is required for verification.");
  }

  const isValid = verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) {
    res.status(400);
    throw new Error("Payment verification failed");
  }

  // Validate feeType if provided, default to Academic
  const validFeeTypes = ["Academic", "Exam", "Backlog", "Other"];
  const paymentFeeType = feeType && validFeeTypes.includes(feeType) ? feeType : "Academic";

  const payment = await Payment.findOneAndUpdate(
    {
      studentId: req.user._id,
      orderId: razorpay_order_id,
    },
    {
      studentId: req.user._id,
      year: numericYear,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: numericAmount,
      status: "success",
      feeType: paymentFeeType,
      paymentDate: new Date(),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // If this is a backlog payment, mark the backlog subjects as paid
  if (backlogSubjectIds && Array.isArray(backlogSubjectIds) && backlogSubjectIds.length > 0) {
    await BacklogSubject.updateMany(
      {
        _id: { $in: backlogSubjectIds },
        studentId: req.user._id,
        paid: false,
      },
      {
        $set: {
          paid: true,
          paymentId: payment._id,
        },
      }
    );
  }

  res.json({ success: true, message: "Payment verified", data: payment });
});

/**
 * @desc Get logged-in student's payments
 * @route GET /api/payments/history
 */
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ studentId: req.user._id }).sort({
    paymentDate: -1,
  });
  res.json({ success: true, data: payments });
});

/**
 * @desc Admin - list all payments
 * @route GET /api/admin/payments
 */
export const getAllPayments = asyncHandler(async (req, res) => {
  const { studentId } = req.query;
  const filter = {};
  if (studentId) {
    filter.studentId = studentId;
  }

  const payments = await Payment.find(filter)
    .populate("studentId", "name email branch year usn")
    .sort({ paymentDate: -1 });

  res.json({ success: true, data: payments });
});

/**
 * @desc Razorpay Webhook Handler
 * @route POST /api/payments/webhook
 * @note This endpoint receives payment events from Razorpay
 * Payments are automatically captured and transferred to the bank account linked to your Razorpay merchant account
 */
export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  // Verify webhook signature
  const webhookSignature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || config.razorpay.keySecret;

  if (!webhookSignature) {
    res.status(400);
    throw new Error("Missing webhook signature");
  }

  // Parse body (it comes as Buffer from express.raw())
  const bodyString = req.body.toString();
  let webhookBody;
  try {
    webhookBody = JSON.parse(bodyString);
  } catch (error) {
    res.status(400);
    throw new Error("Invalid webhook body format");
  }

  // Verify signature using the raw body string
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(bodyString)
    .digest("hex");

  if (webhookSignature !== expectedSignature) {
    res.status(401);
    throw new Error("Invalid webhook signature");
  }

  const event = webhookBody.event;
  const paymentData = webhookBody.payload?.payment?.entity;

  // Handle payment.captured event (payment successful and captured)
  if (event === "payment.captured" && paymentData) {
    const {
      id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount,
      status,
      created_at,
    } = paymentData;

    // Find the order to get student details
    let orderDetails = null;
    if (razorpayConfigured && razorpayInstance) {
      try {
        orderDetails = await razorpayInstance.orders.fetch(razorpay_order_id);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }

    const notes = orderDetails?.notes || {};
    const studentId = notes.studentId;
    const year = notes.year ? Number(notes.year) : null;
    const feeType = notes.feeType || "Academic";

    if (!studentId) {
      console.warn("Webhook: No studentId found in order notes");
      return res.json({ success: true, message: "Webhook received but no studentId" });
    }

    const numericAmount = amount / 100; // Convert paise to INR

    // Update or create payment record
    const payment = await Payment.findOneAndUpdate(
      {
        orderId: razorpay_order_id,
      },
      {
        studentId,
        year: year || 1,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: numericAmount,
        status: status === "captured" ? "success" : status,
        feeType,
        paymentDate: new Date(created_at * 1000),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // If this is a backlog payment, mark backlog subjects as paid
    if (feeType === "Backlog" && payment._id) {
      // Find unpaid backlog subjects for this student
      const unpaidSubjects = await BacklogSubject.find({
        studentId,
        paid: false,
      });

      if (unpaidSubjects.length > 0) {
        await BacklogSubject.updateMany(
          {
            _id: { $in: unpaidSubjects.map((s) => s._id) },
            studentId,
            paid: false,
          },
          {
            $set: {
              paid: true,
              paymentId: payment._id,
            },
          }
        );
      }
    }

    console.log(`✅ Webhook: Payment ${razorpay_payment_id} processed successfully`);
    return res.json({ success: true, message: "Webhook processed successfully" });
  }

  // Handle payment.failed event
  if (event === "payment.failed" && paymentData) {
    const { id: razorpay_payment_id, order_id: razorpay_order_id } = paymentData;

    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        status: "failed",
      },
      { new: true, upsert: true }
    );

    console.log(`❌ Webhook: Payment ${razorpay_payment_id} failed`);
    return res.json({ success: true, message: "Failed payment recorded" });
  }

  // For other events, just acknowledge
  res.json({ success: true, message: "Webhook received" });
});
