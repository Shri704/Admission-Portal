// backend/services/paymentService.js
import { createOrder, verifyPaymentSignature, createRefund } from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import { sendPaymentReceipt } from "./emailService.js";

/**
 * Create Razorpay order and store pending payment
 */
export const initiatePayment = async (student, amount) => {
  const order = await createOrder({
    amount,
    currency: "INR",
    notes: { studentId: student._id },
  });

  await Payment.create({
    studentId: student._id,
    orderId: order.id,
    amount,
    status: "created",
  });

  return order;
};

/**
 * Verify Razorpay payment and update status
 */
export const finalizePayment = async (student, paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  const isValid = verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) throw new Error("Payment verification failed");

  const payment = await Payment.findOneAndUpdate(
    { orderId: razorpay_order_id },
    {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "success",
    },
    { new: true }
  );

  await sendPaymentReceipt(student, payment);

  return payment;
};

/**
 * Refund payment (Admin use)
 */
export const refundPayment = async (paymentId) => {
  const refund = await createRefund(paymentId);
  await Payment.findOneAndUpdate(
    { paymentId },
    { status: "refunded" },
    { new: true }
  );
  return refund;
};
