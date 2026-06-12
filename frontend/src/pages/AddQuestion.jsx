import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function AddQuestion() {

  const { examId } = useParams();
console.log("Exam ID:", examId);
  const [formData, setFormData] = useState({
    topic: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
    marks: 5,
    questionType: "mcq",
    difficulty: "medium"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      let options = [];

      if (formData.questionType === "mcq") {
        options = [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4
        ].filter(option => option.trim() !== "");
      }

      const res = await api.post(
        "/question/create",
        {
          examId,
          topic: formData.topic,
          question: formData.question,
          options,
          correctAnswer: formData.correctAnswer,
          marks: Number(formData.marks),
          questionType: formData.questionType,
          difficulty: formData.difficulty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(res.data);

      alert("Question Added Successfully");

      setFormData({
        topic: "",
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "",
        marks: 5,
        questionType: "mcq",
        difficulty: "medium"
      });

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to add question"
      );

    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        padding: "40px"
      }}
    >

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            color: "#2563eb"
          }}
        >
          Add Question
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Topic */}

          <input
            type="text"
            name="topic"
            placeholder="Topic Name"
            value={formData.topic}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px"
            }}
            required
          />

          {/* Question */}

          <input
            type="text"
            name="question"
            placeholder="Enter Question"
            value={formData.question}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px"
            }}
            required
          />

          {/* Question Type */}

          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px"
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

          {/* Difficulty */}

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px"
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

          {/* MCQ Options */}

          {formData.questionType === "mcq" && (
            <>
              <input
                type="text"
                name="option1"
                placeholder="Option 1"
                value={formData.option1}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "15px"
                }}
              />

              <input
                type="text"
                name="option2"
                placeholder="Option 2"
                value={formData.option2}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "15px"
                }}
              />

              <input
                type="text"
                name="option3"
                placeholder="Option 3"
                value={formData.option3}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "15px"
                }}
              />

              <input
                type="text"
                name="option4"
                placeholder="Option 4"
                value={formData.option4}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "15px"
                }}
              />
            </>
          )}

          {/* Correct Answer */}

          <input
            type="text"
            name="correctAnswer"
            placeholder="Correct Answer"
            value={formData.correctAnswer}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px"
            }}
            required
          />

          {/* Marks */}

          <input
            type="number"
            name="marks"
            placeholder="Marks"
            value={formData.marks}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Add Question
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddQuestion;