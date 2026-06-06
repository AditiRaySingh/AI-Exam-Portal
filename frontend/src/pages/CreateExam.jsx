import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/CreateExam.css";

function CreateExam() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      title: "",
      subject: "",
      description: "",
      duration: "",
      totalMarks: "",
      startTime: "",
      endTime: ""
    });

  const handleChange = (e) => {

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

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await api.post(
            "/exam/create",
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        alert(
          res.data.message
        );

        navigate(
          "/teacher-dashboard"
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message ||
          "Failed to create exam"
        );

      }
    };

  return (

    <div className="create-exam-page">

      <div className="create-exam-card">

        <h1>
          Create New Exam
        </h1>

        <p>
          Create and publish your exam
        </p>

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="title"
            placeholder="Exam Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="totalMarks"
            placeholder="Total Marks"
            value={formData.totalMarks}
            onChange={handleChange}
            required
          />

          <label>
            Start Time
          </label>

          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />

          <label>
            End Time
          </label>

          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
          >
            Create Exam
          </button>

        </form>

      </div>

    </div>

  );
}

export default CreateExam;