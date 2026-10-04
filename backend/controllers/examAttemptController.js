import examModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";
import { evaluateAnswer } from "./aiEvaluationController.js";

// ============================================================
// HELPER: GET USER ID
// ============================================================

const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

// ============================================================
// HELPER: CLEAN ANSWER
// ============================================================

const cleanAnswer = (answer) => {
  if (answer === null || answer === undefined) {
    return "";
  }

  return String(answer)
    .trim()
    .replace(/\s+/g, " ");
};

// ============================================================
// HELPER: RESOLVE ANSWER
// ============================================================

const resolveAnswer = (answer, options = []) => {
  let value = cleanAnswer(answer);

  if (!value) {
    return "";
  }

  // ----------------------------------------------------------
  // Example:
  // B) 8
  // C. 10
  // A - 7
  // ----------------------------------------------------------

  const optionWithTextMatch = value.match(
    /^([A-Da-d])\s*[\)\.\-:]\s*(.+)$/
  );

  if (optionWithTextMatch) {
    const letter = optionWithTextMatch[1].toUpperCase();

    const index = letter.charCodeAt(0) - 65;

    if (
      Array.isArray(options) &&
      options[index] !== undefined
    ) {
      return cleanAnswer(options[index]);
    }

    return cleanAnswer(optionWithTextMatch[2]);
  }

  // ----------------------------------------------------------
  // Only option letter
  // A / B / C / D
  // ----------------------------------------------------------

  const onlyLetterMatch = value.match(/^[A-Da-d]$/);

  if (onlyLetterMatch) {
    const letter = onlyLetterMatch[0].toUpperCase();

    const index = letter.charCodeAt(0) - 65;

    if (
      Array.isArray(options) &&
      options[index] !== undefined
    ) {
      return cleanAnswer(options[index]);
    }
  }

  // ----------------------------------------------------------
  // Already actual answer
  // ----------------------------------------------------------

  return value;
};

// ============================================================
// HELPER: COMPARE ANSWERS
// ============================================================

const answersMatch = (
  studentAnswer,
  correctAnswer,
  options = []
) => {
  const student = resolveAnswer(
    studentAnswer,
    options
  );

  const correct = resolveAnswer(
    correctAnswer,
    options
  );

  return (
    student.toLowerCase() ===
    correct.toLowerCase()
  );
};

// ============================================================
// START EXAM
// ============================================================

export const startExam = async (req, res) => {
  try {
    const { examId } = req.body;

    const studentId = getUserId(req);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated."
      });
    }

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: "Exam Id is required."
      });
    }

    // --------------------------------------------------------
    // FIND EXAM
    // --------------------------------------------------------

    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    // --------------------------------------------------------
    // PUBLISHED CHECK
    // --------------------------------------------------------

    if (exam.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Exam is not published."
      });
    }

    // --------------------------------------------------------
    // START TIME CHECK
    // --------------------------------------------------------

    if (
      exam.startTime &&
      new Date() < new Date(exam.startTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam has not started yet."
      });
    }

    // --------------------------------------------------------
    // END TIME CHECK
    // --------------------------------------------------------

    if (
      exam.endTime &&
      new Date() > new Date(exam.endTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam has already ended."
      });
    }

    // --------------------------------------------------------
    // CHECK EXISTING ATTEMPT
    // --------------------------------------------------------

    const alreadyAttempt =
      await ExamAttemptModel.findOne({
        studentId,
        examId
      });

    if (alreadyAttempt) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this exam."
      });
    }

    // --------------------------------------------------------
    // QUESTION COUNT
    // --------------------------------------------------------

    const totalQuestions =
      await questionModel.countDocuments({
        examId
      });

    if (totalQuestions === 0) {
      return res.status(400).json({
        success: false,
        message: "No questions available."
      });
    }

    // --------------------------------------------------------
    // CREATE ATTEMPT
    // --------------------------------------------------------

    const examAttempt =
      await ExamAttemptModel.create({
        studentId,
        examId,
        status: "in-progress",
        startedAt: new Date(),
        score: 0,
        totalMarks: 0,
        percentage: 0,
        correctCount: 0,
        wrongCount: 0,
        skippedCount: 0,
        result: "Fail",
        answers: []
      });

    return res.status(201).json({
      success: true,
      message: "Exam started successfully.",
      examAttempt,
      duration: exam.duration,
      totalQuestions
    });

  } catch (error) {
    console.error(
      "START EXAM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================
// SHOW QUESTIONS
// ============================================================

export const showQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    // --------------------------------------------------------
    // FIND EXAM
    // --------------------------------------------------------

    const exam =
      await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    // --------------------------------------------------------
    // PUBLISHED CHECK
    // --------------------------------------------------------

    if (exam.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Exam is not available."
      });
    }

    // --------------------------------------------------------
    // GET QUESTIONS
    // --------------------------------------------------------

    const questions =
      await questionModel
        .find({ examId })
        .select("-correctAnswer")
        .sort({ createdAt: 1 });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Questions not found."
      });
    }

    return res.status(200).json({
      success: true,
      totalQuestions: questions.length,
      questions
    });

  } catch (error) {
    console.error(
      "SHOW QUESTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================
// SUBMIT EXAM
// ============================================================

export const submitExam = async (req, res) => {
  try {
    const {
      examId,
      answers
    } = req.body;

    const studentId = getUserId(req);

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated."
      });
    }

    if (
      !examId ||
      !Array.isArray(answers)
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam ID and answers are required."
      });
    }

    // --------------------------------------------------------
    // FIND EXAM
    // --------------------------------------------------------

    const exam =
      await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    // --------------------------------------------------------
    // FIND ATTEMPT
    // --------------------------------------------------------

    const examAttempt =
      await ExamAttemptModel.findOne({
        studentId,
        examId
      });

    if (!examAttempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found."
      });
    }

    // --------------------------------------------------------
    // ALREADY SUBMITTED
    // --------------------------------------------------------

    if (
      examAttempt.status === "submitted"
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam already submitted."
      });
    }

    // --------------------------------------------------------
    // GET QUESTIONS
    // --------------------------------------------------------

    const questions =
      await questionModel
        .find({ examId })
        .sort({ createdAt: 1 });

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No questions found."
      });
    }

    // ========================================================
    // SCORE VARIABLES
    // ========================================================

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let totalMarks = 0;

    const evaluatedAnswers = [];

    // ========================================================
    // CHECK EVERY QUESTION
    // ========================================================

    for (const question of questions) {

      // ------------------------------------------------------
      // ADD QUESTION MARKS
      // ------------------------------------------------------

      const questionMarks =
        Number(question.marks) || 0;

      totalMarks += questionMarks;

      // ------------------------------------------------------
      // FIND STUDENT ANSWER
      // ------------------------------------------------------

      const studentAnswer =
        answers.find(
          (ans) =>
            String(ans.questionId) ===
            String(question._id)
        );

      // ======================================================
      // NOT ATTEMPTED = SKIPPED
      // ======================================================

      if (
        !studentAnswer ||
        !cleanAnswer(studentAnswer.selectedAnswer)
      ) {

        skippedCount++;

        evaluatedAnswers.push({
          questionId: question._id,

          selectedAnswer: "",

          correctAnswer:
            resolveAnswer(
              question.correctAnswer,
              question.options
            ),

          isCorrect: false,

          obtainedMarks: 0,

          aiScore: 0,

          aiFeedback: "Not Attempted",

          timeTaken:
            studentAnswer?.timeTaken || 0
        });

        continue;
      }

      // ======================================================
      // MCQ / TRUE FALSE
      // ======================================================

      if (
        question.questionType === "mcq" ||
        question.questionType === "truefalse"
      ) {

        const rawStudentAnswer =
          studentAnswer.selectedAnswer;

        const rawCorrectAnswer =
          question.correctAnswer;

        // ----------------------------------------------------
        // RESOLVE ANSWERS
        // ----------------------------------------------------

        const resolvedStudentAnswer =
          resolveAnswer(
            rawStudentAnswer,
            question.options
          );

        const resolvedCorrectAnswer =
          resolveAnswer(
            rawCorrectAnswer,
            question.options
          );

        // ----------------------------------------------------
        // COMPARE
        // ----------------------------------------------------

        const isCorrect =
          answersMatch(
            rawStudentAnswer,
            rawCorrectAnswer,
            question.options
          );

        // ----------------------------------------------------
        // MARKS
        // ----------------------------------------------------

        let obtainedMarks = 0;

        if (isCorrect) {

          obtainedMarks =
            questionMarks;

          score += obtainedMarks;

          correctCount++;

        } else {

          // --------------------------------------------------
          // WRONG ANSWER
          // --------------------------------------------------

          wrongCount++;

          // --------------------------------------------------
          // NEGATIVE MARKING
          // --------------------------------------------------

          if (
            exam.negativeMarking === true
          ) {

            const negativeMarks =
              Number(exam.negativeMarks) || 0;

            score -= negativeMarks;
          }
        }

        // ----------------------------------------------------
        // SAVE ANSWER
        // ----------------------------------------------------

        evaluatedAnswers.push({

          questionId:
            question._id,

          selectedAnswer:
            resolvedStudentAnswer,

          correctAnswer:
            resolvedCorrectAnswer,

          isCorrect,

          obtainedMarks,

          aiScore:
            obtainedMarks,

          aiFeedback:
            isCorrect
              ? `Correct! Your answer "${resolvedStudentAnswer}" is correct.`
              : `Incorrect. Your answer "${resolvedStudentAnswer}" is wrong. The correct answer is "${resolvedCorrectAnswer}".`,

          timeTaken:
            studentAnswer.timeTaken || 0
        });

        // ----------------------------------------------------
        // DEBUG
        // ----------------------------------------------------

        console.log(
          "========================================"
        );

        console.log(
          "Question:",
          question.question
        );

        console.log(
          "Raw Student:",
          rawStudentAnswer
        );

        console.log(
          "Raw Correct:",
          rawCorrectAnswer
        );

        console.log(
          "Resolved Student:",
          resolvedStudentAnswer
        );

        console.log(
          "Resolved Correct:",
          resolvedCorrectAnswer
        );

        console.log(
          "Is Correct:",
          isCorrect
        );

        console.log(
          "Obtained Marks:",
          obtainedMarks
        );

        console.log(
          "========================================"
        );
      }

      // ======================================================
      // SUBJECTIVE QUESTION
      // ======================================================

      else {

        const aiResult =
          await evaluateAnswer(
            question.question,
            question.correctAnswer,
            studentAnswer.selectedAnswer,
            questionMarks
          );

        const aiScore =
          Number(aiResult.score) || 0;

        score += aiScore;

        // ----------------------------------------------------
        // CORRECT / WRONG
        // ----------------------------------------------------

        if (
          aiScore >=
          questionMarks / 2
        ) {

          correctCount++;

        } else {

          wrongCount++;
        }

        // ----------------------------------------------------
        // SAVE SUBJECTIVE ANSWER
        // ----------------------------------------------------

        evaluatedAnswers.push({

          questionId:
            question._id,

          selectedAnswer:
            studentAnswer.selectedAnswer,

          correctAnswer:
            question.correctAnswer,

          isCorrect:
            aiScore === questionMarks,

          obtainedMarks:
            aiScore,

          aiScore,

          aiFeedback:
            aiResult.feedback,

          timeTaken:
            studentAnswer.timeTaken || 0
        });
      }
    }

    // ========================================================
    // PREVENT NEGATIVE SCORE
    // ========================================================

    if (score < 0) {
      score = 0;
    }

    // ========================================================
    // PERCENTAGE
    // ========================================================

    const percentage =
      totalMarks === 0
        ? 0
        : Number(
            (
              (score / totalMarks) *
              100
            ).toFixed(2)
          );

    // ========================================================
    // PASS / FAIL
    // ========================================================
    //
    // PASSING RULE:
    // 40% OR ABOVE = PASS
    //
    // Example:
    // 10/10 = 100% = PASS
    // 4/10  = 40%  = PASS
    // 3/10  = 30%  = FAIL
    //
    // ========================================================

    const passingPercentage = 40;

    const resultStatus =
      percentage >= passingPercentage
        ? "Pass"
        : "Fail";

    // ========================================================
    // REMARKS
    // ========================================================

    let remarks = "";

    if (percentage >= 80) {

      remarks =
        "Outstanding Performance";

    } else if (percentage >= 60) {

      remarks =
        "Good Performance";

    } else if (percentage >= 40) {

      remarks =
        "Passed. Keep improving.";

    } else {

      remarks =
        "Needs Improvement";
    }

    // ========================================================
    // SAVE RESULT
    // ========================================================

    examAttempt.answers =
      evaluatedAnswers;

    examAttempt.score =
      score;

    examAttempt.totalMarks =
      totalMarks;

    examAttempt.percentage =
      percentage;

    examAttempt.correctCount =
      correctCount;

    examAttempt.wrongCount =
      wrongCount;

    examAttempt.skippedCount =
      skippedCount;

    examAttempt.result =
      resultStatus;

    examAttempt.remarks =
      remarks;

    examAttempt.status =
      "submitted";

    examAttempt.submittedAt =
      new Date();

    // ========================================================
    // DEBUG FINAL RESULT
    // ========================================================

    console.log(
      "========================================"
    );

    console.log(
      "FINAL SCORE:",
      score
    );

    console.log(
      "TOTAL MARKS:",
      totalMarks
    );

    console.log(
      "PERCENTAGE:",
      percentage
    );

    console.log(
      "PASSING PERCENTAGE:",
      passingPercentage
    );

    console.log(
      "RESULT:",
      resultStatus
    );

    console.log(
      "CORRECT:",
      correctCount
    );

    console.log(
      "WRONG:",
      wrongCount
    );

    console.log(
      "SKIPPED:",
      skippedCount
    );

    console.log(
      "========================================"
    );

    // ========================================================
    // SAVE DATABASE
    // ========================================================

    await examAttempt.save();

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({

      success: true,

      message:
        "Exam submitted successfully.",

      result: {

        score,

        totalMarks,

        percentage,

        result:
          resultStatus,

        correctAnswers:
          correctCount,

        wrongAnswers:
          wrongCount,

        skippedAnswers:
          skippedCount,

        remarks
      },

      answers:
        evaluatedAnswers
    });

  } catch (error) {

    console.error(
      "SUBMIT EXAM ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};

// ============================================================
// STUDENT RESULT
// ============================================================

export const getExamResults = async (
  req,
  res
) => {

  try {

    const { examId } =
      req.params;

    const studentId =
      getUserId(req);

    if (!studentId) {

      return res.status(401).json({

        success: false,

        message:
          "User not authenticated."
      });
    }

    // --------------------------------------------------------
    // FIND ATTEMPT
    // --------------------------------------------------------

    const examAttempt =
      await ExamAttemptModel.findOne({

        studentId,

        examId,

        status: {
          $in: [
            "submitted",
            "auto-submitted"
          ]
        }
      });

    if (!examAttempt) {

      return res.status(404).json({

        success: false,

        message:
          "Result not found."
      });
    }

    // --------------------------------------------------------
    // FIND EXAM
    // --------------------------------------------------------

    const exam =
      await examModel.findById(
        examId
      );

    if (!exam) {

      return res.status(404).json({

        success: false,

        message:
          "Exam not found."
      });
    }

    // --------------------------------------------------------
    // DEBUG
    // --------------------------------------------------------

    console.log(
      "GET RESULT"
    );

    console.log(
      "Score:",
      examAttempt.score
    );

    console.log(
      "Total Marks:",
      examAttempt.totalMarks
    );

    console.log(
      "Percentage:",
      examAttempt.percentage
    );

    console.log(
      "Result:",
      examAttempt.result
    );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({

      success: true,

      exam: {

        _id:
          exam._id,

        title:
          exam.title,

        subject:
          exam.subject,

        duration:
          exam.duration,

        totalMarks:
          exam.totalMarks,

        passingMarks:
          exam.passingMarks
      },

      result: {

        score:
          examAttempt.score || 0,

        totalMarks:
          examAttempt.totalMarks ||
          exam.totalMarks ||
          0,

        percentage:
          examAttempt.percentage || 0,

        correctAnswers:
          examAttempt.correctCount || 0,

        wrongAnswers:
          examAttempt.wrongCount || 0,

        skippedAnswers:
          examAttempt.skippedCount || 0,

        result:
          examAttempt.result || "Fail",

        remarks:
          examAttempt.remarks || "",

        submittedAt:
          examAttempt.submittedAt
      },

      answers:
        examAttempt.answers || []
    });

  } catch (error) {

    console.error(
      "GET RESULT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};

// ============================================================
// TEACHER ANALYTICS
// ============================================================

export const getAllExamResults =
async (req, res) => {

  try {

    const { examId } =
      req.params;

    // --------------------------------------------------------
    // FIND EXAM
    // --------------------------------------------------------

    const exam =
      await examModel.findById(
        examId
      );

    if (!exam) {

      return res.status(404).json({

        success: false,

        message:
          "Exam not found."
      });
    }

    // --------------------------------------------------------
    // GET RESULTS
    // --------------------------------------------------------

    const results =
      await ExamAttemptModel.find({

        examId,

        status: {
          $in: [
            "submitted",
            "auto-submitted"
          ]
        }

      })

        .populate(
          "studentId",
          "name email"
        )

        .populate(
          "examId",
          "title subject"
        )

        .sort({
          score: -1
        });

    if (
      results.length === 0
    ) {

      return res.status(200).json({

        success: true,

        message:
          "No student has attempted this exam.",

        results: []
      });
    }

    // --------------------------------------------------------
    // ANALYTICS
    // --------------------------------------------------------

    const totalAttempts =
      results.length;

    let highestScore = 0;

    let lowestScore =
      results[0].score || 0;

    let totalScore = 0;

    let passCount = 0;

    let failCount = 0;

    results.forEach(
      (item) => {

        const itemScore =
          Number(item.score) || 0;

        const itemPercentage =
          Number(item.percentage) || 0;

        totalScore +=
          itemScore;

        if (
          itemScore >
          highestScore
        ) {

          highestScore =
            itemScore;
        }

        if (
          itemScore <
          lowestScore
        ) {

          lowestScore =
            itemScore;
        }

        // Same 40% rule
        if (
          itemPercentage >= 40
        ) {

          passCount++;

        } else {

          failCount++;
        }
      }
    );

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

    // --------------------------------------------------------
    // LEADERBOARD
    // --------------------------------------------------------

    const leaderboard =
      results.map(
        (student, index) => ({

          rank:
            index + 1,

          studentName:
            student.studentId?.name ||
            "Unknown",

          email:
            student.studentId?.email ||
            "",

          score:
            student.score || 0,

          percentage:
            student.percentage || 0,

          result:
            student.result || "Fail"
        })
      );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

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

  } catch (error) {

    console.error(
      "ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};

// ============================================================
// STUDENT HISTORY
// ============================================================

export const getStudentHistory =
async (req, res) => {

  try {

    const studentId =
      getUserId(req);

    if (!studentId) {

      return res.status(401).json({

        success: false,

        message:
          "User not authenticated."
      });
    }

    const history =
      await ExamAttemptModel.find({

        studentId,

        status: {
          $in: [
            "submitted",
            "auto-submitted"
          ]
        }

      })

        .populate(
          "examId",
          "title subject duration totalMarks passingMarks"
        )

        .sort({
          submittedAt: -1
        });

    // --------------------------------------------------------
    // FORMAT HISTORY
    // --------------------------------------------------------

    const results =
      history.map(
        (attempt) => ({

          _id:
            attempt._id,

          exam:
            attempt.examId,

          score:
            attempt.score || 0,

          totalMarks:
            attempt.totalMarks ||
            attempt.examId?.totalMarks ||
            0,

          percentage:
            attempt.percentage || 0,

          correctCount:
            attempt.correctCount || 0,

          wrongCount:
            attempt.wrongCount || 0,

          skippedCount:
            attempt.skippedCount || 0,

          result:
            attempt.result || "Fail",

          submittedAt:
            attempt.submittedAt,

          timeTaken:
            attempt.timeTaken || 0,

          answers:
            attempt.answers || []
        })
      );

    return res.status(200).json({

      success: true,

      total:
        results.length,

      history:
        results,

      results
    });

  } catch (error) {

    console.error(
      "STUDENT HISTORY ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};

// ============================================================
// GET STUDENT RESULTS
// ============================================================

export const getStudentResults = async (
  req,
  res
) => {

  try {

    const studentId =
      getUserId(req);

    if (!studentId) {

      return res.status(401).json({

        success: false,

        message:
          "User not authenticated."
      });
    }

    const attempts =
      await ExamAttemptModel.find({

        studentId,

        status: {
          $in: [
            "submitted",
            "auto-submitted"
          ]
        }

      })

        .populate(
          "examId",
          "title subject duration totalMarks passingMarks"
        )

        .sort({
          createdAt: -1
        });

    // --------------------------------------------------------
    // FORMAT RESULTS
    // --------------------------------------------------------

    const results =
      attempts.map(
        (attempt) => ({

          _id:
            attempt._id,

          exam:
            attempt.examId,

          score:
            attempt.score || 0,

          totalMarks:
            attempt.totalMarks ||
            attempt.examId?.totalMarks ||
            0,

          percentage:
            attempt.percentage || 0,

          correctCount:
            attempt.correctCount || 0,

          wrongCount:
            attempt.wrongCount || 0,

          skippedCount:
            attempt.skippedCount || 0,

          result:
            attempt.result || "Fail",

          submittedAt:
            attempt.submittedAt,

          timeTaken:
            attempt.timeTaken || 0,

          answers:
            attempt.answers || []
        })
      );

    return res.status(200).json({

      success: true,

      results
    });

  } catch (error) {

    console.error(
      "GET STUDENT RESULTS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};