import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/TeacherResults.css";

function TeacherResults() {
  const { examId } = useParams();

  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [exam, setExam] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredResults(results);
    } else {
      const data = results.filter((item) =>
        item.examId?.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

      setFilteredResults(data);
    }
  }, [search, results]);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/attempt/teacher/${examId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResults(res.data.results || []);
      setFilteredResults(res.data.results || []);
      setAnalytics(res.data.analytics || {});
      setExam(res.data.exam || {});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="teacher-results">

      <h1>Exam Results</h1>

      <h2>{exam.title}</h2>
      <p>
        <b>Subject:</b> {exam.subject}
      </p>

      <br />

      <input
        type="text"
        placeholder="Search by Exam Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

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

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Exam</th>
            <th>Score</th>
            <th>Total Marks</th>
            <th>Percentage</th>
            <th>Correct</th>
            <th>Wrong</th>
            <th>Result</th>
          </tr>
        </thead>

        <tbody>
          {filteredResults.map((item) => (
            <tr key={item._id}>
              <td>{item.studentId?.name}</td>

              <td>{item.studentId?.email}</td>

              <td>{item.examId?.title}</td>

              <td>{item.score}</td>

              <td>{item.totalMarks}</td>

              <td>{item.percentage}%</td>

              <td>{item.correctCount}</td>

              <td>{item.wrongCount}</td>

              <td>{item.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherResults;