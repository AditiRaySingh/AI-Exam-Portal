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


  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

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
        "================================"
      );

      console.log(
        "DASHBOARD RESPONSE:",
        res.data
      );

      console.log(
        "EXAMS:",
        res.data.exams
      );

      console.log(
        "================================"
      );


      setDashboard(
        res.data
      );


    } catch (error) {

      console.error(
        "DASHBOARD ERROR:",
        error
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

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


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="dashboard">

      <Navbar />


      <div className="dashboard-content">


        {/* =================================================
            WELCOME
        ================================================= */}

        <h1>
          Welcome back!
        </h1>


        <p className="subtitle">
          Here's your examination overview
        </p>


        {/* =================================================
            STATS
        ================================================= */}

        <div className="stats-row">

          <StatCard
            title="Total Exams"
            value={
              dashboard.totalExams || 0
            }
            icon="📘"
          />


          <StatCard
            title="Average Score"
            value={
              `${dashboard.averageScore || 0}%`
            }
            icon="📈"
          />


          <StatCard
            title="Pending Exams"
            value={
              dashboard.pendingExams || 0
            }
            icon="⏰"
          />


          <StatCard
            title="Passed Exams"
            value={
              dashboard.passedExams || 0
            }
            icon="🏆"
          />

        </div>


        {/* =================================================
            AVAILABLE EXAMS
        ================================================= */}

        <div className="section-title">

          <h2>
            Available Exams
          </h2>


          <p className="subtitle">
            Start your pending examinations
          </p>


          <div className="exam-row">


            {dashboard.exams &&
              dashboard.exams.length > 0 ? (

              dashboard.exams.map(
                (exam) => (

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

                )
              )

            ) : (

              <p>
                No available exams.
              </p>

            )}

          </div>

        </div>


        {/* =================================================
            RECENT RESULTS
        ================================================= */}

        <div className="section-title">

          <h2>
            Recent Results
          </h2>


          <p className="subtitle">
            Your latest exam performances
          </p>


          {dashboard.results &&
            dashboard.results.length > 0 ? (

            dashboard.results.map(
              (result) => (

                <ResultCard

                  key={result._id}

                  examId={
                    result.examId
                  }

                  title="Exam Result"

                  date={
                    result.submittedAt
                      ? new Date(
                        result.submittedAt
                      ).toLocaleDateString()
                      : "N/A"
                  }

                  percentage={
                    `${result.percentage || 0}%`
                  }

                  marks={
                    `${result.score || 0}/${result.totalMarks || 0}`
                  }

                />

              )
            )

          ) : (

            <p>
              No recent results.
            </p>

          )}

        </div>

      </div>

    </div>

  );

}


export default StudentDashboard;