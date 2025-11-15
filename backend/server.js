/**
 * ================================================
 * Engineering Admission & Fee Management Portal
 * Backend Server (Express + MongoDB + Razorpay + Cloudinary)
 * ================================================
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import config from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import logger, { logInfo, logError } from "./services/loggerService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import backlogSubjectRoutes from "./routes/backlogSubjectRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import { ensureDefaultAdmin } from "./utils/ensureDefaultAdmin.js";
import { seedBranches } from "./utils/seedBranches.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// ================================
// Global Middlewares
// ================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());

// CORS setup - Allow multiple origins
const allowedOrigins = [
  config.clientUrl || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://admission-portal-chi.vercel.app",
  "https://admission-portal-neon.vercel.app",
  // Allow all Vercel preview deployments
  /^https:\/\/admission-portal-.*\.vercel\.app$/,
  // Add more origins as needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowedOrigins array
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        // In development, allow any localhost origin
        if (config.nodeEnv === "development" && origin.includes("localhost")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// HTTP Request Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
if (config.nodeEnv === "production") {
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: "Too many requests from this IP, please try again later.",
    })
  );
}

// =============================================
// Optional: Request logging middleware for each route
// =============================================
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logInfo(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// =============================================
// Health Check
// =============================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `${config.appName} backend is running successfully 🚀`,
    environment: config.nodeEnv,
  });
});

// =============================================
// Static File Serving (for local uploads)
// =============================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================================
// Mount API Routes
// =============================================
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/backlog-subjects", backlogSubjectRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/branches", branchRoutes);

// =============================================
// Error Handling Middlewares
// =============================================
app.use(notFound);
app.use(errorHandler);

// =============================================
// Connect Database & Start Server
// =============================================

if (process.env.NODE_ENV !== "test") {
  try {
    await connectDB();
    
    // Seed default branches
    try {
      await seedBranches();
    } catch (branchError) {
      logError("⚠️ Failed to seed branches (server will continue)", branchError);
    }
    
    // Try to ensure default admin, but don't crash if it fails
    try {
      await ensureDefaultAdmin(config.admin);
    } catch (adminError) {
      logError("⚠️ Failed to ensure default admin account (server will continue)", adminError);
      logInfo("ℹ️ You can create an admin account manually or try again later.");
    }
    
    const server = app.listen(config.port, () => {
      logInfo(`✅ Server started successfully on port ${config.port}`);
      logInfo(`🚀 ${config.appName || "Admission Portal"} backend running at http://localhost:${config.port} [${config.nodeEnv}]`);
    });

    // Graceful Shutdown
    const gracefulShutdown = (signal) => {
      logInfo(`⚠️ Received ${signal}. Closing server gracefully...`);
      server.close(() => {
        logInfo("🛑 HTTP server closed.");
        process.exit(0);
      });
    };

    ["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => gracefulShutdown(sig)));
  } catch (err) {
    logError("❌ Server startup failed", err);
    process.exit(1);
  }
}

// =============================================
// Export app for testing
// =============================================
export default app;
