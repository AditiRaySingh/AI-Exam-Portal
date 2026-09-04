import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EditQuestion() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
    marks: 1,
    questionType: "mcq",
    difficulty: "easy"
  });

  // =====================================
  // FETCH SINGLE QUESTION
  // =====================================

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        `/questions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("QUESTION RESPONSE:", res.data);

      const question = res.data.question;

      if (!question) {
        alert("Question not found");
        navigate(-1);
        return;
      }

      setFormData({
        question: question.question || "",

        option1: question.options?.[0] || "",

        option2: question.options?.[1] || "",

        option3: question.options?.[2] || "",

        option4: question.options?.[3] || "",

        correctAnswer: question.correctAnswer || "",

        marks: question.marks || 1,

        questionType:
          question.questionType || "mcq",

        difficulty:
          question.difficulty || "easy"
      });

    } catch (error) {

      console.log("FETCH QUESTION ERROR:", error);

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "DATA:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Failed to load question"
      );
    }
  };


  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // =====================================
  // UPDATE QUESTION
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      // Validate MCQ
      if (formData.questionType === "mcq") {

        if (
          !formData.option1 ||
          !formData.option2 ||
          !formData.option3 ||
          !formData.option4
        ) {
          alert("Please fill all four options");
          return;
        }

        if (!formData.correctAnswer) {
          alert("Please enter the correct answer");
          return;
        }

      }


      const response = await api.put(
        `/questions/${id}`,
        {
          question: formData.question,

          options:
            formData.questionType === "mcq"
              ? [
                  formData.option1,
                  formData.option2,
                  formData.option3,
                  formData.option4
                ]
              : formData.questionType === "truefalse"
              ? ["True", "False"]
              : [],

          correctAnswer:
            formData.correctAnswer,

          marks:
            Number(formData.marks),

          questionType:
            formData.questionType,

          difficulty:
            formData.difficulty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      alert("Question Updated Successfully");

      navigate(-1);

    } catch (error) {

      console.log("UPDATE QUESTION ERROR:", error);

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "DATA:",
        error.response?.data
      );

      console.log(
        "URL:",
        error.config?.url
      );

      alert(
        error.response?.data?.message ||
        "Failed to update question"
      );
    }
  };


  // =====================================
  // UI
  // =====================================

  return (

    <div
      style={{
        maxWidth: "800px",
        margin: "30px auto",
        padding: "20px"
      }}
    >

      <h1>Edit Question</h1>

      <form onSubmit={handleSubmit}>

        {/* QUESTION */}

        <input
          type="text"
          name="question"
          placeholder="Question"
          value={formData.question}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />


        {/* QUESTION TYPE */}

        <select
          name="questionType"
          value={formData.questionType}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <option value="mcq">
            MCQ
          </option>

          <option value="truefalse">
            True / False
          </option>

          <option value="shortanswer">
            Short Answer
          </option>

          <option value="veryshortanswer">
            Very Short Answer
          </option>

        </select>


        {/* MCQ OPTIONS */}

        {formData.questionType === "mcq" && (

          <>

            <input
              type="text"
              name="option1"
              placeholder="Option 1"
              value={formData.option1}
              onChange={handleChange}
              required
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "5px",
                marginRight: "2%"
              }}
            />

            <input
              type="text"
              name="option2"
              placeholder="Option 2"
              value={formData.option2}
              onChange={handleChange}
              required
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "5px"
              }}
            />

            <input
              type="text"
              name="option3"
              placeholder="Option 3"
              value={formData.option3}
              onChange={handleChange}
              required
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "5px",
                marginRight: "2%"
              }}
            />

            <input
              type="text"
              name="option4"
              placeholder="Option 4"
              value={formData.option4}
              onChange={handleChange}
              required
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "10px"
              }}
            />

          </>

        )}


        {/* TRUE / FALSE */}

        {formData.questionType === "truefalse" && (

          <select
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px"
            }}
          >

            <option value="">
              Select Correct Answer
            </option>

            <option value="True">
              True
            </option>

            <option value="False">
              False
            </option>

          </select>

        )}


        {/* CORRECT ANSWER FOR MCQ */}

        {formData.questionType === "mcq" && (

          <input
            type="text"
            name="correctAnswer"
            placeholder="Correct Answer"
            value={formData.correctAnswer}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px"
            }}
          />

        )}


        {/* SHORT ANSWER */}

        {(formData.questionType === "shortanswer" ||
          formData.questionType === "veryshortanswer") && (

          <input
            type="text"
            name="correctAnswer"
            placeholder="Correct Answer"
            value={formData.correctAnswer}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px"
            }}
          />

        )}


        {/* MARKS */}

        <input
          type="number"
          name="marks"
          placeholder="Marks"
          value={formData.marks}
          onChange={handleChange}
          min="1"
          required
          style={{
            padding: "8px",
            marginBottom: "10px"
          }}
        />


        {/* DIFFICULTY */}

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          style={{
            padding: "8px",
            marginBottom: "10px",
            marginLeft: "10px"
          }}
        >

          <option value="easy">
            Easy
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="hard">
            Hard
          </option>

        </select>


        {/* BUTTON */}

        <br />

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px"
          }}
        >
          Update Question
        </button>

      </form>

    </div>

  );
}

export default EditQuestion;