// backend/services/smsService.js
import twilio from "twilio";
import config from "../config/env.js";

let client;
if (config.twilio.sid && config.twilio.authToken) {
  client = twilio(config.twilio.sid, config.twilio.authToken);
}

/**
 * Send SMS via Twilio
 */
export const sendSMS = async (to, message) => {
  if (!client) return console.warn("Twilio not configured");
  await client.messages.create({
    body: message,
    from: config.twilio.from,
    to,
  });
  console.log("📱 SMS sent to", to);
};

/**
 * Payment success alert
 */
export const sendPaymentAlert = async (student, amount) => {
  const msg = `Hi ${student.name}, your payment of ₹${amount / 100} was successful.`;
  if (student.phone) await sendSMS(student.phone, msg);
};
