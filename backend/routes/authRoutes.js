// backend/routes/authRoutes.js
import express from "express";
import { registerStudent, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", registerStudent);
router.post("/login", loginUser);

export default router;
