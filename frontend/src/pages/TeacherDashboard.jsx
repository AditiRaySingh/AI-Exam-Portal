import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/TeacherDashboard.css";
import Navbar from "../components/Navbar";

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

      const res = await api.get("/dashboard/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard Response:", res.data);
      console.log("Recent Exams:", res.data.recentExams);

      setDashboard(res.data);
    } catch (error) {
      console.log("TEACHER DASHBOARD ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to Load Dashboard"
      );
    } finally {
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      fetchDashboard();
    } catch (error) {
      console.log("PUBLISH EXAM ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to publish exam"
      );
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  /* ================= NO DATA ================= */

  if (!dashboard) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        No Dashboard Data Found
      </h2>
    );
  }

  return (
    <div className="teacher-dashboard">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= DASHBOARD HEADER ================= */}

      <div className="dashboard-header">

        <div>
          <h1>Teacher Dashboard</h1>

          <p>
            Manage Exams, Questions and Student Performance
          </p>
        </div>

        <button
          className="create-btn"
          onClick={() => navigate("/create-exam")}
        >
          + Create Exam
        </button>

      </div>

      {/* ================= STATISTICS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Exams</h3>
          <h2>{dashboard.totalExams || 0}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Students</h3>
          <h2>{dashboard.totalStudents || 0}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Attempts</h3>
          <h2>{dashboard.totalAttempts || 0}</h2>
        </div>

        <div className="stat-card">
          <h3>Average Score</h3>
          <h2>
            {dashboard.averageScore || 0}%
          </h2>
        </div>

      </div>

      {/* ================= EXAM LIST ================= */}

      <div className="exam-section">

        <h2>Your Exams</h2>

        {/* IMPORTANT MOBILE WRAPPER */}

        <div className="table-wrapper">

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

              {dashboard.recentExams &&
              dashboard.recentExams.length > 0 ? (

                dashboard.recentExams.map((exam) => (

                  <tr key={exam._id}>

                    {/* EXAM */}

                    <td>
                      {exam.title}
                    </td>

                    {/* SUBJECT */}

                    <td>
                      {exam.subject}
                    </td>

                    {/* DURATION */}

                    <td>
                      {exam.duration} min
                    </td>

                    {/* TOTAL MARKS */}

                    <td>
                      {exam.totalMarks}
                    </td>

                    {/* ACTIONS */}

                    <td className="actions-cell">

                      {/* ADD QUESTIONS */}

                      <button
                        className="action-btn blue"
                        onClick={() =>
                          navigate(
                            `/add-question/${exam._id}`
                          )
                        }
                      >
                        Add Questions
                      </button>

                      {/* AI GENERATE */}

                      <button
                        className="ai-btn"
                        onClick={() =>
                          navigate(
                            `/ai-generate/${exam._id}`
                          )
                        }
                      >
                        AI Generate
                      </button>

                      {/* UPLOAD MATERIAL */}

                      <button
                        className="material-btn"
                        onClick={() =>
                          navigate(
                            `/generate-material/${exam._id}`
                          )
                        }
                      >
                        Upload Material
                      </button>

                      {/* MANAGE */}

                      <button
                        className="action-btn green"
                        onClick={() =>
                          navigate(
                            `/questions/${exam._id}`
                          )
                        }
                      >
                        Manage
                      </button>

                      {/* RESULTS */}

                      <button
                        className="action-btn purple"
                        onClick={() =>
                          navigate(
                            `/teacher-results/${exam._id}`
                          )
                        }
                      >
                        Results
                      </button>

                      {/* ANALYTICS */}

                      <button
                        className="action-btn analytics"
                        onClick={() =>
                          navigate(
                            `/teacher-analytics/${exam._id}`
                          )
                        }
                      >
                        📊 Analytics
                      </button>

                      {/* PUBLISH */}

                      {exam.status === "draft" && (
                        <button
                          className="action-btn orange"
                          onClick={() =>
                            publishExam(exam._id)
                          }
                        >
                          Publish
                        </button>
                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No Exams Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default TeacherDashboard;
