import express from "express";

import { protect }
from "../middleware/authMiddleware.js";

import {
  getStudentResults
}
from "../controllers/resultController.js";

const router = express.Router();

router.get(
  "/student",
  protect,
  getStudentResults
);

export default router;