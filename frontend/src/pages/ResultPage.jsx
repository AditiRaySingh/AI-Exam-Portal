import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResultPage() {

  const navigate = useNavigate();

  const { examId } = useParams();

  const [result, setResult] =
    useState(null);

  useEffect(() => {

    const fetchResult =
      async () => {

        try {

          const token =
            localStorage.getItem("token");

          const res =
            await api.get(
              `/exam/results/${examId}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          console.log(
            "RESULT API:",
            res.data
          );

          setResult(
            res.data
          );

        } catch (error) {

          console.log(
            "RESULT ERROR:",
            error.response?.data
          );

          console.log(error);

        }

      };

    fetchResult();

  }, [examId]);

  console.log(
    "EXAM ID:",
    examId
  );

  if (!result) {

    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        Loading Result...
      </h2>
    );

  }

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fc"
      }}
    >

      <div
        style={{
          width: "500px",
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "25px"
          }}
        >
          🎉 Exam Result
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            fontSize: "18px"
          }}
        >

          <p>
            <strong>📚 Exam:</strong>{" "}
            {result.examName}
          </p>

          <p>
            <strong>🏆 Score:</strong>{" "}
            {result.score}
          </p>

          <p>
            <strong>📊 Total Marks:</strong>{" "}
            {result.totalMarks}
          </p>

          <p>
            <strong>✅ Status:</strong>{" "}
            {result.status}
          </p>


          <hr />

<h2>
  AI Evaluation
</h2>

{
result.answers &&
result.answers.map(
(answer,index)=>(

<div
key={index}
style={{
border:"1px solid #ddd",
padding:"15px",
marginBottom:"15px",
borderRadius:"10px"
}}
>

<p>
<b>Your Answer:</b>
</p>

<p>
{answer.selectedAnswer}
</p>

{
answer.aiScore > 0 && (

<>
<p>
<b>AI Score:</b>
{" "}
{answer.aiScore}
</p>

<p>
<b>AI Feedback:</b>
</p>

<p>
{answer.aiFeedback}
</p>
</>

)
}

</div>

))
}

          <p>
            <strong>⏰ Submitted:</strong>{" "}
            {
              new Date(
                result.submittedTime
              ).toLocaleString()
            }
          </p>

        </div>

        <div
          style={{
            marginTop: "25px",
            textAlign: "center"
          }}
        >

          <button
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
            style={{
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>

  );
}

export default ResultPage;