// backend/services/emailService.js
import nodemailer from "nodemailer";
import config from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: config.email.smtpHost || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.email.smtpUser,
    pass: config.email.smtpPass,
  },
});

/**
 * Send a generic email
 */
export const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: `"${config.appName}" <${config.email.from}>`,
    to,
    subject,
    html,
  });
  console.log("📧 Email sent:", info.messageId);
};

/**
 * Send payment receipt
 */
export const sendPaymentReceipt = async (student, payment) => {
  const html = `
    <h2>Payment Receipt - ${config.appName}</h2>
    <p>Dear ${student.name},</p>
    <p>We have received your payment of <b>₹${payment.amount / 100}</b>.</p>
    <p>Order ID: <b>${payment.orderId}</b></p>
    <p>Payment ID: <b>${payment.paymentId}</b></p>
    <p>Thank you for using our portal.</p>
  `;
  await sendEmail(student.email, "Payment Receipt", html);
};

/**
 * Send admission confirmation email
 */
export const sendAdmissionConfirmation = async (student, admission) => {
  const html = `
    <h2>Admission Confirmation</h2>
    <p>Hello ${student.name},</p>
    <p>Your admission for Year ${admission.year} - ${admission.branch} has been approved.</p>
    <p>Welcome to the new academic year!</p>
  `;
  await sendEmail(student.email, "Admission Confirmation", html);
};
