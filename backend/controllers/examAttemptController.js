import examModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";
import { evaluateAnswer }
from "./aiEvaluationController.js";
// START EXAM
export const startExam = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    const alreadyAttempt =
      await ExamAttemptModel.findOne({
        studentId,
        examId
      });

    if (alreadyAttempt) {
      return res.status(400).json({
        message: "You already attempted this exam"
      });
    }

    const examAttempt =
      await ExamAttemptModel.create({
        studentId,
        examId,
        status: "in progress"
      });

    return res.status(201).json({
      success: true,
      examAttempt
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

// SHOW QUESTIONS
export const showQuestions = async (req, res) => {
  try {

    const { examId } = req.params;

    const questions =
      await questionModel
        .find({ examId })
        .select("-correctAnswer");

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


export const submitExam = async (req, res) => {

try {

 
const { examId, answers } = req.body;

const studentId = req.user.id;

const questions = await questionModel.find({
  examId
});

console.log("QUESTIONS =", questions);

let score = 0;

const evaluatedAnswers = [];

for (let question of questions) {

  const studentAnswer = answers.find(
    ans =>
      ans.questionId.toString() ===
      question._id.toString()
  );

  if (!studentAnswer) continue;

  // MCQ Evaluation

  if (
    question.questionType === "mcq" ||
    question.questionType === "truefalse"
  ) {

    if (
      studentAnswer.selectedAnswer ===
      question.correctAnswer
    ) {

      score += question.marks;
    }

    evaluatedAnswers.push({
      questionId: question._id,
      selectedAnswer:
        studentAnswer.selectedAnswer
    });

  }

  // Subjective Evaluation

  else {

    console.log(
      "AI EVALUATION STARTED"
    );

    const aiResult =
      await evaluateAnswer(
        question.question,
        question.correctAnswer,
        studentAnswer.selectedAnswer,
        question.marks
      );

    console.log(
      "AI RESULT =",
      aiResult
    );

    score += Number(
      aiResult.score
    );

    evaluatedAnswers.push({
      questionId: question._id,

      selectedAnswer:
        studentAnswer.selectedAnswer,

      aiScore:
        aiResult.score,

      aiFeedback:
        aiResult.feedback
    });
  }
}

const examAttempt =
  await ExamAttemptModel.findOne({
    studentId,
    examId
  });

if (!examAttempt) {

  return res.status(404).json({
    message:
      "Exam attempt not found"
  });

}

let totalMarks = 0;

questions.forEach(q => {
  totalMarks += q.marks;
});

const percentage =
  (score / totalMarks) * 100;

examAttempt.answers =
  evaluatedAnswers;

examAttempt.score =
  score;

examAttempt.totalMarks =
  totalMarks;

examAttempt.percentage =
  percentage;

examAttempt.status =
  "submitted";

examAttempt.submittedAt =
  Date.now();

await examAttempt.save();

return res.status(200).json({
  success: true,
  score,
  percentage,
  answers:
    evaluatedAnswers
});


} catch (error) {


console.log(
  "SUBMIT ERROR =",
  error
);

return res.status(500).json({
  message:
    error.message
});


}
};



// STUDENT RESULT
export const getExamResults = async (req, res) => {
  try {

    const { examId } = req.params;
    const studentId = req.user.id;

    const examAttempt =
      await ExamAttemptModel.findOne({
        studentId,
        examId
      });

    if (!examAttempt) {
      return res.status(404).json({
        success: false,
        message: "Result not found"
      });
    }

    const exam =
      await examModel.findById(examId);

    const questions =
      await questionModel.find({
        examId
      });

    let totalMarks = 0;

    questions.forEach(q => {
      totalMarks += q.marks;
    });

return res.status(200).json({
  success: true,
  examName: exam.title,
  score: examAttempt.score,
  totalMarks,
  submittedTime:
    examAttempt.submittedAt,
  status:
    examAttempt.status,

  answers:
    examAttempt.answers
});

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// TEACHER RESULTS + ANALYTICS
export const getAllExamResults = async (req, res) => {
  try {

    const results =
      await ExamAttemptModel.find({
        examId: req.params.examId,
        status: "submitted"
      })
      .populate(
        "studentId",
        "name email"
      );

    const totalAttempts =
      results.length;

    const scores =
      results.map(
        r => r.score || 0
      );

    const highestScore =
      scores.length
        ? Math.max(...scores)
        : 0;

    const lowestScore =
      scores.length
        ? Math.min(...scores)
        : 0;

    const averageScore =
      scores.length
        ? (
            scores.reduce(
              (a, b) => a + b,
              0
            ) / scores.length
          ).toFixed(2)
        : 0;

    const leaderboard =
      [...results].sort(
        (a, b) =>
          b.score - a.score
      );

    res.status(200).json({
      success: true,
      results,
      analytics: {
        totalAttempts,
        highestScore,
        lowestScore,
        averageScore
      },
      leaderboard
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};