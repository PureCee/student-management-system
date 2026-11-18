import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";


function AdminDashboard() {

    const { student, token } = useContext(AuthContext);

    const [statistics, setStatistics] = useState({
        totalStudents: 0,
        totalCourses: 0
    });

    const [students, setStudents] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    // EDIT MODAL STATES
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState(null);

    const [saving, setSaving] = useState(false);

    const [editMessage, setEditMessage] = useState("");

    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        course: ""
    });


    // FETCH DASHBOARD STATISTICS
    const fetchDashboard = async () => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load dashboard");
            }

            setStatistics(data.statistics);

        } catch (error) {

            setMessage(error.message);

        }

    };


    // FETCH ALL STUDENTS
    const fetchStudents = async (searchTerm = "") => {

        try {

            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/students?search=${encodeURIComponent(searchTerm)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load students");
            }

            setStudents(data.students);

            setMessage("");

        } catch (error) {

            setMessage(error.message);

        } finally {

            setLoading(false);

        }

    };


    // LOAD DASHBOARD
    useEffect(() => {

        if (!token) return;

        fetchDashboard();

        fetchStudents();

    }, [token]);


    // SEARCH STUDENTS
    useEffect(() => {

        if (!token) return;

        const timer = setTimeout(() => {

            fetchStudents(search);

        }, 400);

        return () => clearTimeout(timer);

    }, [search, token]);


    // DELETE STUDENT
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/students/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete student");
            }

            alert("Student deleted successfully!");

            await fetchStudents(search);

            await fetchDashboard();

        } catch (error) {

            alert(error.message);

        }

    };


    // OPEN EDIT MODAL
    const handleEdit = (item) => {

        setSelectedStudent(item);

        setEditForm({

            firstName: item.firstName || "",
            lastName: item.lastName || "",
            email: item.email || "",
            phone: item.phone || "",
            gender: item.gender || "",
            course: item.course || ""

        });

        setEditMessage("");

        setShowEditModal(true);

    };


    // HANDLE EDIT FORM CHANGES
    const handleEditChange = (e) => {

        const { name, value } = e.target;

        setEditForm((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // CLOSE EDIT MODAL
    const closeEditModal = () => {

        setShowEditModal(false);

        setSelectedStudent(null);

        setEditMessage("");

    };


    // SAVE UPDATED STUDENT
    const handleUpdate = async (e) => {

        e.preventDefault();

        if (!selectedStudent) return;

        try {

            setSaving(true);

            setEditMessage("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/students/${selectedStudent._id}`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify(editForm)

                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Unable to update student"
                );

            }


            // Update the student list immediately
            setStudents((previous) =>

                previous.map((item) =>

                    item._id === selectedStudent._id
                        ? data.student
                        : item

                )

            );


            // Close modal
            closeEditModal();

            // Refresh dashboard statistics
            await fetchDashboard();

            alert("Student information updated successfully!");

        } catch (error) {

            setEditMessage(error.message);

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="admin-dashboard">

            {/* PAGE HEADER */}

            <div className="admin-welcome">

                <div>

                    <span>ADMINISTRATION PORTAL</span>

                    <h1>
                        Welcome, {student?.firstName}!
                    </h1>

                    <p>
                        Manage your students and monitor EduSmart activities.
                    </p>

                </div>

            </div>


            {/* ERROR MESSAGE */}

            {message && (

                <div className="admin-message">
                    {message}
                </div>

            )}


            {/* STATISTICS CARDS */}

            <div className="admin-statistics">

                <div className="stat-card">

                    <div className="stat-icon">
                        👨‍🎓
                    </div>

                    <div>

                        <h3>Total Students</h3>

                        <h2>{statistics.totalStudents}</h2>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        📚
                    </div>

                    <div>

                        <h3>Total Courses</h3>

                        <h2>{statistics.totalCourses}</h2>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        👤
                    </div>

                    <div>

                        <h3>Administrator</h3>

                        <h2>{student?.firstName || "Admin"}</h2>

                    </div>

                </div>

            </div>


            {/* STUDENT MANAGEMENT */}

            <div className="admin-student-section">

                <div className="student-section-heading">

                    <div>

                        <h2>Student Management</h2>

                        <p>
                            View and manage registered students.
                        </p>

                    </div>


                    <input
                        type="search"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="student-search"
                    />

                </div>


                {/* STUDENT TABLE */}

                <div className="student-table-wrapper">

                    <table className="admin-student-table">

                        <thead>

                            <tr>

                                <th>First Name</th>

                                <th>Last Name</th>

                                <th>Email Address</th>

                                <th>Course</th>

                                <th>Registration Date</th>

                                <th>Action</th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td colSpan="6">
                                        Loading student records...
                                    </td>

                                </tr>

                            ) : students.length === 0 ? (

                                <tr>

                                    <td colSpan="6">
                                        No students found.
                                    </td>

                                </tr>

                            ) : (

                                students.map((item) => (

                                    <tr key={item._id}>

                                        <td>{item.firstName}</td>

                                        <td>{item.lastName}</td>

                                        <td>{item.email}</td>

                                        <td>{item.course}</td>

                                        <td>
                                            {item.createdAt
                                                ? new Date(item.createdAt).toLocaleDateString()
                                                : "N/A"
                                            }
                                        </td>

                                        <td className="student-actions">

                                            <button
                                                className="edit-student-btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-student-btn"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* EDIT STUDENT MODAL */}

            {showEditModal && (

                <div
                    className="edit-modal-overlay"
                    onMouseDown={(e) => {

                        if (e.target === e.currentTarget && !saving) {
                            closeEditModal();
                        }

                    }}
                >

                    <div
                        className="edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-modal-title"
                    >

                        <div className="edit-modal-header">

                            <div>

                                <span>STUDENT MANAGEMENT</span>

                                <h2 id="edit-modal-title">
                                    Edit Student
                                </h2>

                                <p>
                                    Update the student's information below.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="close-modal-btn"
                                onClick={closeEditModal}
                                disabled={saving}
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleUpdate}>

                            <div className="edit-form-grid">

                                <div className="edit-input-group">

                                    <label>First Name</label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editForm.firstName}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                <div className="edit-input-group">

                                    <label>Last Name</label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editForm.lastName}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                <div className="edit-input-group">

                                    <label>Email Address</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                <div className="edit-input-group">

                                    <label>Phone Number</label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                <div className="edit-input-group">

                                    <label>Gender</label>

                                    <select
                                        name="gender"
                                        value={editForm.gender}
                                        onChange={handleEditChange}
                                        required
                                    >

                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                        <option value="Prefer not to say">
                                            Prefer not to say
                                        </option>

                                    </select>

                                </div>


                                <div className="edit-input-group">

                                    <label>Course</label>

                                    <input
                                        type="text"
                                        name="course"
                                        value={editForm.course}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                            </div>


                            {editMessage && (

                                <div className="edit-error-message">
                                    {editMessage}
                                </div>

                            )}


                            <div className="edit-modal-actions">

                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={closeEditModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-edit-btn"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving Changes..."
                                        : "Save Changes"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}

export default AdminDashboard;
