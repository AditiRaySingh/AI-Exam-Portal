import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ExamPage.css";


function ExamPage() {
  const navigate = useNavigate();

  const examId = localStorage.getItem("examId");

  console.log("Exam ID =", examId);

  // =====================================================
  // STATE
  // =====================================================

  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // CAMERA
  // =====================================================

  const videoRef = useRef(null);

  const cameraStreamRef = useRef(null);

  const [cameraStream, setCameraStream] = useState(null);

  const [cameraError, setCameraError] = useState("");

  // =====================================================
  // TIMER
  // =====================================================

  const [timeLeft, setTimeLeft] = useState(null);

  const [examEndTime, setExamEndTime] = useState(null);

  // =====================================================
  // LOAD EXAM DETAILS
  // =====================================================

  const fetchExamDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/exams/${examId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("EXAM DETAILS:", res.data);

      const exam = res.data.exam;

      if (!exam) {
        alert("Exam details not found.");
        navigate("/student-dashboard");
        return false;
      }

      // ---------------------------------------------------
      // GET EXAM TIMES
      // ---------------------------------------------------

      const startTime = new Date(exam.startTime).getTime();

      const endTime = new Date(exam.endTime).getTime();

      const currentTime = Date.now();

      console.log("Start:", new Date(startTime));
      console.log("End:", new Date(endTime));
      console.log("Current:", new Date(currentTime));

      // ---------------------------------------------------
      // CHECK INVALID TIME
      // ---------------------------------------------------

      if (
        Number.isNaN(startTime) ||
        Number.isNaN(endTime)
      ) {
        alert("Exam timing is not configured correctly.");

        navigate("/student-dashboard");

        return false;
      }

      // ---------------------------------------------------
      // EXAM NOT STARTED
      // ---------------------------------------------------

      if (currentTime < startTime) {
        alert(
          `Exam will start at ${new Date(
            startTime
          ).toLocaleString("en-IN")}`
        );

        navigate("/student-dashboard");

        return false;
      }

      // ---------------------------------------------------
      // EXAM ENDED
      // ---------------------------------------------------

      if (currentTime >= endTime) {
        alert("This exam has already ended.");

        navigate("/student-dashboard");

        return false;
      }

      // ---------------------------------------------------
      // CALCULATE TIME
      // ---------------------------------------------------

      const remainingSeconds = Math.max(
        0,
        Math.floor((endTime - currentTime) / 1000)
      );

      console.log(
        "Remaining seconds:",
        remainingSeconds
      );

      setExamEndTime(endTime);

      setTimeLeft(remainingSeconds);

      return true;
    } catch (error) {
      console.error(
        "EXAM DETAILS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load exam details."
      );

      navigate("/student-dashboard");

      return false;
    }
  };

  // =====================================================
  // LOAD QUESTIONS
  // =====================================================

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/questions/exam/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "QUESTIONS RESPONSE:",
        res.data
      );

      const fetchedQuestions =
        res.data.questions || [];

      console.log(
        "QUESTIONS:",
        fetchedQuestions
      );

      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error(
        "QUESTIONS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load questions."
      );
    }
  };

  // =====================================================
  // START WEBCAM
  // =====================================================

  const startWebcam = async () => {
    try {
      setCameraError("");

      // Browser support
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError(
          "Camera is not supported by this browser."
        );

        return;
      }

      console.log(
        "REQUESTING CAMERA PERMISSION..."
      );

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 640,
            },
            height: {
              ideal: 480,
            },
          },
          audio: false,
        });

      console.log(
        "CAMERA STARTED"
      );

      cameraStreamRef.current = stream;

      setCameraStream(stream);
    } catch (error) {
      console.error(
        "WEBCAM ERROR:",
        error
      );

      if (
        error.name === "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device."
        );
      } else if (
        error.name === "NotReadableError"
      ) {
        setCameraError(
          "Camera is already being used by another application."
        );
      } else {
        setCameraError(
          "Unable to access the camera."
        );
      }
    }
  };

  // =====================================================
  // CONNECT CAMERA STREAM TO VIDEO
  // =====================================================

  useEffect(() => {
    if (
      videoRef.current &&
      cameraStream
    ) {
      videoRef.current.srcObject =
        cameraStream;

      videoRef.current
        .play()
        .catch((error) => {
          console.log(
            "VIDEO PLAY ERROR:",
            error
          );
        });
    }
  }, [cameraStream]);

  // =====================================================
  // STOP WEBCAM
  // =====================================================

  const stopWebcam = () => {
    console.log(
      "STOPPING CAMERA..."
    );

    const stream =
      cameraStreamRef.current;

    if (stream) {
      stream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    cameraStreamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraStream(null);
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadExam = async () => {
      try {
        const examAllowed =
          await fetchExamDetails();

        if (!examAllowed) {
          return;
        }

        await fetchQuestions();

        await startWebcam();
      } finally {
        setLoading(false);
      }
    };

    if (!examId) {
      alert("Exam ID not found.");

      navigate("/student-dashboard");

      return;
    }

    loadExam();
  }, []);

  // =====================================================
  // CLEANUP CAMERA
  // =====================================================

  useEffect(() => {
    return () => {
      const stream =
        cameraStreamRef.current;

      if (stream) {
        stream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      cameraStreamRef.current = null;
    };
  }, []);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (
      timeLeft === null ||
      examEndTime === null ||
      submitting
    ) {
      return;
    }

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor(
          (examEndTime - Date.now()) /
            1000
        )
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    examEndTime,
    submitting,
  ]);

  // =====================================================
  // AUTO SUBMIT WHEN TIMER REACHES ZERO
  // =====================================================

  useEffect(() => {
    if (
      timeLeft === 0 &&
      !submitting &&
      questions.length > 0
    ) {
      console.log(
        "TIME FINISHED - AUTO SUBMIT"
      );

      handleSubmit();
    }
  }, [
    timeLeft,
    submitting,
    questions.length,
  ]);

  // =====================================================
  // SAVE ANSWER
  // =====================================================

  const handleAnswer = (answer) => {
    if (!questions[currentQuestion]) {
      return;
    }

    const questionId =
      questions[currentQuestion]._id;

    setAnswers((previousAnswers) => ({
      ...previousAnswers,

      [questionId]: answer,
    }));
  };

  // =====================================================
  // PREVIOUS QUESTION
  // =====================================================

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const nextQuestion = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // JUMP TO QUESTION
  // =====================================================

  const jumpToQuestion = (index) => {
    if (
      index >= 0 &&
      index < questions.length
    ) {
      setCurrentQuestion(index);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // SUBMIT EXAM
  // =====================================================

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const token =
        localStorage.getItem("token");

      // -------------------------------------------------
      // FORMAT ANSWERS
      // -------------------------------------------------

      const formattedAnswers =
        Object.keys(answers).map(
          (questionId) => ({
            questionId,

            selectedAnswer:
              answers[questionId],
          })
        );

      console.log(
        "ANSWERS BEING SUBMITTED:",
        formattedAnswers
      );

      // -------------------------------------------------
      // SEND TO BACKEND
      // -------------------------------------------------

      await api.post(
        "/attempt/submit",
        {
          examId,

          answers: formattedAnswers,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // -------------------------------------------------
      // STOP CAMERA
      // -------------------------------------------------

      stopWebcam();

      // -------------------------------------------------
      // RESULT PAGE
      // -------------------------------------------------

      navigate(
        `/result/${examId}`
      );
    } catch (error) {
      console.error(
        "SUBMIT ERROR:",
        error
      );

      console.error(
        "SERVER ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to Submit Exam"
      );

      setSubmitting(false);
    }
  };

  // =====================================================
  // FORMAT TIMER
  // =====================================================

  const formatTime = (totalSeconds) => {
    if (
      totalSeconds === null ||
      totalSeconds < 0
    ) {
      return "00:00:00";
    }

    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds =
      totalSeconds % 60;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>

        <h2>
          Loading Exam...
        </h2>
      </div>
    );
  }

  // =====================================================
  // NO QUESTIONS
  // =====================================================

  if (questions.length === 0) {
    return (
      <div className="no-questions">
        <h2>
          No Questions Found
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

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const question =
    questions[currentQuestion];

  // =====================================================
  // CURRENT ANSWER
  // =====================================================

  const currentAnswer =
    answers[question._id] || "";

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="exam-container">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="exam-header">

        <div className="exam-title-section">

          <h2>
            Online Examination
          </h2>

          <p>
            Question{" "}
            {currentQuestion + 1}{" "}
            of{" "}
            {questions.length}
          </p>

        </div>

        <div
          className={`timer ${
            timeLeft !== null &&
            timeLeft <= 300
              ? "timer-danger"
              : ""
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>

      </div>


      {/* ================================================
          CAMERA
      ================================================= */}

      <div className="camera-wrapper">

        <div className="camera-container">

          {cameraStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
          ) : (
            <div className="camera-placeholder">
              <span>📷</span>

              <p>
                Camera unavailable
              </p>
            </div>
          )}

          <div className="camera-label">
            Camera
          </div>

          {cameraStream && (
            <div className="camera-status">
              Monitoring
            </div>
          )}

        </div>

      </div>


      {/* ================================================
          CAMERA ERROR
      ================================================= */}

      {cameraError && (
        <div className="camera-error">
          ⚠ {cameraError}
        </div>
      )}


      {/* ================================================
          PROGRESS
      ================================================= */}

      <div className="progress-section">

        <div className="progress-info">
          <span>
            Progress
          </span>

          <span>
            {currentQuestion + 1}/
            {questions.length}
          </span>
        </div>

        <div className="exam-progress">

          <div
            className="exam-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

      </div>


      {/* ================================================
          QUESTION PALETTE
      ================================================= */}

      <div className="question-palette">

        <div className="palette-title">
          Questions
        </div>

        <div className="palette-buttons">

          {questions.map(
            (item, index) => {

              const answered =
                answers[item._id] !==
                  undefined &&
                answers[item._id] !==
                  "";

              return (
                <button
                  key={item._id}
                  className={`
                    ${
                      index ===
                      currentQuestion
                        ? "active"
                        : ""
                    }
                    ${
                      answered
                        ? "answered"
                        : ""
                    }
                  `}
                  onClick={() =>
                    jumpToQuestion(
                      index
                    )
                  }
                >
                  {index + 1}
                </button>
              );
            }
          )}

        </div>

      </div>


      {/* ================================================
          QUESTION CARD
      ================================================= */}

      <div className="question-card">

        <div className="question-number">
          Question {currentQuestion + 1}
        </div>

        <div className="question-type">
          {question.questionType ||
            question.type ||
            "Question"}
        </div>

        <h3 className="question-text">
          {question.question}
        </h3>


        {/* ==============================================
            MCQ
        ============================================== */}

        {(
          question.questionType ===
            "mcq" ||
          question.questionType ===
            "MCQ" ||
          question.type === "mcq"
        ) && (

          <div className="options">

            {(
              question.options ||
              []
            ).map(
              (option, index) => {

                const isSelected =
                  currentAnswer ===
                  option;

                return (
                  <label
                    key={index}
                    className={`option ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      checked={
                        isSelected
                      }
                      onChange={() =>
                        handleAnswer(
                          option
                        )
                      }
                    />

                    <span className="option-text">
                      {option}
                    </span>

                  </label>
                );
              }
            )}

          </div>

        )}


        {/* ==============================================
            TRUE / FALSE
        ============================================== */}

        {(
          question.questionType ===
            "truefalse" ||
          question.questionType ===
            "trueFalse" ||
          question.type ===
            "truefalse"
        ) && (

          <div className="options">

            {[
              "True",
              "False",
            ].map(
              (option) => {

                const isSelected =
                  currentAnswer ===
                  option;

                return (
                  <label
                    key={option}
                    className={`option ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      checked={
                        isSelected
                      }
                      onChange={() =>
                        handleAnswer(
                          option
                        )
                      }
                    />

                    <span className="option-text">
                      {option}
                    </span>

                  </label>
                );
              }
            )}

          </div>

        )}


        {/* ==============================================
            SHORT ANSWER
        ============================================== */}

        {(
          question.questionType ===
            "shortanswer" ||
          question.questionType ===
            "shortAnswer" ||
          question.type ===
            "shortanswer"
        ) && (

          <textarea
            className="answer-input"
            placeholder="Write your answer here..."
            value={currentAnswer}
            onChange={(e) =>
              handleAnswer(
                e.target.value
              )
            }
          />

        )}


        {/* ==============================================
            VERY SHORT ANSWER
        ============================================== */}

        {(
          question.questionType ===
            "veryshortanswer" ||
          question.questionType ===
            "veryShortAnswer" ||
          question.type ===
            "veryshortanswer"
        ) && (

          <input
            type="text"
            className="short-answer-input"
            placeholder="Enter your answer..."
            value={currentAnswer}
            onChange={(e) =>
              handleAnswer(
                e.target.value
              )
            }
          />

        )}

      </div>


      {/* ================================================
          NAVIGATION
      ================================================= */}

      <div className="exam-navigation">

        <button
          className="prev-btn"
          onClick={
            previousQuestion
          }
          disabled={
            currentQuestion === 0 ||
            submitting
          }
        >
          ← Previous
        </button>


        <div className="navigation-center">

          <span>
            {currentQuestion + 1} /{" "}
            {questions.length}
          </span>

        </div>


        {currentQuestion <
        questions.length - 1 ? (

          <button
            className="next-btn"
            onClick={
              nextQuestion
            }
            disabled={submitting}
          >
            Next →
          </button>

        ) : (

          <button
            className="submit-btn"
            onClick={
              handleSubmit
            }
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Exam"}
          </button>

        )}

      </div>

    </div>
  );
}

export default ExamPage;