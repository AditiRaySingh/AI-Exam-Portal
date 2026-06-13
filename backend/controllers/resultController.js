import examModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";


// Start Exam
export const startExam = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    if (exam.status !== "published") {
      return res.status(400).json({
        message: "Exam is not available",
      });
    }

    const alreadyAttempt = await ExamAttemptModel.findOne({
      studentId,
      examId,
    });

    if (alreadyAttempt) {
      return res.status(400).json({
        message: "You already attempted this exam",
      });
    }

    const examAttempt = await ExamAttemptModel.create({
      studentId,
      examId,
      status: "in progress",
    });

    return res.status(201).json({
      success: true,
      message: "Exam started successfully",
      examAttempt,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Show Questions
export const showQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    const questions = await questionModel
      .find({ examId })
      .select("-correctanswer");

    if (questions.length === 0) {
      return res.status(404).json({
        message: "Questions not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Submit Exam
export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user.id;

    const examAttempt = await ExamAttemptModel.findOne({
      studentId,
      examId,
    });

    if (!examAttempt) {
      return res.status(404).json({
        message: "Exam attempt not found",
      });
    }

    if (examAttempt.status === "submitted") {
      return res.status(400).json({
        message: "Exam already submitted",
      });
    }

    examAttempt.answers = answers;
    examAttempt.status = "submitted";
    examAttempt.submittedAt = Date.now();

    await examAttempt.save();

    // calculate result
    const result = await calculateResult(
      studentId,
      examId,
      answers
    );

    return res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      result,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};




export const getStudentResults = async (req, res) => {
  try {

    const studentId = req.user.id;

    const results =
      await ExamAttemptModel.find({
        studentId,
        status: "submitted"
      })
      .populate("examId", "title");

    res.status(200).json({
      success: true,
      results
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};