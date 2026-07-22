import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function TeacherResults() {

const { examId } = useParams();

const [results, setResults] =
useState([]);

const [analytics, setAnalytics] =
useState({
totalAttempts: 0,
highestScore: 0,
lowestScore: 0,
averageScore: 0
});

const [leaderboard, setLeaderboard] =
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

  console.log("API DATA:", res.data);

  setResults(
    res.data.results || []
  );

  setAnalytics(
    res.data.analytics || {}
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
    padding: "30px",
    background: "#f4f7fc",
    minHeight: "100vh"
  }}
>

  <h1>
    📊 Exam Analytics
  </h1>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(4,1fr)",
      gap: "20px",
      marginTop: "20px"
    }}
  >

    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <h3>Total Attempts</h3>
      <h2>
        {analytics.totalAttempts}
      </h2>
    </div>

    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <h3>Highest Score</h3>
      <h2>
        {analytics.highestScore}
      </h2>
    </div>

    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <h3>Lowest Score</h3>
      <h2>
        {analytics.lowestScore}
      </h2>
    </div>

    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <h3>Average Score</h3>
      <h2>
        {analytics.averageScore}
      </h2>
    </div>

  </div>

  <h2
    style={{
      marginTop: "40px"
    }}
  >
    🏆 Leaderboard
  </h2>

  <table
    border="1"
    cellPadding="10"
    style={{
      width: "100%",
      marginTop: "10px",
      background: "#fff"
    }}
  >

    <thead>

      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Score</th>
      </tr>

    </thead>

 <tbody>
  {leaderboard.map((student) => (
    <tr key={student.email}>
      <td>{student.rank}</td>
      <td>{student.studentName}</td>
      <td>{student.score}</td>
    </tr>
  ))}
</tbody>

  </table>

  <h2
    style={{
      marginTop: "40px"
    }}
  >
    Student Results
  </h2>

  <table
    border="1"
    cellPadding="10"
    style={{
      width: "100%",
      marginTop: "10px",
      background: "#fff"
    }}
  >

    <thead>

      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Score</th>
        <th>Status</th>
      </tr>

    </thead>

    <tbody>

      {results.map(
        (result) => (

          <tr key={result._id}>

            <td>
              {result.studentId?.name}
            </td>

            <td>
              {result.studentId?.email}
            </td>

            <td>
              {result.score}
            </td>

            <td>
              {result.status}
            </td>

          </tr>

        )
      )}

    </tbody>

  </table>

</div>


);
}

export default TeacherResults;
