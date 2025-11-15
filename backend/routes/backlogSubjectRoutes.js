// backend/routes/backlogSubjectRoutes.js
import express from "express";
import {
  getAllBacklogSubjects,
  getStudentBacklogSubjects,
  getBacklogFeeAmount,
  createBacklogSubject,
  updateBacklogSubject,
  deleteBacklogSubject,
} from "../controllers/backlogSubjectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/", protect, authorize("admin"), getAllBacklogSubjects);

// Student routes
router.get("/student", protect, authorize("student"), getStudentBacklogSubjects);
router.get("/fee-amount", protect, authorize("student"), getBacklogFeeAmount);
router.post("/", protect, authorize("student"), createBacklogSubject);
router.put("/:id", protect, authorize("student", "admin"), updateBacklogSubject);
router.delete("/:id", protect, authorize("student", "admin"), deleteBacklogSubject);

export default router;

