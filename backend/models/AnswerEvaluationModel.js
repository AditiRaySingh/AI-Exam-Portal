// models/AnswerEvaluationModel.js

import mongoose from "mongoose";

const answerEvaluationSchema =
new mongoose.Schema({

  studentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  questionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Question"
  },

  studentAnswer:String,

  score:Number,

  feedback:String

});

export default mongoose.model(
  "AnswerEvaluation",
  answerEvaluationSchema
);