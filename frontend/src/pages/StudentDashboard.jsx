import "../styles/studentDashboard.css";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ExamCard from "../components/ExamCard";
import ResultCard from "../components/ResultCard";

function StudentDashboard() {

  return (

    <div className="dashboard">

      <Navbar />

      <div className="dashboard-content">

        {/* Welcome */}

        <h1>
          Welcome back!
        </h1>

        <p className="subtitle">
          Here's your examination overview
        </p>

        {/* Stats */}

        <div className="stats-row">

          <StatCard
            title="Total Exams"
            value="2"
            icon="📘"
          />

          <StatCard
            title="Average Score"
            value="85%"
            icon="📈"
          />

          <StatCard
            title="Pending Exams"
            value="2"
            icon="⏰"
          />

          <StatCard
            title="Passed Exams"
            value="2"
            icon="🏆"
          />

        </div>

        {/* Available Exams */}

        <div className="section-title">

          <h2>
            Available Exams
          </h2>

          <p className="subtitle">
            Start your pending examinations
          </p>

          <div className="exam-row">

            <ExamCard
              examId="6a1a62f936b49b8ff5fb3fe3"
              title="Mathematics Final Exam"
              description="Comprehensive mathematics examination."
              duration="120 minutes"
              questions="50"
              marks="100"
              dueDate="Jun 08, 2026"
            />

            <ExamCard
              examId="6a1955ed691f722d9e7034de"
              title="Mathematics Final Exam"
              description="Comprehensive mathematics examination."
              duration="120 minutes"
              questions="50"
              marks="100"
              dueDate="Jun 08, 2026"
            />

          </div>

        </div>

        {/* Recent Results */}

        <div className="section-title">

          <h2>
            Recent Results
          </h2>

          <p className="subtitle">
            Your latest exam performances
          </p>

          <ResultCard
            title="Mathematics Final Exam"
            date="May 30, 2026"
            percentage="85%"
            marks="85/100 marks"
          />

          <ResultCard
            title="Physics Quiz"
            date="May 27, 2026"
            percentage="84%"
            marks="42/50 marks"
          />

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;