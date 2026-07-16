import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/TeacherResults.css";

function TeacherResults() {

  const { examId } = useParams();

  const [results, setResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    highestScore: 0,
    lowestScore: 0,
    averageScore: 0
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        `/exam/teacher-results/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResults(res.data.results || []);
      setLeaderboard(res.data.leaderboard || []);
      setAnalytics(res.data.analytics || {});

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="teacher-results">

      <h1>📊 Exam Analytics</h1>

      <div className="analytics-grid">

        <div className="analytics-card">
          <h3>Total Attempts</h3>
          <h2>{analytics.totalAttempts}</h2>
        </div>

        <div className="analytics-card">
          <h3>Highest Score</h3>
          <h2>{analytics.highestScore}</h2>
        </div>

        <div className="analytics-card">
          <h3>Lowest Score</h3>
          <h2>{analytics.lowestScore}</h2>
        </div>

        <div className="analytics-card">
          <h3>Average Score</h3>
          <h2>{analytics.averageScore}</h2>
        </div>

      </div>

      <div className="table-card">

        <h2>🏆 Leaderboard</h2>

        <table>

          <thead>

            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Score</th>
            </tr>

          </thead>

          <tbody>

            {leaderboard.map((student, index) => (

              <tr key={student._id}>
                <td>#{index + 1}</td>
                <td>{student.studentId?.name}</td>
                <td>{student.score}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="table-card">

        <h2>👨‍🎓 Student Results</h2>

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {results.map((result) => (

              <tr key={result._id}>

                <td>{result.studentId?.name}</td>

                <td>{result.studentId?.email}</td>

                <td>{result.score}</td>

                <td>
                  <span className="status">
                    {result.status}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default TeacherResults;