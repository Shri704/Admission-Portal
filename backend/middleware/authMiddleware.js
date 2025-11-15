// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import config from "../config/env.js";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";

/**
 * Middleware to verify JWT token and attach user to request.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.jwt.secret);

      // Determine if token belongs to Student or Admin
      let user =
        (await Student.findById(decoded.id).select("-password")) ||
        (await Admin.findById(decoded.id).select("-password"));

      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Auth Error:", err.message);
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});
