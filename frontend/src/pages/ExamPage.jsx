import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ExamPage.css";

function ExamPage() {

  const navigate = useNavigate();

  const examId = localStorage.getItem("examId");
  console.log("Exam ID =", examId);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Default timer (1 hour)
  const [timeLeft, setTimeLeft] = useState(3600);

  // Load Questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(`/questions/exam/${examId}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      setQuestions(res.data.questions || []);

    } catch (error) {

      console.log(error);

      alert("Unable to Load Questions");

    } finally {

      setLoading(false);

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

    return () => clearInterval(timer);

  }, [timeLeft]);

  // Save Answer
  const handleAnswer = (answer) => {

    setAnswers(prev => ({

      ...prev,

      [questions[currentQuestion]._id]: answer

    }));

  };

  // Previous Question
  const previousQuestion = () => {

    if (currentQuestion > 0) {

      setCurrentQuestion(currentQuestion - 1);

    }

  };

  // Next Question
  const nextQuestion = () => {

    if (currentQuestion < questions.length - 1) {

      setCurrentQuestion(currentQuestion + 1);

    }

  };

  // Jump to Question
  const jumpToQuestion = (index) => {

    setCurrentQuestion(index);

  };

  // Submit Exam
  const handleSubmit = async () => {

    try {

      setSubmitting(true);

      const token = localStorage.getItem("token");

      const formattedAnswers = Object.keys(answers).map(questionId => ({

        questionId,

        selectedAnswer: answers[questionId]

      }));

      await api.post(
  "/attempt/submit",
        {
          examId,
          answers: formattedAnswers
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      navigate(`/result/${examId}`);

    } catch (error) {

      console.log(error);

      alert("Failed to Submit Exam");

    } finally {

      setSubmitting(false);

    }

  };

  // Loading Screen
  if (loading) {

    return (

      <div className="loading-screen">

        <div className="loader"></div>

        <h2>Loading Questions...</h2>

      </div>

    );

  }

  const question = questions[currentQuestion];

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  if (!question) {
  return (
    <h2
      style={{
        textAlign: "center",
        marginTop: "100px"
      }}
    >
      No Questions Found
    </h2>
  );
}

return (

  <div className="exam-container">

    {/* Header */}

    <div className="exam-header">

      <div>

        <h1>Online Examination</h1>

        <p>
          Question {currentQuestion + 1} of {questions.length}
        </p>

      </div>

      <div className="timer-box">

        ⏰ {minutes}:{seconds.toString().padStart(2, "0")}

      </div>

    </div>

    {/* Progress */}

    <div className="progress-bar">

      <div
        className="progress-fill"
        style={{
          width: `${((currentQuestion + 1) / questions.length) * 100}%`
        }}
      ></div>

    </div>

    {/* Question Card */}

    <div className="question-card">

      <h2>{question.question}</h2>

      {/* MCQ */}

      {question.questionType === "mcq" && (

        <div className="options">

          {question.options.map((option, index) => (

            <button
              key={index}
              className={
                answers[question._id] === option
                  ? "option selected"
                  : "option"
              }
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>

          ))}

        </div>

      )}

      {/* Subjective */}

      {(question.questionType === "shortanswer" ||
        question.questionType === "veryshortanswer") && (

    <textarea
  rows="6"
  placeholder="Write your answer..."
  value={answers[question._id] || ""}
  onChange={(e) => {
    console.log(e.target.value);
    handleAnswer(e.target.value);
  }}
/>

      )}

    </div>

    {/* Navigation */}

    <div className="navigation">

      <button

        className="prev-btn"

        disabled={currentQuestion === 0}

        onClick={previousQuestion}

      >
        Previous
      </button>

      {currentQuestion !== questions.length - 1 ? (

        <button

          className="next-btn"

          onClick={nextQuestion}

        >
          Next
        </button>

      ) : (

        <button

          className="submit-btn"

          disabled={submitting}

          onClick={handleSubmit}

        >
          {submitting ? "Submitting..." : "Submit Exam"}
        </button>

      )}

    </div>

    {/* Question Palette */}

    <div className="question-palette">

      <h3>Questions</h3>

      <div className="palette-grid">

        {questions.map((q, index) => (

          <button

            key={q._id}

            className={
              currentQuestion === index
                ? "palette-btn active"
                : answers[q._id]
                ? "palette-btn answered"
                : "palette-btn"
            }

            onClick={() => jumpToQuestion(index)}

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