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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [examId]);

    useEffect(() => {
        const value = search.toLowerCase().trim();

        if (!value) {
            setFilteredResults(results);
            return;
        }

        const data = results.filter((item) =>
            item.studentId?.name
                ?.toLowerCase()
                .includes(value)
        );

        setFilteredResults(data);
    }, [search, results]);

    const fetchResults = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get(
                `/attempt/teacher/${examId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Teacher Results:", res.data);

            setResults(res.data.results || []);
            setFilteredResults(res.data.results || []);
            setAnalytics(res.data.analytics || {});
            setExam(res.data.exam || {});
        } catch (error) {
            console.error(
                "Teacher Results Error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const formatPercentage = (value) => {
        const number = Number(value || 0);

        return `${Number(number.toFixed(2))}%`;
    };

    if (loading) {
        return (
            <div className="results-loading">
                <div className="results-loader"></div>
                <h3>Loading Results...</h3>
            </div>
        );
    }

    return (
        <div className="teacher-results">

            {/* ================= HEADER ================= */}

            <div className="results-header">

                <div>
                    <span className="results-label">
                        EXAM RESULTS
                    </span>

                    <h1>
                        {exam.title || "Exam Results"}
                    </h1>

                    <p>
                        <strong>Subject:</strong>{" "}
                        {exam.subject || "N/A"}
                    </p>
                </div>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="results-toolbar">

                <input
                    type="text"
                    placeholder="🔍 Search student..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="results-search"
                />

                <button
                    className="print-btn"
                    onClick={() => window.print()}
                >
                    🖨 Print
                </button>

            </div>


            {/* ================= ANALYTICS ================= */}

            <div className="analytics-grid">

                <div className="analytics-card blue-card">
                    <div className="card-icon">👥</div>

                    <div>
                        <span>Total Attempts</span>
                        <h2>
                            {analytics.totalAttempts || 0}
                        </h2>
                    </div>
                </div>


                <div className="analytics-card green-card">
                    <div className="card-icon">🏆</div>

                    <div>
                        <span>Highest Score</span>
                        <h2>
                            {analytics.highestScore || 0}
                        </h2>
                    </div>
                </div>


                <div className="analytics-card orange-card">
                    <div className="card-icon">📉</div>

                    <div>
                        <span>Lowest Score</span>
                        <h2>
                            {analytics.lowestScore || 0}
                        </h2>
                    </div>
                </div>


                <div className="analytics-card purple-card">
                    <div className="card-icon">📊</div>

                    <div>
                        <span>Average Score</span>
                        <h2>
                            {analytics.averageScore || 0}
                        </h2>
                    </div>
                </div>

            </div>


            {/* ================= RESULTS ================= */}

            <div className="results-card">

                <div className="results-card-header">

                    <div>
                        <h2>📋 Student Results</h2>

                        <p>
                            {filteredResults.length} student
                            {filteredResults.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                </div>


                {filteredResults.length === 0 ? (

                    <div className="no-results">
                        <div>📭</div>
                        <h3>No Results Found</h3>
                        <p>
                            No student results are available
                            for this exam.
                        </p>
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="results-table">

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

                                {filteredResults.map(
                                    (item) => {

                                        const percentage =
                                            Number(
                                                item.percentage || 0
                                            );

                                        return (
                                            <tr
                                                key={item._id}
                                            >

                                                <td className="student-name">
                                                    {item.studentId
                                                        ?.name ||
                                                        "N/A"}
                                                </td>

                                                <td>
                                                    {item.studentId
                                                        ?.email ||
                                                        "N/A"}
                                                </td>

                                                <td>
                                                    {item.examId
                                                        ?.title ||
                                                        exam.title ||
                                                        "N/A"}
                                                </td>

                                                <td className="score">
                                                    {item.score || 0}
                                                </td>

                                                <td>
                                                    {item.totalMarks ||
                                                        exam.totalMarks ||
                                                        0}
                                                </td>

                                                <td className="percentage">
                                                    {formatPercentage(
                                                        percentage
                                                    )}
                                                </td>

                                                <td className="correct">
                                                    {item.correctCount ||
                                                        0}
                                                </td>

                                                <td className="wrong">
                                                    {item.wrongCount ||
                                                        0}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            percentage >=
                                                            40
                                                                ? "result-pass"
                                                                : "result-fail"
                                                        }
                                                    >
                                                        {percentage >=
                                                        40
                                                            ? "PASS"
                                                            : "FAIL"}
                                                    </span>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default TeacherResults;
