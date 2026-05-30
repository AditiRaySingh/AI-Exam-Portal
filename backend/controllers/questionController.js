import questionModel from "../models/QuestionModel.js";
import examModel from "../models/examModel.js";
export const questionDesign = async (req, res) => {
    try {

        const teacherId = req.user.id;
        const { examId, question, options, correctAnswer, marks, questionType } = req.body;
        if (!examId || !question || !options || !correctAnswer || !marks || !questionType) {
            return res.status(400).json({ message: "all field are required to filled" })
        }
        const exam = await examModel.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }
        // ownership check
        if (exam.teacherId.toString() !== teacherId) {
            return res.status(403).json({
                message: "Only teacher who created the exam can add questions"
            });
        }
        const validQuestionTypes = ["mcq", "truefalse", "shortanswer"];
        if (!validQuestionTypes.includes(questionType)) {
            return res.status(400).json({
                message: "invalid question type"
            })
        }
        if (questionType === "mcq") {
            if (!options || !Array.isArray(options) || options.length < 2) {
                return res.status(400).json({
                    message: "mcq must have options"
                })
            }
        }
        if (isNaN(marks) || Number(marks) <= 0) {
            return res.status(400).json({
                message: "Marks must be a valid number greater than 0",
            });
        }
        const newQuestion = await questionModel.create({
            examId,
            question,
            options,
            correctAnswer,
            marks,
            questionType
        });

        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            question: newQuestion,
        });


    }
    catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
}

// get questions

export const getQuestion = async (req, res) => {
    try {

        const Questions = await questionModel.find();
        if (!Questions && Questions.length === 0) {
            return res.status(404).json({
                message: "NO questions found"
            })
        }
        return res.status(200).json({
            message: "all questions feched successfully", Questions
        })

    }
    catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
}


// update questions 

export const updateQuestion = async (req, res) => {
    try {

        const { questions, options, correctanswer, questionType, marks } = req.body;
        const { id } = req.params;
        if (!questions || !options || !correctanswer || !questionType || !marks) {
            return res.status(201).send(message, "all filed are required to filled")
        }
        const updateQuestion = await questionModel.findByIdAndUpdate(id, {
            question,
            options,
            correctanswer,
            questionType,
            marks
        },
            {
                new: true
            })

        if (!updateQuestion) {
            return res.status(404).json({
                message: "Question not found"
            })
        }
        return res.status(200).json({
            message:
                "question updated succesfully", updateQuestion
        })

    }

    catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
}


// delete questions

export const deleteQuestion=async(req,res)=>{
    try{

        const{id}=req.params;
        const deleteQuestion=await questionModel.findByIdAndDelete();
        if(!deleteQuestion){
            return res.status(404).send({message:"question is not deleted"});

        }
         return res.status(200).json({
            message:
                "question deleted succesfully", updateQuestion
        })

    }
   catch (error) {

    console.log(error);

    return res.status(500).json({
        message: "internal server error",
        error: error.message
    });
} 
    
}