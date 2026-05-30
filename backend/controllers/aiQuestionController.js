import Groq from "groq-sdk";
import questionModel from "../models/QuestionModel.js";
import examModel from "../models/examModel.js";

export const generateQuestions = async (req, res) => {
  try {

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const {
      examId,
      topic,
      difficulty,
      numberOfQuestions,
    } = req.body;

    // validation
    if (
      !examId ||
      !topic ||
      !difficulty ||
      !numberOfQuestions
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check exam
    const exam =
      await examModel.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // AI prompt
    const prompt = `
Generate ${numberOfQuestions} MCQ questions on topic "${topic}".

Difficulty: ${difficulty}

Return ONLY valid JSON array.

Each object must follow this format:

[
  {
    "question":"What is JavaScript?",
    "options":[
      "Programming Language",
      "Database",
      "Operating System",
      "Browser"
    ],
    "correctAnswer":"Programming Language",
    "marks":5,
    "questionType":"mcq"
  }
]

Important:
- Use exact key correctAnswer
- Use exact key marks
- Use exact key questionType
- questionType must be mcq
- Return ONLY JSON
- No markdown
- No explanation
- No extra text
`;

    // Groq request
    const response =
      await groq.chat.completions.create({
        model:
          "llama-3.1-8b-instant",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    // raw AI response
    const aiResponse =
      response.choices[0]
        .message.content;

    console.log(
      "RAW AI:",
      aiResponse
    );

    // clean AI response
    const cleanedResponse =
      aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .trim();

    console.log(
      "CLEANED:",
      cleanedResponse
    );

    // parse JSON
    const generatedQuestions =
      JSON.parse(cleanedResponse);

    console.log(
      generatedQuestions
    );

    // save DB
    const savedQuestions = [];

    for (
      let question of generatedQuestions
    ) {

      const savedQuestion =
        await questionModel.create({
          examId,

          question:
            question.question,

          options:
            question.options || [],

          correctAnswer:
            question.correctAnswer ||
            question.correctanswer,

          marks:
            question.marks || 5,

          questionType:
            (
              question.questionType ||
              "mcq"
            ).toLowerCase(),
        });

      savedQuestions.push(
        savedQuestion
      );
    }

    return res.status(201).json({
      success: true,
      message:
        "AI questions generated successfully",
      totalQuestions:
        savedQuestions.length,
      questions:
        savedQuestions,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
      error:
        error.message,
    });
  }
};