import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import "../App.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // Handle login submission
    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setLoading(true);

        try {

            const data = await login(
                formData.email,
                formData.password
            );

            // Check user role and redirect
            if (data.student.role === "admin") {

                navigate("/admin-dashboard");

            } else {

                navigate("/dashboard");

            }

        } catch (error) {

            setMessage(error.message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-container">

            <div className="login-card">

                <div className="login-logo">
                    Edu<span>Smart</span>
                </div>

                <div className="login-heading">

                    <span className="form-label">
                        STUDENT / ADMIN PORTAL
                    </span>

                    <h2>Welcome Back!</h2>

                    <p>
                        Sign in to continue your EduSmart journey.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {message && (

                        <div className="form-message error">

                            {message}

                        </div>

                    )}


                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing In..."
                            : "Sign In"
                        }

                    </button>

                </form>


                <div className="login-link">

                    Don't have an account?

                    <Link to="/register">
                        {" "}Create Account
                    </Link>

                </div>


                <div className="copyright">

                    © 2026 EduSmart. All rights reserved.

                </div>

            </div>

        </div>

    );

}

export default Login;
