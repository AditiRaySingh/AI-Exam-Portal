import { useEffect, useState } from "react";
import api from "../services/api";

import "../styles/studentDashboard.css";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ExamCard from "../components/ExamCard";
import ResultCard from "../components/ResultCard";

function StudentDashboard() {

  const [dashboard, setDashboard] =
    useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await api.get(
          "/dashboard/student",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      console.log(
        "DASHBOARD:",
        res.data
      );

      setDashboard(
        res.data
      );

    } catch (error) {

      console.log(error);

    }

  };

  if (!dashboard) {

    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        Loading Dashboard...
      </h2>
    );

  }

  return (

    <div className="dashboard">

      <Navbar />

      <div className="dashboard-content">

        <h1>
          Welcome back!
        </h1>

        <p className="subtitle">
          Here's your examination overview
        </p>

        {/* Stats */}

        <div className="stats-row">

          <StatCard
            title="Total Exams"
            value={dashboard.totalExams}
            icon="📘"
          />

          <StatCard
            title="Average Score"
            value={`${dashboard.averageScore}%`}
            icon="📈"
          />

          <StatCard
            title="Pending Exams"
            value={dashboard.pendingExams}
            icon="⏰"
          />

          <StatCard
            title="Passed Exams"
            value={dashboard.passedExams}
            icon="🏆"
          />

        </div>

        {/* Available Exams */}

        <div className="section-title">

          <h2>
            Available Exams
          </h2>

          <p className="subtitle">
            Start your pending examinations
          </p>

          <div className="exam-row">

            {dashboard.exams?.map(
              (exam) => (

                <ExamCard
                  key={exam._id}
                  examId={exam._id}
                  title={exam.title}
                  description={
                    exam.description
                  }
                  duration={
                    exam.duration
                  }
                  marks={
                    exam.totalMarks
                  }
                />

              )
            )}

          </div>

        </div>

        {/* Recent Results */}

        <div className="section-title">

          <h2>
            Recent Results
          </h2>

          <p className="subtitle">
            Your latest exam performances
          </p>

          {dashboard.results?.map(
            (result) => (

              <ResultCard
                key={result._id}
                title="Exam Result"
                date={
                  new Date(
                    result.submittedAt
                  ).toLocaleDateString()
                }
                percentage={
                  `${result.percentage}%`
                }
                marks={
                  `${result.score}/${result.totalMarks}`
                }
              />

            )
          )}

        </div>

      </div>

    </div>

  );
}

export default StudentDashboard;