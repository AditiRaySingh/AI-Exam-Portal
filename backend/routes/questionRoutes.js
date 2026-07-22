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
  "/create",
  protect,
  authorizeRoles("teacher"),
  createQuestion
);

router.get("/", protect, getQuestion);

router.get(
  "/statistics",
  protect,
  authorizeRoles("teacher"),
  getQuestionStatistics
);

router.get(
  "/exam/:examId",
  protect,
  getQuestionsByExam
);

router.get(
  "/:id",
  protect,
  getSingleQuestion
);

router.put(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  updateQuestion
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  deleteQuestion
);



router.get(
  "/result/:examId",
  protect,
  authorizeRoles("student"),
  getExamResults
);

router.get(
  "/teacher/:examId",
  protect,
  authorizeRoles("teacher"),
  getAllExamResults
);

router.get(
  "/history",
  protect,
  authorizeRoles("student"),
  getStudentHistory
);

export default router;