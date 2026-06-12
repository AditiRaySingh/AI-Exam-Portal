import express from "express";

import {
  exam,
  getExam,
  deleteExam,
  updateExam,
  publishExam
} from "../controllers/examController.js";

import {
  startExam,
  showQuestions,
  submitExam,
  getExamResults,
  getAllExamResults
} from "../controllers/examAttemptController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  getTeacherDashboard
} from "../controllers/dashboardController.js";

const router = express.Router();

// Create Exam
router.post(
  "/create",
  protect,
  exam
);

// Get All Exams
router.get(
  "/",
  protect,
  getExam
);

// Update Exam
router.put(
  "/:id",
  protect,
  updateExam
);

// Delete Exam
router.delete(
  "/:id",
  protect,
  deleteExam
);

// Publish Exam
router.put(
  "/publish/:id",
  protect,
  (req,res,next)=>{
    console.log("PUBLISH API CALLED");
    next();
  },
  publishExam
);

// Start Exam
router.post(
  "/start",
  protect,
  startExam
);

// Get Questions
router.get(
  "/questions/:examId",
  protect,
  showQuestions
);

// Submit Exam
router.post(
  "/submit",
  (req, res, next) => {
    console.log("SUBMIT ROUTE HIT");
    next();
  },
  protect,
  submitExam
);

// Student Results
router.get(
  "/results/:examId",
  protect,
  getExamResults
);

// Teacher Results
router.get(
  "/teacher-results/:examId",
  protect,
  getAllExamResults
);

// Dashboard
router.get(
  "/dashboard",
  protect,
  getTeacherDashboard
);

export default router;