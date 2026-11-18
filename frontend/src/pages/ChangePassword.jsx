import { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext";


function ChangePassword() {

    const { token } = useContext(AuthContext);


    // Store password form values
    const [formData, setFormData] = useState({

        currentPassword: "",
        newPassword: "",
        confirmPassword: ""

    });


    // Store response messages
    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // Handle input changes
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    // Submit password change request
    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        if (formData.newPassword !== formData.confirmPassword) {

            setError("New passwords do not match.");

            return;

        }


        try {

            setLoading(true);


            const response = await fetch(

                `${import.meta.env.VITE_API_URL}/api/auth/change-password`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify(formData)

                }

            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(

                    data.message || "Unable to change password."

                );

            }


            setMessage(data.message);


            // Clear password fields after success
            setFormData({

                currentPassword: "",

                newPassword: "",

                confirmPassword: ""

            });


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="change-password-container">

            <div className="change-password-card">

                <div className="password-heading">

                    <h2>Change Password</h2>

                    <p>
                        Update your account password to keep your
                        EduSmart account secure.
                    </p>

                </div>


                {message && (

                    <div className="password-success">

                        {message}

                    </div>

                )}


                {error && (

                    <div className="password-error">

                        {error}

                    </div>

                )}


                <form onSubmit={handleSubmit}>

                    <div className="password-input-group">

                        <label>Current Password</label>

                        <input

                            type="password"

                            name="currentPassword"

                            value={formData.currentPassword}

                            onChange={handleChange}

                            placeholder="Enter current password"

                            autoComplete="current-password"

                            required

                        />

                    </div>


                    <div className="password-input-group">

                        <label>New Password</label>

                        <input

                            type="password"

                            name="newPassword"

                            value={formData.newPassword}

                            onChange={handleChange}

                            placeholder="Enter new password"

                            autoComplete="new-password"

                            minLength={8}

                            required

                        />

                    </div>


                    <div className="password-input-group">

                        <label>Confirm New Password</label>

                        <input

                            type="password"

                            name="confirmPassword"

                            value={formData.confirmPassword}

                            onChange={handleChange}

                            placeholder="Confirm new password"

                            autoComplete="new-password"

                            minLength={8}

                            required

                        />

                    </div>


                    <button

                        type="submit"

                        className="change-password-btn"

                        disabled={loading}

                    >

                        {loading ? "Updating Password..." : "Update Password"}

                    </button>

                </form>


                <div className="password-security-note">

                    🔒 Your password is securely encrypted before storage.

                </div>

            </div>

        </div>

    );

}


export default ChangePassword;
