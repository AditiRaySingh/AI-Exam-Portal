import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [exams, setExams] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
    fetchExams();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/exam/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDashboard(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExams = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/exam",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setExams(res.data.exams || []);
      console.log("EXAMS", exams);
    } catch (error) {
      console.log(error);
    }
  };


  const publishExam = async (examId) => {

  try {

    const token =
      localStorage.getItem("token");

await api.put(
  `/exam/publish/${examId}`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    alert(
      "Exam Published Successfully"
    );

    fetchExams();
    fetchDashboard();

  } catch (error) {
 console.log("PUBLISH ERROR:", error.response?.data || error);
    alert(
      "Failed to publish exam"
    );

  }

};

  return (
    <div className="teacher-dashboard">

      <div className="topbar">
        <div className="logo">
          AI Exam System
        </div>

        <div className="profile">
          {user?.name}
        </div>
      </div>

      <h1 className="dashboard-title">
        Teacher Dashboard
      </h1>

      <p className="subtitle">
        Manage your examinations and track student performance
      </p>

      <div className="stats">

        <div className="stat-card">
          <h3>Total Exams</h3>
          <h2>
            {dashboard?.totalExams || 0}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Published Exams</h3>
          <h2>
            {dashboard?.publishedExams || 0}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Total Students</h3>
          <h2>
            {dashboard?.totalStudents || 0}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Total Questions</h3>
          <h2>
            {dashboard?.totalQuestions || 0}
          </h2>
        </div>

      </div>

      <div className="action-cards">

        <div
          className="action-card"
          onClick={() =>
            navigate("/create-exam")
          }
        >
          <h2>➕ Create New Exam</h2>
          <p>Create and publish exams</p>
        </div>

        <div
          className="action-card"
          onClick={() =>
            navigate("/ai-generate")
          }
        >
          <h2>🤖 AI Questions</h2>

          <p>
            Generate questions using AI
          </p>
        </div>
        <div className="action-card">
          <h2>📊 Analytics</h2>
          <p>Track student performance</p>
        </div>
     


     <div
 className="action-card"
 onClick={() =>
  navigate("/generate-material")
 }
>
 <h2>📄 Upload Notes</h2>
 <p>
  Generate Questions From PDF
 </p>
</div>





      </div>

      <div className="exam-section">

        <h2>Your Examinations</h2>

        <p className="section-subtitle">
          Manage and monitor all your exams
        </p>

        {exams.length === 0 ? (

          <div className="empty-state">

            <div className="book-icon">
              📖
            </div>

            <h3>
              No exams created yet
            </h3>

            <button
              className="create-exam-btn"
              onClick={() =>
                navigate("/create-exam")
              }
            >
              Create Your First Exam
            </button>

          </div>

        ) : (

          <div className="exam-grid">

            {exams.map((exam) => (

              <div
                key={exam._id}
                className="exam-card"
              >

                <h3>{exam.title}</h3>

                <p>
                  Subject: {exam.subject}
                </p>

                <p>
                  Duration: {exam.duration} mins
                </p>

                <p>
                  Total Marks: {exam.totalMarks}
                </p>

                <span
                  className={`status ${exam.status}`}
                >
                  {exam.status}
                </span>
<div className="card-buttons">

  <button
    className="question-btn"
    onClick={() =>
      navigate(`/add-question/${exam._id}`)
    }
  >
    Add Questions
  </button>
<button
  className="view-btn"
  onClick={() =>
    navigate(`/questions/${exam._id}`)
  }
>
  View Questions
</button>

  <button
    className="result-btn"
    onClick={() =>
      navigate(`/teacher-results/${exam._id}`)
    }
  >
    Results
  </button>

  {exam.status === "draft" && (
    <button
      className="publish-btn"
      onClick={() =>
        publishExam(exam._id)
      }
    >
      Publish
    </button>
  )}

</div>
              </div>

            ))}

          </div>

        )}

      </div>


    </div>
  );
}

export default TeacherDashboard;