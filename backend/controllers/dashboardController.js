import ExamModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";
import userModel from "../models/userModel.js";


// ======================================================
// STUDENT DASHBOARD
// ======================================================

export const studentDashboard = async (req, res) => {

  try {

    // ==================================================
    // STUDENT ID
    // ==================================================

    const studentId = req.user.id;


    // ==================================================
    // GET PUBLISHED EXAMS
    // ==================================================

    const publishedExams =
      await ExamModel.find({
        status: "published"
      })
      .sort({
        createdAt: -1
      });


    // ==================================================
    // TOTAL EXAMS
    // ==================================================

    const totalExams =
      publishedExams.length;


    // ==================================================
    // PUBLISHED EXAM IDS
    // ==================================================

    const publishedExamIds =
      publishedExams.map(
        exam => exam._id
      );


    // ==================================================
    // GET STUDENT ATTEMPTS
    // ==================================================

    const attempts =
      await ExamAttemptModel.find({
        studentId,

        examId: {
          $in: publishedExamIds
        }
      });


    // ==================================================
    // COMPLETED ATTEMPTS
    // ==================================================

    const completedAttempts =
      attempts.filter(
        attempt =>
          attempt.status === "submitted" ||
          attempt.status === "auto-submitted"
      );


    // ==================================================
    // PASSED EXAMS
    // ==================================================

    const passedExams =
      completedAttempts.filter(
        attempt =>
          Number(attempt.percentage || 0) >= 40
      ).length;


    // ==================================================
    // PENDING EXAMS
    // ==================================================

    const pendingExams =
      Math.max(
        0,
        totalExams -
          completedAttempts.length
      );


    // ==================================================
    // AVERAGE SCORE
    // ==================================================

    let averageScore = 0;

    if (
      completedAttempts.length > 0
    ) {

      const totalPercentage =
        completedAttempts.reduce(
          (sum, attempt) =>
            sum +
            Number(
              attempt.percentage || 0
            ),
          0
        );


      averageScore = Number(
        (
          totalPercentage /
          completedAttempts.length
        ).toFixed(2)
      );

    }


    // ==================================================
    // CREATE EXAM DATA FOR STUDENT
    // ==================================================

    const exams = await Promise.all(

      publishedExams.map(
        async (exam) => {

          // --------------------------------------------
          // COUNT QUESTIONS
          // --------------------------------------------

          const questionCount =
            await questionModel.countDocuments({
              examId: exam._id
            });


          // --------------------------------------------
          // CHECK WHETHER STUDENT ATTEMPTED
          // --------------------------------------------

          const attempted =
            completedAttempts.some(
              attempt =>
                String(
                  attempt.examId
                ) ===
                String(exam._id)
            );


          // --------------------------------------------
          // RETURN EXAM DATA
          // --------------------------------------------

          return {

            _id: exam._id,

            title: exam.title,

            description:
              exam.description,

            duration:
              exam.duration,

            totalMarks:
              exam.totalMarks,

            questionCount,

            // This is the due date
            endTime:
              exam.endTime,

            // Also send start time
            startTime:
              exam.startTime,

            status:
              exam.status,

            attempted

          };

        }
      )
    );


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,

      totalExams,

      passedExams,

      pendingExams,

      averageScore,

      exams,

      results:
        completedAttempts

    });


  } catch (error) {

    console.error(
      "STUDENT DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};



// ======================================================
// TEACHER DASHBOARD
// ======================================================

export const getTeacherDashboard = async (
  req,
  res
) => {

  try {

    const teacherId =
      req.user.id;


    // ==================================================
    // GET TEACHER EXAMS
    // ==================================================

    const exams =
      await ExamModel.find({
        teacherId
      })
      .sort({
        createdAt: -1
      });


    const totalExams =
      exams.length;


    // ==================================================
    // PUBLISHED EXAMS
    // ==================================================

    const publishedExams =
      exams.filter(
        exam =>
          exam.status === "published"
      ).length;


    // ==================================================
    // EXAM IDS
    // ==================================================

    const examIds =
      exams.map(
        exam => exam._id
      );


    // ==================================================
    // TOTAL QUESTIONS
    // ==================================================

    const totalQuestions =
      await questionModel.countDocuments({
        examId: {
          $in: examIds
        }
      });


    // ==================================================
    // TOTAL STUDENTS
    // ==================================================

    const totalStudents =
      await userModel.countDocuments({
        role: "student"
      });


    // ==================================================
    // ALL ATTEMPTS
    // ==================================================

    const attempts =
      await ExamAttemptModel.find({
        examId: {
          $in: examIds
        }
      });


    const totalAttempts =
      attempts.length;


    // ==================================================
    // COMPLETED ATTEMPTS
    // ==================================================

    const completedAttempts =
      attempts.filter(
        attempt =>
          attempt.status === "submitted" ||
          attempt.status === "auto-submitted"
      );


    // ==================================================
    // AVERAGE SCORE
    // ==================================================

    let averageScore = 0;

    if (
      completedAttempts.length > 0
    ) {

      const totalPercentage =
        completedAttempts.reduce(
          (sum, attempt) =>
            sum +
            Number(
              attempt.percentage || 0
            ),
          0
        );


      averageScore = Number(
        (
          totalPercentage /
          completedAttempts.length
        ).toFixed(2)
      );

    }


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,

      totalExams,

      publishedExams,

      totalQuestions,

      totalStudents,

      totalAttempts,

      averageScore,

      recentExams:
        exams

    });


  } catch (error) {

    console.error(
      "TEACHER DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};