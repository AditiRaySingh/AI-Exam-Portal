import fs from "fs";
import mammoth from "mammoth";
import Groq from "groq-sdk";
import { PdfReader } from "pdfreader";
import questionModel from "../models/QuestionModel.js";

function extractPdfText(filePath) {
  return new Promise((resolve, reject) => {
    let text = "";

    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(text);
      else if (item.text) text += item.text + " ";
    });
  });
}

export const generateFromMaterial = async (req, res) => {
  try {
    const {
      examId,
      difficulty,
      questionType,
      numberOfQuestions
    } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File required"
      });
    }

    let extractedText = "";

    // PDF
    if (file.mimetype === "application/pdf") {
      extractedText = await extractPdfText(file.path);
    }

    // DOCX
    else if (file.originalname.endsWith(".docx")) {
      const result = await mammoth.extractRawText({
        path: file.path
      });

      extractedText = result.value;
    }

    // TXT
    else {
      extractedText = fs.readFileSync(file.path, "utf8");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `
Study this material:

${extractedText.substring(0, 10000)}

Generate ${numberOfQuestions} ${questionType} questions.

Difficulty: ${difficulty}

IMPORTANT:
For MCQ:
- Return options as full text.
- correctAnswer should be ONLY A, B, C or D.

Return ONLY JSON.

[
  {
    "question":"Question",
    "options":["Option1","Option2","Option3","Option4"],
    "correctAnswer":"A",
    "marks":5,
    "questionType":"mcq"
  }
]
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const aiResponse = response.choices[0].message.content;

    console.log("RAW AI RESPONSE:");
    console.log(aiResponse);

    const cleaned = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleaned);

    const optionMap = {
      A: 0,
      B: 1,
      C: 2,
      D: 3
    };

    const savedQuestions = [];

    for (const q of questions) {

      let correctAnswer = q.correctAnswer;

      console.log("\n------------------------");
      console.log("Question:", q.question);
      console.log("Options:", q.options);
      console.log("Original Answer:", correctAnswer);

      if ((q.questionType || questionType) === "mcq") {

        let letter = String(correctAnswer)
          .toUpperCase()
          .trim();

        letter = letter
          .replace("OPTION", "")
          .replace("ANSWER:", "")
          .replace(".", "")
          .replace(")", "")
          .trim();

        console.log("Normalized Letter:", letter);

        if (
          optionMap.hasOwnProperty(letter) &&
          q.options &&
          q.options.length > optionMap[letter]
        ) {
          correctAnswer = q.options[optionMap[letter]];
        }

        console.log("Converted Answer:", correctAnswer);
      }

      console.log("Options:", q.options);
console.log("AI Correct:", q.correctAnswer);
console.log("Saving Correct:", correctAnswer);



      const saved = await questionModel.create({
        examId,
        topic: "Generated From Material",
        question: q.question,
        options: q.options || [],
        correctAnswer,
        marks: q.marks || 5,
        questionType: q.questionType || questionType,
        difficulty
      });

      console.log("Saved In Mongo:", saved.correctAnswer);

      savedQuestions.push(saved);
    }

    return res.status(201).json({
      success: true,
      message: "Questions generated successfully",
      totalQuestions: savedQuestions.length,
      questions: savedQuestions
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};