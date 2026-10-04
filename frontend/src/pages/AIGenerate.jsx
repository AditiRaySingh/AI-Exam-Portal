import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ai.css";

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
    <div className="ai-page">

      <div className="ai-card">

        <h1>AI Question Generator</h1>

        <p>
          Generate questions automatically using AI
          based on your selected topic and difficulty.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Topic</label>

          <input
            type="text"
            name="topic"
            placeholder="Enter Topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />

          <label>Difficulty</label>

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label>Question Type</label>

          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleChange}
          >
            <option value="mcq">MCQ</option>
            <option value="truefalse">True False</option>
            <option value="shortanswer">Short Answer</option>
            <option value="veryshortanswer">
              Very Short Answer
            </option>
          </select>

          <label>Number of Questions</label>

          <input
            type="number"
            name="numberOfQuestions"
            min="1"
            max="50"
            value={formData.numberOfQuestions}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
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