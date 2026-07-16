import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        "/dashboard/teacher",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

 console.log("Dashboard Response:", res.data);
console.log("Recent Exams:", res.data.recentExams);

      setDashboard(res.data);

    }

    catch (error) {

      console.log(error);

      alert("Unable to Load Dashboard");

    }

    finally {

      setLoading(false);

    }

  };

const publishExam = async (examId) => {

  try {

    const token = localStorage.getItem("token");

    const res = await api.put(
      `/exams/publish/${examId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert(res.data.message);

    // Refresh dashboard after publishing
    fetchDashboard();

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Failed to publish exam"
    );

  }

};



  if (loading) {

    return (

      <div className="loading-screen">

        <div className="loader"></div>

        <h2>Loading Dashboard...</h2>

      </div>

    );

  }


    if (!dashboard) {

    return (

      <h2
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        No Dashboard Data Found
      </h2>

    );

  }

  return (

    <div className="teacher-dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>

          <h1>Teacher Dashboard</h1>

          <p>Manage Exams, Questions and Student Performance</p>

        </div>

        <button
          className="create-btn"
          onClick={() => navigate("/create-exam")}
        >
          + Create Exam
        </button>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <h3>Total Exams</h3>

          <h2>{dashboard.totalExams}</h2>

        </div>

        <div className="stat-card">

          <h3>Total Students</h3>

          <h2>{dashboard.totalStudents}</h2>

        </div>

        <div className="stat-card">

          <h3>Total Attempts</h3>

          <h2>{dashboard.totalAttempts}</h2>

        </div>

        <div className="stat-card">

          <h3>Average Score</h3>

          <h2>{dashboard.averageScore}%</h2>

        </div>

      </div>

      {/* Exam List */}

      <div className="exam-section">

        <h2>Your Exams</h2>

        <table className="exam-table">

          <thead>

            <tr>

              <th>Exam</th>

              <th>Subject</th>

              <th>Duration</th>

              <th>Total Marks</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {dashboard.recentExams?.map((exam) => (

              <tr key={exam._id}>

                <td>{exam.title}</td>

                <td>{exam.subject}</td>

                <td>{exam.duration} min</td>

                <td>{exam.totalMarks}</td>

               <td>

  <button
    className="action-btn blue"
    onClick={() =>
      navigate(`/add-question/${exam._id}`)
    }
  >
    Add Questions
  </button>

  <button
    className="ai-btn"
    onClick={() =>
      navigate(`/ai-generate/${exam._id}`)
    }
  >
    AI Generate
  </button>

  <button
    className="material-btn"
    onClick={() =>
      navigate(`/generate-material/${exam._id}`)
    }
  >
    Upload Material
  </button>

  <button
    className="action-btn green"
    onClick={() =>
      navigate(`/questions/${exam._id}`)
    }
  >
    Manage
  </button>

  <button
    className="action-btn purple"
    onClick={() =>
      navigate(`/teacher-results/${exam._id}`)
    }
  >
    Results
  </button>

  {exam.status === "draft" && (
    <button
      className="action-btn orange"
      onClick={() => publishExam(exam._id)}
    >
      Publish
    </button>
  )}

</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default TeacherDashboard;