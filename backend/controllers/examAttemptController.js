import examModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";
import { evaluateAnswer } from "./aiEvaluationController.js";


// ==========================================
// START EXAM
// ==========================================

export const startExam = async (req, res) => {

  try {

    const { examId } = req.body;

    const studentId = req.user._id;

    if (!examId) {

      return res.status(400).json({
        success: false,
        message: "Exam Id is required."
      });

    }

    const exam =
      await examModel.findById(examId);

    if (!exam) {

      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });

    }

    // Published Check

    if (exam.status !== "published") {

      return res.status(400).json({
        success: false,
        message: "Exam is not published."
      });

    }

    // Start Time Check

    if (new Date() < new Date(exam.startTime)) {

      return res.status(400).json({

        success: false,

        message:
          "Exam has not started yet."

      });

    }

    // End Time Check

    if (new Date() > new Date(exam.endTime)) {

      return res.status(400).json({

        success: false,

        message:
          "Exam has already ended."

      });

    }

    // Already Attempted

    console.log("Student ID:", studentId.toString());
console.log("Exam ID:", examId);

   const alreadyAttempt = await ExamAttemptModel.findOne({
  studentId,
  examId
});

console.log("Already Attempt:", alreadyAttempt);

if (alreadyAttempt) {
  return res.status(400).json({
    success: false,
    message: "You have already attempted this exam."
  });
}

    const totalQuestions =
      await questionModel.countDocuments({
        examId
      });

    if (totalQuestions === 0) {

      return res.status(400).json({

        success: false,

        message:
          "No questions available."

      });

    }

    const examAttempt =
      await ExamAttemptModel.create({

        studentId,

        examId,

        status: "in-progress",

        startedAt: Date.now()

      });

    return res.status(201).json({

      success: true,

      message:
        "Exam started successfully.",

      examAttempt,

      duration: exam.duration,

      totalQuestions

    });

  }

 catch (error) {

  console.log("START EXAM ERROR:");
  console.log(error);

  return res.status(500).json({
    success: false,
    message: error.message
  });

}

};



// ==========================================
// SHOW QUESTIONS
// ==========================================

export const showQuestions = async (req, res) => {

  try {

    const { examId } = req.params;

    const exam =
      await examModel.findById(examId);

    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Exam not found."

      });

    }

    if (exam.status !== "published") {

      return res.status(400).json({

        success: false,

        message:
          "Exam is not available."

      });

    }

    const questions =
      await questionModel

      .find({
        examId
      })

      .select("-correctAnswer")

      .sort({
        createdAt: 1
      });

    if (questions.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          "Questions not found."

      });

    }

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



// ==========================================
// SUBMIT EXAM
// ==========================================

export const submitExam = async (req, res) => {

  try {

    const { examId, answers } = req.body;

    const studentId = req.user._id;

    if (!examId || !answers) {

      return res.status(400).json({
        success: false,
        message: "Exam ID and answers are required."
      });

    }

    const exam = await examModel.findById(examId);

    if (!exam) {

      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });

    }

    const examAttempt = await ExamAttemptModel.findOne({
      studentId,
      examId
    });

    if (!examAttempt) {

      return res.status(404).json({
        success: false,
        message: "Exam attempt not found."
      });

    }

    if (examAttempt.status === "submitted") {

      return res.status(400).json({
        success: false,
        message: "Exam already submitted."
      });

    }

    const questions = await questionModel.find({ examId });

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let totalMarks = 0;

    const evaluatedAnswers = [];

    for (const question of questions) {

      totalMarks += question.marks;

      const studentAnswer = answers.find(
        ans => ans.questionId.toString() === question._id.toString()
      );

      // ==========================
      // NOT ATTEMPTED
      // ==========================

      if (!studentAnswer) {

        wrongCount++;

        evaluatedAnswers.push({

          questionId: question._id,

          selectedAnswer: "",

          isCorrect: false,

          obtainedMarks: 0,

          aiScore: 0,

          aiFeedback: "Not Attempted",

          timeTaken: 0

        });

        continue;

      }
      // ==========================
      // MCQ & TRUE FALSE
      // ==========================

// ==========================
// MCQ & TRUE FALSE
// ==========================

if (
  question.questionType === "mcq" ||
  question.questionType === "truefalse"
) {




      console.log("================================");
console.log("Question:", question.question);
console.log("Options:", JSON.stringify(question.options));
console.log("Correct Answer:", JSON.stringify(question.correctAnswer));
console.log("Student Answer:", JSON.stringify(studentAnswer.selectedAnswer));

console.log(
  "Correct Length:",
  String(question.correctAnswer).length
);

console.log(
  "Student Length:",
  String(studentAnswer.selectedAnswer).length
);

const isCorrect =
  String(studentAnswer.selectedAnswer).trim() ===
  String(question.correctAnswer).trim();

console.log("Matched:", isCorrect);
console.log("================================");



  const obtainedMarks = isCorrect
    ? question.marks
    : 0;

  score += obtainedMarks;

  if (isCorrect) {
    correctCount++;
  } else {
    wrongCount++;
  }

 evaluatedAnswers.push({

  questionId: question._id,

  selectedAnswer: studentAnswer.selectedAnswer,

  correctAnswer: question.correctAnswer,

  isCorrect: isCorrect,

  obtainedMarks: obtainedMarks,

  aiScore: obtainedMarks,

  aiFeedback: isCorrect
    ? `Correct! Your answer "${studentAnswer.selectedAnswer}" is correct.`
    : `Incorrect. Your answer "${studentAnswer.selectedAnswer}" is wrong. The correct answer is "${question.correctAnswer}".`,

  timeTaken: 0

});

}
      // ==========================
      // SUBJECTIVE AI
      // ==========================
       else {

  const aiResult = await evaluateAnswer(

    question.question,

    question.correctAnswer,

    studentAnswer.selectedAnswer,

    question.marks

  );

  const aiScore = Number(aiResult.score) || 0;

  score += aiScore;

  if (aiScore >= question.marks / 2) {

    correctCount++;

  } else {

    wrongCount++;

  }

  evaluatedAnswers.push({

    questionId: question._id,

    selectedAnswer: studentAnswer.selectedAnswer,

    isCorrect: aiScore === question.marks,

    obtainedMarks: aiScore,

    aiScore: aiScore,

    aiFeedback: aiResult.feedback,

    timeTaken: 0

  });

}

    }



const percentage = Number(
  ((score / totalMarks) * 100).toFixed(2)
);

const resultStatus =
  percentage >= 40 ? "Pass" : "Fail";

// ==========================
// SAVE RESULT
// ==========================

examAttempt.answers = evaluatedAnswers;

examAttempt.score = score;

examAttempt.totalMarks = totalMarks;

examAttempt.percentage = percentage;

examAttempt.correctCount = correctCount;

examAttempt.wrongCount = wrongCount;

examAttempt.result = resultStatus;

examAttempt.status = "submitted";

examAttempt.submittedAt = new Date();

// ==========================
// DEBUG
// ==========================

console.log("Final Score:", score);

console.log("Evaluated Answers:");
console.log(JSON.stringify(evaluatedAnswers, null, 2));

await examAttempt.save();

const savedAttempt =
  await ExamAttemptModel.findById(examAttempt._id);

console.log("Saved Score:", savedAttempt.score);

console.log("Saved Answers:");
console.log(JSON.stringify(savedAttempt.answers, null, 2));


    return res.status(200).json({

      success: true,

      message:
        "Exam submitted successfully.",

      result: {

        score,

        totalMarks,

        percentage,

        resultStatus,

        correctAnswers:
          correctCount,

        wrongAnswers:
          wrongCount

      },

      answers:
        evaluatedAnswers

    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ==========================================
// STUDENT RESULT
// ==========================================

export const getExamResults = async (req, res) => {

  try {

    const { examId } = req.params;

    const studentId = req.user._id;

    const examAttempt =
      await ExamAttemptModel.findOne({
        studentId,
        examId,
        status: "submitted"
      });

    if (!examAttempt) {

      return res.status(404).json({
        success: false,
        message: "Result not found."
      });

    }

    const exam =
      await examModel.findById(examId);
      console.log("GET RESULT");
console.log("Score:", examAttempt.score);
console.log("Answers:", JSON.stringify(examAttempt.answers, null, 2));

    return res.status(200).json({

      success: true,

      exam: {

        title: exam.title,

        subject: exam.subject,

        duration: exam.duration

      },

      result: {

        score: examAttempt.score,

        totalMarks: examAttempt.totalMarks,

        percentage: examAttempt.percentage,

        correctAnswers:
          examAttempt.correctCount,

        wrongAnswers:
          examAttempt.wrongCount,
status: examAttempt.result,
        submittedAt:
          examAttempt.submittedAt

      },

      answers:
        examAttempt.answers

    });

  }

  catch (error) {

    console.log("GET RESULT");

console.log("Score:", examAttempt.score);

console.log("Answers:");

console.log(JSON.stringify(examAttempt.answers, null, 2));

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ==========================================
// TEACHER ANALYTICS
// ==========================================

export const getAllExamResults =
async (req, res) => {

  try {

    const { examId } = req.params;

    const exam =
      await examModel.findById(examId);

    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Exam not found."

      });

    }

    const results =
      await ExamAttemptModel.find({

        examId,

        status: "submitted"

      })

     .populate("studentId", "name email")
.populate("examId", "title subject")

      .sort({
        score: -1
      });

    if (results.length === 0) {

      return res.status(200).json({

        success: true,

        message:
          "No student has attempted this exam.",

        results: []

      });

    }

    const totalAttempts =
      results.length;

    let highestScore = 0;

    let lowestScore =
      results[0].score;

    let totalScore = 0;

    let passCount = 0;

    let failCount = 0;

    results.forEach((item) => {

      totalScore += item.score;

      if (item.score > highestScore)
        highestScore = item.score;

      if (item.score < lowestScore)
        lowestScore = item.score;

      if (item.percentage >= 40)
        passCount++;
      else
        failCount++;

    });

    const averageScore =
      Number(
        (
          totalScore /
          totalAttempts
        ).toFixed(2)
      );

    const passPercentage =
      Number(
        (
          (passCount /
            totalAttempts) *
          100
        ).toFixed(2)
      );

    const failPercentage =
      Number(
        (
          (failCount /
            totalAttempts) *
          100
        ).toFixed(2)
      );

    const leaderboard =
      results.map((student, index) => ({

        rank: index + 1,

        studentName:
          student.studentId.name,

        email:
          student.studentId.email,

        score:
          student.score,

        percentage:
          student.percentage

      }));

    return res.status(200).json({

      success: true,

      exam: {

        title:
          exam.title,

        subject:
          exam.subject

      },

      analytics: {

        totalAttempts,

        highestScore,

        lowestScore,

        averageScore,

        passCount,

        failCount,

        passPercentage,

        failPercentage

      },

      leaderboard,

      results

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ==========================================
// STUDENT HISTORY
// ==========================================

export const getStudentHistory = async (req, res) => {

  try {

    const studentId = req.user._id;

    const history = await ExamAttemptModel.find({
      studentId,
      status: "submitted"
    })
    .populate("examId", "title subject duration")
    .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      total: history.length,
      history
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};