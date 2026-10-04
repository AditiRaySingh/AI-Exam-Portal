import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ai.css";

function GenerateFromMaterial() {

  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    examId: "",
    difficulty: "easy",
    questionType: "mcq",
    numberOfQuestions: 5
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/exams/teacher",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(res.data);

      setExams(res.data.exams);

    } catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!file) {

      alert("Please Upload File");

      return;

    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const data = new FormData();

      data.append(
        "file",
        file
      );

      data.append(
        "examId",
        formData.examId
      );

      data.append(
        "difficulty",
        formData.difficulty
      );

      data.append(
        "questionType",
        formData.questionType
      );

      data.append(
        "numberOfQuestions",
        formData.numberOfQuestions
      );

      const res = await api.post(
        "/ai/material/generate-from-material",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
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
        "Generation Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="ai-page">

      <div className="ai-card">

        <h1>
          📄 Generate Questions From Notes
        </h1>

        <p>
          Upload your study material and let AI
          generate questions automatically.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Select Exam
          </label>

          <select
            name="examId"
            value={formData.examId}
            onChange={handleChange}
            required
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


          <label>
            Upload Study Material
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />


          <label>
            Question Type
          </label>

          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleChange}
          >

            <option value="mcq">
              MCQ
            </option>

            <option value="truefalse">
              True False
            </option>

            <option value="shortanswer">
              Short Answer
            </option>

            <option value="veryshortanswer">
              Very Short Answer
            </option>

          </select>


          <label>
            Difficulty
          </label>

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
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


          <label>
            Number of Questions
          </label>

          <input
            type="number"
            name="numberOfQuestions"
            value={formData.numberOfQuestions}
            onChange={handleChange}
            min="1"
            max="50"
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

export default GenerateFromMaterial;