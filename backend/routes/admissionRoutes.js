// backend/routes/admissionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  applyAdmission,
  getAdmissionHistory,
} from "../controllers/admissionController.js";

const router = express.Router();

// Student routes
router.post("/apply", protect, authorize("student"), applyAdmission);
router.get("/history", protect, authorize("student"), getAdmissionHistory);

export default router;
