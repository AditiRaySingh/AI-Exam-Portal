import express from "express";
import { generateQuestions } from "../controllers/aiQuestionController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  authorizeRoles("teacher"),
  generateQuestions
);

export default router;