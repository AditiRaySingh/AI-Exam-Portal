import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ExamPage.css";

function ExamPage() {

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [timeLeft, setTimeLeft] = useState(3600);

  const [answers, setAnswers] = useState({});

  const examId =
    localStorage.getItem("examId");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/exam/questions/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuestions(
        res.data.questions || []
      );

    } catch (error) {
      console.log(error);
    }
  };

  // Timer

  useEffect(() => {

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {

      setTimeLeft(prev => prev - 1);

    }, 1000);

    return () =>
      clearInterval(timer);

  }, [timeLeft]);

 const handleAnswer = (answer) => {

  setAnswers(prev => ({
    ...prev,
    [questions[currentQuestion]._id]:
      answer
  }));

};

  const handleSubmit = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const formattedAnswers =
        Object.keys(answers).map(
          questionId => ({
            questionId,
            selectedAnswer:
              answers[questionId]
          })
        );

      const res = await api.post(
        "/exam/submit",
        {
          examId,
          answers:
            formattedAnswers
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      console.log(res.data);

      navigate(
        `/result/${examId}`
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to submit exam"
      );
    }
  };

  if (questions.length === 0) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        Loading Questions...
      </h2>
    );
  }

  const question =
    questions[currentQuestion];

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;
console.log(question);
  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "15px",
        boxShadow:
          "0 0 20px rgba(0,0,0,0.1)"
      }}
    >

      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center"
        }}
      >

        <h1>
          Online Exam
        </h1>

        <h2
          style={{
            color: "#2563eb"
          }}
        >
          ⏰ {minutes}:
          {seconds
            .toString()
            .padStart(2, "0")}
        </h2>

      </div>

      {/* Progress */}

      <div
        style={{
          marginTop: "20px"
        }}
      >

        Question
        {" "}
        {currentQuestion + 1}
        {" "}
        of
        {" "}
        {questions.length}

        <div
          style={{
            width: "100%",
            height: "10px",
            background:
              "#ddd",
            borderRadius: "10px",
            marginTop: "8px"
          }}
        >

          <div
            style={{
              width:
                `${((currentQuestion + 1) / questions.length) * 100}%`,
              height: "100%",
              background:
                "#2563eb",
              borderRadius: "10px"
            }}
          />

        </div>

      </div>

      {/* Question */}

      <div
        style={{
          marginTop: "40px"
        }}
      >

        <h2>
          {question.question}
        </h2>

      </div>

{/* MCQ */}

{question.questionType === "mcq" && (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginTop: "30px"
    }}
  >

    {question.options.map(
      (option, index) => (

        <button
          key={index}
          onClick={() =>
            handleAnswer(option)
          }
          style={{
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            cursor: "pointer",
            textAlign: "left",

            background:
              answers[question._id] === option
                ? "#2563eb"
                : "#fff",

            color:
              answers[question._id] === option
                ? "#fff"
                : "#000"
          }}
        >
          {option}
        </button>

      )
    )}

  </div>

)}

{/* Subjective */}

{(
  question.questionType === "shortanswer" ||
  question.questionType === "veryshortanswer"
) && (

  <div
    style={{
      marginTop: "30px"
    }}
  >

    <textarea

      rows="6"

      placeholder="Write your answer here..."

      value={
        answers[question._id] || ""
      }

      onChange={(e) =>
        handleAnswer(
          e.target.value
        )
      }

      style={{
        width: "100%",
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        fontSize: "16px"
      }}
    />

  </div>

)}

      {/* Navigation */}

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent:
            "space-between"
        }}
      >

        <button
          disabled={
            currentQuestion === 0
          }
          onClick={() =>
            setCurrentQuestion(
              currentQuestion - 1
            )
          }
        >
          Previous
        </button>

        {currentQuestion <
        questions.length - 1 ? (

          <button
            onClick={() =>
              setCurrentQuestion(
                currentQuestion + 1
              )
            }
          >
            Next
          </button>

        ) : (

          <button
            onClick={
              handleSubmit
            }
            style={{
              background:
                "#16a34a",
              color: "#fff"
            }}
          >
            Submit Exam
          </button>

        )}

      </div>

      <div className="sidebar">
  <h3>Questions</h3>

  <div className="question-palette">
    {questions.map((q, index) => (
      <button
        key={q._id}
        className={
          currentQuestion === index
            ? "active-question"
            : answers[q._id]
            ? "answered-question"
            : ""
        }
        onClick={() =>
          setCurrentQuestion(index)
        }
      >
        {index + 1}
      </button>
    ))}
  </div>
</div>

    </div>

   



  );
}

export default ExamPage;