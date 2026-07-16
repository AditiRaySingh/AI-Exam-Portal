import express from "express";

import {
  userregistration,
  loginUser,
  getProfile
} from "../controllers/authController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userregistration);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

export default router;