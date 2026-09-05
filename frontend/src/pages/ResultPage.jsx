import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import "../styles/ResultPage.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function ResultPage() {

  const { examId } = useParams();

  const navigate = useNavigate();

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const resultRef =
    useRef();


  // ============================================
  // FETCH RESULT
  // ============================================

  useEffect(() => {

    fetchResult();

  }, [examId]);


  const fetchResult = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await api.get(
          `/attempt/result/${examId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      console.log(
        "RESULT:",
        res.data
      );

      setResult(
        res.data
      );

    } catch (error) {

      console.log(
        "RESULT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to Load Result"
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================================
  // DOWNLOAD PDF
  // ============================================

  const downloadPDF = async () => {

    try {

      const element =
        resultRef.current;

      const canvas =
        await html2canvas(
          element,
          {
            scale: 2
          }
        );

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );

      const imgWidth = 190;

      const pageHeight = 295;

      const imgHeight =
        (canvas.height * imgWidth) /
        canvas.width;

      let heightLeft =
        imgHeight;

      let position = 10;


      pdf.addImage(
        imgData,
        "PNG",
        10,
        position,
        imgWidth,
        imgHeight
      );


      heightLeft -= pageHeight;


      while (
        heightLeft > 0
      ) {

        position =
          heightLeft -
          imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          10,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;

      }


      pdf.save(
        `${result.exam.title}-Result.pdf`
      );

    } catch (error) {

      console.error(
        "PDF ERROR:",
        error
      );

      alert(
        "Failed to generate PDF"
      );

    }

  };


  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <div className="loading-screen">

        <div className="loader"></div>

        <h2>
          Loading Result...
        </h2>

      </div>

    );

  }


  // ============================================
  // NO RESULT
  // ============================================

  if (!result) {

    return (

      <h2
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        No Result Found
      </h2>

    );

  }


  // ============================================
  // PERCENTAGE
  // ============================================

  const rawPercentage =
    Number(
      result.result?.percentage || 0
    );


  const percentage =
    Number.isFinite(
      rawPercentage
    )
      ? rawPercentage
      : 0;


  // IMPORTANT
  // 100.00 -> 100
  // 85.00 -> 85
  // 75.50 -> 76

  const formattedPercentage =
    Math.round(percentage);


  // ============================================
  // PASS / FAIL
  // ============================================

  const passed =
    percentage >= 40;


  // ============================================
  // BAR DATA
  // ============================================

  const barData = [

    {
      name: "Correct",
      value:
        result.result.correctAnswers || 0
    },

    {
      name: "Wrong",
      value:
        result.result.wrongAnswers || 0
    },

    {
      name: "Score",
      value:
        result.result.score || 0
    },

    {
      name: "Total",
      value:
        result.result.totalMarks || 0
    }

  ];


  // ============================================
  // PIE DATA
  // ============================================

  const pieData = [

    {
      name: "Correct",
      value:
        result.result.correctAnswers || 0
    },

    {
      name: "Wrong",
      value:
        result.result.wrongAnswers || 0
    }

  ];


  const COLORS = [
    "#22c55e",
    "#ef4444"
  ];


  // ============================================
  // PERFORMANCE MESSAGE
  // ============================================

  const getPerformanceMessage =
    () => {

      if (
        percentage >= 90
      ) {
        return "🏆 Outstanding Performance";
      }

      if (
        percentage >= 75
      ) {
        return "🥇 Excellent Performance";
      }

      if (
        percentage >= 60
      ) {
        return "👍 Good Performance";
      }

      if (
        percentage >= 40
      ) {
        return "🙂 Passed Successfully";
      }

      return "📚 Needs Improvement";

    };


  // ============================================
  // UI
  // ============================================

  return (

    <div className="result-container">

      <div
        className="result-card"
        ref={resultRef}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="result-header">

          <h1>
            🎉 Exam Result
          </h1>

          <span
            className={
              passed
                ? "status pass"
                : "status fail"
            }
          >

            {passed
              ? "PASSED"
              : "FAILED"}

          </span>

        </div>


        {/* =========================
            EXAM INFO
        ========================= */}

        <div className="exam-info">

          <h2>
            {result.exam.title}
          </h2>

          <p>
            <strong>
              Subject:
            </strong>{" "}
            {result.exam.subject}
          </p>

          <p>
            <strong>
              Duration:
            </strong>{" "}
            {result.exam.duration}
            {" "}Minutes
          </p>

        </div>


        {/* =========================
            CIRCULAR SCORE
        ========================= */}

        <div className="circle-wrapper">

          <div
            style={{
              width: 180,
              height: 180
            }}
          >

            <CircularProgressbar

              value={percentage}

              text={`${formattedPercentage}%`}

              styles={
                buildStyles({

                  textSize: "16px",

                  pathColor:
                    passed
                      ? "#22c55e"
                      : "#ef4444",

                  textColor:
                    "#111827",

                  trailColor:
                    "#e5e7eb"

                })
              }

            />

          </div>

        </div>


        {/* =========================
            STATS
        ========================= */}

        <div className="result-grid">


          <div className="result-box">

            <h3>
              Score
            </h3>

            <p>
              {result.result.score}
              {" / "}
              {result.result.totalMarks}
            </p>

          </div>


          <div className="result-box">

            <h3>
              Correct
            </h3>

            <p>
              {result.result.correctAnswers}
            </p>

          </div>


          <div className="result-box">

            <h3>
              Wrong
            </h3>

            <p>
              {result.result.wrongAnswers}
            </p>

          </div>


          <div className="result-box">

            <h3>
              Percentage
            </h3>

            <p>
              {formattedPercentage}%
            </p>

          </div>


          <div className="result-box">

            <h3>
              Status
            </h3>

            <p>
              {passed
                ? "Pass"
                : "Fail"}
            </p>

          </div>

        </div>


        {/* =========================
            BAR CHART
        ========================= */}

        <h2 className="chart-title">
          📊 Performance Chart
        </h2>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={barData}
            >

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#2563eb"
                radius={[
                  6,
                  6,
                  0,
                  0
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* =========================
            PIE CHART
        ========================= */}

        <h2 className="chart-title">
          🥧 Correct vs Wrong
        </h2>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie

                data={pieData}

                dataKey="value"

                nameKey="name"

                cx="50%"

                cy="50%"

                outerRadius={90}

                label

              >

                {pieData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* =========================
            AI FEEDBACK
        ========================= */}

        <h2 className="feedback-title">
          🤖 AI Evaluation
        </h2>


        <div className="feedback-list">

          {result.answers?.map(
            (answer, index) => (

              <div
                key={index}
                className={
                  `feedback-card ${
                    answer.isCorrect
                      ? "correct"
                      : "wrong"
                  }`
                }
              >

                <div className="feedback-header">

                  <h3>

                    {answer.isCorrect
                      ? "✅"
                      : "❌"}

                    {" "}
                    Question {index + 1}

                  </h3>


                  <span className="marks-badge">

                    {answer.obtainedMarks}
                    /
                    {
                      answer.aiScore ||
                      answer.obtainedMarks
                    }

                  </span>

                </div>


                <p>
                  <strong>
                    Your Answer:
                  </strong>
                </p>


                <p className="answer-text">

                  {
                    answer.selectedAnswer ||
                    "Not Attempted"
                  }

                </p>


                <p>
                  <strong>
                    Feedback:
                  </strong>
                </p>


                <p className="feedback-text">

                  {answer.aiFeedback}

                </p>

              </div>

            )
          )}

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="summary-card">

          <h2>
            📈 Performance Summary
          </h2>

          <h3>
            {getPerformanceMessage()}
          </h3>

          <p>

            You scored{" "}

            <strong>
              {result.result.score}
            </strong>

            {" "}out of{" "}

            <strong>
              {result.result.totalMarks}
            </strong>

            {" "}marks with{" "}

            <strong>
              {formattedPercentage}%
            </strong>

            {" "}accuracy.

          </p>

        </div>


        {/* =========================
            BUTTONS
        ========================= */}

        <div className="result-actions">

          <button
            className="download-btn"
            onClick={downloadPDF}
          >
            📄 Download PDF
          </button>


          <button
            className="dashboard-btn"
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>

  );

}

export default ResultPage;
