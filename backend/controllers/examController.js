import examModel from "../models/examModel.js";
import {
evaluateAnswer
}
from "./aiEvaluationController.js";
// create the exam
export const exam = async (req, res) => {
    try {

        const {
            title,
            subject,
            description,
            duration,
            totalMarks,
            startTime,
            endTime
        } = req.body;

        const teacherId = req.user.id;

        if (
            !title ||
            !subject ||
            !description ||
            !duration ||
            !totalMarks ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message: "all field is required to fill"
            });
        }

        const newExam = await examModel.create({
            title,
            subject,
            description,
            duration,
            totalMarks,
            startTime,
            endTime,
            teacherId
        });

        return res.status(201).json({
            message: "exam created successfully",
            exam: newExam
        });

    } catch (error) {

        return res.status(500).json({
            message: "internal server error"
        });
    }
};

// get all exams

export const getExam= async (req, res) => {

    try {

      const exams = await examModel.find({
  teacherId: req.user.id
});

        // fixed variable name
        if (!exams || exams.length === 0) {
            return res.status(404).json({
                message: "No exams found"
            });
        }

        return res.status(200).json({
            message: "All exam fetched successfully",
            exams
        });

    } catch (error) {

        return res.status(500).json({
            message: "internal server error"
        });
    }
};

// delete exam

export const deleteExam = async (req, res) => {

    try {

        const examId = req.params.id;

        const exam = await examModel.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message: "exam not found"
            });
        }

        if (exam.teacherId.toString() !== req.user.id) {
            return res.status(400).json({
                message: "only teacher who created the exam can delete it"
            });
        }

        await examModel.findByIdAndDelete(examId);

        // fixed status + removed unreachable return
        return res.status(200).json({
            message: "exam deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "internal server error"
        });
    }
};

// update exam

export const updateExam = async (req, res) => {

    try {

        const examId = req.params.id;

        const exam = await examModel.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message: "exam not found"
            });
        }

        if (exam.teacherId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "only teacher who created the exam can update it"
            });
        }

        await examModel.findByIdAndUpdate(
            examId,
            req.body,
            { new: true }
        );

        return res.status(200).json({
            message: "exam updated successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "internal server error"
        });
    }
};

export const publishExam = async (req, res) => {
try {


const examId = req.params.id;

const exam =
  await examModel.findById(examId);

if (!exam) {
  return res.status(404).json({
    success: false,
    message: "Exam not found"
  });
}

const questions =
  await questionModel.find({
    examId
  });

if (questions.length === 0) {
  return res.status(400).json({
    success: false,
    message:
      "Add at least one question before publishing"
  });
}

let totalMarks = 0;

questions.forEach((q) => {
  totalMarks += q.marks;
});

exam.totalMarks = totalMarks;
exam.status = "published";

await exam.save();

return res.status(200).json({
  success: true,
  message:
    "Exam published successfully",
  exam
});

} catch (error) {


return res.status(500).json({
  success: false,
  message: error.message
});


}
};
