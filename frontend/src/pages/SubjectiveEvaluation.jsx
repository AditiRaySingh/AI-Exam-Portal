import { useState } from "react";
import api from "../services/api";

function SubjectiveEvaluation() {

  const [question,setQuestion] =
    useState("");

  const [answer,setAnswer] =
    useState("");

  const [marks,setMarks] =
    useState(10);

  const [result,setResult] =
    useState(null);

  const evaluate =
  async () => {

    try {

      const token =
      localStorage.getItem("token");

      const res =
      await api.post(
      "/ai/evaluate-answer",
      {
        question,
        studentAnswer: answer,
        maxMarks: marks
      },
      {
        headers:{
          Authorization:
          `Bearer ${token}`
        }
      });

      setResult(
        res.data.result
      );

    } catch(error) {

      console.log(error);

    }

  };

  return (

    <div style={{padding:"40px"}}>

      <h1>
        AI Subjective Evaluation
      </h1>

      <textarea
      placeholder="Question"
      value={question}
      onChange={(e)=>
      setQuestion(e.target.value)}
      />

      <br/><br/>

      <textarea
      placeholder="Student Answer"
      value={answer}
      onChange={(e)=>
      setAnswer(e.target.value)}
      />

      <br/><br/>

      <input
      type="number"
      value={marks}
      onChange={(e)=>
      setMarks(e.target.value)}
      />

      <br/><br/>

      <button
      onClick={evaluate}
      >
        Evaluate
      </button>

      {result && (

        <div>

          <h2>
            Score:
            {result.score}
          </h2>

          <p>
            {result.feedback}
          </p>

        </div>

      )}

    </div>
  );
}

export default SubjectiveEvaluation;