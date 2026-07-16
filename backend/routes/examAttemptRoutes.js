import express from "express";

import {
  startExam,
  showQuestions,
  submitExam,
  getExamResults,
  getAllExamResults,
  getStudentHistory
} from "../controllers/examAttemptController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/start",
  protect,
  authorizeRoles("student"),
  startExam
);

router.get(
  "/questions/:examId",
  protect,
  authorizeRoles("student"),
  showQuestions
);

router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitExam
);

router.get(
  "/result/:examId",
  protect,
  authorizeRoles("student"),
  getExamResults
);

router.get(
  "/history",
  protect,
  authorizeRoles("student"),
  getStudentHistory
);

router.get(
  "/teacher/:examId",
  protect,
  authorizeRoles("teacher"),
  getAllExamResults
);

export default router;