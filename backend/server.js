import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
});
import cors from "cors";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);



import express from "express";

import connectedDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

const app = express();

app.use(cors());
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
connectedDb();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/question", questionRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});


const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(
    `Server is listening at port ${PORT}`
  );
});