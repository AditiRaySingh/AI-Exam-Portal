import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedAnswer: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    obtainedMarks: {
      type: Number,
      default: 0,
    },

    aiScore: {
      type: Number,
      default: 0,
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    timeTaken: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const examAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    answers: [answerSchema],

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    correctCount: {
      type: Number,
      default: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
    },

    skippedCount: {
      type: Number,
      default: 0,
    },

    result: {
      type: String,
      enum: ["Pass", "Fail"],
      default: "Fail",
    },

    remarks: {
      type: String,
      default: "",
    },

  status: {
  type: String,
  enum: [
    "in-progress",
    "submitted",
    "auto-submitted"
  ],
  default: "in-progress"
},

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
    },

    timeTaken: {
      type: Number,
      default: 0,
    },

    attemptNumber: {
      type: Number,
      default: 1,
    },

    tabSwitches: {
      type: Number,
      default: 0,
    },

    isCheatingDetected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

examAttemptSchema.index(
  {
    studentId: 1,
    examId: 1,
  },
  {
    unique: true,
  }
);

const ExamAttemptModel = mongoose.model(
  "ExamAttempt",
  examAttemptSchema
);

export default ExamAttemptModel;