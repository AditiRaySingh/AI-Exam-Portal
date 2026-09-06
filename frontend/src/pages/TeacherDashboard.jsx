import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {

    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {

            const response = await axios.get(
                "https://your-backend-url/api/exams/teacher",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setExams(response.data.exams || response.data);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <h3>Loading...</h3>
            </div>
        );
    }


    return (
        <div className="teacher-dashboard">

            {/* HEADER */}

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


            {/* STATS */}

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Exams</h3>
                    <h2>{exams.length}</h2>
                </div>

                <div className="stat-card">
                    <h3>Total Students</h3>
                    <h2>1</h2>
                </div>

                <div className="stat-card">
                    <h3>Total Attempts</h3>
                    <h2>5</h2>
                </div>

            </div>


            {/* EXAMS */}

            <div className="exam-section">

                <h2>Your Exams</h2>

                <div className="exam-slider">

                    {exams.map((exam) => (

                        <div
                            className="exam-card"
                            key={exam._id}
                        >

                            <div className="exam-info">

                                <div>
                                    <span>EXAM</span>
                                    <h3>{exam.title || exam.name}</h3>
                                </div>

                                <div>
                                    <span>SUBJECT</span>
                                    <p>{exam.subject}</p>
                                </div>

                                <div>
                                    <span>DURATION</span>
                                    <p>{exam.duration} min</p>
                                </div>

                                <div>
                                    <span>TOTAL MARKS</span>
                                    <p>{exam.totalMarks}</p>
                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="actions-cell">

                                <button
                                    className="action-btn blue"
                                    onClick={() =>
                                        navigate(`/add-question/${exam._id}`)
                                    }
                                >
                                    Add Questions
                                </button>

                                <button
                                    className="action-btn purple"
                                    onClick={() =>
                                        navigate(`/ai-generate/${exam._id}`)
                                    }
                                >
                                    AI Generate
                                </button>

                                <button
                                    className="action-btn orange"
                                    onClick={() =>
                                        navigate(`/generate-material/${exam._id}`)
                                    }
                                >
                                    Upload Material
                                </button>

                                <button
                                    className="action-btn blue"
                                    onClick={() =>
                                        navigate(`/questions/${exam._id}`)
                                    }
                                >
                                    Manage
                                </button>

                                {/* IMPORTANT */}

                                <button
                                    className="action-btn blue result-btn"
                                    onClick={() =>
                                        navigate(`/teacher-results/${exam._id}`)
                                    }
                                >
                                    Results
                                </button>

                                <button
                                    className="action-btn analytics"
                                    onClick={() =>
                                        navigate(`/teacher-analytics/${exam._id}`)
                                    }
                                >
                                    📊 Analytics
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default TeacherDashboard;
