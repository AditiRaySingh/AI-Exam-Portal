
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function ManageQuestions() {
const navigate = useNavigate();
  const { examId } = useParams();

  const [questions, setQuestions] =
    useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/question/exam/${examId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setQuestions(
        res.data.questions
      );

    } catch (error) {

      console.log(error);

    }
  };

  const deleteQuestion =
    async (id) => {

      if (
        !window.confirm(
          "Delete Question?"
        )
      )
        return;

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await api.delete(
          `/question/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        fetchQuestions();

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <div
      style={{
        padding: "30px"
      }}
    >

      <h1>
        Manage Questions
      </h1>

      <table
        border="1"
        width="100%"
      >

        <thead>

          <tr>
            <th>Question</th>
            <th>Type</th>
            <th>Difficulty</th>
            <th>Marks</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {questions.map(
            (q) => (

              <tr key={q._id}>

                <td>
                  {q.question}
                </td>

                <td>
                  {q.questionType}
                </td>

                <td>
                  {q.difficulty}
                </td>

                <td>
                  {q.marks}
                </td>

               <td>

  <button
    onClick={() =>
      navigate(`/edit-question/${q._id}`)
    }
  >
    Edit
  </button>

  <button
    onClick={() =>
      deleteQuestion(q._id)
    }
  >
    Delete
  </button>

</td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );
}

export default ManageQuestions;