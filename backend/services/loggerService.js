import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";

// Determine current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if missing
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level.toUpperCase()} - ${message}\nStack: ${stack}`
      : `[${timestamp}] ${level.toUpperCase()} - ${message}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // Error logs only
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    // General logs
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
    }),
    // Daily rotating logs
    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "info",
    }),
  ],
});

// Add console output (colorized)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Named helper exports
export const logInfo = (msg) => logger.info(msg);
export const logWarn = (msg) => logger.warn(msg);
export const logError = (msg, err) =>
  logger.error(err ? `${msg} - ${err.message}` : msg, { stack: err?.stack });
export const logDebug = (msg) => logger.debug(msg);

// Default export (for import logger from './services/loggerService.js')
export default logger;
