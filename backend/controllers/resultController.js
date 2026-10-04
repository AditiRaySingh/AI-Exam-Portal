import examModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";


// =====================================================
// START EXAM
// =====================================================

export const startExam = async (req, res) => {
  try {

    const { examId } = req.body;

    const studentId = req.user.id;

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: "Exam ID is required"
      });
    }


    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }


    // Exam must be published

    if (
      exam.status !== "published" ||
      exam.isPublished !== true
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam is not available"
      });
    }


    // Check exam timing

    const now = new Date();

    if (
      exam.startTime &&
      now < new Date(exam.startTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam has not started yet"
      });
    }


    if (
      exam.endTime &&
      now > new Date(exam.endTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Exam has already ended"
      });
    }


    // Check previous attempt

    const alreadyAttempt =
      await ExamAttemptModel.findOne({
        studentId,
        examId
      });


    if (alreadyAttempt) {

      return res.status(409).json({
        success: false,
        message: "You already attempted this exam",
        alreadyAttempted: true
      });

    }


    // Check questions

    const questionCount =
      await questionModel.countDocuments({
        examId
      });


    if (questionCount === 0) {
      return res.status(400).json({
        success: false,
        message: "This exam has no questions"
      });
    }


    const examAttempt =
      await ExamAttemptModel.create({

        studentId,

        examId,

        answers: [],

        score: 0,

        totalMarks:
          exam.totalMarks || 0,

        percentage: 0,

        correctCount: 0,

        wrongCount: 0,

        skippedCount: 0,

        result: "Fail",

        remarks: "",

        status: "in-progress",

        startedAt: new Date(),

        attemptNumber: 1,

        tabSwitches: 0,

        isCheatingDetected: false

      });


    return res.status(201).json({

      success: true,

      message:
        "Exam started successfully",

      examAttempt

    });


  } catch (error) {

    console.error(
      "START EXAM ERROR:",
      error
    );


    // Mongo duplicate key

    if (error.code === 11000) {

      return res.status(409).json({

        success: false,

        message:
          "You already attempted this exam",

        alreadyAttempted: true

      });

    }


    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

      error: error.message

    });

  }
};



// =====================================================
// SHOW QUESTIONS
// =====================================================

export const showQuestions = async (
  req,
  res
) => {

  try {

    const { examId } = req.params;


    const questions =
      await questionModel
        .find({
          examId
        })
        .select(
          "-correctAnswer -correctanswer"
        );


    if (
      !questions ||
      questions.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Questions not found"

      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Questions fetched successfully",

      questions

    });


  } catch (error) {

    console.error(
      "SHOW QUESTIONS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

      error: error.message

    });

  }

};



// =====================================================
// HELPER - NORMALIZE ANSWER
// =====================================================

const normalizeAnswer = (value) => {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();

};



// =====================================================
// HELPER - CHECK ANSWER
// =====================================================

const answersMatch = (
  selectedAnswer,
  correctAnswer
) => {

  const selected =
    normalizeAnswer(
      selectedAnswer
    );

  const correct =
    normalizeAnswer(
      correctAnswer
    );


  if (!selected || !correct) {
    return false;
  }


  // Direct match

  if (selected === correct) {
    return true;
  }


  // Remove option prefixes

  const removePrefix = (value) => {

    return value
      .replace(
        /^([a-d])[\s.)\-:]+/i,
        ""
      )
      .trim();

  };


  return (
    removePrefix(selected) ===
    removePrefix(correct)
  );

};



// =====================================================
// HELPER - GET CORRECT ANSWER
// =====================================================

const getCorrectAnswer = (question) => {

  return (
    question.correctAnswer ??
    question.correctanswer ??
    question.answer ??
    question.correct_option ??
    ""
  );

};



// =====================================================
// SUBMIT EXAM
// =====================================================

export const submitExam = async (
  req,
  res
) => {

  try {

    const {
      examId,
      answers = []
    } = req.body;


    const studentId =
      req.user.id;


    if (!examId) {

      return res.status(400).json({

        success: false,

        message:
          "Exam ID is required"

      });

    }


    if (!Array.isArray(answers)) {

      return res.status(400).json({

        success: false,

        message:
          "Answers must be an array"

      });

    }


    const exam =
      await examModel.findById(
        examId
      );


    if (!exam) {

      return res.status(404).json({

        success: false,

        message:
          "Exam not found"

      });

    }


    const examAttempt =
      await ExamAttemptModel.findOne({

        studentId,

        examId

      });


    if (!examAttempt) {

      return res.status(404).json({

        success: false,

        message:
          "Exam attempt not found"

      });

    }


    if (
      examAttempt.status ===
        "submitted" ||
      examAttempt.status ===
        "auto-submitted"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Exam already submitted"

      });

    }


    const questions =
      await questionModel.find({
        examId
      });


    if (
      !questions ||
      questions.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "No questions found"

      });

    }


    // =========================================
    // CALCULATE RESULT
    // =========================================

    let score = 0;

    let correctCount = 0;

    let wrongCount = 0;

    let skippedCount = 0;


    const evaluatedAnswers = [];


    for (
      let i = 0;
      i < questions.length;
      i++
    ) {

      const question =
        questions[i];


      const submittedAnswer =
        answers.find(
          (answer) =>
            String(
              answer.questionId
            ) ===
            String(
              question._id
            )
        );


      const selectedAnswer =
        submittedAnswer?.selectedAnswer ??
        submittedAnswer?.answer ??
        "";


      const marks =
        Number(
          question.marks || 1
        );


      const correctAnswer =
        getCorrectAnswer(
          question
        );


      // =====================================
      // SKIPPED
      // =====================================

      if (
        !selectedAnswer ||
        normalizeAnswer(
          selectedAnswer
        ) === ""
      ) {

        skippedCount++;


        evaluatedAnswers.push({

          questionId:
            question._id,

          selectedAnswer:
            "",

          correctAnswer,

          obtainedMarks: 0,

          isCorrect: false,

          aiFeedback:
            "Question was not attempted."

        });


        continue;

      }


      // =====================================
      // CHECK ANSWER
      // =====================================

      const isCorrect =
        answersMatch(
          selectedAnswer,
          correctAnswer
        );


      if (isCorrect) {

        correctCount++;

        score += marks;


        evaluatedAnswers.push({

          questionId:
            question._id,

          selectedAnswer,

          correctAnswer,

          obtainedMarks:
            marks,

          isCorrect: true,

          aiFeedback:
            "Correct answer."

        });

      }

      else {

        wrongCount++;


        let obtainedMarks = 0;


        // Negative marking

        if (
          exam.negativeMarking === true
        ) {

          const negativeMarks =
            Number(
              exam.negativeMarks || 0
            );


          if (
            negativeMarks > 0
          ) {

            score -=
              negativeMarks;

          }

        }


        evaluatedAnswers.push({

          questionId:
            question._id,

          selectedAnswer,

          correctAnswer,

          obtainedMarks,

          isCorrect: false,

          aiFeedback:
            "Incorrect answer."

        });

      }

    }


    // =========================================
    // TOTAL MARKS
    // =========================================

    const totalMarks =
      questions.reduce(
        (
          total,
          question
        ) =>
          total +
          Number(
            question.marks || 1
          ),
        0
      );


    // =========================================
    // PERCENTAGE
    // =========================================

    let percentage = 0;


    if (totalMarks > 0) {

      percentage =
        (score / totalMarks) *
        100;

    }


    // Prevent negative percentage

    if (percentage < 0) {
      percentage = 0;
    }


    // Round percentage

    percentage =
      Number(
        percentage.toFixed(2)
      );


    // =========================================
    // PASSING MARKS
    // =========================================

    const passingMarks =
      Number(
        exam.passingMarks || 40
      );


    const resultStatus =
      percentage >= passingMarks
        ? "Pass"
        : "Fail";


    // =========================================
    // REMARKS
    // =========================================

    let remarks = "";


    if (
      percentage >= 90
    ) {

      remarks =
        "Outstanding performance.";

    }

    else if (
      percentage >= 75
    ) {

      remarks =
        "Excellent performance.";

    }

    else if (
      percentage >= 60
    ) {

      remarks =
        "Good performance.";

    }

    else if (
      percentage >= passingMarks
    ) {

      remarks =
        "Passed successfully.";

    }

    else {

      remarks =
        "Needs improvement.";

    }


    // =========================================
    // TIME TAKEN
    // =========================================

    const submittedAt =
      new Date();


    const startedAt =
      examAttempt.startedAt ||
      submittedAt;


    const timeTaken =
      Math.max(
        0,
        Math.floor(
          (
            submittedAt -
            new Date(startedAt)
          ) / 1000
        )
      );


    // =========================================
    // SAVE ATTEMPT
    // =========================================

    examAttempt.answers =
      evaluatedAnswers;


    examAttempt.score =
      Math.max(
        0,
        Number(
          score.toFixed(2)
        )
      );


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
      submittedAt;


    examAttempt.timeTaken =
      timeTaken;


    await examAttempt.save();


    console.log(
      "================================"
    );

    console.log(
      "EXAM SUBMITTED"
    );

    console.log(
      "Exam:",
      examId
    );

    console.log(
      "Student:",
      studentId
    );

    console.log(
      "FINAL SCORE:",
      examAttempt.score
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
      "SKIPPED:",
      skippedCount
    );

    console.log(
      "RESULT:",
      resultStatus
    );

    console.log(
      "================================"
    );


    return res.status(200).json({

      success: true,

      message:
        "Exam submitted successfully",

      result: {

        score:
          examAttempt.score,

        totalMarks,

        percentage,

        correctAnswers:
          correctCount,

        wrongAnswers:
          wrongCount,

        skippedAnswers:
          skippedCount,

        result:
          resultStatus,

        remarks

      }

    });


  } catch (error) {

    console.error(
      "SUBMIT EXAM ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

      error: error.message

    });

  }

};



// =====================================================
// GET SINGLE EXAM RESULT
// =====================================================

export const getExamResults = async (
  req,
  res
) => {

  try {

    const {
      examId
    } = req.params;


    const studentId =
      req.user.id;


    console.log(
      "================================"
    );

    console.log(
      "GET EXAM RESULT"
    );

    console.log(
      "Exam ID:",
      examId
    );

    console.log(
      "Student ID:",
      studentId
    );


    const examAttempt =
      await ExamAttemptModel.findOne({

        studentId,

        examId

      })
      .populate(
        "examId",
        "title subject duration totalMarks passingMarks"
      );


    if (!examAttempt) {

      return res.status(404).json({

        success: false,

        message:
          "Result not found"

      });

    }


    if (
      examAttempt.status !==
        "submitted" &&
      examAttempt.status !==
        "auto-submitted"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Exam has not been submitted yet"

      });

    }


    const exam =
      examAttempt.examId;


    const answerData =
      examAttempt.answers || [];


    console.log(
      "Result found"
    );

    console.log(
      "Score:",
      examAttempt.score
    );

    console.log(
      "Percentage:",
      examAttempt.percentage
    );


    return res.status(200).json({

      success: true,

      exam: {

        _id:
          exam?._id,

        title:
          exam?.title,

        subject:
          exam?.subject,

        duration:
          exam?.duration,

        totalMarks:
          exam?.totalMarks,

        passingMarks:
          exam?.passingMarks

      },


      result: {

        score:
          examAttempt.score || 0,

        totalMarks:
          examAttempt.totalMarks ||
          exam?.totalMarks ||
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
          examAttempt.result ||
          "Fail",

        remarks:
          examAttempt.remarks ||
          ""

      },


      answers:
        answerData

    });

  } catch (error) {

    console.error(
      "GET EXAM RESULT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};



// =====================================================
// GET ALL EXAM RESULTS - TEACHER
// =====================================================

export const getAllExamResults = async (
  req,
  res
) => {

  try {

    const {
      examId
    } = req.params;


    const attempts =
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
        "title subject duration totalMarks passingMarks"
      )
      .sort({
        score: -1
      });


    if (
      !attempts ||
      attempts.length === 0
    ) {

      return res.status(200).json({

        success: true,

        exam:
          null,

        analytics: {

          totalAttempts: 0,

          averageScore: 0,

          highestScore: 0,

          passCount: 0,

          failCount: 0

        },

        leaderboard: [],

        results: []

      });

    }


    const exam =
      attempts[0].examId;


    const totalAttempts =
      attempts.length;


    const totalScore =
      attempts.reduce(
        (
          sum,
          attempt
        ) =>
          sum +
          Number(
            attempt.score || 0
          ),
        0
      );


    const averageScore =
      totalAttempts > 0
        ? Number(
            (
              totalScore /
              totalAttempts
            ).toFixed(2)
          )
        : 0;


    const highestScore =
      Math.max(
        ...attempts.map(
          (attempt) =>
            Number(
              attempt.score || 0
            )
        )
      );


    const passCount =
      attempts.filter(
        (attempt) =>
          attempt.result ===
          "Pass"
      ).length;


    const failCount =
      attempts.filter(
        (attempt) =>
          attempt.result ===
          "Fail"
      ).length;


    const leaderboard =
      attempts.map(
        (
          attempt,
          index
        ) => ({

          rank:
            index + 1,

          studentId:
            attempt.studentId?._id,

          studentName:
            attempt.studentId?.name ||
            "Unknown Student",

          email:
            attempt.studentId?.email ||
            "",

          score:
            attempt.score || 0,

          totalMarks:
            attempt.totalMarks || 0,

          percentage:
            attempt.percentage || 0,

          result:
            attempt.result || "Fail"

        })
      );


    const results =
      attempts.map(
        (attempt) => ({

          _id:
            attempt._id,

          studentId:
            attempt.studentId,

          score:
            attempt.score || 0,

          totalMarks:
            attempt.totalMarks || 0,

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
            attempt.timeTaken || 0

        })
      );


    return res.status(200).json({

      success: true,

      exam,

      analytics: {

        totalAttempts,

        averageScore,

        highestScore,

        passCount,

        failCount

      },

      leaderboard,

      results

    });


  } catch (error) {

    console.error(
      "GET ALL EXAM RESULTS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};



// =====================================================
// GET STUDENT HISTORY
// =====================================================

export const getStudentHistory = async (
  req,
  res
) => {

  try {

    const studentId =
      req.user.id;


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


    const history =
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
            attempt.result ||
            "Fail",

          submittedAt:
            attempt.submittedAt,

          timeTaken:
            attempt.timeTaken || 0

        })
      );


    return res.status(200).json({

      success: true,

      history

    });


  } catch (error) {

    console.error(
      "GET STUDENT HISTORY ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};