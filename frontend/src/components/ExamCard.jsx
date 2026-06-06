import "../styles/examCard.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ExamCard({
  examId,
  title,
  description,
  duration,
  questions,
  marks,
  dueDate
}) {

  const navigate = useNavigate();

  const handleStartExam = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.post(
        "/exam/start",
        {
          examId
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      console.log(
        "Exam Started:",
        res.data
      );

      localStorage.setItem(
        "examId",
        examId
      );

      navigate("/exam");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to start exam"
      );

    }
  };

  return (

    <div className="exam-card">

      <h2>
        {title}
      </h2>

      <p className="desc">
        {description}
      </p>

      <div className="exam-info">

        <p>
          ⏱ Duration:
          {duration}
        </p>

        <p>
          📄 Questions:
          {questions}
        </p>

        <p>
          🏆 Total Marks:
          {marks}
        </p>

        <p>
          📅 Due:
          {dueDate}
        </p>

      </div>

      <button
        className="start-btn"
        onClick={handleStartExam}
      >
        ▶ Start Exam
      </button>

    </div>
  );
}

export default ExamCard;