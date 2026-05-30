import express from "express";
import {
  userregistration,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

// register
router.post("/register", userregistration);

// login
router.post("/login", loginUser);

export default router;