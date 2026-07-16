import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/AddQuestion.css";

function AddQuestion() {

  const { examId } = useParams();

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

      const token = localStorage.getItem("token");

      let options = [];

      if (formData.questionType === "mcq") {

        options = [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4
        ].filter(option => option.trim() !== "");

      }

     await api.post(
  "/questions/create",
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
        "Failed to Add Question"
      );

    }

  };

  return (

    <div className="add-question-page">

      <div className="add-question-card">

        <h1>Add New Question</h1>

        <p>Create questions for your exam</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="topic"
            placeholder="Topic Name"
            value={formData.topic}
            onChange={handleChange}
            required
          />

          <textarea
            rows="4"
            name="question"
            placeholder="Enter Question"
            value={formData.question}
            onChange={handleChange}
            required
          />

          <div className="two-column">

            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
            >

              <option value="mcq">MCQ</option>
              <option value="truefalse">True / False</option>
              <option value="shortanswer">Short Answer</option>
              <option value="veryshortanswer">Very Short Answer</option>

            </select>

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >

              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>

            </select>

          </div>

          {formData.questionType === "mcq" && (

            <>

              <input
                type="text"
                name="option1"
                placeholder="Option 1"
                value={formData.option1}
                onChange={handleChange}
              />

              <input
                type="text"
                name="option2"
                placeholder="Option 2"
                value={formData.option2}
                onChange={handleChange}
              />

              <input
                type="text"
                name="option3"
                placeholder="Option 3"
                value={formData.option3}
                onChange={handleChange}
              />

              <input
                type="text"
                name="option4"
                placeholder="Option 4"
                value={formData.option4}
                onChange={handleChange}
              />

            </>

          )}

          <input
            type="text"
            name="correctAnswer"
            placeholder="Correct Answer"
            value={formData.correctAnswer}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="marks"
            placeholder="Marks"
            value={formData.marks}
            onChange={handleChange}
            min="1"
            required
          />

          <button type="submit">
            Add Question
          </button>

        </form>

      </div>

    </div>

  );

}

export default AddQuestion;