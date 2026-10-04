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

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);

  const resultRef = useRef(null);


  // ============================================
  // FETCH RESULT
  // ============================================

  const fetchResult = async () => {

    try {

      const token = localStorage.getItem("token");

      console.log("================================");
      console.log("RESULT PAGE STARTED");
      console.log("Exam ID:", examId);
      console.log("Token exists:", !!token);
      console.log("Calling API...");


      const res = await api.get(
        `/exam-attempts/result/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log("API SUCCESS");
      console.log("Status:", res.status);
      console.log("Response:", res.data);


      // IMPORTANT:
      // Store complete backend response
      setResult(res.data);

    }

    catch (error) {

      console.error("================================");
      console.error("RESULT API ERROR");
      console.error("Message:", error.message);
      console.error("Status:", error.response?.status);

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Full error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to load result"
      );


      setResult(null);

    }

    finally {

      console.log(
        "SETTING LOADING FALSE"
      );

      setLoading(false);

    }

  };


  // ============================================
  // CALL FETCH RESULT
  // ============================================

  useEffect(() => {

    if (examId) {

      fetchResult();

    }

  }, [examId]);


  // ============================================
  // DOWNLOAD PDF
  // ============================================

  const downloadPDF = async () => {

    try {

      const element = resultRef.current;


      if (!element) {

        alert(
          "Result content not found"
        );

        return;

      }


      const canvas = await html2canvas(
        element,
        {
          scale: 2
        }
      );


      const imgData = canvas.toDataURL(
        "image/png"
      );


      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );


      const imgWidth = 190;

      const pageHeight = 295;


      const imgHeight =
        (canvas.height * imgWidth) /
        canvas.width;


      let heightLeft = imgHeight;

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


      while (heightLeft > 0) {

        position =
          heightLeft - imgHeight;


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


      const examTitle =
        result.exam?.title ||
        "Exam";


      pdf.save(
        `${examTitle}-Result.pdf`
      );

    }

    catch (error) {

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

      <div
        className="no-result-screen"
      >

        <h2>
          No Result Found
        </h2>


        <button
          onClick={() =>
            navigate(
              "/student-dashboard"
            )
          }
        >

          Back to Dashboard

        </button>

      </div>

    );

  }


  // ============================================
  // RESULT DATA
  // ============================================

  const exam = result.exam || {};

  const resultData = result.result || {};

  const answers = result.answers || [];


  // ============================================
  // PERCENTAGE
  // ============================================

  const rawPercentage =
    Number(
      resultData.percentage || 0
    );


  const percentage =
    Number.isFinite(rawPercentage)
      ? rawPercentage
      : 0;


  const formattedPercentage =
    Math.round(percentage);


  // ============================================
  // SCORE
  // ============================================

  const score =
    Number(
      resultData.score || 0
    );


  const totalMarks =
    Number(
      resultData.totalMarks ||
      exam.totalMarks ||
      0
    );


  const correctAnswers =
    Number(
      resultData.correctAnswers || 0
    );


  const wrongAnswers =
    Number(
      resultData.wrongAnswers || 0
    );


  const skippedAnswers =
    Number(
      resultData.skippedAnswers || 0
    );


  // ============================================
  // PASS / FAIL
  // ============================================

  const passed =
    resultData.result === "Pass";


  // ============================================
  // BAR DATA
  // ============================================

  const barData = [

    {
      name: "Correct",
      value: correctAnswers
    },

    {
      name: "Wrong",
      value: wrongAnswers
    },

    {
      name: "Score",
      value: score
    },

    {
      name: "Total",
      value: totalMarks
    }

  ];


  // ============================================
  // PIE DATA
  // ============================================

  const pieData = [

    {
      name: "Correct",
      value: correctAnswers
    },

    {
      name: "Wrong",
      value: wrongAnswers
    }

  ];


  const COLORS = [
    "#22c55e",
    "#ef4444"
  ];


  // ============================================
  // PERFORMANCE MESSAGE
  // ============================================

  const getPerformanceMessage = () => {

    if (percentage >= 90) {

      return "🏆 Outstanding Performance";

    }


    if (percentage >= 75) {

      return "🥇 Excellent Performance";

    }


    if (percentage >= 60) {

      return "👍 Good Performance";

    }


    if (passed) {

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


        {/* =====================================
            HEADER
        ===================================== */}

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


        {/* =====================================
            EXAM INFO
        ===================================== */}

        <div className="exam-info">

          <h2>
            {exam.title || "Exam"}
          </h2>


          <p>

            <strong>
              Subject:
            </strong>{" "}

            {exam.subject || "N/A"}

          </p>


          <p>

            <strong>
              Duration:
            </strong>{" "}

            {exam.duration || 0}

            {" "}Minutes

          </p>

        </div>


        {/* =====================================
            CIRCULAR SCORE
        ===================================== */}

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
                    "#ffffff",

                  trailColor:
                    "#3b3152"

                })
              }

            />

          </div>

        </div>


        {/* =====================================
            STATS
        ===================================== */}

        <div className="result-grid">


          <div className="result-box">

            <h3>
              Score
            </h3>

            <p>

              {score}

              {" / "}

              {totalMarks}

            </p>

          </div>


          <div className="result-box">

            <h3>
              Correct
            </h3>

            <p>
              {correctAnswers}
            </p>

          </div>


          <div className="result-box">

            <h3>
              Wrong
            </h3>

            <p>
              {wrongAnswers}
            </p>

          </div>


          <div className="result-box">

            <h3>
              Skipped
            </h3>

            <p>
              {skippedAnswers}
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


        {/* =====================================
            BAR CHART
        ===================================== */}

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
                stroke="#c4b5fd"
              />

              <YAxis
                stroke="#c4b5fd"
              />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#a855f7"
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


        {/* =====================================
            PIE CHART
        ===================================== */}

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


        {/* =====================================
            AI EVALUATION
        ===================================== */}

        <h2 className="feedback-title">

          🤖 AI Evaluation

        </h2>


        <div className="feedback-list">


          {answers.length > 0 ? (

            answers.map(
              (answer, index) => (

                <div
                  key={
                    answer.questionId ||
                    index
                  }
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

                      {answer.obtainedMarks ?? 0}

                      /

                      {
                        answer.aiScore ??
                        answer.obtainedMarks ??
                        0
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

                    {
                      answer.aiFeedback ||
                      "No feedback available."
                    }

                  </p>


                </div>

              )

            )

          ) : (

            <div className="no-feedback">

              <p>
                📝 No question-wise evaluation available.
              </p>

            </div>

          )}

        </div>


        {/* =====================================
            SUMMARY
        ===================================== */}

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
              {score}
            </strong>

            {" "}out of{" "}

            <strong>
              {totalMarks}
            </strong>

            {" "}marks with{" "}

            <strong>
              {formattedPercentage}%
            </strong>

            {" "}accuracy.

          </p>

        </div>


        {/* =====================================
            BUTTONS
        ===================================== */}

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