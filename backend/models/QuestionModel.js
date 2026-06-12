import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true
  },

  topic: {
    type: String,
    required: true
  },

  question: {
    type: String,
    required: true
  },

  options: {
    type: [String],
    default: []
  },

  correctAnswer: {
    type: String,
    required: true
  },

  marks: {
    type: Number,
    required: true
  },

  questionType: {
    type: String,
    enum: [
      "mcq",
      "truefalse",
      "shortanswer",
      "veryshortanswer"
    ]
  },

  difficulty: {
    type: String,
    enum: [
      "easy",
      "medium",
      "hard"
    ],
    default: "medium"
  }
},
{
  timestamps: true
});
const questionModel =
mongoose.model(
  "Question",
  questionSchema
);

export default questionModel;