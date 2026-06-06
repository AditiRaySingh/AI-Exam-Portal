import "../styles/register.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Register() {

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "student"
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

      console.log(
        "FORM DATA:",
        formData
      );

      try {

        const res =
          await api.post(
            "/auth/register",
            {
              name:
                formData.name,
              email:
                formData.email,
              password:
                formData.password,
              role:
                formData.role
            }
          );

        console.log(
          res.data
        );

        alert(
          "Registration Success"
        );

      }

      catch (error) {

        console.log(
          error.response?.data
        );

        alert(
          error.response?.data?.message ||
          "Registration Failed"
        );
      }

    };

  return (

    <div className="register-container">

      <form
        className="register-box"
        onSubmit={handleSubmit}
      >

        <h2>
          Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />

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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >

          <option value="student">
            Student
          </option>

          <option value="teacher">
            Teacher
          </option>

        </select>

        <button>
          Register
        </button>

        <p
          style={{
            marginTop: "15px",
            textAlign: "center"
          }}
        >
          Already have account?

          <Link to="/">
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Register;