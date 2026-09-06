import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/teacherAnalytics.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

import {
    FaUsers,
    FaTrophy,
    FaChartLine,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

import { motion } from "framer-motion";

function TeacherAnalytics() {

    const { examId } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ==========================
    // FETCH ANALYTICS
    // ==========================

    useEffect(() => {
        fetchAnalytics();
    }, [examId]);

    const fetchAnalytics = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Token not found");
                setData(null);
                return;
            }

            if (!examId) {
                console.error("Exam ID not found");
                setData(null);
                return;
            }

            const res = await api.get(
                `/attempt/teacher/${examId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Analytics Response:", res.data);

            setData(res.data);

        } catch (err) {

            console.error(
                "Analytics Error:",
                err.response?.data || err.message
            );

            setData(null);

        } finally {

            setLoading(false);

        }
    };


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (
            <div className="loading">
                <h2>Loading Analytics...</h2>
            </div>
        );

    }


    // ==========================
    // NO DATA
    // ==========================

    if (!data) {

        return (
            <div className="teacher-dashboard">
                <div className="no-exams">

                    <h2>
                        No Analytics Available
                    </h2>

                    <p>
                        Unable to load analytics for this exam.
                    </p>

                </div>
            </div>
        );

    }


    // ==========================
    // SAFE DATA
    // ==========================

    const analytics = data.analytics || {

        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        passCount: 0,
        failCount: 0

    };


    const leaderboard = Array.isArray(data.leaderboard)
        ? data.leaderboard
        : [];


    const results = Array.isArray(data.results)
        ? data.results
        : [];


    // ==========================
    // SEARCH RESULTS
    // ==========================

    const filteredResults = results.filter((student) => {

        const studentName =
            student.studentId?.name || "";

        return studentName
            .toLowerCase()
            .includes(search.toLowerCase());

    });


    // ==========================
    // PIE DATA
    // ==========================

    const pieData = [

        {
            name: "Pass",
            value: Number(analytics.passCount) || 0
        },

        {
            name: "Fail",
            value: Number(analytics.failCount) || 0
        }

    ];


    const COLORS = [
        "#22c55e",
        "#ef4444"
    ];


    // ==========================
    // BAR DATA
    // ==========================

    const barData = leaderboard.map((student) => ({

        name:
            student.studentName ||
            student.studentId?.name ||
            "Student",

        Score:
            Number(student.score) || 0

    }));


    // ==========================
    // EXAM DATA
    // ==========================

    const exam = data.exam || {};

    const examTitle =
        exam.title ||
        exam.name ||
        "Exam Analytics";

    const examSubject =
        exam.subject ||
        "N/A";


    // ==========================
    // JSX
    // ==========================

    return (

        <div className="teacher-dashboard">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        📊 Teacher Analytics Dashboard
                    </h1>

                    <h3>
                        {examTitle}
                    </h3>

                    <p>
                        Subject: {examSubject}
                    </p>

                </div>

            </div>


            {/* ==========================
                STATS
            ========================== */}

            <div className="stats-grid">


                {/* TOTAL ATTEMPTS */}

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="stat-card"
                >

                    <FaUsers className="stat-icon" />

                    <h3>
                        Total Attempts
                    </h3>

                    <h1>
                        {analytics.totalAttempts}
                    </h1>

                </motion.div>


                {/* AVERAGE SCORE */}

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="stat-card"
                >

                    <FaChartLine
                        className="stat-icon blue"
                    />

                    <h3>
                        Average Score
                    </h3>

                    <h1>
                        {analytics.averageScore}
                    </h1>

                </motion.div>


                {/* HIGHEST SCORE */}

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="stat-card"
                >

                    <FaTrophy
                        className="stat-icon gold"
                    />

                    <h3>
                        Highest Score
                    </h3>

                    <h1>
                        {analytics.highestScore}
                    </h1>

                </motion.div>


                {/* PASS */}

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="stat-card"
                >

                    <FaCheckCircle
                        className="stat-icon green"
                    />

                    <h3>
                        Pass Students
                    </h3>

                    <h1>
                        {analytics.passCount}
                    </h1>

                </motion.div>


                {/* FAIL */}

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="stat-card"
                >

                    <FaTimesCircle
                        className="stat-icon red"
                    />

                    <h3>
                        Fail Students
                    </h3>

                    <h1>
                        {analytics.failCount}
                    </h1>

                </motion.div>

            </div>


            {/* ==========================
                CHARTS
            ========================== */}

            <div className="charts-grid">


                {/* ==========================
                    BAR CHART
                ========================== */}

                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >

                    <h2>
                        📊 Student Score Analysis
                    </h2>


                    {barData.length > 0 ? (

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart data={barData}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="Score"
                                    fill="#4f46e5"
                                    radius={[
                                        8,
                                        8,
                                        0,
                                        0
                                    ]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    ) : (

                        <div className="no-data">
                            No student score data available.
                        </div>

                    )}

                </motion.div>


                {/* ==========================
                    PIE CHART
                ========================== */}

                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >

                    <h2>
                        🥧 Pass vs Fail
                    </h2>


                    {analytics.totalAttempts > 0 ? (

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <PieChart>

                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={120}
                                    innerRadius={60}
                                    label
                                >

                                    {pieData.map(
                                        (entry, index) => (

                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index]}
                                            />

                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    ) : (

                        <div className="no-data">
                            No attempt data available.
                        </div>

                    )}

                </motion.div>

            </div>


            {/* ==========================
                TOOLBAR
            ========================== */}

            <motion.div
                className="toolbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >

                <input
                    type="text"
                    placeholder="🔍 Search Student"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="search-box"
                />


                <button
                    className="action-btn"
                    onClick={() => window.print()}
                >
                    🖨 Print Report
                </button>


                <button
                    className="action-btn"
                    onClick={() =>
                        alert(
                            "PDF Export Coming Next"
                        )
                    }
                >
                    📄 Download PDF
                </button>

            </motion.div>


            {/* ==========================
                LEADERBOARD
            ========================== */}

            <motion.div
                className="leaderboard-card"
                initial={{
                    opacity: 0,
                    y: 40
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}
            >

                <h2>
                    🏆 Student Leaderboard
                </h2>


                {leaderboard.length > 0 ? (

                    <div className="table-container">

                        <table className="leaderboard-table">

                            <thead>

                                <tr>

                                    <th>
                                        Rank
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Score
                                    </th>

                                    <th>
                                        Percentage
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {leaderboard.map(
                                    (student, index) => (

                                        <tr
                                            key={
                                                student.email ||
                                                student._id ||
                                                index
                                            }
                                        >

                                            <td>

                                                {index === 0
                                                    ? "🥇"
                                                    : index === 1
                                                    ? "🥈"
                                                    : index === 2
                                                    ? "🥉"
                                                    : index + 1}

                                            </td>


                                            <td>

                                                {student.studentName ||
                                                    student.studentId?.name ||
                                                    "Unknown"}

                                            </td>


                                            <td>

                                                {student.email ||
                                                    student.studentId?.email ||
                                                    "N/A"}

                                            </td>


                                            <td>

                                                {student.score ?? 0}

                                            </td>


                                            <td>

                                                {student.percentage ?? 0}%

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="no-data">
                        No leaderboard data available.
                    </div>

                )}

            </motion.div>


            {/* ==========================
                STUDENT RESULTS
            ========================== */}

            <motion.div
                className="students-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >

                <h2>
                    📋 All Student Results
                </h2>


                {filteredResults.length > 0 ? (

                    <div className="table-container">

                        <table className="students-table">

                            <thead>

                                <tr>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Score
                                    </th>

                                    <th>
                                        Correct
                                    </th>

                                    <th>
                                        Wrong
                                    </th>

                                    <th>
                                        Percentage
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredResults.map(
                                    (student) => (

                                        <tr
                                            key={
                                                student._id
                                            }
                                        >

                                            <td>

                                                {student.studentId?.name ||
                                                    "Unknown"}

                                            </td>


                                            <td>

                                                {student.score ?? 0}

                                            </td>


                                            <td>

                                                {student.correctCount ?? 0}

                                            </td>


                                            <td>

                                                {student.wrongCount ?? 0}

                                            </td>


                                            <td>

                                                {student.percentage ?? 0}%

                                            </td>


                                            <td>

                                                {Number(
                                                    student.percentage || 0
                                                ) >= 40 ? (

                                                    <span className="pass">
                                                        PASS
                                                    </span>

                                                ) : (

                                                    <span className="fail">
                                                        FAIL
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="no-data">

                        {search
                            ? "No student found."
                            : "No student results available."}

                    </div>

                )}

            </motion.div>

        </div>
    );
}

export default TeacherAnalytics;
