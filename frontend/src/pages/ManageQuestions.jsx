import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ManageQuestions.css";

function ManageQuestions() {

  const { examId } = useParams();

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {

    fetchQuestions();

  }, []);

  const fetchQuestions = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(

        `/questions/exam/${examId}`,

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      setQuestions(res.data.questions || []);

    }

    catch (error) {

      console.log(error);
      console.log("DELETE STATUS:", error.response?.status);
  console.log("DELETE DATA:", error.response?.data);
  console.log("DELETE MESSAGE:", error.response?.data?.message);

      alert("Unable to Load Questions");

    }

    finally {

      setLoading(false);

    }

  };

  const deleteQuestion = async (id) => {

    if (!window.confirm("Delete this question?")) {

      return;

    }

    try {

      const token = localStorage.getItem("token");

      await api.delete(

        `/questions/${id}`,

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      fetchQuestions();

    }

    catch (error) {

      console.log(error);

      alert("Delete Failed");

    }

  };

  const filteredQuestions = questions.filter((question) =>

    question.question
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  if (loading) {

    return (

      <div className="loading-screen">

        <div className="loader"></div>

        <h2>Loading Questions...</h2>

      </div>

    );

  }

    return (

    <div className="manage-container">

      <div className="manage-header">

        <div>

          <h1>Manage Questions</h1>

          <p>
            Total Questions : {filteredQuestions.length}
          </p>

        </div>

        <button
          className="add-btn"
          onClick={() =>
            navigate(`/add-question/${examId}`)
          }
        >
          + Add Question
        </button>

      </div>

      <input
        type="text"
        placeholder="Search Question..."
        className="search-box"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="table-container">

        <table className="question-table">

          <thead>

            <tr>

              <th>Question</th>

              <th>Type</th>

              <th>Difficulty</th>

              <th>Marks</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredQuestions.length > 0 ? (

              filteredQuestions.map((question) => (

                <tr key={question._id}>

                  <td>{question.question}</td>

                  <td>{question.questionType}</td>

                  <td>

                    <span
                      className={`difficulty ${question.difficulty}`}
                    >
                      {question.difficulty}
                    </span>

                  </td>

                  <td>{question.marks}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/edit-question/${question._id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteQuestion(question._id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "30px"
                  }}
                >
                  No Questions Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default ManageQuestions;