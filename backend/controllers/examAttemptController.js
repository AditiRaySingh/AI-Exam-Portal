import examModel from "../models/examModel.js";
import ExamAttemptModel from "../models/ExamAttemptModel.js";
import questionModel from "../models/QuestionModel.js";

// Start Exam
export const startExam = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    // find exam
    const exam = await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // check published
    if (exam.status !== "published") {
      return res.status(400).json({
        message: "Exam is not available",
      });
    }

    // check already attempted
    const alreadyAttempt = await ExamAttemptModel.findOne({
      studentId,
      examId,
    });

    if (alreadyAttempt) {
      return res.status(400).json({
        message: "You already attempted the exam",
      });
    }

    // create exam attempt
    const examAttempt =
      await ExamAttemptModel.create({
        studentId,
        examId,
        status: "in progress",
      });

    return res.status(201).json({
      success: true,
      message: "Exam started successfully",
      examAttempt,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Show Questions
export const showQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    const questions =
      await questionModel
        .find({ examId })
        .select("-correctAnswer");

    if (questions.length === 0) {
      return res.status(404).json({
        message: "Questions not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Submit Exam
export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user.id;

    // get questions
    const questions =
      await questionModel.find({ examId });

    if (questions.length === 0) {
      return res.status(404).json({
        message: "Questions not found",
      });
    }

    // calculate score
    let score = 0;

    for (let question of questions) {

      const studentAnswer = answers.find(
        (ans) =>
          ans.questionId.toString() ===
          question._id.toString()
      );

      // compare answers
      if (
        studentAnswer &&
        studentAnswer.selectedAnswer ===
          question.correctAnswer
      ) {
        score += question.marks;
      }
    }

    // find exam attempt
    const examAttempt =
      await ExamAttemptModel.findOne({
        studentId,
        examId,
      });

    if (!examAttempt) {
      return res.status(404).json({
        message: "Exam attempt not found",
      });
    }

    // update attempt
    examAttempt.answers = answers;
    examAttempt.score = score;
    examAttempt.status = "submitted";
    examAttempt.submittedAt = Date.now();

    await examAttempt.save();

    return res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      score,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



// getstudentresult...

export const   getExamResults=async(req,res)=>{
    try{

        const {examId}=req.params;
        const studentId=req.user.id;

        const examAttempt=await ExamAttemptModel.findOne({
            studentId,examId
        })

        if(!examAttempt)
        {
            return res.status(404).json({
        success: false,
        message: "Result not found",
      });
        }
 // find exam
        const exam=await examModel.findById(examId);

// calculate question
const questions=await questionModel.find({
    examId
})

let totalMarks=0;
for(let question of questions)
{
    totalMarks=totalMarks+question.marks;
}

return res.status(200).json({
    success:true,
    examName:exam.title,
    score:examAttempt.score,
    totalMarks,
    submittedTime:examAttempt.submittedAt,
    status:examAttempt.status,
})


    }
    catch(error)
    {
      return res.status(500).json({
        success:false,
      message: "Internal server error",
      error: error.message,
    });  
    }
}
