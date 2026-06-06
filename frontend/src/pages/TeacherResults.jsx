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

  const fetchResults = async () => {

    try {

      const token =
        localStorage.getItem("token");

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
        minHeight: "100vh",
        background: "#f4f7fc",
        padding: "40px"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "30px"
        }}
      >
        📊 Student Results
      </h1>

      {results.length === 0 ? (

        <div
          style={{
            textAlign: "center",
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          <h2>No Results Found</h2>
        </div>

      ) : (

        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            borderRadius: "15px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.1)"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#2563eb",
                  color: "white"
                }}
              >
                <th style={{ padding: "15px" }}>
                  Student
                </th>

                <th style={{ padding: "15px" }}>
                  Email
                </th>

                <th style={{ padding: "15px" }}>
                  Score
                </th>

                <th style={{ padding: "15px" }}>
                  Status
                </th>
              </tr>

            </thead>

            <tbody>

              {results.map((result) => (

                <tr
                  key={result._id}
                  style={{
                    textAlign: "center",
                    borderBottom:
                      "1px solid #eee"
                  }}
                >

                  <td
                    style={{
                      padding: "15px"
                    }}
                  >
                    {result.studentId?.name}
                  </td>

                  <td
                    style={{
                      padding: "15px"
                    }}
                  >
                    {result.studentId?.email}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      fontWeight: "bold",
                      color: "#16a34a"
                    }}
                  >
                    {result.score}
                  </td>

                  <td
                    style={{
                      padding: "15px"
                    }}
                  >
                    <span
                      style={{
                        background:
                          "#dcfce7",
                        color:
                          "#166534",
                        padding:
                          "6px 12px",
                        borderRadius:
                          "20px",
                        fontSize:
                          "14px"
                      }}
                    >
                      {result.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default TeacherResults;