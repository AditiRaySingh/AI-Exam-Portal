import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/studentResults.css";

function StudentResults() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await api.get(
          "/result/student",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setResults(res.data.results);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="results-page">

      <h1>
        My Results
      </h1>

      {results.map((result) => (

        <div
          key={result._id}
          className="result-card"
        >

          <div className="summary">

            <h2>
              Exam Attempt
            </h2>

            <p>
              Score:
              <span>
                {result.score}
              </span>
            </p>

            <p>
              Percentage:
              <span>
                {result.percentage?.toFixed(2)}%
              </span>
            </p>

            <p>
              Total Marks:
              <span>
                {result.totalMarks}
              </span>
            </p>

          </div>

          <div className="evaluation-section">

            <h3>
              AI Evaluation
            </h3>

            {result.answers?.map((ans) => (

              ans.aiScore > 0 && (

                <div
                  key={ans._id}
                  className="answer-box"
                >

                  <p>
                    <strong>
                      Student Answer:
                    </strong>
                    {" "}
                    {ans.selectedAnswer}
                  </p>

                  <p>
                    <strong>
                      AI Score:
                    </strong>
                    {" "}
                    {ans.aiScore}
                  </p>

                  {ans.aiFeedback && (

                    <p>
                      <strong>
                        Feedback:
                      </strong>
                      {" "}
                      {ans.aiFeedback}
                    </p>

                  )}

                </div>

              )

            ))}

          </div>

        </div>

      ))}

    </div>

  );

}

export default StudentResults;