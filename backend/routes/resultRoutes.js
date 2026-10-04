import express from "express";

import {
  getStudentResults
} from "../controllers/examAttemptController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/student",
  protect,
  getStudentResults
);

export default router;