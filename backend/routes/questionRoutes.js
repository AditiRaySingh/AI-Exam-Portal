import express from "express";

import {
  createQuestion,
  getQuestion,
  getSingleQuestion,
  getQuestionsByExam,
  updateQuestion,
  deleteQuestion,
  getQuestionStatistics
} from "../controllers/questionController.js";

import {
  getExamResults,
  getAllExamResults,
  getStudentHistory
} from "../controllers/examAttemptController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// CREATE QUESTION
// ==========================================

router.post(
  "/create",
  protect,
  authorizeRoles("teacher"),
  createQuestion
);


// ==========================================
// ALL QUESTIONS
// ==========================================

router.get(
  "/",
  protect,
  getQuestion
);


// ==========================================
// STATISTICS
// ==========================================

router.get(
  "/statistics",
  protect,
  authorizeRoles("teacher"),
  getQuestionStatistics
);


// ==========================================
// QUESTIONS BY EXAM
// ==========================================

router.get(
  "/exam/:examId",
  protect,
  getQuestionsByExam
);


// ==========================================
// RESULTS
// ==========================================

router.get(
  "/result/:examId",
  protect,
  authorizeRoles("student"),
  getExamResults
);


// ==========================================
// TEACHER RESULTS
// ==========================================

router.get(
  "/teacher/:examId",
  protect,
  authorizeRoles("teacher"),
  getAllExamResults
);


// ==========================================
// STUDENT HISTORY
// ==========================================

router.get(
  "/history",
  protect,
  authorizeRoles("student"),
  getStudentHistory
);


// ==========================================
// SINGLE QUESTION
// ==========================================

router.get(
  "/:id",
  protect,
  getSingleQuestion
);


// ==========================================
// UPDATE QUESTION
// ==========================================

router.put(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  updateQuestion
);


// ==========================================
// DELETE QUESTION
// ==========================================

router.delete(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  deleteQuestion
);


export default router;