import "../styles/register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",
        role: "student"

    });

    const [loading, setLoading] =
        useState(false);


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        /*
        ================================================
        FRONTEND EMAIL CHECK
        ================================================
        */

        if (
            !formData.email
                .toLowerCase()
                .trim()
                .endsWith("@gla.ac.in")
        ) {

            alert(
                "Please use your GLA University email address."
            );

            return;

        }


        if (formData.password.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;

        }


        try {

            setLoading(true);


            const res =
                await api.post(
                    "/auth/register",
                    formData
                );


            console.log(
                "REGISTRATION:",
                res.data
            );


            alert(
                "Registration submitted successfully!\n\nYour account is now pending Admin approval."
            );


            setFormData({

                name: "",
                email: "",
                password: "",
                role: "student"

            });


            navigate("/");


        } catch (error) {

            console.error(
                "REGISTRATION ERROR:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="register-container">

            <form
                className="register-box"
                onSubmit={handleSubmit}
            >

                <h2>Create Account</h2>

                <p
                    style={{
                        textAlign: "center",
                        color: "#777",
                        fontSize: "13px",
                        marginBottom: "20px"
                    }}
                >
                    GLA University users only
                </p>


                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />


                <input
                    type="email"
                    name="email"
                    placeholder="Enter GLA Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />


                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Submitting..."
                        : "Register"}

                </button>


                <p
                    style={{
                        marginTop: "15px",
                        textAlign: "center"
                    }}
                >

                    Already have account?{" "}

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </form>

        </div>

    );

}

export default Register;