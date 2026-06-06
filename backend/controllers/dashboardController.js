import examModel from "../models/examModel.js";
import questionModel from "../models/QuestionModel.js";
import userModel from "../models/userModel.js";

export const getTeacherDashboard = async (req, res) => {
  try {

    const teacherId = req.user.id;

    const exams = await examModel.find({
      teacherId
      
    });
    console.log(exams);

console.log("Teacher ID:", teacherId);

console.log("All Exams:", exams);

    const totalExams = exams.length;

    const publishedExams =
      exams.filter(
        exam => exam.status === "published"
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