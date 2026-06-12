import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function GenerateFromMaterial() {

const navigate = useNavigate();

const [file, setFile] =
useState(null);

const [exams, setExams] =
useState([]);

const [loading, setLoading] =
useState(false);

const [formData, setFormData] =
useState({
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

  const res =
    await api.get(
      "/exam",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  setExams(
    res.data.exams || []
  );

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

const handleSubmit =
async (e) => {


  e.preventDefault();

  if (!file) {

    alert(
      "Please Upload File"
    );

    return;

  }

  try {

    setLoading(true);

    const token =
      localStorage.getItem(
        "token"
      );

    const data =
      new FormData();

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

    const res =
      await api.post(
        "/ai-material/generate-from-material",
        data,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data"
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


<div
  style={{
    padding: "40px"
  }}
>

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
      📄 Generate Questions
      From Notes
    </h1>

    <form
      onSubmit={handleSubmit}
    >

      <select
        name="examId"
        value={
          formData.examId
        }
        onChange={
          handleChange
        }
        required
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px"
        }}
      >

        <option value="">
          Select Exam
        </option>

        {exams.map(
          (exam) => (

            <option
              key={exam._id}
              value={exam._id}
            >
              {exam.title}
            </option>

          )
        )}

      </select>

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
        style={{
          width: "100%",
          marginTop: "20px"
        }}
      />

      <select
        name="questionType"
        value={
          formData.questionType
        }
        onChange={
          handleChange
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px"
        }}
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

      <select
        name="difficulty"
        value={
          formData.difficulty
        }
        onChange={
          handleChange
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px"
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

      <input
        type="number"
        name="numberOfQuestions"
        value={
          formData.numberOfQuestions
        }
        onChange={
          handleChange
        }
        min="1"
        max="50"
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px"
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "25px",
          background:
            "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "10px"
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

export default GenerateFromMaterial;
