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

useEffect(() => {
fetchQuestion();
}, []);

const fetchQuestion = async () => {


try {

  const token =
    localStorage.getItem("token");

  const res = await api.get(
    "/question",
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const question =
    res.data.questions.find(
      q => q._id === id
    );

  if (!question) {
    alert("Question not found");
    navigate(-1);
    return;
  }

  setFormData({
    question:
      question.question || "",

    option1:
      question.options?.[0] || "",

    option2:
      question.options?.[1] || "",

    option3:
      question.options?.[2] || "",

    option4:
      question.options?.[3] || "",

    correctAnswer:
      question.correctAnswer || "",

    marks:
      question.marks || 1,

    questionType:
      question.questionType || "mcq",

    difficulty:
      question.difficulty || "easy"
  });

} catch (error) {

  console.log(error);

  alert("Failed to load question");

}


};

const handleChange = (e) => {


setFormData({
  ...formData,
  [e.target.name]:
    e.target.value
});


};

const handleSubmit = async (e) => {


e.preventDefault();

try {

  const token =
    localStorage.getItem("token");

  await api.put(
    `/question/${id}`,
    {
      question:
        formData.question,

      options:
        formData.questionType === "mcq"
          ? [
              formData.option1,
              formData.option2,
              formData.option3,
              formData.option4
            ]
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
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  alert(
    "Question Updated Successfully"
  );

  navigate(-1);

} catch (error) {

  console.log(error);

  alert(
    error.response?.data?.message ||
    "Failed to update question"
  );

}


};

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

    <input
      type="text"
      name="question"
      placeholder="Question"
      value={formData.question}
      onChange={handleChange}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px"
      }}
    />

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
    />

    <input
      type="number"
      name="marks"
      placeholder="Marks"
      value={formData.marks}
      onChange={handleChange}
    />

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
