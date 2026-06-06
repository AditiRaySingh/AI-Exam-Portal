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
  (req,res,next)=>{

    console.log(
      "SUBMIT ROUTE HIT"
    );

    next();
  },
  protect,
  submitExam
);

// Teacher Results
router.get(
  "/results/:examId",
  protect,
  getExamResults
);

router.get(
  "/teacher-results/:examId",
  protect,
  getAllExamResults
);

router.get(
  "/dashboard",
  protect,
  getTeacherDashboard
);

export default router;