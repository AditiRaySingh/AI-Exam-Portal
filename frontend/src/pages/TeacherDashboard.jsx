import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);

    const token = localStorage.getItem("token");

    // IMPORTANT:
    // Change this URL to your deployed BACKEND URL.
   const API_URL = "https://ai-exam-portal-backend.onrender.com/api";

    useEffect(() => {
        fetchDashboard();
        fetchExams();
    }, []);

    /* =========================
       FETCH DASHBOARD STATS
    ========================= */

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/dashboard/teacher`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;

            console.log("Teacher Dashboard:", data);

            setTotalStudents(
                data.totalStudents ??
                data.students ??
                0
            );

            setTotalAttempts(
                data.totalAttempts ??
                data.attempts ??
                0
            );

        } catch (error) {
            console.log(
                "Dashboard error:",
                error.response?.data || error.message
            );
        }
    };

    /* =========================
       FETCH TEACHER EXAMS
    ========================= */

    const fetchExams = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/exams/teacher`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Teacher Exams:", response.data);

            const examData =
                response.data?.exams ||
                response.data?.data ||
                response.data ||
                [];

            setExams(Array.isArray(examData) ? examData : []);

        } catch (error) {
            console.log(
                "Exam error:",
                error.response?.data || error.message
            );

            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <h3>Loading Teacher Dashboard...</h3>
            </div>
        );
    }

    return (
        <div className="teacher-dashboard">

            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <div>
                    <h1>Teacher Dashboard</h1>

                    <p>
                        Manage Exams, Questions and Student Performance
                    </p>
                </div>

                <button
                    className="create-btn"
                    onClick={() => navigate("/create-exam")}
                >
                    + Create Exam
                </button>

            </div>


            {/* ================= STATS ================= */}

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Exams</h3>
                    <h2>{exams.length}</h2>
                </div>

                <div className="stat-card">
                    <h3>Total Students</h3>
                    <h2>{totalStudents}</h2>
                </div>

                <div className="stat-card">
                    <h3>Total Attempts</h3>
                    <h2>{totalAttempts}</h2>
                </div>

            </div>


            {/* ================= EXAMS ================= */}

            <div className="exam-section">

                <h2>Your Exams</h2>

                {exams.length === 0 ? (

                    <div className="no-exams">
                        <h3>No exams found</h3>

                        <p>
                            Create your first exam to get started.
                        </p>

                        <button
                            className="create-btn"
                            onClick={() => navigate("/create-exam")}
                        >
                            + Create Exam
                        </button>
                    </div>

                ) : (

                    <div className="exam-slider">

                        {exams.map((exam) => (

                            <div
                                className="exam-card"
                                key={exam._id}
                            >

                                {/* ================= EXAM INFO ================= */}

                                <div className="exam-info">

                                    <div className="exam-field">
                                        <span>EXAM</span>

                                        <h3>
                                            {exam.title ||
                                                exam.name ||
                                                "Untitled Exam"}
                                        </h3>
                                    </div>


                                    <div className="exam-field">
                                        <span>SUBJECT</span>

                                        <p>
                                            {exam.subject || "N/A"}
                                        </p>
                                    </div>


                                    <div className="exam-field">
                                        <span>DURATION</span>

                                        <p>
                                            {exam.duration || 0} min
                                        </p>
                                    </div>


                                    <div className="exam-field">
                                        <span>TOTAL MARKS</span>

                                        <p>
                                            {exam.totalMarks || 0}
                                        </p>
                                    </div>

                                </div>


                                {/* ================= ACTIONS ================= */}

                                <div className="actions-cell">

                                    <button
                                        className="action-btn blue"
                                        onClick={() =>
                                            navigate(
                                                `/add-question/${exam._id}`
                                            )
                                        }
                                    >
                                        Add Questions
                                    </button>


                                    <button
                                        className="action-btn purple"
                                        onClick={() =>
                                            navigate(
                                                `/ai-generate/${exam._id}`
                                            )
                                        }
                                    >
                                        AI Generate
                                    </button>


                                    <button
                                        className="action-btn orange"
                                        onClick={() =>
                                            navigate(
                                                `/generate-material/${exam._id}`
                                            )
                                        }
                                    >
                                        Upload Material
                                    </button>


                                    <button
                                        className="action-btn blue"
                                        onClick={() =>
                                            navigate(
                                                `/questions/${exam._id}`
                                            )
                                        }
                                    >
                                        Manage
                                    </button>


                                    {/* RESULTS */}

                                    <button
                                        className="action-btn blue result-btn"
                                        onClick={() =>
                                            navigate(
                                                `/teacher-results/${exam._id}`
                                            )
                                        }
                                    >
                                        Results
                                    </button>


                                    {/* ANALYTICS */}

                                    <button
                                        className="action-btn analytics"
                                        onClick={() =>
                                            navigate(
                                                `/teacher-analytics/${exam._id}`
                                            )
                                        }
                                    >
                                        📊 Analytics
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default TeacherDashboard;
