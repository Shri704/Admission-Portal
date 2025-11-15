// backend/middleware/errorMiddleware.js
import { logError } from "../services/loggerService.js";

/**
 * Express global error handler
 * Catches thrown errors from async controllers or middlewares
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Log the error with context
  logError(`Error ${statusCode} on ${req.method} ${req.originalUrl}`, {
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Not Found handler — if no route matches
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
