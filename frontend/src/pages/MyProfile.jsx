import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MyProfile() {

    const { student } = useContext(AuthContext);

    const profileFields = [
        {
            label: "First Name",
            value: student?.firstName
        },
        {
            label: "Last Name",
            value: student?.lastName
        },
        {
            label: "Email Address",
            value: student?.email
        },
        {
            label: "Phone Number",
            value: student?.phone
        },
        {
            label: "Gender",
            value: student?.gender
        },
        {
            label: "Registered Course",
            value: student?.course
        },
        {
            label: "Account Type",
            value: student?.role
    ? student.role.charAt(0).toUpperCase() + student.role.slice(1)
    : "Not available"
        }
    ];

    return (

        <div className="my-profile-container">

            <div className="my-profile-card">

                <div className="my-profile-heading">

                    <div className="my-profile-avatar">
                        {student?.firstName?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div>
                        <h2>
                            {student?.firstName} {student?.lastName}
                        </h2>

                        <p>Student Profile</p>
                    </div>

                </div>


                <div className="profile-section-heading">
                    <h3>Personal Information</h3>

                    <span>READ ONLY</span>
                </div>


                <div className="my-profile-grid">

                    {profileFields.map((field) => (

                        <div
                            className="my-profile-field"
                            key={field.label}
                        >

                            <label>{field.label}</label>

                            <div className="readonly-field">
                                {field.value || "Not available"}
                            </div>

                        </div>

                    ))}

                </div>


                <div className="profile-access-note">

                    🔒 Your personal information can only be modified
                    by an authorised administrator.

                </div>

            </div>

        </div>

    );

}

export default MyProfile;
