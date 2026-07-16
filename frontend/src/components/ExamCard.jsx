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

      const token = localStorage.getItem("token");

      await api.post(
        "/exams/start",
        {
          examId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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

      <div className="exam-header">

        <span className="status">
          Available
        </span>

        <h2>{title}</h2>

        <p className="description">
          {description}
        </p>

      </div>

      <div className="exam-info">

        <div className="info-card">

          <div className="icon">
            ⏱
          </div>

          <div>

            <h4>Duration</h4>

            <p>
              {duration} Minutes
            </p>

          </div>

        </div>

        <div className="info-card">

          <div className="icon">
            📄
          </div>

          <div>

            <h4>Questions</h4>

            <p>
              {questions || 0}
            </p>

          </div>

        </div>

        <div className="info-card">

          <div className="icon">
            🏆
          </div>

          <div>

            <h4>Total Marks</h4>

            <p>
              {marks}
            </p>

          </div>

        </div>

        <div className="info-card">

          <div className="icon">
            📅
          </div>

          <div>

            <h4>Due Date</h4>

            <p>
              {dueDate
                ? new Date(
                    dueDate
                  ).toLocaleDateString()
                : "Not Set"}
            </p>

          </div>

        </div>

      </div>

      <button
        className="start-btn"
        onClick={handleStartExam}
      >
        Start Exam →
      </button>

    </div>

  );

}

export default ExamCard;