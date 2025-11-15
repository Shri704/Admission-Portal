// backend/config/db.js
// -------------------------------------------------------------
// MongoDB Connection Helper (Compatible with Mongoose v7+)
// Handles MongoDB Atlas & Local Connections
// -------------------------------------------------------------

import mongoose from "mongoose";
import config from "./env.js";
import { logInfo, logError } from "../services/loggerService.js";

// Optional global mongoose configurations
mongoose.set("strictQuery", true); // Enforce strict query filters

// Base connection options for performance tuning
const defaultOpts = {
  maxPoolSize: 10, // Concurrent connection pool
  serverSelectionTimeoutMS: 30000, // Timeout for initial connection (30s)
  socketTimeoutMS: 45000, // Close idle sockets after 45s
  connectTimeoutMS: 30000, // Connection timeout (30s)
  retryWrites: true, // Retry writes on network errors
  retryReads: true, // Retry reads on network errors
  heartbeatFrequencyMS: 10000, // How often to check server status
};

/**
 * Connect to MongoDB with retry logic
 * @param {Object} [extraOptions] - Optional overrides for Mongoose connect()
 * @param {Number} [maxRetries=3] - Maximum number of connection retry attempts
 */
export async function connectDB(extraOptions = {}, maxRetries = 3) {
  const opts = { ...defaultOpts, ...extraOptions };

  if (!config.mongoURI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables. Please check your .env file.");
  }

  // Trim whitespace and clean up the URI
  let mongoURI = String(config.mongoURI).trim();
  
  // Remove "MONGO_URI=" prefix if it exists (common .env file mistake)
  if (mongoURI.startsWith("MONGO_URI=")) {
    mongoURI = mongoURI.replace(/^MONGO_URI=/, "").trim();
  }
  
  // Remove quotes if present
  mongoURI = mongoURI.replace(/^["']|["']$/g, "");
  
  if (!mongoURI.startsWith("mongodb://") && !mongoURI.startsWith("mongodb+srv://")) {
    throw new Error(`❌ Invalid MONGO_URI format. Must start with 'mongodb://' or 'mongodb+srv://'. Current value: ${mongoURI.substring(0, 50)}...`);
  }
  
  // Use cleaned URI
  const finalURI = mongoURI;

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Attempt to connect
      const conn = await mongoose.connect(finalURI, opts);

      logInfo(`✅ MongoDB connected successfully - Host: ${conn.connection.host}, Database: ${conn.connection.name}`);

      // Enable debug logging in development
      if (config.nodeEnv === "development") {
        mongoose.set("debug", (collection, method, query, doc) => {
          console.debug(
            `[mongoose] ${collection}.${method}`,
            JSON.stringify(query),
            doc ? JSON.stringify(doc) : ""
          );
        });
      }

      return conn.connection;
    } catch (err) {
      lastError = err;
      
      if (attempt < maxRetries) {
        const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  logError("❌ MongoDB connection error", lastError);
  
  // Provide specific guidance for different error types
  const errorMsg = lastError?.message || "";
  
  if (errorMsg.includes("IP") && errorMsg.includes("whitelist")) {
    console.error("\n🔒 MongoDB Atlas IP Whitelist Error - Quick Fix:");
    console.error("   1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com");
    console.error("   2. Select your project and cluster");
    console.error("   3. Click 'Network Access' (or 'IP Access List') in the left sidebar");
    console.error("   4. Click 'Add IP Address' button");
    console.error("   5. Click 'Add Current IP Address' (recommended)");
    console.error("      OR click 'Allow Access from Anywhere' (0.0.0.0/0) for development");
    console.error("   6. Click 'Confirm' and wait 1-2 minutes");
    console.error("   7. Restart your server");
    console.error(`\n   Connection string: ${finalURI.replace(/:[^:@]+@/, ':****@')}\n`);
  } else if (errorMsg.includes("ETIMEDOUT") || errorMsg.includes("timed out") || errorMsg.includes("Server selection timed out")) {
    console.error("\n💡 MongoDB Atlas Connection Timeout - Quick Fix:");
    console.error("   1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com");
    console.error("   2. Click 'Network Access' in the left sidebar");
    console.error("   3. Click 'Add IP Address' button");
    console.error("   4. Click 'Allow Access from Anywhere' (0.0.0.0/0) for testing");
    console.error("      OR add your current IP address");
    console.error("   5. Wait 1-2 minutes for changes to take effect");
    console.error("   6. Verify your cluster is not paused");
    console.error(`\n   Connection string: ${finalURI.replace(/:[^:@]+@/, ':****@')}\n`);
  }
  
  throw lastError;
}

/**
 * Gracefully close the MongoDB connection
 */
export async function closeDB() {
  try {
    await mongoose.connection.close(false);
    logInfo("🔒 MongoDB connection closed gracefully.");
  } catch (err) {
    logError("⚠️ Error closing MongoDB connection", err);
  }
}

export default { connectDB, closeDB };
