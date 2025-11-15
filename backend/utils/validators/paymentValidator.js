// backend/utils/validators/paymentValidator.js
import Joi from "joi";

export const createOrderSchema = Joi.object({
  amount: Joi.number().integer().min(100).required(), // min ₹1.00
});

export const verifyPaymentSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
});
