import express from "express";

import {
  questionDesign,
  getQuestion,
  updateQuestion,
  deleteQuestion,
   getQuestionsByExam,
   getSingleQuestion
} from "../controllers/questionController.js";

import {
  generateQuestions
} from "../controllers/aiQuestionController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  questionDesign
);

router.get(
  "/",
  protect,
  getQuestion
);

router.get(
  "/exam/:examId",
  protect,
  getQuestionsByExam
);

router.put(
  "/:id",
  protect,
  updateQuestion
);

router.delete(
  "/:id",
  protect,
  deleteQuestion
);

router.post(
  "/ai-generate",
  protect,
  generateQuestions
);

router.get(
  "/single/:id",
  protect,
  getSingleQuestion
);

export default router;