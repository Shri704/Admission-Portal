// backend/routes/studentRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getProfile,
  updateProfile,
  getDocuments,
} from "../controllers/studentController.js";

const router = express.Router();

// Only authenticated students
router.use(protect, authorize("student"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/documents", getDocuments);

export default router;
