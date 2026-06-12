import mongoose from "mongoose";

const ExamAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },

  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },

 answers: [
{
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },

  selectedAnswer: {
    type: String
  },

  aiScore: {
    type: Number,
    default: 0
  },

  aiFeedback: {
    type: String,
    default: ""
  }
}
],

  score: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: [
      "in progress",
      "submitted",
      "auto-submitted",
    ],
    default: "in progress",
  },

  startedAt: {
    type: Date,
    default: Date.now,
  },

  submittedAt: {
    type: Date,
  },

  correctCount: {
  type: Number,
  default: 0
},

wrongCount: {
  type: Number,
  default: 0
},

totalMarks: {
  type: Number,
  default: 0
},

percentage: {
  type: Number,
  default: 0
}


});

const ExamAttemptModel = mongoose.model(
  "ExamAttempt",
  ExamAttemptSchema
);

export default ExamAttemptModel;