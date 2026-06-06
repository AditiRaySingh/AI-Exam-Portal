import {
  useState,
  useEffect
} from "react";


import {
 useNavigate
} from "react-router-dom";


import api from "../services/api";

function ExamPage() {

  const navigate = useNavigate();
  const [questions,
    setQuestions]
    = useState([]);

  const [currentQuestion,
    setCurrentQuestion]
    = useState(0);

  const [timeLeft,
    setTimeLeft]
    = useState(1800);

  const [answers,
    setAnswers]
    = useState({});

  // TEMP examId
  const examId =
    localStorage.getItem(
      "examId"
    );

  // fetch questions
  useEffect(() => {

    fetchQuestions();

  }, []);

  const fetchQuestions =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.get(
            `/exam/questions/${examId}`,
            {
              headers:{
                Authorization:
                `Bearer ${token}`
              }
            }
          );

        setQuestions(
          res.data.questions
        );

      }

      catch(error){

        console.log(
          error
        );
      }
    };

  // timer
  useEffect(() => {

    const timer =
      setInterval(()=>{

        setTimeLeft(
          prev=>prev-1
        );

      },1000);

      return()=>
        clearInterval(
          timer
        );

  },[]);

  if(
    questions.length===0
  ){
    return(
      <h2>
        Loading...
      </h2>
    );
  }

  const minutes =
    Math.floor(
      timeLeft/60
    );

  const seconds =
    timeLeft%60;

  const question =
    questions[
      currentQuestion
    ];

  // select answer
  const handleAnswer =
    (option)=>{

      setAnswers({
        ...answers,
        [question._id]:
          option
      });

    };

  // submit
  const handleSubmit =
    async()=>{

      try{

        const token =
          localStorage.getItem(
            "token"
          );

        const formattedAnswers =
          Object.keys(
            answers
          ).map(
            questionId=>({

              questionId,

              selectedAnswer:
              answers[
                questionId
              ]

            })
          );


          console.log(
  "Submitting to backend..."
);

console.log(
  "ExamId:",
  examId
);

console.log(
  "Answers:",
  formattedAnswers
);

        const res =
          await api.post(
            "/exam/submit",
            {
              examId,
              answers:
              formattedAnswers
            },
            {
              headers:{
                Authorization:
                `Bearer ${token}`
              }
            }
          );

        console.log(
          res.data
        );

        navigate(
  `/result/${examId}`
);

      }

      catch(error){

  console.log(
    "FULL ERROR:",
    error.response?.data
  );

  console.log(error);

  alert(
    "Submit Failed"
  );
}
    };

  return(

    <div
      style={{
        padding:"40px"
      }}
    >

      {/* Header */}

      <div
        style={{
          display:"flex",
          justifyContent:
          "space-between"
        }}
      >

        <h1>
          Exam Page
        </h1>

        <h2>
          ⏰
          {minutes}:
          {seconds
            .toString()
            .padStart(
              2,
              "0"
            )}
        </h2>

      </div>

      {/* Question */}

      <h2
        style={{
          marginTop:"30px"
        }}
      >
        Question
        {currentQuestion+1}
      </h2>

      <h3
        style={{
          marginTop:"15px"
        }}
      >
        {question.question}
      </h3>

      {/* Options */}

      <div
        style={{
          display:"flex",
          flexDirection:
          "column",
          gap:"15px",
          marginTop:"25px"
        }}
      >

        {question.options.map(
          (option,index)=>(

            <button
              key={index}
              onClick={()=>
                handleAnswer(
                  option
                )
              }
              style={{

                padding:"15px",

                border:
                "1px solid #ccc",

                borderRadius:
                "10px",

                cursor:
                "pointer",

                textAlign:
                "left",

                background:
                answers[
                  question._id
                ]===option
                ? "#2563eb"
                : "white",

                color:
                answers[
                  question._id
                ]===option
                ? "white"
                : "black"

              }}
            >
              {option}
            </button>

        ))}

      </div>

      {/* Buttons */}

      <div
        style={{
          display:"flex",
          gap:"15px",
          marginTop:"35px"
        }}
      >

        <button
          onClick={()=>
            setCurrentQuestion(
              currentQuestion-1
            )
          }
          disabled={
            currentQuestion===0
          }
        >
          Previous
        </button>

        {currentQuestion <
        questions.length-1 ? (

          <button
            onClick={()=>
              setCurrentQuestion(
                currentQuestion+1
              )
            }
          >
            Next
          </button>

        ) : (

          <button
            onClick={
              handleSubmit
            }
          >
            Submit Exam
          </button>

        )}

      </div>

    </div>
  );
}

export default ExamPage;