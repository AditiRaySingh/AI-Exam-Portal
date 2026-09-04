import examModel from "../models/examModel.js";
import questionModel from "../models/QuestionModel.js";



import ExamAttemptModel from "../models/ExamAttemptModel.js";

export const startExam = async (req, res) => {

  try {

    const { examId } = req.body;

    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    if (exam.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Exam is not published"
      });
    }

    const attempt = await ExamAttemptModel.create({
      studentId: req.user._id,
      examId,
      status: "in-progress"
    });

    return res.status(200).json({
      success: true,
      message: "Exam started",
      attempt
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
// ============================
// CREATE EXAM
// ============================

export const createExam = async (req, res) => {
  try {

    const {
      title,
      subject,
      description,
      duration,
       totalMarks,
      startTime,
      endTime,
      instructions,
      passingMarks,
      negativeMarking,
      negativeMarks,
      shuffleQuestions,
      shuffleOptions,
      allowReview
    } = req.body;

    if (
      !title ||
      !subject ||
      !description ||
      !duration ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled."
      });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time."
      });
    }

    const alreadyExists =
      await examModel.findOne({
        title: title.trim()
      });

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Exam title already exists."
      });
    }

    const exam =
      await examModel.create({

        title: title.trim(),

        subject,

        description,

        duration,

        teacherId: req.user._id,

        startTime,

        endTime,
         totalMarks,

        instructions,

        passingMarks,

        negativeMarking,

        negativeMarks,

        shuffleQuestions,

        shuffleOptions,

        allowReview,

        status: "draft",

        isPublished: false
      });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully.",
      exam
    });

  }

  catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ============================
// GET MY EXAMS
// ============================

export const getExam = async (req, res) => {

  try {

    const exams =
      await examModel
        .find({
          teacherId: req.user._id
        })
        .sort({
          createdAt: -1
        });

    return res.status(200).json({
      success: true,
      exams
    });

  }

  catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ============================
// GET SINGLE EXAM
// ============================

export const getSingleExam = async (req, res) => {

  try {

    const exam =
      await examModel
        .findById(req.params.id)
        .populate(
          "teacherId",
          "name email"
        );

    if (!exam) {

      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });

    }

    return res.status(200).json({
      success: true,
      exam
    });

  }

  catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ============================
// UPDATE EXAM
// ============================

export const updateExam = async (req, res) => {

  try {

    const exam =
      await examModel.findById(
        req.params.id
      );

    if (!exam) {

      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });

    }

    if (
      exam.teacherId.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized."
      });

    }

    if (
      exam.status === "published"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Published exams cannot be edited."
      });

    }

    Object.assign(
      exam,
      req.body
    );

    await exam.save();

    return res.status(200).json({

      success: true,

      message:
        "Exam updated successfully.",

      exam

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
export const deleteExam = async (req, res) => {
  try {
    const exam = await examModel.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    if (
      !exam.teacherId ||
      exam.teacherId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized."
      });
    }

    await questionModel.deleteMany({
      examId: exam._id
    });

    await exam.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully."
    });

  }


catch (error) {
  console.log("DELETE ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);
  console.log("URL:", error.config?.url);

  alert(
    error.response?.data?.message ||
    "Delete Failed"
  );
}

};
// ============================
// PUBLISH EXAM
// ============================

export const publishExam = async (
  req,
  res
) => {

  try {

    const exam =
      await examModel.findById(
        req.params.id
      );

    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Exam not found."

      });

    }

    if (
      exam.teacherId.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({

        success: false,

        message: "Unauthorized."

      });

    }

    if (
      exam.status === "published"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Exam already published."

      });

    }

    const questions =
      await questionModel.find({

        examId: exam._id

      });

    if (
      questions.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please add questions first."

      });

    }

    const totalMarks =
      questions.reduce(
        (sum, q) => sum + q.marks,
        0
      );

    exam.totalMarks =
      totalMarks;

    exam.status =
      "published";

    exam.isPublished =
      true;

    await exam.save();

    return res.status(200).json({

      success: true,

      message:
        "Exam published successfully.",

      exam

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ============================
// GET ALL PUBLISHED EXAMS
// ============================

export const getPublishedExams = async (req, res) => {
  try {

    const exams = await examModel
      .find({
        isPublished: true
      })
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      exams
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};