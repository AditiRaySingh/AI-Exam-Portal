import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "../styles/StudentResults.css";

import Navbar from "../components/Navbar";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import { motion } from "framer-motion";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaBook
} from "react-icons/fa";


function StudentResults() {

  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==============================
  // FETCH RESULTS
  // ==============================

  useEffect(() => {
    fetchResults();
  }, []);


  const fetchResults = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        "/attempt/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("STUDENT RESULTS:", res.data);

      setResults(res.data.history || []);

    } catch (error) {

      console.error(
        "STUDENT RESULTS ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="student-results-loading">
          <div className="student-results-loader"></div>
          <h2>Loading Results...</h2>
        </div>
      </>
    );
  }


  // ==============================
  // NO RESULTS
  // ==============================

  if (results.length === 0) {

    return (
      <>
        <Navbar />

        <div className="student-results-page">

          <h1 className="student-results-title">
            📊 My Exam Results
          </h1>

          <div className="student-no-results">
            <FaBook />
            <h2>No Results Found</h2>
            <p>
              You have not completed any exam yet.
            </p>
          </div>

        </div>
      </>
    );
  }


  // ==============================
  // UI
  // ==============================

  return (

    <div className="student-results-wrapper">

      <Navbar />

      <div className="student-results-page">


        {/* ==============================
            PAGE TITLE
        ============================== */}

        <div className="student-results-heading">

          <h1>
            📊 My Exam Results
          </h1>

          <p>
            Check your exam performance and detailed evaluation
          </p>

        </div>


        {/* ==============================
            RESULTS
        ============================== */}

        <div className="student-results-list">


          {results.map((result) => {


            const percentage =
              parseFloat(result.percentage) || 0;


            // Do not show 100.00%
            // Show 100%, 85.5%, etc.
            const displayPercentage =
              Number.isInteger(percentage)
                ? percentage
                : parseFloat(
                    percentage.toFixed(2)
                  );


            const chartData = [

              {
                name: "Correct",
                value: result.correctCount || 0
              },

              {
                name: "Wrong",
                value: result.wrongCount || 0
              }

            ];


            const scoreData = [

              {
                name: "Score",
                Marks: result.score || 0
              },

              {
                name: "Total",
                Marks: result.totalMarks || 0
              }

            ];


            const badge =
              percentage >= 90
                ? "Excellent"
                : percentage >= 75
                ? "Very Good"
                : percentage >= 60
                ? "Good"
                : percentage >= 40
                ? "Average"
                : "Needs Improvement";


            const passed =
              percentage >= 40;


            return (

              <motion.div

                key={result._id}

                className="student-result-card"

                initial={{
                  opacity: 0,
                  y: 30
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                transition={{
                  duration: 0.4
                }}

              >


                {/* ==============================
                    HEADER
                ============================== */}

                <div className="student-result-header">

                  <div className="student-result-exam">

                    <FaBook />

                    <h2>
                      {result.examId?.title || "Exam"}
                    </h2>

                  </div>


                  <span
                    className={
                      passed
                        ? "student-result-badge student-pass"
                        : "student-result-badge student-fail"
                    }
                  >

                    <FaTrophy />

                    {badge}

                  </span>

                </div>


                {/* ==============================
                    SUMMARY
                ============================== */}

                <div className="student-summary-grid">


                  <div className="student-summary-box">

                    <h4>
                      Score
                    </h4>

                    <h2>
                      {result.score || 0}
                      {" / "}
                      {result.totalMarks || 0}
                    </h2>

                  </div>


                  <div className="student-summary-box">

                    <h4>
                      Percentage
                    </h4>

                    <h2>
                      {displayPercentage}%
                    </h2>

                  </div>


                  <div className="student-summary-box">

                    <h4>
                      Correct
                    </h4>

                    <h2 className="student-correct">

                      <FaCheckCircle />

                      {result.correctCount || 0}

                    </h2>

                  </div>


                  <div className="student-summary-box">

                    <h4>
                      Wrong
                    </h4>

                    <h2 className="student-wrong">

                      <FaTimesCircle />

                      {result.wrongCount || 0}

                    </h2>

                  </div>

                </div>


                {/* ==============================
                    PERFORMANCE
                ============================== */}

                <div className="student-performance-section">


                  <div className="student-progress">

                    <CircularProgressbar

                      value={percentage}

                      text={`${displayPercentage}%`}

                      styles={buildStyles({

                        pathColor:
                          passed
                            ? "#22c55e"
                            : "#ef4444",

                        textColor:
                          "#1e293b",

                        trailColor:
                          "#e5e7eb"

                      })}

                    />

                  </div>


                  <div className="student-performance-info">

                    <h2>
                      Performance
                    </h2>

                    <p>
                      Status:
                      <strong>
                        {" "}
                        {result.result || (
                          passed
                            ? "Passed"
                            : "Failed"
                        )}
                      </strong>
                    </p>

                    <p>
                      Submitted:
                      <strong>
                        {" "}
                        {result.submittedAt
                          ? new Date(
                              result.submittedAt
                            ).toLocaleString()
                          : "N/A"}
                      </strong>
                    </p>

                  </div>

                </div>


                {/* ==============================
                    CHARTS
                ============================== */}

                <div className="student-charts">


                  {/* MARKS CHART */}

                  <div className="student-chart-box">

                    <h3>
                      📊 Marks Analysis
                    </h3>

                    <ResponsiveContainer
                      width="100%"
                      height={280}
                    >

                      <BarChart
                        data={scoreData}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="name"
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                          dataKey="Marks"
                          fill="#4f46e5"
                          radius={[
                            8,
                            8,
                            0,
                            0
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>


                  {/* PIE CHART */}

                  <div className="student-chart-box">

                    <h3>
                      🥧 Correct vs Wrong
                    </h3>

                    <ResponsiveContainer
                      width="100%"
                      height={280}
                    >

                      <PieChart>

                        <Pie

                          data={chartData}

                          dataKey="value"

                          nameKey="name"

                          cx="50%"

                          cy="50%"

                          outerRadius={90}

                          innerRadius={45}

                          paddingAngle={5}

                          label

                        >

                          <Cell fill="#22c55e" />

                          <Cell fill="#ef4444" />

                        </Pie>

                        <Tooltip />

                        <Legend />

                      </PieChart>

                    </ResponsiveContainer>

                  </div>

                </div>


                {/* ==============================
                    AI EVALUATION
                ============================== */}

                <div className="student-evaluation">

                  <h2>
                    🤖 AI Evaluation
                  </h2>


                  {result.answers?.length > 0 ? (

                    result.answers.map(
                      (answer, index) => (

                        <div
                          key={index}
                          className={
                            answer.isCorrect
                              ? "student-answer-card correct-answer"
                              : "student-answer-card wrong-answer"
                          }
                        >

                          <div className="student-answer-header">

                            <h3>
                              Question {index + 1}
                            </h3>

                            <span>

                              {answer.isCorrect ? (
                                <>
                                  <FaCheckCircle />
                                  {" "}Correct
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle />
                                  {" "}Wrong
                                </>
                              )}

                            </span>

                          </div>


                          <div className="student-answer-row">

                            <strong>
                              Your Answer
                            </strong>

                            <p>
                              {answer.selectedAnswer ||
                                "Not Attempted"}
                            </p>

                          </div>


                          <div className="student-answer-row">

                            <strong>
                              AI Score
                            </strong>

                            <p>
                              {answer.aiScore ??
                                answer.obtainedMarks ??
                                0}
                            </p>

                          </div>


                          <div className="student-answer-row">

                            <strong>
                              Feedback
                            </strong>

                            <p>
                              {answer.aiFeedback ||
                                "No feedback available"}
                            </p>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <div className="student-no-ai">

                      <h3>
                        No AI Evaluation Available
                      </h3>

                    </div>

                  )}

                </div>


                {/* ==============================
                    FOOTER
                ============================== */}

                <div className="student-result-footer">

                  <button
                    className="student-view-btn"
                    onClick={() =>
                      navigate(
                        `/result/${result.examId?._id || result.examId}`
                      )
                    }
                  >
                    View Full Result →
                  </button>

                  <button
                    className="student-print-btn"
                    onClick={() =>
                      window.print()
                    }
                  >
                    🖨 Print Result
                  </button>

                </div>


              </motion.div>

            );

          })}

        </div>

      </div>

    </div>

  );

}

export default StudentResults;
