import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Prevent the browser from refreshing
    e.preventDefault();

    // Clear previous messages
    setMessage("");
    setMessageType("");

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");

      return;
    }

    // Start loading
    setLoading(true);

    try {
      // Send registration information to Node.js
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/students/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        },
      );

      // Convert backend response to JavaScript
      const data = await response.json();

      // Check whether the request was successful
      if (!response.ok) {
        const errorMessage = data.errors
          ? data.errors.map((error) => error.msg).join(", ")
          : data.message || "Registration failed";

        throw new Error(errorMessage);
      }

      // Display success message
      setMessage(data.message);

      setMessageType("success");

      // Clear the form after successful registration
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        course: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Display error message
      setMessage(error.message);

      setMessageType("error");

      console.error("Registration Error:", error);
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* LEFT PANEL */}
      <section className="welcome-panel">
        <div className="welcome-content">
          <div className="brand">
            <span className="brand-icon">E</span>
            <span>EduSmart</span>
          </div>

          <h1>
            Your Future
            <br />
            Starts <span>Here.</span>
          </h1>

          <p>
            Take the first step towards achieving your academic dreams. Join a
            community of learners and discover endless opportunities.
          </p>

          <div className="benefits">
            <div>✓ Quality Education</div>
            <div>✓ Experienced Lecturers</div>
            <div>✓ Flexible Learning</div>
            <div>✓ Career Opportunities</div>
          </div>

          <div className="welcome-footer">
            Empowering minds. Building futures.
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="form-panel">
        <div className="form-wrapper">
          <div className="mobile-brand">
            Edu<span>Smart</span>
          </div>

          <div className="form-heading">
            <span className="form-label">STUDENT REGISTRATION</span>

            <h2>Create Your Account</h2>

            <p>Please provide your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* PERSONAL INFORMATION */}
            <h3 className="section-heading">Personal Information</h3>

            <div className="input-row">
              <div className="input-group">
                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* ACADEMIC INFORMATION */}
            <h3 className="section-heading">Academic Information</h3>

            <div className="input-group">
              <label>Select Course</label>

              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">Choose your course</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business Administration">
                  Business Administration
                </option>
                <option value="Engineering">Engineering</option>
                <option value="Accounting">Accounting</option>
                <option value="Mass Communication">Mass Communication</option>
                <option value="Medicine">Medicine</option>
                <option value="Law">Law</option>
              </select>
            </div>

            {/* ACCOUNT SECURITY */}
            <h3 className="section-heading">Account Security</h3>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            {/* TERMS */}
            <div className="terms">
              <input type="checkbox" id="terms" required />

              <label htmlFor="terms">
                I agree to the Terms & Conditions and Privacy Policy.
              </label>
            </div>

            {message && (
              <div className={`form-message ${messageType}`} role="alert">
                {message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Registering Student..." : "Create Student Account"}

              {!loading && <span> → </span>}
            </button>
          </form>

          <div className="login-link">
            Already have an account?
            <Link to="/login"> Sign In</Link>
          </div>

          <div className="copyright">© 2026 EduSmart. All rights reserved.</div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
