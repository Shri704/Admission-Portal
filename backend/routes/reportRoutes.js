// backend/routes/reportRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getPaymentReport,
  getStudentStats,
} from "../controllers/reportController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/payments", getPaymentReport);
router.get("/students", getStudentStats);

export default router;
