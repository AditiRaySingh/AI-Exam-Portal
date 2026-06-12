import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AIGenerate() {

const navigate = useNavigate();

const [exams, setExams] = useState([]);

const [formData, setFormData] = useState({
examId: "",
topic: "",
difficulty: "easy",
questionType: "mcq",
numberOfQuestions: 5
});

const [loading, setLoading] = useState(false);

useEffect(() => {
fetchExams();
}, []);

const fetchExams = async () => {
try {


  const token =
    localStorage.getItem("token");

  const res = await api.get(
    "/exam",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setExams(res.data.exams || []);

} catch (error) {
  console.log(error);
}


};

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]:
e.target.value
});
};

const generateQuestions = async (e) => {


e.preventDefault();

try {

  setLoading(true);

  const token =
    localStorage.getItem("token");

  const res = await api.post(
    "/question/ai-generate",
    formData,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  alert(
    `${res.data.totalQuestions} Questions Generated Successfully`
  );

  navigate(
    `/questions/${formData.examId}`
  );

} catch (error) {

  console.log(error);

  alert(
    error.response?.data?.message ||
    "Failed to generate questions"
  );

} finally {

  setLoading(false);

}


};

return (
<div
style={{
minHeight: "100vh",
background: "#f5f7fb",
padding: "40px"
}}
>

```
  <div
    style={{
      maxWidth: "700px",
      margin: "auto",
      background: "#fff",
      padding: "30px",
      borderRadius: "20px",
      boxShadow:
        "0 10px 30px rgba(0,0,0,0.1)"
    }}
  >

    <h1>
      🤖 AI Question Generator
    </h1>

    <p>
      Generate Questions Automatically Using AI
    </p>

    <form
      onSubmit={generateQuestions}
    >

      <div style={{ marginTop: "20px" }}>
        <label>
          Select Exam
        </label>

        <select
          name="examId"
          value={formData.examId}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px"
          }}
        >

          <option value="">
            Select Exam
          </option>

          {exams.map((exam) => (
            <option
              key={exam._id}
              value={exam._id}
            >
              {exam.title}
            </option>
          ))}

        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          Topic
        </label>

        <input
          type="text"
          name="topic"
          placeholder="Enter Topic"
          value={formData.topic}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px"
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          Difficulty
        </label>

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px"
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
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          Question Type
        </label>

        <select
          name="questionType"
          value={formData.questionType}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px"
          }}
        >

          <option value="mcq">
            MCQ
          </option>

          <option value="shortanswer">
            Short Answer
          </option>

          <option value="veryshortanswer">
            Very Short Answer
          </option>

          <option value="truefalse">
            True / False
          </option>

        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          Number of Questions
        </label>

        <input
          type="number"
          name="numberOfQuestions"
          min="1"
          max="20"
          value={formData.numberOfQuestions}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px"
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          marginTop: "30px",
          padding: "15px",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >

        {loading
          ? "Generating..."
          : "Generate Questions"}

      </button>

    </form>

  </div>

</div>


);
}

export default AIGenerate;
