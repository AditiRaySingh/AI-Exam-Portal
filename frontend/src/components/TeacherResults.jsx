import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function TeacherResults() {

  const { examId } = useParams();

  const [results, setResults] =
    useState([]);

  useEffect(() => {

    fetchResults();

  }, []);

  const fetchResults =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.get(
            `/exam/teacher-results/${examId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setResults(
          res.data.results
        );

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
        Exam Results
      </h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "20px"
        }}
      >

        <thead>

          <tr>

            <th>
              Student Name
            </th>

            <th>
              Email
            </th>

            <th>
              Score
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {results.map(
            (result) => (

              <tr
                key={result._id}
              >

                <td>
                  {
                    result
                    .studentId
                    ?.name
                  }
                </td>

                <td>
                  {
                    result
                    .studentId
                    ?.email
                  }
                </td>

                <td>
                  {
                    result.score
                  }
                </td>

                <td>
                  {
                    result.status
                  }
                </td>

              </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default TeacherResults;