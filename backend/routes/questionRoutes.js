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

export default router;