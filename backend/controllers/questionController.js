import questionModel from "../models/QuestionModel.js";
import examModel from "../models/examModel.js";

// CREATE QUESTION
export const questionDesign = async (req, res) => {
  try {
    const teacherId = req.user.id;

const {
 examId,
 topic,
 question,
 options,
 correctAnswer,
 marks,
 questionType,
 difficulty
} = req.body;

    if (
  !examId ||
  !topic ||
  !question ||
  !correctAnswer ||
  !marks ||
  !questionType ||
  !difficulty
){
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    if (exam.teacherId.toString() !== teacherId) {
      return res.status(403).json({
        message:
          "Only exam owner can add questions"
      });
    }

   const validTypes = [
  "mcq",
  "truefalse",
  "shortanswer",
  "veryshortanswer"
];

    if (!validTypes.includes(questionType)) {
      return res.status(400).json({
        message: "Invalid question type"
      });
    }

    if (
      questionType === "mcq" &&
      (!options ||
        !Array.isArray(options) ||
        options.length < 2)
    ) {
      return res.status(400).json({
        message:
          "MCQ must contain at least 2 options"
      });
    }

    const newQuestion =
await questionModel.create({
 examId,
 topic,
 question,
 options,
 correctAnswer,
 marks,
 questionType,
 difficulty
});

    return res.status(201).json({
      success: true,
      message:
        "Question added successfully",
      question: newQuestion
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message
    });

  }
};

// GET QUESTIONS
export const getQuestion = async (
  req,
  res
) => {
  try {

    const questions =
      await questionModel.find();

    if (
      !questions ||
      questions.length === 0
    ) {
      return res.status(404).json({
        message: "No questions found"
      });
    }

    return res.status(200).json({
      success: true,
      questions
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

// UPDATE QUESTION
export const updateQuestion = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const {
  topic,
  question,
  options,
  correctAnswer,
  marks,
  questionType,
  difficulty
} = req.body;

    const updatedQuestion =
      await questionModel.findByIdAndUpdate(
        id,
      {
  topic,
  question,
  options,
  correctAnswer,
  marks,
  questionType,
  difficulty
},
        {
          new: true
        }
      );

    if (!updatedQuestion) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Question updated successfully",
      question: updatedQuestion
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

// DELETE QUESTION
export const deleteQuestion = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const deletedQuestion =
      await questionModel.findByIdAndDelete(
        id
      );

    if (!deletedQuestion) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Question deleted successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message
    });

  }
};


// GET QUESTIONS BY EXAM
export const getQuestionsByExam = async (
  req,
  res
) => {
  try {

    const { examId } = req.params;

    const questions =
      await questionModel.find({
        examId
      });

    return res.status(200).json({
      success: true,
      questions
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

// GET SINGLE QUESTION

export const getSingleQuestion = async (req, res) => {
  try {

    const { id } = req.params;

    const question =
      await questionModel.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    return res.status(200).json({
      success: true,
      question
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};