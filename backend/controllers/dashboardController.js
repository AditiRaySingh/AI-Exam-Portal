import ExamModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";
import userModel from "../models/userModel.js";

export const studentDashboard = async (req, res) => {
  try {

    const studentId = req.user.id;

    const totalExams =
      await ExamModel.countDocuments();

    const attempts =
      await ExamAttemptModel.find({
        studentId
      });

    const passedExams =
      attempts.filter(
        a => a.percentage >= 40
      ).length;

    const pendingExams =
      totalExams - attempts.length;

    let averageScore = 0;

    if (attempts.length > 0) {

      averageScore =
        (
          attempts.reduce(
            (sum, item) =>
              sum + (item.percentage || 0),
            0
          ) / attempts.length
        ).toFixed(2);

    }

    const exams =
      await ExamModel.find({
        status: "published"
      });

    res.status(200).json({
      success: true,
      totalExams,
      passedExams,
      pendingExams,
      averageScore,
      exams,
      results: attempts
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getTeacherDashboard = async (req, res) => {

  try {

    const teacherId = req.user.id;

    const exams =
      await ExamModel.find({
        teacherId
      });

    const totalExams =
      exams.length;

    const publishedExams =
      exams.filter(
        exam =>
          exam.status === "published"
      ).length;

    const totalQuestions =
      await questionModel.countDocuments();

    const totalStudents =
      await userModel.countDocuments({
        role: "student"
      });

    res.status(200).json({
      totalExams,
      publishedExams,
      totalQuestions,
      totalStudents,
      recentExams: exams
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};