import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import examAttemptRoutes from "./routes/examAttemptRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiMaterialRoutes from "./routes/aiMaterialRoutes.js";
import aiEvaluationRoutes from "./routes/aiEvaluationRoutes.js";
import aiQuestionRoutes from "./routes/aiQuestionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-exam-portal-frontend.onrender.com"
    ],
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempt", examAttemptRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/ai/material", aiMaterialRoutes);
app.use("/api/ai/evaluation", aiEvaluationRoutes);
app.use("/api/ai/question", aiQuestionRoutes);

app.use("/api/results", resultRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
