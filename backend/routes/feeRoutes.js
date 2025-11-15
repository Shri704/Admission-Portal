// backend/routes/feeRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getFees,
  getStudentFees,
  getStudentFeesByType,
} from "../controllers/feeController.js";

const router = express.Router();

// Public fetch
router.get("/", getFees);

// Authenticated student fetch
router.get("/student", protect, authorize("student"), getStudentFees);
router.get("/student/:type", protect, authorize("student"), getStudentFeesByType);

export default router;
