import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  return (

    <nav className="navbar">

      <div className="nav-left">

        <div className="logo-box">
          🎓
        </div>

        <h2>
          ExamPortal
        </h2>

      </div>

      <div className="nav-center">

        <button
          className="nav-btn active"
        >
          Dashboard
        </button>

        <button
          className="nav-btn"
          onClick={() =>
            navigate("/student-results")
          }
        >
          My Results
        </button>

      </div>

      <div className="nav-right">

        <div className="profile-circle">
          {user?.name?.charAt(0)}
        </div>

        <p>
          {user?.name}
        </p>

      </div>

    </nav>
  );
}

export default Navbar;