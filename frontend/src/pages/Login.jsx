import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: ""
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post(
        "/auth/login",
        formData
      );
     console.log("========== LOGIN ==========");
console.log("EMAIL:", formData.email);
console.log("FULL RESPONSE:", res.data);
console.log("USER FROM BACKEND:", res.data.user);
console.log("============================");

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      if (res.data.user.role === "teacher") {

        navigate("/teacher-dashboard");

      } else {

        navigate("/student-dashboard");

      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (

    <div className="login-page">

      <div className="login-left">

        <h1>
          AI Exam Portal
        </h1>

        <h3>
          Smart Online Examination System
        </h3>

        <p>
          Conduct AI-powered online exams,
          evaluate subjective answers,
          generate questions automatically,
          and track student performance
          using advanced analytics.
        </p>

      </div>

      <div className="login-right">

        <form
          className="login-card"
          onSubmit={handleSubmit}
        >

          <h2>
            Welcome Back
          </h2>

          <p>
            Login to continue
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-box">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          <button
            className="login-btn"
            type="submit"
          >
            Login
          </button>

          <p className="register-link">

            Don't have an account?

            <Link to="/register">

              Register

            </Link>

          </p>

        </form>

      </div>

    </div>

  );

}

export default Login;