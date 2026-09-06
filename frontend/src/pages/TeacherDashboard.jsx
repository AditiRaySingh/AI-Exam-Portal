import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publishingId, setPublishingId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchExams();
    }, []);

    /* =========================================================
       FETCH TEACHER EXAMS
    ========================================================= */

    const fetchExams = async () => {
        try {
            const response = await axios.get(
                "https://ai-exam-portal-1-vhhx.onrender.com/api/exams/teacher",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setExams(response.data.exams || []);
        } catch (error) {
            console.error(
                "FETCH EXAMS ERROR:",
                error.response?.data || error.message
            );

            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       PUBLISH EXAM
    ========================================================= */

    const publishExam = async (examId) => {
        try {
            setPublishingId(examId);

            const response = await axios.put(
                `https://ai-exam-portal-1-vhhx.onrender.com/api/exams/publish/${examId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(
                response.data.message ||
                "Exam published successfully!"
            );

            await fetchExams();

        } catch (error) {
            console.error(
                "PUBLISH EXAM ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to publish exam"
            );
        } finally {
            setPublishingId(null);
        }
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="loading-screen">
                    <div className="loader"></div>
                    <h3>Loading...</h3>
                </div>
            </>
        );
    }

    /* =========================================================
       DASHBOARD
    ========================================================= */

    return (
        <>
            {/* SAME NAVBAR AS STUDENT DASHBOARD */}
            <Navbar />

            <div className="teacher-dashboard">

                {/* =================================================
                    HEADER
                ================================================= */}

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


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="stats-grid">

                    <div className="stat-card">

                        <div>
                            <h3>Total Exams</h3>

                            <h2>
                                {exams.length}
                            </h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div>
                            <h3>Total Students</h3>

                            <h2>
                                1
                            </h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div>
                            <h3>Total Attempts</h3>

                            <h2>
                                5
                            </h2>
                        </div>

                    </div>

                </div>


                {/* =================================================
                    EXAM SECTION
                ================================================= */}

                <div className="exam-section">

                    <div className="section-heading">

                        <div>
                            <h2>Your Exams</h2>

                            <p>
                                Create, manage and publish your exams
                            </p>
                        </div>

                        <span className="exam-count">
                            {exams.length} Exams
                        </span>

                    </div>


                    {exams.length === 0 ? (

                        <div className="no-exams">

                            <div className="no-exams-icon">
                                📝
                            </div>

                            <h3>
                                No exams found
                            </h3>

                            <p>
                                Create your first exam to get started.
                            </p>

                            <button
                                className="empty-create-btn"
                                onClick={() =>
                                    navigate("/create-exam")
                                }
                            >
                                + Create Exam
                            </button>

                        </div>

                    ) : (

                        /*
                            IMPORTANT:
                            This is NOT a slider.

                            Desktop:
                            3 cards per row

                            Tablet:
                            2 cards per row

                            Mobile:
                            1 card per row
                        */

                        <div className="exam-slider">

                            {exams.map((exam) => {

                                const isPublished =
                                    exam.status === "published" ||
                                    exam.isPublished === true;

                                const isPublishing =
                                    publishingId === exam._id;

                                return (

                                    <div
                                        className="exam-card"
                                        key={exam._id}
                                    >

                                        {/* =========================
                                            CARD HEADER
                                        ========================= */}

                                        <div className="exam-info">

                                            <div className="exam-title-area">

                                                <span className="exam-label">
                                                    EXAM
                                                </span>

                                                <h3>
                                                    {
                                                        exam.title ||
                                                        exam.name ||
                                                        "Untitled Exam"
                                                    }
                                                </h3>

                                                <span
                                                    className={
                                                        isPublished
                                                            ? "status-badge published"
                                                            : "status-badge draft"
                                                    }
                                                >
                                                    {isPublished
                                                        ? "✓ Published"
                                                        : "Draft"}
                                                </span>

                                            </div>


                                            {/* SUBJECT */}

                                            <div className="exam-meta">

                                                <div className="meta-item">

                                                    <span>
                                                        SUBJECT
                                                    </span>

                                                    <p>
                                                        {
                                                            exam.subject ||
                                                            "N/A"
                                                        }
                                                    </p>

                                                </div>


                                                {/* DURATION */}

                                                <div className="meta-item">

                                                    <span>
                                                        DURATION
                                                    </span>

                                                    <p>
                                                        {
                                                            exam.duration ||
                                                            0
                                                        }{" "}
                                                        min
                                                    </p>

                                                </div>

                                            </div>


                                            {/* TOTAL MARKS */}

                                            <div className="marks-info">

                                                <span>
                                                    TOTAL MARKS
                                                </span>

                                                <p>
                                                    {
                                                        exam.totalMarks ||
                                                        0
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            ACTION BUTTONS
                                        ================================================= */}

                                        <div className="actions-cell">

                                            {/* ADD QUESTIONS */}

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


                                            {/* AI GENERATE */}

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


                                            {/* UPLOAD MATERIAL */}

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


                                            {/* MANAGE */}

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
                                                className="action-btn blue"
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


                                            {/* =================================================
                                                PUBLISH
                                            ================================================= */}

                                            <button
                                                className={
                                                    isPublished
                                                        ? "action-btn published-btn"
                                                        : "action-btn publish-btn"
                                                }
                                                onClick={() =>
                                                    publishExam(
                                                        exam._id
                                                    )
                                                }
                                                disabled={
                                                    isPublished ||
                                                    isPublishing
                                                }
                                            >
                                                {isPublishing
                                                    ? "Publishing..."
                                                    : isPublished
                                                        ? "✓ Published"
                                                        : "🚀 Publish Exam"}
                                            </button>

                                        </div>

                                    </div>

                                );
                            })}

                        </div>

                    )}

                </div>

            </div>
        </>
    );
}

export default TeacherDashboard;
