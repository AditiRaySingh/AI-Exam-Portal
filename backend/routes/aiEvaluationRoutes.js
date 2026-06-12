import express from "express";

import {
  evaluateAnswer
}
from "../controllers/aiEvaluationController.js";

import {
  protect
}
from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/evaluate-answer",
  protect,
  evaluateAnswer
);

export default router;