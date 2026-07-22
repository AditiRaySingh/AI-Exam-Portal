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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(

        `/attempt/teacher/${examId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      console.log("Analytics:", res.data);

      setData(res.data);

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <h2 className="loading">

        Loading Analytics...

      </h2>

    );

  }

  if (!data) {

    return (

      <h2>

        No Analytics Available

      </h2>

    );

  }

  const analytics = data.analytics;

  const leaderboard = data.leaderboard;

  const results = data.results;
  const filteredResults = results.filter((student) =>

  student.studentId?.name
    ?.toLowerCase()
    .includes(search.toLowerCase())

);

  const pieData = [

    {

      name: "Pass",

      value: analytics.passCount

    },

    {

      name: "Fail",

      value: analytics.failCount

    }

  ];

  const COLORS = [

    "#22c55e",

    "#ef4444"

  ];

 


  const barData = leaderboard.map(student => ({
  name: student.studentName,
  Score: student.score
}));

return (

  <div className="teacher-dashboard">

    <div className="dashboard-header">

      <h1>

        📊 Teacher Analytics Dashboard

      </h1>

      <h3>

        {data.exam.title}

      </h3>

      <p>

        Subject : {data.exam.subject}

      </p>

    </div>

    <div className="stats-grid">

      <motion.div

        whileHover={{ scale: 1.05 }}

        className="stat-card"

      >

        <FaUsers className="stat-icon" />

        <h3>Total Attempts</h3>

        <h1>

          {analytics.totalAttempts}

        </h1>

      </motion.div>

      <motion.div

        whileHover={{ scale: 1.05 }}

        className="stat-card"

      >

        <FaChartLine className="stat-icon blue" />

        <h3>Average Score</h3>

        <h1>

          {analytics.averageScore}

        </h1>

      </motion.div>

      <motion.div

        whileHover={{ scale: 1.05 }}

        className="stat-card"

      >

        <FaTrophy className="stat-icon gold" />

        <h3>Highest Score</h3>

        <h1>

          {analytics.highestScore}

        </h1>

      </motion.div>

      <motion.div

        whileHover={{ scale: 1.05 }}

        className="stat-card"

      >

        <FaCheckCircle

          className="stat-icon green"

        />

        <h3>Pass Students</h3>

        <h1>

          {analytics.passCount}

        </h1>

      </motion.div>

      <motion.div

        whileHover={{ scale: 1.05 }}

        className="stat-card"

      >

        <FaTimesCircle

          className="stat-icon red"

        />

        <h3>Fail Students</h3>

        <h1>

          {analytics.failCount}

        </h1>

      </motion.div>

    </div>

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
                radius={[8,8,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

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

                {

                  pieData.map((entry,index)=>(

                    <Cell

                      key={index}

                      fill={COLORS[index]}

                    />

                  ))

                }

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </motion.div>

      </div>




      <motion.div

  className="toolbar"

  initial={{ opacity: 0 }}

  animate={{ opacity: 1 }}

>

  <input

    type="text"

    placeholder="🔍 Search Student"

    value={search}

    onChange={(e)=>setSearch(e.target.value)}

    className="search-box"

  />

  <button

    className="action-btn"

    onClick={()=>window.print()}

  >

    🖨 Print Report

  </button>

  <button

    className="action-btn"

    onClick={()=>alert("PDF Export Coming Next")}

  >

    📄 Download PDF

  </button>

</motion.div>

            {/* ==========================
          LEADERBOARD
      ========================== */}

      <motion.div

        className="leaderboard-card"

        initial={{ opacity: 0, y: 40 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5 }}

      >

        <h2>

          🏆 Student Leaderboard

        </h2>

        <table className="leaderboard-table">

          <thead>

            <tr>

              <th>Rank</th>

              <th>Student</th>

              <th>Email</th>

              <th>Score</th>

              <th>Percentage</th>

            </tr>

          </thead>

          <tbody>

            {

              leaderboard.map((student, index) => (

                <tr key={student.email}>

                  <td>

                    {

                      index === 0

                        ? "🥇"

                        : index === 1

                        ? "🥈"

                        : index === 2

                        ? "🥉"

                        : index + 1

                    }

                  </td>

                  <td>

                    {student.studentName}

                  </td>

                  <td>

                    {student.email}

                  </td>

                  <td>

                    {student.score}

                  </td>

                  <td>

                    {student.percentage}%

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

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

        <table className="students-table">

          <thead>

            <tr>

              <th>Student</th>

              <th>Score</th>

              <th>Correct</th>

              <th>Wrong</th>

              <th>Percentage</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {

              filteredResults.map((student) => (

                <tr key={student._id}>

                  <td>

                    {student.studentId?.name}

                  </td>

                  <td>

                    {student.score}

                  </td>

                  <td>

                    {student.correctCount}

                  </td>

                  <td>

                    {student.wrongCount}

                  </td>

                  <td>

                    {student.percentage}%

                  </td>

                  <td>

                    {

                      student.percentage >= 40

                        ?

                        <span className="pass">

                          PASS

                        </span>

                        :

                        <span className="fail">

                          FAIL

                        </span>

                    }

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </motion.div>


          </div>

  );

}

export default TeacherAnalytics;