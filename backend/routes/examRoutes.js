import express from "express";

import {
  exam,
  getExam,
  deleteExam,
  updateExam
} from "../controllers/examController.js";

import {
  startExam,
  showQuestions,
  submitExam,
  getExamResults
} from "../controllers/examAttemptController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Exam CRUD
router.post(
  "/create",
  protect,
  exam
);

router.get(
  "/",
  protect,
  getExam
);

router.put(
  "/:id",
  protect,
  updateExam
);

router.delete(
  "/:id",
  protect,
  deleteExam
);

// Exam Attempt
router.post(
  "/start",
  protect,
  startExam
);

router.get(
  "/questions/:examId",
  protect,
  showQuestions
);

router.post(
  "/submit",
  protect,
  submitExam
);

// Teacher Results
router.get(
  "/results/:examId",
  protect,
  getExamResults
);

export default router;