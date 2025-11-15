// backend/config/razorpay.js
// Razorpay instance & helper functions for creating orders and verifying payments.

import Razorpay from "razorpay";
import crypto from "crypto";
import config from "./env.js";

export const razorpayConfigured =
  Boolean(config.razorpay.keyId) && Boolean(config.razorpay.keySecret);

if (!razorpayConfigured) {
  console.warn(
    "⚠️  Razorpay keys are not set. Falling back to mock payment mode — transactions will be simulated."
  );
}

export const razorpayInstance = razorpayConfigured
  ? new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    })
  : null;

/**
 * Create a Razorpay order
 * @param {Object} params - { amount, currency, receipt, notes }
 * amount must be in the smallest currency unit (e.g., paise for INR)
 */
export async function createOrder(params = {}) {
  const { amount, currency = "INR", receipt = `rcpt_${Date.now()}`, notes = {} } = params;

  if (!amount || typeof amount !== "number") {
    throw new Error("createOrder: invalid amount provided (should be number in smallest currency unit).");
  }

  if (!razorpayConfigured) {
    return {
      id: `order_mock_${Date.now()}`,
      amount,
      currency,
      receipt,
      status: "created",
      notes,
    };
  }

  const options = {
    amount,
    currency,
    receipt,
    payment_capture: 1, // auto-capture
    notes,
  };

  const order = await razorpayInstance.orders.create(options);
  return order; // contains id, amount, currency, status etc.
}

/**
 * Verify payment signature after a payment using server-side verification
 * @param {Object} params - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Boolean}
 */
export function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!razorpayConfigured) {
    return Boolean(razorpay_order_id && razorpay_payment_id);
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Missing arguments for signature verification");
  }
  const generatedSignature = crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return generatedSignature === razorpay_signature;
}

/**
 * Optionally expose refund creation (requires payment_id)
 */
export async function createRefund(paymentId, options = {}) {
  if (!paymentId) throw new Error("createRefund: paymentId is required");
  if (!razorpayConfigured) {
    throw new Error("Refunds are unavailable in mock Razorpay mode.");
  }
  const result = await razorpayInstance.payments.refund(paymentId, options);
  return result;
}

export default {
  instance: razorpayInstance,
  createOrder,
  verifyPaymentSignature,
  createRefund,
  isConfigured: razorpayConfigured,
};
