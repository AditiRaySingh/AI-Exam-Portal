import "../styles/examCard.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ExamCard({
  examId,
  title,
  description,
  duration,
  questions,
  questionCount,
  marks,
  dueDate,
  endTime,
  startTime,
  attempted
}) {

  const navigate = useNavigate();

  // =====================================================
  // QUESTION COUNT
  // =====================================================

  const totalQuestions =
    questionCount ??
    questions ??
    0;


  // =====================================================
  // DATE
  // =====================================================

  const examStart =
    startTime
      ? new Date(startTime)
      : null;

  const examEnd =
    endTime
      ? new Date(endTime)
      : null;


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formattedDate =
    examStart
      ? examStart.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        )
      : "Not Set";


  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formattedStartTime =
    examStart
      ? examStart.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          }
        )
      : "Not Set";


  const formattedEndTime =
    examEnd
      ? examEnd.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          }
        )
      : "Not Set";


  // =====================================================
  // START EXAM
  // =====================================================

  const handleStartExam = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await api.post(
        "/exams/start",
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

      localStorage.setItem(
        "examId",
        examId
      );

      navigate("/exam");

    } catch (error) {

      console.log(
        "START EXAM ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to start exam"
      );
    }
  };


  // =====================================================
  // VIEW RESULT
  // =====================================================

  const handleViewResult = () => {

    navigate(
      `/result/${examId}`
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="exam-card">

      {/* HEADER */}

      <div className="exam-header">

        <span className="status">
          {attempted
            ? "Completed"
            : "Available"}
        </span>

        <h2>
          {title}
        </h2>

        <p className="description">
          {description || "No description"}
        </p>

      </div>


      {/* EXAM INFORMATION */}

      <div className="exam-info">


        {/* DATE */}

        <div className="info-card">

          <div className="icon">
            📅
          </div>

          <div>

            <h4>
              Exam Date
            </h4>

            <p>
              {formattedDate}
            </p>

          </div>

        </div>


        {/* TIME */}

        <div className="info-card">

          <div className="icon">
            🕐
          </div>

          <div>

            <h4>
              Exam Time
            </h4>

            <p>
              {formattedStartTime}
              {" - "}
              {formattedEndTime}
            </p>

          </div>

        </div>


        {/* DURATION */}

        <div className="info-card">

          <div className="icon">
            ⏱
          </div>

          <div>

            <h4>
              Duration
            </h4>

            <p>
              {duration || 0} Minutes
            </p>

          </div>

        </div>


        {/* QUESTIONS */}

        <div className="info-card">

          <div className="icon">
            📄
          </div>

          <div>

            <h4>
              Questions
            </h4>

            <p>
              {totalQuestions}
            </p>

          </div>

        </div>


        {/* MARKS */}

        <div className="info-card">

          <div className="icon">
            🏆
          </div>

          <div>

            <h4>
              Total Marks
            </h4>

            <p>
              {marks || 0}
            </p>

          </div>

        </div>

      </div>


      {/* BUTTON */}

      {attempted ? (

        <button
          className="start-btn"
          onClick={handleViewResult}
        >
          View Result →
        </button>

      ) : (

        <button
          className="start-btn"
          onClick={handleStartExam}
        >
          Start Exam →
        </button>

      )}

    </div>

  );
}

export default ExamCard;