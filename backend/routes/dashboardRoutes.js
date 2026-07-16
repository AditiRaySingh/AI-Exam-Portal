import express from "express";

import {
  studentDashboard,
  getTeacherDashboard
} from "../controllers/dashboardController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  studentDashboard
);

router.get(
  "/teacher",
  protect,
  authorizeRoles("teacher"),
  getTeacherDashboard
);

export default router;