// backend/routes/branchRoutes.js
import express from "express";
import { getBranches } from "../controllers/branchController.js";

const router = express.Router();

// Public route to get all active branches
router.get("/", getBranches);

export default router;

