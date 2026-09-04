import examModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";
import { evaluateAnswer } from "./aiEvaluationController.js";


// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Convert any answer into a clean string
const cleanAnswer = (answer) => {
  if (answer === null || answer === undefined) {
    return "";
  }

  return String(answer)
    .trim()
    .replace(/\s+/g, " ");
};


// ============================================================
// GET ACTUAL OPTION TEXT
//
// Examples:
//
// correctAnswer = "B"
// options = ["7","8","9","10"]
//
// returns "8"
//
// correctAnswer = "B) 8"
// returns "8"
//
// correctAnswer = "8"
// returns "8"
// ============================================================

const resolveAnswer = (answer, options = []) => {

  let value = cleanAnswer(answer);

  if (!value) {
    return "";
  }

  // ----------------------------------------------------------
  // Case 1:
  // "B) 8"
  // "C. 10"
  // "A - 7"
  // ----------------------------------------------------------

  const optionWithTextMatch =
    value.match(/^([A-Da-d])\s*[\)\.\-:]\s*(.+)$/);

  if (optionWithTextMatch) {

    const letter =
      optionWithTextMatch[1].toUpperCase();

    const index =
      letter.charCodeAt(0) - 65;

    if (
      Array.isArray(options) &&
      options[index] !== undefined
    ) {

      return cleanAnswer(options[index]);
    }

    return cleanAnswer(optionWithTextMatch[2]);
  }


  // ----------------------------------------------------------
  // Case 2:
  // Only option letter
  //
  // "A"
  // "B"
  // "C"
  // "D"
  // ----------------------------------------------------------

  const onlyLetterMatch =
    value.match(/^[A-Da-d]$/);

  if (onlyLetterMatch) {

    const letter =
      value.toUpperCase();

    const index =
      letter.charCodeAt(0) - 65;

    if (
      Array.isArray(options) &&
      options[index] !== undefined
    ) {

      return cleanAnswer(options[index]);
    }
  }


  // ----------------------------------------------------------
  // Case 3:
  // Already actual option text
  //
  // "8"
  // "10"
  // "Rs 3"
  // "Java"
  // ----------------------------------------------------------

  return value;
};


// ============================================================
// COMPARE ANSWERS
// ============================================================

const answersMatch = (
  studentAnswer,
  correctAnswer,
  options = []
) => {

  const student =
    resolveAnswer(
      studentAnswer,
      options
    );

  const correct =
    resolveAnswer(
      correctAnswer,
      options
    );

  console.log("Student raw:", studentAnswer);
  console.log("Correct raw:", correctAnswer);

  console.log("Student resolved:", student);
  console.log("Correct resolved:", correct);

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

    const studentId = req.user._id;


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!examId) {

      return res.status(400).json({

        success: false,

        message:
          "Exam Id is required."

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

        message:
          "Exam not found."

      });

    }


    // --------------------------------------------------------
    // PUBLISHED CHECK
    // --------------------------------------------------------

    if (
      exam.status !== "published"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Exam is not published."

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

        message:
          "Exam has not started yet."

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

        message:
          "Exam has already ended."

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

        message:
          "You have already attempted this exam."

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

        message:
          "No questions available."

      });

    }


    // --------------------------------------------------------
    // CREATE ATTEMPT
    // --------------------------------------------------------

    const examAttempt =
      await ExamAttemptModel.create({

        studentId,

        examId,

        status:
          "in-progress",

        startedAt:
          new Date()

      });


    return res.status(201).json({

      success: true,

      message:
        "Exam started successfully.",

      examAttempt,

      duration:
        exam.duration,

      totalQuestions

    });

  }

  catch (error) {

    console.error(
      "START EXAM ERROR:",
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
// SHOW QUESTIONS
// ============================================================

export const showQuestions = async (req, res) => {

  try {

    const { examId } =
      req.params;


    // --------------------------------------------------------
    // FIND EXAM
    // --------------------------------------------------------

    const exam =
      await examModel.findById(examId);


    if (!exam) {

      return res.status(404).json({

        success: false,

        message:
          "Exam not found."

      });

    }


    // --------------------------------------------------------
    // PUBLISHED CHECK
    // --------------------------------------------------------

    if (
      exam.status !== "published"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Exam is not available."

      });

    }


    // --------------------------------------------------------
    // GET QUESTIONS
    //
    // VERY IMPORTANT:
    // correctAnswer is NOT sent to student.
    // --------------------------------------------------------

    const questions =
      await questionModel
        .find({
          examId
        })
        .select("-correctAnswer")
        .sort({
          createdAt: 1
        });


    if (
      questions.length === 0
    ) {

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

    console.error(
      "SHOW QUESTIONS ERROR:",
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
// SUBMIT EXAM
// ============================================================

export const submitExam = async (req, res) => {

  try {

    const {
      examId,
      answers
    } = req.body;

    const studentId =
      req.user._id;


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      !examId ||
      !Array.isArray(answers)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Exam ID and answers are required."

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

        message:
          "Exam not found."

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

        message:
          "Exam attempt not found."

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

        message:
          "Exam already submitted."

      });

    }


    // --------------------------------------------------------
    // GET QUESTIONS
    // --------------------------------------------------------

    const questions =
      await questionModel
        .find({
          examId
        })
        .sort({
          createdAt: 1
        });


    if (
      questions.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "No questions found."

      });

    }


    // --------------------------------------------------------
    // SCORE VARIABLES
    // --------------------------------------------------------

    let score = 0;

    let correctCount = 0;

    let wrongCount = 0;

    let totalMarks = 0;

    const evaluatedAnswers = [];


    // ========================================================
    // CHECK EVERY QUESTION
    // ========================================================

    for (
      const question of questions
    ) {


      totalMarks +=
        Number(question.marks) || 0;


      // ------------------------------------------------------
      // FIND STUDENT ANSWER
      // ------------------------------------------------------

      const studentAnswer =
        answers.find(

          ans =>

            String(ans.questionId) ===
            String(question._id)

        );


      // ======================================================
      // NOT ATTEMPTED
      // ======================================================

      if (!studentAnswer) {

        wrongCount++;


        evaluatedAnswers.push({

          questionId:
            question._id,

          selectedAnswer:
            "",

          correctAnswer:
            resolveAnswer(
              question.correctAnswer,
              question.options
            ),

          isCorrect:
            false,

          obtainedMarks:
            0,

          aiScore:
            0,

          aiFeedback:
            "Not Attempted",

          timeTaken:
            0

        });


        continue;

      }


      // ======================================================
      // MCQ / TRUE FALSE
      // ======================================================

      if (

        question.questionType ===
          "mcq" ||

        question.questionType ===
          "truefalse"

      ) {


        const rawStudentAnswer =
          studentAnswer.selectedAnswer;


        const rawCorrectAnswer =
          question.correctAnswer;


        // ----------------------------------------------------
        // RESOLVE BOTH ANSWERS TO ACTUAL OPTION TEXT
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
          resolvedStudentAnswer
            .toLowerCase() ===
          resolvedCorrectAnswer
            .toLowerCase();


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
          "Options:",
          JSON.stringify(
            question.options
          )
        );

        console.log(
          "Raw Correct:",
          JSON.stringify(
            rawCorrectAnswer
          )
        );

        console.log(
          "Raw Student:",
          JSON.stringify(
            rawStudentAnswer
          )
        );

        console.log(
          "Resolved Correct:",
          JSON.stringify(
            resolvedCorrectAnswer
          )
        );

        console.log(
          "Resolved Student:",
          JSON.stringify(
            resolvedStudentAnswer
          )
        );

        console.log(
          "Matched:",
          isCorrect
        );

        console.log(
          "========================================"
        );


        // ----------------------------------------------------
        // MARKS
        // ----------------------------------------------------

        const obtainedMarks =
          isCorrect
            ? Number(question.marks)
            : 0;


        score +=
          obtainedMarks;


        if (isCorrect) {

          correctCount++;

        }

        else {

          wrongCount++;

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

          isCorrect:
            isCorrect,

          obtainedMarks:
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


      }


      // ======================================================
      // SUBJECTIVE
      // ======================================================

      else {


        const aiResult =
          await evaluateAnswer(

            question.question,

            question.correctAnswer,

            studentAnswer.selectedAnswer,

            question.marks

          );


        const aiScore =
          Number(aiResult.score) || 0;


        score +=
          aiScore;


        if (
          aiScore >=
          Number(question.marks) / 2
        ) {

          correctCount++;

        }

        else {

          wrongCount++;

        }


        evaluatedAnswers.push({

          questionId:
            question._id,

          selectedAnswer:
            studentAnswer.selectedAnswer,

          correctAnswer:
            question.correctAnswer,

          isCorrect:
            aiScore ===
            Number(question.marks),

          obtainedMarks:
            aiScore,

          aiScore:
            aiScore,

          aiFeedback:
            aiResult.feedback,

          timeTaken:
            studentAnswer.timeTaken || 0

        });

      }

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

    const passingMarks =
      exam.passingMarks || 40;


    const resultStatus =
      percentage >= passingMarks
        ? "Pass"
        : "Fail";


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

    examAttempt.result =
      resultStatus;

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
      "CORRECT:",
      correctCount
    );

    console.log(
      "WRONG:",
      wrongCount
    );

    console.log(
      "EVALUATED ANSWERS:"
    );

    console.log(

      JSON.stringify(
        evaluatedAnswers,
        null,
        2
      )

    );

    console.log(
      "========================================"
    );


    // ========================================================
    // SAVE TO DATABASE
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
      req.user._id;


    // --------------------------------------------------------
    // FIND ATTEMPT
    // --------------------------------------------------------

    const examAttempt =
      await ExamAttemptModel.findOne({

        studentId,

        examId,

        status:
          "submitted"

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


    console.log(
      "GET RESULT"
    );

    console.log(
      "Score:",
      examAttempt.score
    );

    console.log(
      "Answers:",
      JSON.stringify(
        examAttempt.answers,
        null,
        2
      )
    );


    return res.status(200).json({

      success: true,

      exam: {

        title:
          exam.title,

        subject:
          exam.subject,

        duration:
          exam.duration

      },

      result: {

        score:
          examAttempt.score,

        totalMarks:
          examAttempt.totalMarks,

        percentage:
          examAttempt.percentage,

        correctAnswers:
          examAttempt.correctCount,

        wrongAnswers:
          examAttempt.wrongCount,

        status:
          examAttempt.result,

        submittedAt:
          examAttempt.submittedAt

      },

      answers:
        examAttempt.answers

    });

  }

  catch (error) {

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


    const results =
      await ExamAttemptModel.find({

        examId,

        status:
          "submitted"

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


    const totalAttempts =
      results.length;


    let highestScore = 0;

    let lowestScore =
      results[0].score;

    let totalScore = 0;

    let passCount = 0;

    let failCount = 0;


    results.forEach(
      item => {

        totalScore +=
          item.score;


        if (
          item.score >
          highestScore
        ) {

          highestScore =
            item.score;

        }


        if (
          item.score <
          lowestScore
        ) {

          lowestScore =
            item.score;

        }


        if (
          item.percentage >=
          40
        ) {

          passCount++;

        }

        else {

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


    const leaderboard =
      results.map(

        (student, index) => ({

          rank:
            index + 1,

          studentName:
            student.studentId.name,

          email:
            student.studentId.email,

          score:
            student.score,

          percentage:
            student.percentage

        })

      );


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
      req.user._id;


    const history =
      await ExamAttemptModel.find({

        studentId,

        status:
          "submitted"

      })

      .populate(
        "examId",
        "title subject duration"
      )

      .sort({
        submittedAt: -1
      });


    return res.status(200).json({

      success: true,

      total:
        history.length,

      history

    });

  }

  catch (error) {

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