import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: ""
    });

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value
      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await api.post(
            "/auth/login",
            {
              email:
                formData.email,
              password:
                formData.password
            }
          );

        console.log(
          res.data
        );

        // save token
        localStorage.setItem(
          "token",
          res.data.token
        );

        // save user
        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.user
          )
        );

        alert(
          "Login Success"
        );

        // role based redirect
        if (
          res.data.user.role ===
          "teacher"
        ) {

          navigate(
            "/teacher-dashboard"
          );

        }

        else {

          navigate(
            "/student-dashboard"
          );
        }

      }

      catch (error) {

  console.log("FULL ERROR:", error);

  console.log(
    "RESPONSE:",
    error.response?.data
  );

  alert(
    error.response?.data?.message ||
    "Login Failed"
  );
}
    };

  return (

    <div className="login-container">

      <form
        className="login-box"
        onSubmit={handleSubmit}
      >

        <h2>
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button>
          Login
        </button>

        <p
          style={{
            marginTop:"15px",
            textAlign:"center"
          }}
        >
          No account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;