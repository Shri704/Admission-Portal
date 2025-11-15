// backend/routes/adminRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getAllStudents,
  updateAdmissionStatus,
  createFee,
  getAdmissions,
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../controllers/adminController.js";
import { getAllPayments } from "../controllers/paymentController.js";

const router = express.Router();

// Require admin role
router.use(protect, authorize("admin"));

router.get("/students", getAllStudents);
router.get("/admissions", getAdmissions);
router.put("/admissions/:id", updateAdmissionStatus);
router.post("/fees", createFee);
router.get("/payments", getAllPayments);

// Branch management routes
router.get("/branches", getAllBranches);
router.post("/branches", createBranch);
router.put("/branches/:id", updateBranch);
router.delete("/branches/:id", deleteBranch);

export default router;
