import Groq from "groq-sdk";

export const evaluateAnswer = async (
  question,
  correctAnswer,
  studentAnswer,
  marks
) => {

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const prompt = `
Question:
${question}

Correct Answer:
${correctAnswer}

Student Answer:
${studentAnswer}

Maximum Marks: ${marks}

Evaluate the student answer.

Return ONLY JSON:

{
  "score": 4,
  "feedback": "Good explanation"
}
`;

  const response =
    await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    console.log("Student Answer:", studentAnswer);
console.log("Correct Answer:", correctAnswer);
console.log("AI Response:", response.choices[0].message.content);
  const text =
    response.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  return JSON.parse(text);
};