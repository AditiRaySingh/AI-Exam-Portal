import Groq from "groq-sdk";
import questionModel from "../models/QuestionModel.js";
import examModel from "../models/examModel.js";

export const generateQuestions = async (req, res) => {
try {


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const {
  examId,
  topic,
  difficulty,
  questionType,
  numberOfQuestions
} = req.body;

if (
  !examId ||
  !topic ||
  !difficulty ||
  !questionType ||
  !numberOfQuestions
) {
  return res.status(400).json({
    success: false,
    message: "All fields are required"
  });
}

const exam =
  await examModel.findById(examId);

if (!exam) {
  return res.status(404).json({
    success: false,
    message: "Exam not found"
  });
}

let prompt = "";

if (questionType === "mcq") {

  prompt = `


Generate ${numberOfQuestions} MCQ questions on "${topic}"

Difficulty: ${difficulty}

Return ONLY JSON array.

[
{
"question":"Question here",
"options":["A","B","C","D"],
"correctAnswer":"A",
"marks":5,
"questionType":"mcq"
}
]
`;


}

else if (
  questionType === "truefalse"
) {

  prompt = `


Generate ${numberOfQuestions} True False questions on "${topic}"

Difficulty: ${difficulty}

Return ONLY JSON array.

[
{
"question":"Java is platform independent",
"options":["True","False"],
"correctAnswer":"True",
"marks":2,
"questionType":"truefalse"
}
]
`;


}

else if (
  questionType === "shortanswer"
) {

  prompt = `


Generate ${numberOfQuestions} Short Answer questions on "${topic}"

Difficulty: ${difficulty}

Return ONLY JSON array.

[
{
"question":"Explain polymorphism",
"correctAnswer":"Polymorphism allows objects to take many forms.",
"marks":5,
"questionType":"shortanswer"
}
]
`;


}

else if (
  questionType ===
  "veryshortanswer"
) {

  prompt = `


Generate ${numberOfQuestions} Very Short Answer questions on "${topic}"

Difficulty: ${difficulty}

Return ONLY JSON array.

[
{
"question":"What is JVM?",
"correctAnswer":"Java Virtual Machine",
"marks":1,
"questionType":"veryshortanswer"
}
]
`;


}

const response =
  await groq.chat.completions.create({
    model:
      "llama-3.1-8b-instant",

    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

const aiResponse =
  response.choices[0]
    .message.content;

console.log(
  "RAW AI RESPONSE:",
  aiResponse
);

const cleanedResponse =
  aiResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const generatedQuestions =
  JSON.parse(cleanedResponse);

const savedQuestions = [];

for (
  let question of generatedQuestions
) {

  const exists =
    await questionModel.findOne({
      examId,
      question:
        question.question
    });

  if (exists) continue;

  const savedQuestion =
    await questionModel.create({
      examId,
      topic,

      question:
        question.question,

      options:
        question.options || [],

      correctAnswer:
        question.correctAnswer,

      marks:
        question.marks || 5,

      questionType:
        question.questionType,

      difficulty
    });

  savedQuestions.push(
    savedQuestion
  );
}

return res.status(201).json({
  success: true,
  message:
    "AI Questions Generated Successfully",
  totalQuestions:
    savedQuestions.length,
  questions:
    savedQuestions
});


}

catch (error) {


console.log(error);

return res.status(500).json({
  success: false,
  message:
    "Internal Server Error",
  error: error.message
});


}
};
