import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/TeacherResults.css";
function TeacherResults() {
 console.log("PAGE LOADED");
  const { examId } = useParams();

  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
   console.log("fetchResults Called");
    try {
console.log("ExamId:", examId);


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
        console.log("API DATA:", res.data);

      setResults(
        res.data.results || []
      );

      setAnalytics(
        res.data.analytics
      );

      setLeaderboard(
        res.data.leaderboard || []
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "40px"
        }}
      >
        📊 Exam Analytics Dashboard
      </h1>

      {/* Analytics */}

      {analytics && (

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}
        >

          <div className="card">
            <h3>Total Attempts</h3>
            <h1>
              {analytics.totalAttempts}
            </h1>
          </div>

          <div className="card">
            <h3>Highest Score</h3>
            <h1>
              {analytics.highestScore}
            </h1>
          </div>

          <div className="card">
            <h3>Lowest Score</h3>
            <h1>
              {analytics.lowestScore}
            </h1>
          </div>

          <div className="card">
            <h3>Average Score</h3>
            <h1>
              {analytics.averageScore}
            </h1>
          </div>

        </div>

      )}

      {/* Leaderboard */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "15px",
          marginBottom: "40px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >

        <h2>
          🏆 Leaderboard
        </h2>

        {leaderboard.slice(0, 3).map(
          (student, index) => (

            <div
              key={student._id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "15px 0",
                borderBottom:
                  "1px solid #eee"
              }}
            >

              <h3>

                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}

                {" "}
                {student.studentId?.name}

              </h3>

              <h3>
                {student.score}
              </h3>

            </div>

          )
        )}

      </div>

      {/* Results Table */}

      <div
        style={{
          background: "#fff",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse"
          }}
        >

          <thead>

            <tr
              style={{
                background:
                  "#2563eb",
                color: "#fff"
              }}
            >

              <th
                style={{
                  padding: "15px"
                }}
              >
                Rank
              </th>

              <th
                style={{
                  padding: "15px"
                }}
              >
                Student
              </th>

              <th
                style={{
                  padding: "15px"
                }}
              >
                Email
              </th>

              <th
                style={{
                  padding: "15px"
                }}
              >
                Score
              </th>

              <th
                style={{
                  padding: "15px"
                }}
              >
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {leaderboard.map(
              (result, index) => (

                <tr
                  key={result._id}
                  style={{
                    textAlign:
                      "center",
                    borderBottom:
                      "1px solid #eee"
                  }}
                >

                  <td
                    style={{
                      padding: "15px"
                    }}
                  >
                    {index + 1}
                  </td>

                  <td
                    style={{
                      padding: "15px"
                    }}
                  >
                    {
                      result.studentId?.name
                    }
                  </td>

                  <td
                    style={{
                      padding: "15px"
                    }}
                  >
                    {
                      result.studentId?.email
                    }
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      fontWeight:
                        "bold",
                      color:
                        "#16a34a"
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
                          "6px 14px",
                        borderRadius:
                          "20px"
                      }}
                    >
                      {result.status}
                    </span>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default TeacherResults;