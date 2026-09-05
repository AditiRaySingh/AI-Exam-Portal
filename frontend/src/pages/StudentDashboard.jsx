import { useEffect, useState } from "react";
import api from "../services/api";

import "../styles/studentDashboard.css";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ExamCard from "../components/ExamCard";
import ResultCard from "../components/ResultCard";

function StudentDashboard() {

  const [dashboard, setDashboard] = useState(null);

  // ============================================
  // FETCH DASHBOARD
  // ============================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        "/dashboard/student",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("STUDENT DASHBOARD:", res.data);

      setDashboard(res.data);

    } catch (error) {

      console.error(
        "DASHBOARD ERROR:",
        error
      );

    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (!dashboard) {

    return (
      <div className="loading-screen">

        <div className="loader"></div>

        <h2>
          Loading Dashboard...
        </h2>

      </div>
    );
  }

  // ============================================
  // FORMAT PERCENTAGE
  // ============================================

  const averageScore =
    Number(dashboard.averageScore || 0);

  const formattedAverageScore =
    Number.isFinite(averageScore)
      ? `${Math.round(averageScore)}%`
      : "0%";

  // ============================================
  // UI
  // ============================================

  return (

    <div className="dashboard">

      <Navbar />

      <div className="dashboard-content">

        {/* =========================
            WELCOME
        ========================= */}

        <div className="welcome-section">

          <h1>
            Welcome back!
          </h1>

          <p className="subtitle">
            Here's your examination overview
          </p>

        </div>


        {/* =========================
            STATISTICS
        ========================= */}

        <div className="stats-row">

          <StatCard
            title="Total Exams"
            value={dashboard.totalExams || 0}
            icon="📘"
          />

          <StatCard
            title="Average Score"
            value={formattedAverageScore}
            icon="📈"
          />

          <StatCard
            title="Pending Exams"
            value={dashboard.pendingExams || 0}
            icon="⏰"
          />

          <StatCard
            title="Passed Exams"
            value={dashboard.passedExams || 0}
            icon="🏆"
          />

        </div>


        {/* =========================
            AVAILABLE EXAMS
        ========================= */}

        <div className="section-title">

          <h2>
            Available Exams
          </h2>

          <p className="subtitle">
            Start your pending examinations
          </p>

        </div>


        <div className="exam-row">

          {dashboard.exams &&
          dashboard.exams.length > 0 ? (

            dashboard.exams.map((exam) => (

              <ExamCard
                key={exam._id}

                examId={exam._id}

                title={exam.title}

                description={exam.description}

                duration={exam.duration}

                marks={exam.totalMarks}

                questions={exam.questionCount}

                questionCount={exam.questionCount}

                startTime={exam.startTime}

                endTime={exam.endTime}

                attempted={exam.attempted}
              />

            ))

          ) : (

            <p className="empty-message">
              No available exams.
            </p>

          )}

        </div>


        {/* =========================
            RECENT RESULTS
        ========================= */}

        <div className="section-title">

          <h2>
            Recent Results
          </h2>

          <p className="subtitle">
            Your latest exam performances
          </p>

        </div>


        <div className="results-list">

          {dashboard.results &&
          dashboard.results.length > 0 ? (

            dashboard.results.map((result) => (

              <ResultCard

                key={result._id}

                examId={result.examId}

                title={
                  result.exam?.title ||
                  result.title ||
                  "Exam Result"
                }

                date={
                  result.submittedAt
                    ? new Date(
                        result.submittedAt
                      ).toLocaleDateString("en-IN")
                    : "N/A"
                }

                percentage={
                  result.percentage
                }

                marks={
                  `${result.score || 0}/${result.totalMarks || 0}`
                }

              />

            ))

          ) : (

            <p className="empty-message">
              No recent results.
            </p>

          )}

        </div>

      </div>

    </div>

  );
}

export default StudentDashboard;
