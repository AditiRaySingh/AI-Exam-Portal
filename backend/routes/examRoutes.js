import express from "express";

import {
  createExam,
  getExam,
  updateExam,
  deleteExam,
  publishExam,
  getPublishedExams,
  getSingleExam,
  startExam
} from "../controllers/examController.js";

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

router.post(
  "/create",
  protect,
  authorizeRoles("teacher"),
  createExam
);

router.get(
  "/teacher",
  protect,
  authorizeRoles("teacher"),
  getExam
);

router.get(
  "/published",
  protect,
  getPublishedExams
);

router.get(
  "/:id",
  protect,
  getSingleExam
);

router.put(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  updateExam
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  deleteExam
);

router.put(
  "/publish/:id",
  protect,
  authorizeRoles("teacher"),
  publishExam
);

export default router;