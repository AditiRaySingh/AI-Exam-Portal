import "../styles/navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("examId");

    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <div className="logo-circle">🎓</div>

        <div>
          <h2>AI Exam Portal</h2>
          <p>Smart Examination System</p>
        </div>
      </div>

      <div className="navbar-links">

        <Link
          to={
            user?.role === "teacher"
              ? "/teacher-dashboard"
              : "/student-dashboard"
          }
          className={
            location.pathname.includes("dashboard")
              ? "active"
              : ""
          }
        >
          Dashboard
        </Link>

        {user?.role === "student" && (
          <Link
            to="/student-results"
            className={
              location.pathname.includes("student-results")
                ? "active"
                : ""
            }
          >
            Results
          </Link>
        )}

        {user?.role === "teacher" && (
          <Link
            to="/create-exam"
            className={
              location.pathname.includes("create-exam")
                ? "active"
                : ""
            }
          >
            Create Exam
          </Link>
        )}

      </div>

      <div className="navbar-profile">

        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h4>{user?.name}</h4>
          <span>{user?.role}</span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;