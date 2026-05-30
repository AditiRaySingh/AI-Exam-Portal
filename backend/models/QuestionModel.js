import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },

  question: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
  },

  correctAnswer: {
    type: String,
    required: true,
  },

  marks: {
    type: Number,
    required: true,
  },

  questionType: {
    type: String,
    required: true,
    enum: ["mcq", "truefalse", "shortanswer"],
  },
});

const questionModel = mongoose.model(
  "Question",
  questionSchema
);

export default questionModel;