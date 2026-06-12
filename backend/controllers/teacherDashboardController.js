import express from "express";
import {
  studentDashboard,
  getTeacherDashboard
} from "../controllers/dashboardController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/student",
  authMiddleware,
  studentDashboard
);

router.get(
  "/teacher",
  authMiddleware,
  getTeacherDashboard
);

export default router;