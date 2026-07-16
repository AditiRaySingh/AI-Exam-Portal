import questionModel from "../models/QuestionModel.js";
import examModel from "../models/examModel.js";





export const getQuestion = async (req, res) => {
    try {

        const questions = await questionModel.find();

        res.status(200).json({
            success: true,
            questions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ============================================
// CREATE QUESTION
// ============================================

export const createQuestion = async (req, res) => {
  try {

    const teacherId = req.user._id;

    const {
      examId,
      topic,
      question,
      options,
      correctAnswer,
      marks,
      questionType,
      difficulty,
      explanation,
      tags,
      image
    } = req.body;

    // Required Fields

    if (
      !examId ||
      !topic ||
      !question ||
      !correctAnswer ||
      !marks ||
      !questionType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }
    

    // Find Exam

    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    // Owner Check

    if (
      exam.teacherId.toString() !==
      teacherId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only exam owner can add questions."
      });
    }

    // Published Check

    if (exam.status === "published") {
      return res.status(400).json({
        success: false,
        message:
          "Published exam cannot be modified."
      });
    }

    // Duplicate Question

    const alreadyExists =
      await questionModel.findOne({
        examId,
        question: question.trim()
      });

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message:
          "Question already exists."
      });
    }

    const validTypes = [
      "mcq",
      "truefalse",
      "shortanswer",
      "veryshortanswer"
    ];

    if (
      !validTypes.includes(questionType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid question type."
      });
    }

    // MCQ Validation

    if (questionType === "mcq") {

      if (
        !Array.isArray(options) ||
        options.length < 2
      ) {
        return res.status(400).json({
          success: false,
          message:
            "MCQ requires at least two options."
        });
      }

      if (
        !options.includes(correctAnswer)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Correct answer must be one of the options."
        });
      }

    }

    // True False Validation

    if (
      questionType === "truefalse"
    ) {

      if (
        correctAnswer !== "True" &&
        correctAnswer !== "False"
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Correct answer must be True or False."
        });

      }

    }

    const newQuestion =
      await questionModel.create({

        examId,

        topic,

        question: question.trim(),

        options:
          questionType === "mcq"
            ? options
            : questionType === "truefalse"
            ? ["True", "False"]
            : [],

        correctAnswer,

        marks,

        questionType,

        difficulty:
          difficulty || "medium",

        explanation:
          explanation || "",

        tags:
          tags || [],

        image:
          image || "",

        generatedByAI: false

      });

    return res.status(201).json({

      success: true,

      message:
        "Question added successfully.",

      question: newQuestion

    });

  }

  catch (error) {
  console.error("CREATE QUESTION ERROR:");
  console.error(error);
  console.error(error.stack);

  return res.status(500).json({
    success: false,
    message: error.message
  });
}
 

};

// ============================================
// GET ALL QUESTIONS
// ============================================

export const getAllQuestions =
async (req, res) => {

  try {

    const questions =
      await questionModel
        .find()
        .populate(
          "examId",
          "title subject"
        )
        .sort({
          createdAt: -1
        });

    return res.status(200).json({

      success: true,

      totalQuestions:
        questions.length,

      questions

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

}; 




// ============================================
// GET QUESTIONS OF A PARTICULAR EXAM
// ============================================

export const getQuestionsByExam = async (req, res) => {

  try {

    const { examId } = req.params;

    const exam = await examModel.findById(examId);

    if (!exam) {

      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });

    }

    const questions = await questionModel
      .find({ examId })
      .sort({ createdAt: 1 });

    return res.status(200).json({

      success: true,

      totalQuestions: questions.length,

      questions

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ============================================
// GET SINGLE QUESTION
// ============================================

export const getSingleQuestion = async (req, res) => {

  try {

    const { id } = req.params;

    const question =
      await questionModel
        .findById(id)
        .populate(
          "examId",
          "title subject status"
        );

    if (!question) {

      return res.status(404).json({

        success: false,

        message: "Question not found."

      });

    }

    return res.status(200).json({

      success: true,

      question

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ============================================
// UPDATE QUESTION
// ============================================

export const updateQuestion = async (req, res) => {

  try {

    const { id } = req.params;

    const teacherId = req.user._id;

    const question = await questionModel.findById(id);

    if (!question) {

      return res.status(404).json({
        success: false,
        message: "Question not found."
      });

    }

    const exam = await examModel.findById(question.examId);

    if (!exam) {

      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });

    }

    // Owner Check

    if (
      exam.teacherId.toString() !==
      teacherId.toString()
    ) {

      return res.status(403).json({
        success: false,
        message: "Only exam owner can update questions."
      });

    }

    // Published Check

    if (exam.status === "published") {

      return res.status(400).json({
        success: false,
        message: "Published exam cannot be modified."
      });

    }

    const {

      topic,

      question: newQuestion,

      options,

      correctAnswer,

      marks,

      questionType,

      difficulty,

      explanation,

      tags,

      image

    } = req.body;

    // Duplicate Question Check

    if (newQuestion) {

      const duplicate =
        await questionModel.findOne({

          examId: exam._id,

          question: newQuestion.trim(),

          _id: { $ne: id }

        });

      if (duplicate) {

        return res.status(409).json({

          success: false,

          message: "Question already exists."

        });

      }

    }

    // MCQ Validation

    if (questionType === "mcq") {

      if (
        !Array.isArray(options) ||
        options.length < 2
      ) {

        return res.status(400).json({

          success: false,

          message:
            "MCQ requires at least two options."

        });

      }

      if (!options.includes(correctAnswer)) {

        return res.status(400).json({

          success: false,

          message:
            "Correct answer must be inside options."

        });

      }

    }

    // True False Validation

    if (questionType === "truefalse") {

      if (
        correctAnswer !== "True" &&
        correctAnswer !== "False"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Correct answer must be True or False."

        });

      }

    }

    question.topic =
      topic ?? question.topic;

    question.question =
      newQuestion ?? question.question;

    question.options =
      options ?? question.options;

    question.correctAnswer =
      correctAnswer ?? question.correctAnswer;

    question.marks =
      marks ?? question.marks;

    question.questionType =
      questionType ?? question.questionType;

    question.difficulty =
      difficulty ?? question.difficulty;

    question.explanation =
      explanation ?? question.explanation;

    question.tags =
      tags ?? question.tags;

    question.image =
      image ?? question.image;

    await question.save();

    return res.status(200).json({

      success: true,

      message:
        "Question updated successfully.",

      question

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ============================================
// DELETE QUESTION
// ============================================

export const deleteQuestion = async (req, res) => {

  try {

    const { id } = req.params;

    const teacherId = req.user._id;

    const question =
      await questionModel.findById(id);

    if (!question) {

      return res.status(404).json({

        success: false,

        message: "Question not found."

      });

    }

    const exam =
      await examModel.findById(
        question.examId
      );

    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Exam not found."

      });

    }

    // Owner Check

    if (
      exam.teacherId.toString() !==
      teacherId.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Only exam owner can delete questions."

      });

    }

    // Published Check

    if (exam.status === "published") {

      return res.status(400).json({

        success: false,

        message:
          "Published exam cannot be modified."

      });

    }

    await questionModel.findByIdAndDelete(id);

    return res.status(200).json({

      success: true,

      message:
        "Question deleted successfully."

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ============================================
// SEARCH QUESTIONS
// GET /api/questions/search?keyword=java
// ============================================

export const searchQuestions = async (req, res) => {

  try {

    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required."
      });
    }

    const questions = await questionModel.find({

      $or: [

        {
          question: {
            $regex: keyword,
            $options: "i"
          }
        },

        {
          topic: {
            $regex: keyword,
            $options: "i"
          }
        }

      ]

    })
    .populate("examId", "title subject")
    .sort({ createdAt: -1 });

    return res.status(200).json({

      success: true,

      totalQuestions: questions.length,

      questions

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ============================================
// GET QUESTIONS BY DIFFICULTY
// ============================================

export const getQuestionsByDifficulty =
async (req, res) => {

  try {

    const { difficulty } = req.params;

    const validDifficulty = [

      "easy",

      "medium",

      "hard"

    ];

    if (!validDifficulty.includes(difficulty)) {

      return res.status(400).json({

        success: false,

        message: "Invalid difficulty."

      });

    }

    const questions =
      await questionModel.find({
        difficulty
      });

    return res.status(200).json({

      success: true,

      totalQuestions:
        questions.length,

      questions

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ============================================
// QUESTION STATISTICS
// ============================================

export const getQuestionStatistics =
async (req, res) => {

  try {

    const totalQuestions =
      await questionModel.countDocuments();

    const mcq =
      await questionModel.countDocuments({
        questionType: "mcq"
      });

    const trueFalse =
      await questionModel.countDocuments({
        questionType: "truefalse"
      });

    const shortAnswer =
      await questionModel.countDocuments({
        questionType: "shortanswer"
      });

    const veryShort =
      await questionModel.countDocuments({
        questionType:
          "veryshortanswer"
      });

    const easy =
      await questionModel.countDocuments({
        difficulty: "easy"
      });

    const medium =
      await questionModel.countDocuments({
        difficulty: "medium"
      });

    const hard =
      await questionModel.countDocuments({
        difficulty: "hard"
      });

    return res.status(200).json({

      success: true,

      statistics: {

        totalQuestions,

        byType: {

          mcq,

          trueFalse,

          shortAnswer,

          veryShort

        },

        byDifficulty: {

          easy,

          medium,

          hard

        }

      }

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ============================================
// BULK DELETE QUESTIONS
// ============================================

export const bulkDeleteQuestions =
async (req, res) => {

  try {

    const { ids } = req.body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Question IDs are required."

      });

    }

    await questionModel.deleteMany({

      _id: {
        $in: ids
      }

    });

    return res.status(200).json({

      success: true,

      message:
        "Questions deleted successfully."

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



















