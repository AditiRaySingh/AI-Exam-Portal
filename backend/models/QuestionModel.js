import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam ID is required"],
    },

    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },

    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      required: true,
      min: 1,
    },

    questionType: {
      type: String,
      enum: [
        "mcq",
        "truefalse",
        "shortanswer",
        "veryshortanswer",
      ],
      required: true,
    },

    difficulty: {
      type: String,
      enum: [
        "easy",
        "medium",
        "hard",
      ],
      default: "medium",
    },

    tags: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: "",
    },

    generatedByAI: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validation
questionSchema.pre("save", function () {

  if (
    this.questionType === "mcq" &&
    this.options.length < 2
  ) {
    throw new Error("MCQ must contain at least 2 options");
  }

  if (this.questionType === "truefalse") {

    const validOptions = ["True", "False"];

    if (!validOptions.includes(this.correctAnswer)) {
      throw new Error(
        "True/False question must have True or False answer"
      );
    }

  }

});

const questionModel = mongoose.model(
  "Question",
  questionSchema
);

export default questionModel;