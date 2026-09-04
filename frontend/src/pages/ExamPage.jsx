import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ExamPage.css";

function ExamPage() {

  const navigate = useNavigate();

  const examId =
    localStorage.getItem("examId");

  console.log("Exam ID =", examId);


  // =====================================================
  // STATE
  // =====================================================

  const [questions, setQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);


  // =====================================================
  // EXAM TIMER
  // =====================================================

  const [timeLeft, setTimeLeft] =
    useState(null);

  const [examEndTime, setExamEndTime] =
    useState(null);


  // =====================================================
  // LOAD EXAM DETAILS
  // =====================================================

  const fetchExamDetails = async () => {

    try {

      const token =
        localStorage.getItem("token");


      const res =
        await api.get(
          `/exams/${examId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      console.log(
        "EXAM DETAILS:",
        res.data
      );


      const exam =
        res.data.exam;


      if (!exam) {

        alert(
          "Exam details not found."
        );

        navigate(
          "/student-dashboard"
        );

        return false;
      }


      // =================================================
      // GET START AND END TIME
      // =================================================

      const startTime =
        new Date(
          exam.startTime
        ).getTime();


      const endTime =
        new Date(
          exam.endTime
        ).getTime();


      const currentTime =
        Date.now();


      console.log(
        "Start Time:",
        new Date(startTime)
      );

      console.log(
        "End Time:",
        new Date(endTime)
      );

      console.log(
        "Current Time:",
        new Date(currentTime)
      );


      // =================================================
      // INVALID TIME
      // =================================================

      if (
        Number.isNaN(startTime) ||
        Number.isNaN(endTime)
      ) {

        alert(
          "Exam timing is not configured correctly."
        );

        navigate(
          "/student-dashboard"
        );

        return false;
      }


      // =================================================
      // EXAM NOT STARTED
      // =================================================

      if (
        currentTime < startTime
      ) {

        alert(
          `Exam will start at ${new Date(
            startTime
          ).toLocaleString("en-IN")}`
        );

        navigate(
          "/student-dashboard"
        );

        return false;
      }


      // =================================================
      // EXAM ALREADY ENDED
      // =================================================

      if (
        currentTime >= endTime
      ) {

        alert(
          "This exam has already ended."
        );

        navigate(
          "/student-dashboard"
        );

        return false;
      }


      // =================================================
      // CALCULATE REMAINING TIME
      // =================================================

      const remainingSeconds =
        Math.floor(
          (endTime - currentTime) / 1000
        );


      console.log(
        "Remaining Seconds:",
        remainingSeconds
      );


      setExamEndTime(
        endTime
      );


      setTimeLeft(
        remainingSeconds
      );


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


      navigate(
        "/student-dashboard"
      );


      return false;
    }
  };


  // =====================================================
  // LOAD QUESTIONS
  // =====================================================

  const fetchQuestions = async () => {

    try {

      const token =
        localStorage.getItem("token");


      const res =
        await api.get(
          `/questions/exam/${examId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      console.log(
        "QUESTIONS:",
        res.data.questions
      );


      setQuestions(
        res.data.questions || []
      );


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
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    const loadExam = async () => {

      try {

        // First check exam timing
        const examAllowed =
          await fetchExamDetails();


        // Only load questions
        // if exam is currently active
        if (examAllowed) {

          await fetchQuestions();

        }

      } finally {

        setLoading(false);

      }

    };


    if (!examId) {

      alert(
        "Exam ID not found."
      );

      navigate(
        "/student-dashboard"
      );

      return;
    }


    loadExam();

  }, []);


  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {

    // Timer not ready
    if (
      timeLeft === null
    ) {
      return;
    }


    // Exam is submitting
    if (
      submitting
    ) {
      return;
    }


    // ===================================================
    // TIME FINISHED
    // ===================================================

    if (
      timeLeft <= 0
    ) {

      console.log(
        "TIME FINISHED - AUTO SUBMIT"
      );


      handleSubmit();

      return;
    }


    // ===================================================
    // COUNTDOWN
    // ===================================================

    const timer =
      setInterval(() => {

        setTimeLeft(
          previousTime => {

            if (
              previousTime === null
            ) {
              return 0;
            }


            if (
              previousTime <= 1
            ) {
              return 0;
            }


            return previousTime - 1;

          }
        );

      }, 1000);


    // Cleanup timer
    return () => {

      clearInterval(
        timer
      );

    };

  }, [
    timeLeft,
    submitting
  ]);


  // =====================================================
  // SAVE ANSWER
  // =====================================================

  const handleAnswer = (
    answer
  ) => {

    setAnswers(
      previousAnswers => ({

        ...previousAnswers,

        [
          questions[
            currentQuestion
          ]._id
        ]: answer

      })
    );

  };


  // =====================================================
  // PREVIOUS QUESTION
  // =====================================================

  const previousQuestion = () => {

    if (
      currentQuestion > 0
    ) {

      setCurrentQuestion(
        currentQuestion - 1
      );

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
        currentQuestion + 1
      );

    }

  };


  // =====================================================
  // JUMP TO QUESTION
  // =====================================================

  const jumpToQuestion = (
    index
  ) => {

    setCurrentQuestion(
      index
    );

  };


  // =====================================================
  // SUBMIT EXAM
  // =====================================================

  const handleSubmit = async () => {

    // Prevent duplicate submission
    if (
      submitting
    ) {
      return;
    }


    try {

      setSubmitting(
        true
      );


      const token =
        localStorage.getItem("token");


      // =================================================
      // CONVERT ANSWERS
      // =================================================

      const formattedAnswers =
        Object.keys(
          answers
        ).map(
          questionId => ({

            questionId,

            selectedAnswer:
              answers[
                questionId
              ]

          })
        );


      console.log(
        "ANSWERS BEING SUBMITTED:",
        formattedAnswers
      );


      // =================================================
      // SUBMIT TO BACKEND
      // =================================================

      await api.post(
        "/attempt/submit",
        {
          examId,

          answers:
            formattedAnswers
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


      // =================================================
      // GO TO RESULT
      // =================================================

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


      // If submission failed,
      // allow user to try again
      setSubmitting(
        false
      );

    }

  };


  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (
    loading
  ) {

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

  if (
    questions.length === 0
  ) {

    return (

      <h2
        style={{
          textAlign:
            "center",

          marginTop:
            "100px"
        }}
      >
        No Questions Found
      </h2>

    );

  }


  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const question =
    questions[
      currentQuestion
    ];


  // =====================================================
  // TIMER FORMAT
  // =====================================================

  const hours =
    Math.floor(
      (timeLeft || 0) /
      3600
    );


  const minutes =
    Math.floor(
      ((timeLeft || 0) %
        3600) /
      60
    );


  const seconds =
    (timeLeft || 0) %
    60;


  // =====================================================
  // TIMER TEXT
  // =====================================================

  const formattedTime =
    `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0"
    )}`;


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="exam-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="exam-header">

        <div>

          <h1>
            Online Examination
          </h1>

          <p>
            Question{" "}
            {currentQuestion + 1}
            {" "}
            of{" "}
            {questions.length}
          </p>

        </div>


        {/* =================================================
            TIMER
        ================================================= */}

        <div
          className={
            timeLeft !== null &&
            timeLeft <= 300
              ? "timer-box timer-warning"
              : "timer-box"
          }
        >

          ⏰{" "}

          {formattedTime}

        </div>

      </div>


      {/* =================================================
          EXAM END INFORMATION
      ================================================= */}

      {examEndTime && (

        <div className="exam-end-info">

          Exam ends at{" "}

          {new Date(
            examEndTime
          ).toLocaleTimeString(
            "en-IN",
            {
              hour:
                "2-digit",

              minute:
                "2-digit",

              hour12:
                true
            }
          )}

        </div>

      )}


      {/* =================================================
          PROGRESS BAR
      ================================================= */}

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width:
              `${
                (
                  (
                    currentQuestion + 1
                  ) /
                  questions.length
                ) *
                100
              }%`
          }}
        ></div>

      </div>


      {/* =================================================
          QUESTION CARD
      ================================================= */}

      <div className="question-card">

        <h2>
          {question.question}
        </h2>


        {/* =================================================
            MCQ
        ================================================= */}

        {question.questionType ===
          "mcq" && (

          <div className="options">

            {question.options?.map(
              (
                option,
                index
              ) => {

                const isSelected =
                  answers[
                    question._id
                  ] === option;


                return (

                  <button
                    key={index}

                    type="button"

                    className={
                      isSelected
                        ? "option selected"
                        : "option"
                    }

                    onClick={() =>
                      handleAnswer(
                        option
                      )
                    }
                  >

                    {option}

                  </button>

                );

              }
            )}

          </div>

        )}


        {/* =================================================
            TRUE / FALSE
        ================================================= */}

        {question.questionType ===
          "truefalse" && (

          <div className="options">

            <button
              type="button"

              className={
                answers[
                  question._id
                ] === "True"
                  ? "option selected"
                  : "option"
              }

              onClick={() =>
                handleAnswer(
                  "True"
                )
              }
            >
              True
            </button>


            <button
              type="button"

              className={
                answers[
                  question._id
                ] === "False"
                  ? "option selected"
                  : "option"
              }

              onClick={() =>
                handleAnswer(
                  "False"
                )
              }
            >
              False
            </button>

          </div>

        )}


        {/* =================================================
            SHORT ANSWER
        ================================================= */}

        {(
          question.questionType ===
            "shortanswer" ||

          question.questionType ===
            "veryshortanswer"

        ) && (

          <textarea
            rows="6"

            placeholder="Write your answer..."

            value={
              answers[
                question._id
              ] || ""
            }

            onChange={(event) =>
              handleAnswer(
                event.target.value
              )
            }
          />

        )}

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="navigation">


        {/* PREVIOUS */}

        <button
          type="button"

          className="prev-btn"

          disabled={
            currentQuestion === 0
          }

          onClick={
            previousQuestion
          }
        >
          Previous
        </button>


        {/* NEXT */}

        {currentQuestion !==
          questions.length - 1 ? (

          <button
            type="button"

            className="next-btn"

            onClick={
              nextQuestion
            }
          >
            Next
          </button>

        ) : (

          <button
            type="button"

            className="submit-btn"

            disabled={
              submitting
            }

            onClick={
              handleSubmit
            }
          >

            {submitting
              ? "Submitting..."
              : "Submit Exam"}

          </button>

        )}

      </div>


      {/* =================================================
          QUESTION PALETTE
      ================================================= */}

      <div className="question-palette">

        <h3>
          Questions
        </h3>


        <div className="palette-grid">

          {questions.map(
            (
              q,
              index
            ) => (

              <button
                type="button"

                key={q._id}

                className={

                  currentQuestion ===
                    index

                    ? "palette-btn active"

                    : answers[
                        q._id
                      ]

                    ? "palette-btn answered"

                    : "palette-btn"

                }

                onClick={() =>
                  jumpToQuestion(
                    index
                  )
                }
              >

                {index + 1}

              </button>

            )
          )}

        </div>

      </div>

    </div>

  );

}

export default ExamPage;