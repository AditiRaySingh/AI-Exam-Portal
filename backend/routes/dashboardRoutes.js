import express from "express";
import {
  studentDashboard,
  getTeacherDashboard
} from "../controllers/dashboardController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/student",
  protect,
  studentDashboard
);

router.get(
  "/teacher",
  protect,
  getTeacherDashboard
);

export default router;