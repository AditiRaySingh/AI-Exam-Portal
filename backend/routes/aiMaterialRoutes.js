import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  generateFromMaterial
}
from "../controllers/aiMaterialController.js";

import {
  protect
}
from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate-from-material",
  protect,
  upload.single("file"),
  (req,res,next)=>{
    console.log("UPLOAD MIDDLEWARE HIT");
    next();
  },
  generateFromMaterial
);

export default router;