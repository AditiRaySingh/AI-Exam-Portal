import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/StudentResults.css";

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

  const [results, setResults] = useState([]);

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

      console.log(res.data);

      setResults(res.data.history || []);

    } catch (error) {

      console.log(error);

    }

  };

  if (results.length === 0) {

    return (

      <div className="no-results">

        <h1>No Results Found</h1>

      </div>

    );

  }

  return (

    <div className="results-page">

      <h1 className="page-title">

        📊 My Exam Results

      </h1>

      {

        results.map((result) => {

          const percentage =
            result.percentage || 0;

          const chartData = [

            {
              name: "Correct",
              value: result.correctCount
            },

            {
              name: "Wrong",
              value: result.wrongCount
            }

          ];

          const scoreData = [

            {
              name: "Score",
              Marks: result.score
            },

            {
              name: "Total",
              Marks: result.totalMarks
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
                        return (

            <motion.div

              key={result._id}

              className="result-card"

              initial={{ opacity: 0, y: 40 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5 }}

            >

              <div className="result-header">

                <h2>

                  <FaBook />

                  {" "}

                  {result.examId?.title || "Exam"}

                </h2>

                <span className="badge">

                  <FaTrophy />

                  {" "}

                  {badge}

                </span>

              </div>

              <div className="summary-grid">

                <div className="summary-box">

                  <h4>Score</h4>

                  <h2>

                    {result.score} / {result.totalMarks}

                  </h2>

                </div>

                <div className="summary-box">

                  <h4>Percentage</h4>

                  <h2>

                    {percentage.toFixed(2)}%

                  </h2>

                </div>

                <div className="summary-box">

                  <h4>Correct</h4>

                  <h2>

                    <FaCheckCircle
                      style={{
                        color: "green",
                        marginRight: "6px"
                      }}
                    />

                    {result.correctCount}

                  </h2>

                </div>

                <div className="summary-box">

                  <h4>Wrong</h4>

                  <h2>

                    <FaTimesCircle
                      style={{
                        color: "red",
                        marginRight: "6px"
                      }}
                    />

                    {result.wrongCount}

                  </h2>

                </div>

              </div>

              <div className="progress-section">

                <div className="circle">

                  <CircularProgressbar

                    value={percentage}

                    text={`${percentage}%`}

                    styles={buildStyles({

                      pathColor:
                        percentage >= 40
                          ? "#22c55e"
                          : "#ef4444",

                      textColor: "#111",

                      trailColor: "#ddd"

                    })}

                  />

                </div>

                <div className="performance">

                  <h2>Performance</h2>

                  <p>

                    Status :

                    <strong>

                      {" "}

                      {result.result}

                    </strong>

                  </p>

                  <p>

                    Submitted :

                    <strong>

                      {" "}

                      {

                        new Date(
                          result.submittedAt
                        ).toLocaleString()

                      }

                    </strong>

                  </p>

                </div>

              </div>
                            <div className="charts">

                <div className="chart-box">

                  <h3>📊 Marks Analysis</h3>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
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

                      <Legend />

                      <Bar
                        dataKey="Marks"
                        fill="#4f46e5"
                        radius={[8, 8, 0, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

                <div className="chart-box">

                  <h3>🥧 Correct vs Wrong</h3>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >

                    <PieChart>

                      <Pie

                        data={chartData}

                        dataKey="value"

                        nameKey="name"

                        outerRadius={100}

                        innerRadius={50}

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
                            <div className="evaluation-section">

                <h2 className="evaluation-title">

                  🤖 AI Evaluation

                </h2>

                {

                  result.answers?.length > 0 ? (

                    result.answers.map((answer, index) => (

                      <motion.div

                        key={index}

                        className="answer-card"

                        initial={{ opacity: 0, y: 20 }}

                        whileInView={{ opacity: 1, y: 0 }}

                        whileHover={{ scale: 1.02 }}

                        transition={{ duration: 0.4 }}

                      >

                        <div className="answer-header">

                          <h3>

                            Question {index + 1}

                          </h3>

                          {

                            answer.isCorrect ? (

                              <span className="correct">

                                <FaCheckCircle />

                                {" "}Correct

                              </span>

                            ) : (

                              <span className="wrong">

                                <FaTimesCircle />

                                {" "}Wrong

                              </span>

                            )

                          }

                        </div>

                        <div className="answer-content">

                          <div className="answer-row">

                            <strong>Your Answer</strong>

                            <p>

                              {

                                answer.selectedAnswer ||

                                "Not Attempted"

                              }

                            </p>

                          </div>

                          <div className="answer-row">

                            <strong>AI Score</strong>

                            <p>

                              {answer.aiScore}

                            </p>

                          </div>

                          <div className="answer-row">

                            <strong>Feedback</strong>

                            <p>

                              {

                                answer.aiFeedback ||

                                "No feedback available"

                              }

                            </p>

                          </div>

                        </div>

                      </motion.div>

                    ))

                  ) : (

                    <div className="no-ai">

                      <h3>

                        No AI Evaluation Available

                      </h3>

                    </div>

                  )

                }

              </div>
              

                            <div className="result-footer">

                <button
                  className="download-btn"
                  onClick={() => window.print()}
                >
                  🖨 Print Result
                </button>

                <button
                  className="download-btn"
                  onClick={() => {

                    const text =
`Exam : ${result.examId?.title}

Score : ${result.score}/${result.totalMarks}

Percentage : ${percentage.toFixed(2)}%

Status : ${result.result}`;

                    navigator.clipboard.writeText(text);

                    alert("Result copied to clipboard!");

                  }}
                >
                  📋 Copy Result
                </button>

              </div>

            </motion.div>

          );

        })

      }

    </div>

  );

}

export default StudentResults;