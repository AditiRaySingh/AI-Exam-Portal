import fs from "fs";
import mammoth from "mammoth";
import Groq from "groq-sdk";
import { PdfReader } from "pdfreader";
import questionModel from "../models/QuestionModel.js";

// ======================================================
// EXTRACT PDF TEXT
// ======================================================
function extractPdfText(filePath) {
  return new Promise((resolve, reject) => {
    let text = "";

    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) {
        reject(err);
        return;
      }

      // PDF finished
      if (!item) {
        resolve(text);
        return;
      }

      // Add PDF text
      if (item.text) {
        text += item.text + " ";
      }
    });
  });
}

// ======================================================
// NORMALIZE QUESTION TYPE
// ======================================================
function normalizeQuestionType(type) {
  return String(type || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

// ======================================================
// NORMALIZE TRUE / FALSE ANSWER
// ======================================================
function normalizeTrueFalseAnswer(answer) {
  if (answer === undefined || answer === null) {
    return null;
  }

  let value = String(answer)
    .trim()
    .toLowerCase();

  // Remove common AI formatting
  value = value
    .replace(/^answer\s*:\s*/i, "")
    .replace(/^option\s*/i, "")
    .replace(/\.$/, "")
    .replace(/\)$/, "")
    .trim();

  console.log(
    "True/False answer after cleaning:",
    value
  );

  // ------------------------------------------
  // AI returned A
  // ------------------------------------------
  if (value === "a") {
    return "True";
  }

  // ------------------------------------------
  // AI returned B
  // ------------------------------------------
  if (value === "b") {
    return "False";
  }

  // ------------------------------------------
  // AI returned True
  // ------------------------------------------
  if (value === "true") {
    return "True";
  }

  // ------------------------------------------
  // AI returned False
  // ------------------------------------------
  if (value === "false") {
    return "False";
  }

  // Invalid
  return null;
}

// ======================================================
// NORMALIZE MCQ ANSWER
// ======================================================
function normalizeMcqAnswer(answer, options) {
  if (
    answer === undefined ||
    answer === null ||
    !Array.isArray(options)
  ) {
    return null;
  }

  let value = String(answer).trim();

  // ------------------------------------------
  // Remove common AI formatting
  // ------------------------------------------

  value = value
    .replace(/^answer\s*:\s*/i, "")
    .replace(/^option\s*/i, "")
    .trim();

  console.log(
    "MCQ answer after cleaning:",
    value
  );

  // ------------------------------------------
  // A/B/C/D
  // ------------------------------------------

  if (/^[A-Da-d]$/.test(value)) {
    const letter = value.toUpperCase();

    const index =
      letter.charCodeAt(0) - 65;

    if (options[index] === undefined) {
      return null;
    }

    return String(options[index]).trim();
  }

  // ------------------------------------------
  // A. / B. / C. / D.
  // ------------------------------------------

  if (/^[A-Da-d][.)]$/.test(value)) {
    const letter =
      value.charAt(0).toUpperCase();

    const index =
      letter.charCodeAt(0) - 65;

    if (options[index] === undefined) {
      return null;
    }

    return String(options[index]).trim();
  }

  // ------------------------------------------
  // Actual option text
  // ------------------------------------------

  const matchingOption = options.find(
    (option) =>
      String(option)
        .trim()
        .toLowerCase() ===
      value.toLowerCase()
  );

  if (matchingOption !== undefined) {
    return String(matchingOption).trim();
  }

  return null;
}

// ======================================================
// GENERATE QUESTIONS FROM MATERIAL
// ======================================================
export const generateFromMaterial = async (req, res) => {
  let uploadedFilePath = null;

  try {
    // ==================================================
    // GET REQUEST DATA
    // ==================================================

    const {
      examId,
      difficulty,
      questionType,
      numberOfQuestions
    } = req.body;

    const file = req.file;

    console.log("\n========================================");
    console.log("GENERATE QUESTIONS FROM MATERIAL");
    console.log("========================================");

    console.log("Exam ID:", examId);
    console.log("Difficulty:", difficulty);
    console.log("Question Type:", questionType);
    console.log(
      "Number Of Questions:",
      numberOfQuestions
    );

    // ==================================================
    // VALIDATE FILE
    // ==================================================

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File required"
      });
    }

    uploadedFilePath = file.path;

    console.log("Uploaded file:", file.originalname);
    console.log("File type:", file.mimetype);
    console.log("File path:", file.path);

    // ==================================================
    // VALIDATE EXAM ID
    // ==================================================

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: "examId is required"
      });
    }

    // ==================================================
    // NORMALIZE QUESTION TYPE
    // ==================================================

    const requestedQuestionType =
      normalizeQuestionType(questionType);

    console.log(
      "Normalized Question Type:",
      requestedQuestionType
    );

    // ==================================================
    // VALIDATE QUESTION TYPE
    // ==================================================

    if (
      ![
        "mcq",
        "truefalse",
        "shortanswer"
      ].includes(requestedQuestionType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "questionType must be mcq, truefalse or shortanswer"
      });
    }

    // ==================================================
    // VALIDATE NUMBER OF QUESTIONS
    // ==================================================

    const totalQuestions =
      Number(numberOfQuestions);

    if (
      !Number.isInteger(totalQuestions) ||
      totalQuestions <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "numberOfQuestions must be a positive number"
      });
    }

    // ==================================================
    // EXTRACT MATERIAL TEXT
    // ==================================================

    let extractedText = "";

    // ==================================================
    // PDF
    // ==================================================

    if (
      file.mimetype === "application/pdf"
    ) {
      console.log("Reading PDF...");

      extractedText =
        await extractPdfText(file.path);
    }

    // ==================================================
    // DOCX
    // ==================================================

    else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.originalname
        .toLowerCase()
        .endsWith(".docx")
    ) {
      console.log("Reading DOCX...");

      const result =
        await mammoth.extractRawText({
          path: file.path
        });

      extractedText = result.value;
    }

    // ==================================================
    // TXT
    // ==================================================

    else if (
      file.mimetype === "text/plain" ||
      file.originalname
        .toLowerCase()
        .endsWith(".txt")
    ) {
      console.log("Reading TXT...");

      extractedText =
        fs.readFileSync(
          file.path,
          "utf8"
        );
    }

    // ==================================================
    // UNSUPPORTED FILE
    // ==================================================

    else {
      return res.status(400).json({
        success: false,
        message:
          "Only PDF, DOCX and TXT files are supported"
      });
    }

    // ==================================================
    // CHECK EXTRACTED TEXT
    // ==================================================

    if (
      !extractedText ||
      extractedText.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from the uploaded file"
      });
    }

    console.log(
      "Extracted text length:",
      extractedText.length
    );

    // ==================================================
    // CHECK GROQ API KEY
    // ==================================================

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "GROQ_API_KEY is missing in .env"
      });
    }

    // ==================================================
    // CREATE GROQ CLIENT
    // ==================================================

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // ==================================================
    // LIMIT MATERIAL
    // ==================================================

    const material =
      extractedText
        .trim()
        .substring(0, 10000);

    // ==================================================
    // AI PROMPT
    // ==================================================

    const prompt = `
You are an expert exam question generator.

Read the following study material carefully.

================ MATERIAL ================
${material}
============================================

Generate exactly ${totalQuestions} questions.

Requested Question Type:
${requestedQuestionType}

Difficulty:
${difficulty || "medium"}

========================================================
GENERAL RULES
========================================================

1. Questions MUST be based ONLY on the provided material.
2. Do not invent unrelated information.
3. Each question must have one clearly correct answer.
4. marks must always be 5.
5. questionType must be exactly "${requestedQuestionType}".
6. Return ONLY valid JSON.
7. Do not use markdown.
8. Do not write anything outside the JSON object.

========================================================
IF QUESTION TYPE = MCQ
========================================================

Generate exactly 4 options.

The options must be complete answer texts.

correctAnswer MUST be the COMPLETE TEXT of the correct option.

IMPORTANT:
NEVER return A, B, C or D as correctAnswer.

The correctAnswer must exactly match one of the four options.

Example:

{
  "question": "What is HTML?",
  "options": [
    "HyperText Markup Language",
    "HighText Machine Language",
    "Hyper Tool Markup Language",
    "Home Tool Markup Language"
  ],
  "correctAnswer": "HyperText Markup Language",
  "marks": 5,
  "questionType": "mcq"
}

========================================================
IF QUESTION TYPE = TRUEFALSE
========================================================

Generate a statement based ONLY on the material.

The options MUST ALWAYS be exactly:

[
  "True",
  "False"
]

There MUST be exactly 2 options.

correctAnswer MUST ALWAYS be exactly:

"True"

OR

"False"

NEVER return:

"A"
"B"
"C"
"D"

Example:

{
  "question": "The number 7 is greater than 5.",
  "options": [
    "True",
    "False"
  ],
  "correctAnswer": "True",
  "marks": 5,
  "questionType": "truefalse"
}

========================================================
IF QUESTION TYPE = SHORTANSWER
========================================================

options MUST be an empty array.

correctAnswer must contain the expected answer.

Example:

{
  "question": "What is HTML?",
  "options": [],
  "correctAnswer": "HyperText Markup Language",
  "marks": 5,
  "questionType": "shortanswer"
}

========================================================
VERY IMPORTANT
========================================================

Before returning each question:

- Verify the correct answer.
- For MCQ, verify correctAnswer matches one option.
- For True/False, verify correctAnswer is exactly True or False.
- For True/False, options MUST contain only True and False.
- Do not return A/B/C/D for True/False.
- Do not duplicate True/False options.

========================================================
FINAL JSON FORMAT
========================================================

{
  "questions": [
    {
      "question": "Question text",
      "options": [],
      "correctAnswer": "Correct answer",
      "marks": 5,
      "questionType": "${requestedQuestionType}"
    }
  ]
}
`;

    // ==================================================
    // SEND REQUEST TO GROQ
    // ==================================================

    console.log(
      "Sending request to Groq..."
    );

    const response =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.2,

        response_format: {
          type: "json_object"
        }
      });

    // ==================================================
    // GET AI RESPONSE
    // ==================================================

    const aiResponse =
      response
        ?.choices?.[0]
        ?.message
        ?.content;

    console.log("\n========================================");
    console.log("RAW AI RESPONSE");
    console.log("========================================");

    console.log(aiResponse);

    console.log("========================================\n");

    // ==================================================
    // EMPTY AI RESPONSE
    // ==================================================

    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        message:
          "Groq returned an empty response"
      });
    }

    // ==================================================
    // PARSE JSON
    // ==================================================

    let parsed;

    try {
      parsed = JSON.parse(aiResponse);
    } catch (jsonError) {
      console.error(
        "JSON PARSE ERROR:",
        jsonError
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid JSON",
        rawResponse: aiResponse
      });
    }

    // ==================================================
    // GET QUESTIONS
    // ==================================================

    let questions;

    // AI normally returns:
    //
    // {
    //   "questions": [...]
    // }

    if (
      parsed &&
      Array.isArray(parsed.questions)
    ) {
      questions = parsed.questions;
    }

    // Also support direct array
    else if (Array.isArray(parsed)) {
      questions = parsed;
    }

    else {
      return res.status(500).json({
        success: false,
        message:
          "AI response does not contain a questions array"
      });
    }

    // ==================================================
    // CHECK QUESTIONS
    // ==================================================

    console.log(
      "Questions generated:",
      questions.length
    );

    if (questions.length === 0) {
      return res.status(500).json({
        success: false,
        message:
          "AI did not generate any questions"
      });
    }

    // ==================================================
    // SAVED QUESTIONS ARRAY
    // ==================================================

    const savedQuestions = [];

    // ==================================================
    // PROCESS EACH QUESTION
    // ==================================================

    for (const q of questions) {
      try {
        console.log("\n========================================");
        console.log("PROCESSING QUESTION");
        console.log("========================================");

        console.log(
          "Question:",
          q.question
        );

        console.log(
          "AI Options:",
          q.options
        );

        console.log(
          "AI Answer:",
          q.correctAnswer
        );

        console.log(
          "AI Question Type:",
          q.questionType
        );

        // =================================================
        // VALIDATE QUESTION TEXT
        // =================================================

        if (
          !q.question ||
          String(q.question).trim().length === 0
        ) {
          console.log(
            "Skipping question because question text is missing"
          );

          continue;
        }

        // =================================================
        // NORMALIZE QUESTION TYPE
        // =================================================

        const currentQuestionType =
          normalizeQuestionType(
            q.questionType ||
              requestedQuestionType
          );

        console.log(
          "Normalized Question Type:",
          currentQuestionType
        );

        // =================================================
        // FORCE REQUESTED QUESTION TYPE
        // =================================================

        if (
          currentQuestionType !==
          requestedQuestionType
        ) {
          console.log(
            "AI returned different question type."
          );

          console.log(
            "Requested:",
            requestedQuestionType
          );

          console.log(
            "Received:",
            currentQuestionType
          );

          continue;
        }

        // =================================================
        // VARIABLES
        // =================================================

        let options = [];
        let correctAnswer = null;

        // =================================================
        // MCQ
        // =================================================

        if (
          currentQuestionType === "mcq"
        ) {
          console.log(
            "\nProcessing MCQ..."
          );

          // ----------------------------------------------
          // Validate options
          // ----------------------------------------------

          if (
            !Array.isArray(q.options)
          ) {
            console.log(
              "Skipping MCQ: options is not an array"
            );

            continue;
          }

          if (
            q.options.length !== 4
          ) {
            console.log(
              "Skipping MCQ: exactly 4 options required"
            );

            continue;
          }

          // ----------------------------------------------
          // Clean options
          // ----------------------------------------------

          options =
            q.options.map(
              (option) =>
                String(option).trim()
            );

          // ----------------------------------------------
          // Make sure options are not empty
          // ----------------------------------------------

          if (
            options.some(
              (option) => option.length === 0
            )
          ) {
            console.log(
              "Skipping MCQ: empty option found"
            );

            continue;
          }

          // ----------------------------------------------
          // Normalize answer
          // ----------------------------------------------

          correctAnswer =
            normalizeMcqAnswer(
              q.correctAnswer,
              options
            );

          console.log(
            "Final MCQ Correct Answer:",
            correctAnswer
          );

          // ----------------------------------------------
          // Validate answer
          // ----------------------------------------------

          if (!correctAnswer) {
            console.log(
              "Skipping MCQ: correct answer does not match any option"
            );

            continue;
          }
        }

        // =================================================
        // TRUE / FALSE
        // =================================================

        else if (
          currentQuestionType ===
          "truefalse"
        ) {
          console.log(
            "\nProcessing True/False..."
          );

          // ----------------------------------------------
          // IMPORTANT
          // NEVER use AI options here.
          //
          // Even if AI returns:
          //
          // ["True","False","True","False"]
          //
          // we replace them.
          // ----------------------------------------------

          options = [
            "True",
            "False"
          ];

          // ----------------------------------------------
          // Normalize answer
          // ----------------------------------------------

          correctAnswer =
            normalizeTrueFalseAnswer(
              q.correctAnswer
            );

          console.log(
            "AI True/False Answer:",
            q.correctAnswer
          );

          console.log(
            "Final True/False Answer:",
            correctAnswer
          );

          console.log(
            "Final True/False Options:",
            options
          );

          // ----------------------------------------------
          // Validate answer
          // ----------------------------------------------

          if (
            correctAnswer !== "True" &&
            correctAnswer !== "False"
          ) {
            console.log(
              "Skipping question: invalid True/False answer"
            );

            continue;
          }
        }

        // =================================================
        // SHORT ANSWER
        // =================================================

        else if (
          currentQuestionType ===
          "shortanswer"
        ) {
          console.log(
            "\nProcessing Short Answer..."
          );

          options = [];

          // ----------------------------------------------
          // Normalize answer
          // ----------------------------------------------

          if (
            q.correctAnswer ===
              undefined ||
            q.correctAnswer ===
              null ||
            String(q.correctAnswer)
              .trim()
              .length === 0
          ) {
            console.log(
              "Skipping short answer: correct answer missing"
            );

            continue;
          }

          correctAnswer =
            String(
              q.correctAnswer
            ).trim();

          console.log(
            "Final Short Answer:",
            correctAnswer
          );
        }

        // =================================================
        // UNKNOWN TYPE
        // =================================================

        else {
          console.log(
            "Skipping unknown question type:",
            currentQuestionType
          );

          continue;
        }

        // =================================================
        // FINAL VALIDATION
        // =================================================

        if (!correctAnswer) {
          console.log(
            "Skipping because final correctAnswer is empty"
          );

          continue;
        }

        // =================================================
        // FINAL TRUE/FALSE VALIDATION
        // =================================================

        if (
          currentQuestionType ===
          "truefalse"
        ) {
          if (
            correctAnswer !== "True" &&
            correctAnswer !== "False"
          ) {
            console.log(
              "True/False validation failed"
            );

            continue;
          }

          // Force exact options
          options = [
            "True",
            "False"
          ];
        }

        // =================================================
        // FINAL MCQ VALIDATION
        // =================================================

        if (
          currentQuestionType ===
          "mcq"
        ) {
          const answerExists =
            options.some(
              (option) =>
                String(option)
                  .trim()
                  .toLowerCase() ===
                String(correctAnswer)
                  .trim()
                  .toLowerCase()
            );

          if (!answerExists) {
            console.log(
              "MCQ final validation failed"
            );

            continue;
          }
        }

        // =================================================
        // SAVE TO MONGODB
        // =================================================

        console.log(
          "\nSaving question to MongoDB..."
        );

        const saved =
          await questionModel.create({
            examId,

            topic:
              "Generated From Material",

            question:
              String(
                q.question
              ).trim(),

            options,

            correctAnswer,

            marks: 5,

            questionType:
              currentQuestionType,

            difficulty:
              difficulty || "medium",

            generatedByAI: true
          });

        // =================================================
        // LOG SAVED QUESTION
        // =================================================

        console.log(
          "Question saved successfully."
        );

        console.log(
          "MongoDB ID:",
          saved._id
        );

        console.log(
          "Saved Question:",
          saved.question
        );

        console.log(
          "Saved Options:",
          saved.options
        );

        console.log(
          "Saved Correct Answer:",
          saved.correctAnswer
        );

        // =================================================
        // ADD TO ARRAY
        // =================================================

        savedQuestions.push(saved);

      } catch (questionError) {
        // =================================================
        // ONE QUESTION ERROR SHOULD NOT CRASH EVERYTHING
        // =================================================

        console.error(
          "\nQUESTION SAVE ERROR:"
        );

        console.error(
          questionError
        );

        console.error(
          "Question:",
          q.question
        );

        continue;
      }
    }

    // ==================================================
    // CHECK SAVED QUESTIONS
    // ==================================================

    if (
      savedQuestions.length === 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          "No valid questions could be generated or saved",

        generatedQuestions:
          questions.length,

        savedQuestions: 0
      });
    }

    // ==================================================
    // FINAL RESPONSE
    // ==================================================

    console.log("\n========================================");
    console.log(
      "QUESTIONS GENERATED SUCCESSFULLY"
    );
    console.log("Saved:", savedQuestions.length);
    console.log("========================================\n");

    return res.status(201).json({
      success: true,

      message:
        "Questions generated successfully",

      totalQuestions:
        savedQuestions.length,

      questions:
        savedQuestions
    });

  } catch (error) {
    // ==================================================
    // MAIN ERROR
    // ==================================================

    console.error(
      "\n========================================"
    );

    console.error(
      "GENERATE MATERIAL ERROR:"
    );

    console.error(error);

    console.error(
      "========================================\n"
    );

    // ==================================================
    // GROQ ERROR
    // ==================================================

    if (error?.error) {
      console.error(
        "Groq Error:",
        error.error
      );
    }

    return res.status(500).json({
      success: false,

      message:
        error?.error?.message ||
        error?.message ||
        "Something went wrong while generating questions"
    });

  } finally {
    // ==================================================
    // DELETE UPLOADED FILE
    // ==================================================

    if (
      uploadedFilePath &&
      fs.existsSync(uploadedFilePath)
    ) {
      try {
        fs.unlinkSync(
          uploadedFilePath
        );

        console.log(
          "Uploaded file deleted successfully."
        );

      } catch (deleteError) {
        console.error(
          "Could not delete uploaded file:",
          deleteError.message
        );
      }
    }
  }
};