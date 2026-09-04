import Groq from "groq-sdk";

export const evaluateAnswer = async (
  question,
  correctAnswer,
  studentAnswer,
  marks
) => {

  try {

    // ==============================
    // GROQ CONNECTION
    // ==============================

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });


    // ==============================
    // CHECK AVAILABLE MODELS
    // ==============================

    const models = await groq.models.list();

    console.log(
      "AVAILABLE GROQ MODELS:",
      models.data.map(model => model.id)
    );


    // ==============================
    // SELECT AVAILABLE MODEL
    // ==============================

    const preferredModels = [
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b"
    ];

    const availableModelIds =
      models.data.map(model => model.id);

    const model =
      preferredModels.find(
        modelId =>
          availableModelIds.includes(modelId)
      ) ||
      availableModelIds.find(
        modelId =>
          !modelId.includes("whisper") &&
          !modelId.includes("safeguard")
      );


    if (!model) {

      throw new Error(
        "No suitable Groq text-generation model is available."
      );

    }


    console.log(
      "USING GROQ MODEL:",
      model
    );


    // ==============================
    // PROMPT
    // ==============================

    const prompt = `
You are an exam answer evaluator.

Evaluate the student's answer against the correct answer.

Question:
${question}

Correct Answer:
${correctAnswer}

Student Answer:
${studentAnswer}

Maximum Marks:
${marks}

Give marks according to the quality and correctness of the student's answer.

The score must be between 0 and ${marks}.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

Required format:

{
  "score": 0,
  "feedback": "Short explanation of the evaluation"
}
`;


    // ==============================
    // AI REQUEST
    // ==============================

    const response =
      await groq.chat.completions.create({

        model,

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.2,

        max_tokens: 300

      });


    // ==============================
    // GET AI RESPONSE
    // ==============================

    const aiResponse =
      response?.choices?.[0]?.message?.content;


    console.log(
      "Student Answer:",
      studentAnswer
    );

    console.log(
      "Correct Answer:",
      correctAnswer
    );

    console.log(
      "AI Response:",
      aiResponse
    );


    if (!aiResponse) {

      throw new Error(
        "AI returned an empty response."
      );

    }


    // ==============================
    // CLEAN RESPONSE
    // ==============================

    const text =
      aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();


    // ==============================
    // PARSE JSON
    // ==============================

    let result;

    try {

      result = JSON.parse(text);

    } catch (parseError) {

      console.log(
        "AI JSON PARSE ERROR:",
        parseError.message
      );

      console.log(
        "RAW AI RESPONSE:",
        text
      );

      throw new Error(
        "AI returned invalid JSON."
      );

    }


    // ==============================
    // VALIDATE SCORE
    // ==============================

    let score = Number(result.score);

    if (Number.isNaN(score)) {
      score = 0;
    }

    if (score < 0) {
      score = 0;
    }

    if (score > Number(marks)) {
      score = Number(marks);
    }


    // ==============================
    // RETURN RESULT
    // ==============================

    return {

      score,

      feedback:
        result.feedback ||
        "Answer evaluated successfully."

    };

  } catch (error) {

    console.log(
      "AI EVALUATION ERROR:",
      error
    );

    throw error;

  }

};