import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AIGenerate() {

  const navigate = useNavigate();
  const { examId } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    examId: examId || "",
    topic: "",
    difficulty: "easy",
    questionType: "mcq",
    numberOfQuestions: 5,
  });

  useEffect(() => {
    if (examId) {
      setFormData((prev) => ({
        ...prev,
        examId,
      }));
    }
  }, [examId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/ai/question/generate",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      navigate(`/questions/${formData.examId}`);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "AI Generation Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "15px",
      }}
    >
      <h2>AI Question Generator</h2>

      <form onSubmit={handleSubmit}>

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
            marginTop: "20px",
          }}
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
          }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          name="questionType"
          value={formData.questionType}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
          }}
        >
          <option value="mcq">MCQ</option>
          <option value="truefalse">True False</option>
          <option value="shortanswer">Short Answer</option>
          <option value="veryshortanswer">Very Short Answer</option>
        </select>

        <input
          type="number"
          name="numberOfQuestions"
          min="1"
          max="50"
          value={formData.numberOfQuestions}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "25px",
            padding: "15px",
            border: "none",
            borderRadius: "10px",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

      </form>
    </div>
  );
}

export default AIGenerate;