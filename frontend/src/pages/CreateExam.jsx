import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/CreateExam.css";

function CreateExam() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

    const dataToSend = {
  ...formData,
  startTime: new Date(formData.startTime).toISOString(),
  endTime: new Date(formData.endTime).toISOString()
};

const res = await api.post(
  "/exams/create",
  dataToSend,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      alert(res.data.message);

      navigate("/teacher-dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to Create Exam"
      );

    }

  };

  return (

    <div className="create-page">

      <div className="create-card">

        <h1>Create New Exam</h1>

        <p>
          Fill the information below to publish an online examination.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div>

              <label>Exam Title</label>

              <input
                type="text"
                name="title"
                placeholder="Java Programming"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>

            <div>

              <label>Subject</label>

              <input
                type="text"
                name="subject"
                placeholder="Core Java"
                value={formData.subject}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <label>Description</label>

          <textarea
            rows="5"
            name="description"
            placeholder="Enter Exam Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="row">

            <div>

              <label>Duration (Minutes)</label>

              <input
                type="number"
                name="duration"
                placeholder="60"
                value={formData.duration}
                onChange={handleChange}
                required
              />

            </div>

            <div>

              <label>Total Marks</label>

              <input
                type="number"
                name="totalMarks"
                placeholder="100"
                value={formData.totalMarks}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="row">

            <div>

              <label>Start Time</label>

              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />

            </div>

            <div>

              <label>End Time</label>

              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <button type="submit">
            Create Exam
          </button>

        </form>

      </div>

    </div>

  );

}

export default CreateExam;
