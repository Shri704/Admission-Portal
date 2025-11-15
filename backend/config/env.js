// backend/config/env.js
import dotenv from "dotenv";
dotenv.config(); // Load .env variables

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,

  // MongoDB
  mongoURI: process.env.MONGO_URI,

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // SMTP / Email
  smtp: {
    fromEmail: process.env.FROM_EMAIL,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === "true" || false,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // Client URL (Frontend)
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  admin: {
    name: process.env.ADMIN_NAME || "Portal Super Admin",
    email: process.env.ADMIN_EMAIL || "admin@admp.com",
    password: process.env.ADMIN_PASSWORD || "Adminp@1234",
  },

  student: {
    name: process.env.STUDENT_NAME || "Demo Student",
    email: process.env.STUDENT_EMAIL || "student@admp.com",
    password: process.env.STUDENT_PASSWORD || "Studentp@1234",
    year: Number(process.env.STUDENT_YEAR) || 1,
    branch: process.env.STUDENT_BRANCH || "CSE",
    category: process.env.STUDENT_CATEGORY || "CET",
    programStartYear: Number(process.env.STUDENT_PROGRAM_START_YEAR) || new Date().getFullYear(),
  },
};

export default config;
