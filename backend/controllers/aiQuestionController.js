import Groq from "groq-sdk";
import questionModel from "../models/QuestionModel.js";
import examModel from "../models/examModel.js";


// ==========================================
// GENERATE AI QUESTIONS
// ==========================================

export const generateQuestions = async (req, res) => {

  try {

    const {
      examId,
      topic,
      difficulty,
      questionType,
      numberOfQuestions
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

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


    // ==========================================
    // FIND EXAM
    // ==========================================

    const exam =
      await examModel.findById(examId);


    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Exam not found"

      });

    }


    // ==========================================
    // GROQ API KEY
    // ==========================================

    if (!process.env.GROQ_API_KEY) {

      return res.status(500).json({

        success: false,

        message: "GROQ_API_KEY is missing"

      });

    }


    const groq = new Groq({

      apiKey:
        process.env.GROQ_API_KEY

    });


    // ==========================================
    // PROMPT
    // ==========================================

    let prompt = "";


    // ==========================================
    // MCQ
    // ==========================================

    if (questionType === "mcq") {

      prompt = `

You are an expert exam question generator.

Generate exactly ${numberOfQuestions}
multiple choice questions about:

"${topic}"

Difficulty:
${difficulty}

IMPORTANT RULES:

1. Questions must be factually correct.
2. Carefully calculate arithmetic questions before answering.
3. Generate exactly 4 options.
4. Options must contain the complete answer text.
5. correctAnswer MUST contain the EXACT TEXT of the correct option.
6. NEVER use A, B, C or D as correctAnswer.
7. The correctAnswer MUST exactly match one item inside options.
8. Do not create duplicate options.
9. marks must be 5.
10. questionType must be "mcq".
11. Return ONLY valid JSON.
12. Do not return markdown.

Example:

{
  "questions": [
    {
      "question": "What is 4 + 5?",
      "options": [
        "8",
        "9",
        "7",
        "10"
      ],
      "correctAnswer": "9",
      "marks": 5,
      "questionType": "mcq"
    }
  ]
}

Notice:

correctAnswer = "9"

NOT:

correctAnswer = "B"

Generate the questions now.

`;


    }


    // ==========================================
    // TRUE / FALSE
    // ==========================================

    else if (questionType === "truefalse") {

      prompt = `

You are an expert exam question generator.

Generate exactly ${numberOfQuestions}
True/False questions about:

"${topic}"

Difficulty:
${difficulty}

IMPORTANT RULES:

1. Questions must be factually correct.
2. options MUST be exactly:
   ["True", "False"]
3. correctAnswer MUST be exactly:
   "True"
   OR
   "False"
4. Never use A, B, C or D.
5. marks must be 2.
6. questionType must be "truefalse".
7. Return ONLY valid JSON.
8. Do not return markdown.

Example:

{
  "questions": [
    {
      "question": "Java is platform independent.",
      "options": [
        "True",
        "False"
      ],
      "correctAnswer": "True",
      "marks": 2,
      "questionType": "truefalse"
    }
  ]
}

Generate the questions now.

`;

    }


    // ==========================================
    // SHORT ANSWER
    // ==========================================

    else if (questionType === "shortanswer") {

      prompt = `

You are an expert exam question generator.

Generate exactly ${numberOfQuestions}
short answer questions about:

"${topic}"

Difficulty:
${difficulty}

IMPORTANT RULES:

1. Questions must be factually correct.
2. Provide a clear expected answer.
3. correctAnswer must contain the actual expected answer.
4. Do NOT use A, B, C or D.
5. marks must be 5.
6. questionType must be "shortanswer".
7. Return ONLY valid JSON.
8. Do not return markdown.

Example:

{
  "questions": [
    {
      "question": "Explain polymorphism in Java.",
      "options": [],
      "correctAnswer": "Polymorphism allows one interface to be used for different forms.",
      "marks": 5,
      "questionType": "shortanswer"
    }
  ]
}

Generate the questions now.

`;

    }


    // ==========================================
    // VERY SHORT ANSWER
    // ==========================================

    else if (questionType === "veryshortanswer") {

      prompt = `

You are an expert exam question generator.

Generate exactly ${numberOfQuestions}
very short answer questions about:

"${topic}"

Difficulty:
${difficulty}

IMPORTANT RULES:

1. Questions must be factually correct.
2. correctAnswer must contain the actual answer.
3. Do NOT use A, B, C or D.
4. marks must be 1.
5. questionType must be "veryshortanswer".
6. Return ONLY valid JSON.
7. Do not return markdown.

Example:

{
  "questions": [
    {
      "question": "What is JVM?",
      "options": [],
      "correctAnswer": "Java Virtual Machine",
      "marks": 1,
      "questionType": "veryshortanswer"
    }
  ]
}

Generate the questions now.

`;

    }


    else {

      return res.status(400).json({

        success: false,

        message: "Invalid question type"

      });

    }


    // ==========================================
    // CALL GROQ
    // ==========================================

    console.log("Sending request to Groq...");


    const response =
      await groq.chat.completions.create({

        model:
          "openai/gpt-oss-20b",

        messages: [

          {
            role: "user",

            content: prompt

          }

        ],

        temperature: 0.1,

        response_format: {

          type: "json_object"

        }

      });


    // ==========================================
    // GET AI RESPONSE
    // ==========================================

    const aiResponse =
      response.choices?.[0]?.message?.content;


    console.log(
      "RAW AI RESPONSE:"
    );

    console.log(aiResponse);


    if (!aiResponse) {

      return res.status(500).json({

        success: false,

        message:
          "Groq returned empty response"

      });

    }


    // ==========================================
    // PARSE JSON
    // ==========================================

    let parsed;


    try {

      parsed =
        JSON.parse(aiResponse);

    }

    catch (error) {

      console.log(
        "JSON PARSE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "AI returned invalid JSON",

        rawResponse:
          aiResponse

      });

    }


    const questions =
      parsed.questions;


    // ==========================================
    // VALIDATE ARRAY
    // ==========================================

    if (!Array.isArray(questions)) {

      return res.status(500).json({

        success: false,

        message:
          "AI response does not contain questions array"

      });

    }


    console.log(
      "Questions generated:",
      questions.length
    );


    // ==========================================
    // SAVE QUESTIONS
    // ==========================================

    const savedQuestions = [];


    for (const q of questions) {

      console.log(
        "\n================================="
      );

      console.log(
        "Question:",
        q.question
      );

      console.log(
        "Options:",
        q.options
      );

      console.log(
        "AI Correct Answer:",
        q.correctAnswer
      );


      if (!q.question) {

        console.log(
          "Skipping question: missing question"
        );

        continue;

      }


      const type =
        (
          q.questionType ||
          questionType
        )
          .toLowerCase()
          .trim();


      // ==========================================
      // MCQ ANSWER NORMALIZATION
      // ==========================================

      let correctAnswer =
        String(
          q.correctAnswer ?? ""
        ).trim();


      if (type === "mcq") {

        // ------------------------------------------
        // Validate options
        // ------------------------------------------

        if (
          !Array.isArray(q.options) ||
          q.options.length !== 4
        ) {

          console.log(
            "Skipping MCQ: must have exactly 4 options"
          );

          continue;

        }


        // ------------------------------------------
        // Remove A/B/C/D if AI accidentally returns it
        // ------------------------------------------

        let normalized =
          correctAnswer
            .replace(/^ANSWER\s*:\s*/i, "")
            .replace(/^OPTION\s*/i, "")
            .trim();


        // ------------------------------------------
        // If AI returns A/B/C/D,
        // convert it to actual option text
        // ------------------------------------------

        const optionMap = {

          A: 0,
          B: 1,
          C: 2,
          D: 3

        };


        const letter =
          normalized
            .replace(/\.$/, "")
            .replace(/\)$/, "")
            .toUpperCase()
            .trim();


        if (
          Object.prototype.hasOwnProperty.call(
            optionMap,
            letter
          )
        ) {

          correctAnswer =
            String(
              q.options[
                optionMap[letter]
              ]
            ).trim();

        }

        else {

          // ------------------------------------------
          // Otherwise use actual answer text
          // ------------------------------------------

          correctAnswer =
            normalized;

        }


        // ------------------------------------------
        // VERY IMPORTANT:
        // correctAnswer MUST exist in options
        // ------------------------------------------

        const matchingOption =
          q.options.find(

            option =>
              String(option)
                .trim()
                .toLowerCase() ===
              correctAnswer
                .trim()
                .toLowerCase()

          );


        if (!matchingOption) {

          console.log(
            "INVALID CORRECT ANSWER:"
          );

          console.log(
            "Options:",
            q.options
          );

          console.log(
            "Correct:",
            correctAnswer
          );

          console.log(
            "Skipping question."
          );

          continue;

        }


        // Store the exact option text

        correctAnswer =
          matchingOption;

      }


      // ==========================================
      // TRUE/FALSE
      // ==========================================

      if (type === "truefalse") {

        const answer =
          correctAnswer.toLowerCase();


        if (
          answer === "true"
        ) {

          correctAnswer = "True";

        }

        else if (
          answer === "false"
        ) {

          correctAnswer = "False";

        }

        else {

          console.log(
            "Invalid True/False answer:",
            correctAnswer
          );

          continue;

        }

      }


      // ==========================================
      // DUPLICATE QUESTION
      // ==========================================

      const exists =
        await questionModel.findOne({

          examId,

          question:
            q.question.trim()

        });


      if (exists) {

        console.log(
          "Skipping duplicate question"
        );

        continue;

      }


      // ==========================================
      // SAVE TO MONGODB
      // ==========================================

      const saved =
        await questionModel.create({

          examId,

          topic,

          question:
            q.question.trim(),

          options:
            Array.isArray(q.options)
              ? q.options
              : [],

          // IMPORTANT
          // Always save actual answer
          correctAnswer,

          marks:
            Number(q.marks) ||
            (
              type === "truefalse"
                ? 2
                : type === "veryshortanswer"
                ? 1
                : 5
            ),

          questionType:
            type,

          difficulty,

          generatedByAI: true

        });


      console.log(
        "FINAL CORRECT ANSWER SAVED:",
        saved.correctAnswer
      );


      savedQuestions.push(
        saved
      );

    }


    // ==========================================
    // RESPONSE
    // ==========================================

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

    console.log(
      "AI GENERATION ERROR:",
      error.message
    );

    console.log(
      "FULL ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Internal Server Error"

    });

  }

};